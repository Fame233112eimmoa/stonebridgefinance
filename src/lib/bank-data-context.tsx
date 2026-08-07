"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import { PROFILES, buildProfileDataset, payees } from "./mock-data";
import type {
  Account,
  AccountType,
  Bill,
  Card,
  CustomerProfile,
  LinkedBankAccount,
  Loan,
  Notification,
  ScheduledTransfer,
  Transaction,
  TransferFrequency,
} from "./types";

let idCounter = 1000;
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

type TransferInput = {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  memo?: string;
};

export type TransferProvider = "Bank Transfer" | "Zelle" | "PayPal" | "Cash App" | "Venmo";

type SendInput = {
  fromAccountId: string;
  recipientName: string;
  contact: string;
  amount: number;
  memo?: string;
  provider?: TransferProvider;
};

type PayBillInput = {
  billId: string;
  accountId: string;
};

type DepositInput = {
  accountId: string;
  amount: number;
};

type LoanApplicationInput = {
  type: Loan["type"];
  amount: number;
  termMonths: number;
};

type AddLinkedAccountInput = {
  bankName: string;
  nickname: string;
  accountType: AccountType;
  last4: string;
  routingLast4: string;
  instant: boolean;
};

type ScheduleTransferInput = {
  fromAccountId: string;
  toLabel: string;
  amount: number;
  date: string;
  frequency: TransferFrequency;
  memo?: string;
  kind: "internal" | "external-bank";
};

type ExternalBankTransferInput = {
  fromAccountId: string;
  linkedAccountId: string;
  amount: number;
  memo?: string;
};

type ActionResult = { ok: boolean; error?: string };

type BankDataContextValue = {
  profile: CustomerProfile;
  updateProfile: (updates: Partial<CustomerProfile>) => void;
  accounts: Account[];
  transactions: Transaction[];
  cards: Card[];
  loans: Loan[];
  bills: Bill[];
  notifications: Notification[];
  linkedBankAccounts: LinkedBankAccount[];
  scheduledTransfers: ScheduledTransfer[];
  transferFunds: (input: TransferInput) => ActionResult;
  sendToRecipient: (input: SendInput) => ActionResult;
  payBill: (input: PayBillInput) => ActionResult;
  depositCheck: (input: DepositInput) => ActionResult;
  toggleCardFreeze: (cardId: string) => void;
  payCreditCard: (input: { cardId: string; accountId: string; amount: number }) => ActionResult;
  applyForLoan: (input: LoanApplicationInput) => ActionResult;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addLinkedAccount: (input: AddLinkedAccountInput) => ActionResult;
  removeLinkedAccount: (id: string) => void;
  transferToExternalBank: (input: ExternalBankTransferInput) => ActionResult;
  scheduleTransfer: (input: ScheduleTransferInput) => ActionResult;
  cancelScheduledTransfer: (id: string) => void;
};

const BankDataContext = createContext<BankDataContextValue | null>(null);

export function BankDataProvider({ children }: { children: ReactNode }) {
  const { activeProfile } = useAuth();
  const initialProfileId = activeProfile?.id ?? PROFILES[0].id;
  const initialDataset = useMemo(() => buildProfileDataset(initialProfileId), [initialProfileId]);

  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(initialDataset.profile);
  const [accounts, setAccounts] = useState<Account[]>(initialDataset.accounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialDataset.transactions);
  const [cards, setCards] = useState<Card[]>(initialDataset.cards);
  const [loans, setLoans] = useState<Loan[]>(initialDataset.loans);
  const [bills, setBills] = useState<Bill[]>(initialDataset.bills);
  const [notifications, setNotifications] = useState<Notification[]>(initialDataset.notifications);
  const [linkedBankAccounts, setLinkedBankAccounts] = useState<LinkedBankAccount[]>(
    initialDataset.linkedBankAccounts
  );
  const [scheduledTransfers, setScheduledTransfers] = useState<ScheduledTransfer[]>(
    initialDataset.scheduledTransfers
  );

  // Re-seed everything whenever a different profile signs in, so each demo
  // customer sees their own accounts, transactions, cards, and balances.
  useEffect(() => {
    if (!activeProfile) return;
    const data = buildProfileDataset(activeProfile.id);
    setCustomerProfile(data.profile);
    setAccounts(data.accounts);
    setTransactions(data.transactions);
    setCards(data.cards);
    setLoans(data.loans);
    setBills(data.bills);
    setNotifications(data.notifications);
    setLinkedBankAccounts(data.linkedBankAccounts);
    setScheduledTransfers(data.scheduledTransfers);
  }, [activeProfile]);

  const updateProfile = useCallback((updates: Partial<CustomerProfile>) => {
    setCustomerProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const addNotification = useCallback((n: Omit<Notification, "id" | "date" | "read">) => {
    setNotifications((prev) => [
      { ...n, id: nextId("n"), date: todayIso(), read: false },
      ...prev,
    ]);
  }, []);

  const transferFunds = useCallback(
    ({ fromAccountId, toAccountId, amount, memo }: TransferInput): ActionResult => {
      if (fromAccountId === toAccountId) {
        return { ok: false, error: "Choose two different accounts." };
      }
      if (!(amount > 0)) {
        return { ok: false, error: "Enter an amount greater than $0." };
      }
      const from = accounts.find((a) => a.id === fromAccountId);
      if (!from || from.availableBalance < amount) {
        return { ok: false, error: "Insufficient available balance." };
      }

      setAccounts((prev) =>
        prev.map((a) => {
          if (a.id === fromAccountId) {
            return { ...a, balance: a.balance - amount, availableBalance: a.availableBalance - amount };
          }
          if (a.id === toAccountId) {
            return { ...a, balance: a.balance + amount, availableBalance: a.availableBalance + amount };
          }
          return a;
        })
      );

      const to = accounts.find((a) => a.id === toAccountId);
      const date = todayIso();
      setTransactions((prev) => [
        {
          id: nextId("t"),
          accountId: fromAccountId,
          date,
          description: memo || `Transfer to ${to?.nickname ?? "account"}`,
          merchant: "Internal Transfer",
          category: "Transfer",
          amount: -amount,
          status: "posted",
        },
        {
          id: nextId("t"),
          accountId: toAccountId,
          date,
          description: memo || `Transfer from ${from.nickname}`,
          merchant: "Internal Transfer",
          category: "Transfer",
          amount,
          status: "posted",
        },
        ...prev,
      ]);

      addNotification({
        type: "transaction",
        title: "Transfer completed",
        message: `${formatMoney(amount)} moved from ${from.nickname} to ${to?.nickname ?? "your other account"}.`,
      });

      return { ok: true };
    },
    [accounts, addNotification]
  );

  const sendToRecipient = useCallback(
    ({ fromAccountId, recipientName, contact, amount, memo, provider = "Bank Transfer" }: SendInput): ActionResult => {
      if (!(amount > 0)) return { ok: false, error: "Enter an amount greater than $0." };
      const from = accounts.find((a) => a.id === fromAccountId);
      if (!from || from.availableBalance < amount) {
        return { ok: false, error: "Insufficient available balance." };
      }

      setAccounts((prev) =>
        prev.map((a) =>
          a.id === fromAccountId
            ? { ...a, balance: a.balance - amount, availableBalance: a.availableBalance - amount }
            : a
        )
      );

      const isThirdParty = provider !== "Bank Transfer" && provider !== "Zelle";
      setTransactions((prev) => [
        {
          id: nextId("t"),
          accountId: fromAccountId,
          date: todayIso(),
          description: memo || `${provider} payment to ${recipientName}`,
          merchant: isThirdParty ? provider : recipientName,
          category: "Transfer",
          amount: -amount,
          status: "posted",
        },
        ...prev,
      ]);

      addNotification({
        type: "transaction",
        title: `${provider} payment sent`,
        message: `${formatMoney(amount)} sent to ${recipientName} via ${provider} (${contact}).`,
      });

      return { ok: true };
    },
    [accounts, addNotification]
  );

  const payBill = useCallback(
    ({ billId, accountId }: PayBillInput): ActionResult => {
      const bill = bills.find((b) => b.id === billId);
      const payee = payees.find((p) => p.id === bill?.payeeId);
      if (!bill) return { ok: false, error: "Bill not found." };
      const account = accounts.find((a) => a.id === accountId);
      if (!account || account.availableBalance < bill.amount) {
        return { ok: false, error: "Insufficient available balance." };
      }

      setAccounts((prev) =>
        prev.map((a) =>
          a.id === accountId
            ? { ...a, balance: a.balance - bill.amount, availableBalance: a.availableBalance - bill.amount }
            : a
        )
      );
      setBills((prev) => prev.map((b) => (b.id === billId ? { ...b, status: "paid" } : b)));
      setTransactions((prev) => [
        {
          id: nextId("t"),
          accountId,
          date: todayIso(),
          description: `Bill payment — ${payee?.name ?? "Payee"}`,
          merchant: payee?.name ?? "Payee",
          category: "Bill Payment",
          amount: -bill.amount,
          status: "posted",
        },
        ...prev,
      ]);

      addNotification({
        type: "bill",
        title: "Bill paid",
        message: `${formatMoney(bill.amount)} paid to ${payee?.name ?? "payee"}.`,
      });

      return { ok: true };
    },
    [accounts, bills, addNotification]
  );

  const depositCheck = useCallback(
    ({ accountId, amount }: DepositInput): ActionResult => {
      if (!(amount > 0)) return { ok: false, error: "Enter an amount greater than $0." };
      const account = accounts.find((a) => a.id === accountId);
      if (!account) return { ok: false, error: "Account not found." };

      setAccounts((prev) =>
        prev.map((a) => (a.id === accountId ? { ...a, balance: a.balance + amount } : a))
      );
      setTransactions((prev) => [
        {
          id: nextId("t"),
          accountId,
          date: todayIso(),
          description: "Mobile Check Deposit",
          merchant: "Mobile Deposit",
          category: "Transfer",
          amount,
          status: "pending",
        },
        ...prev,
      ]);

      addNotification({
        type: "transaction",
        title: "Check deposit submitted",
        message: `${formatMoney(amount)} deposit is pending review and typically clears within 1 business day.`,
      });

      return { ok: true };
    },
    [accounts, addNotification]
  );

  const toggleCardFreeze = useCallback((cardId: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? { ...c, status: c.status === "frozen" ? "active" : "frozen" }
          : c
      )
    );
  }, []);

  const payCreditCard = useCallback(
    ({ cardId, accountId, amount }: { cardId: string; accountId: string; amount: number }): ActionResult => {
      if (!(amount > 0)) return { ok: false, error: "Enter an amount greater than $0." };
      const card = cards.find((c) => c.id === cardId);
      const account = accounts.find((a) => a.id === accountId);
      if (!card) return { ok: false, error: "Card not found." };
      if (!account || account.availableBalance < amount) {
        return { ok: false, error: "Insufficient available balance." };
      }

      setAccounts((prev) =>
        prev.map((a) =>
          a.id === accountId
            ? { ...a, balance: a.balance - amount, availableBalance: a.availableBalance - amount }
            : a
        )
      );
      setCards((prev) =>
        prev.map((c) =>
          c.id === cardId
            ? { ...c, currentBalance: Math.max(0, (c.currentBalance ?? 0) - amount) }
            : c
        )
      );
      setTransactions((prev) => [
        {
          id: nextId("t"),
          accountId,
          date: todayIso(),
          description: `Credit Card Payment — ${card.network} ••${card.last4}`,
          merchant: "Card Payment",
          category: "Bill Payment",
          amount: -amount,
          status: "posted",
        },
        ...prev,
      ]);

      addNotification({
        type: "transaction",
        title: "Card payment submitted",
        message: `${formatMoney(amount)} applied to your ${card.network} card ending in ${card.last4}.`,
      });

      return { ok: true };
    },
    [cards, accounts, addNotification]
  );

  const applyForLoan = useCallback(
    ({ type, amount, termMonths }: LoanApplicationInput): ActionResult => {
      if (!(amount > 0)) return { ok: false, error: "Enter a loan amount greater than $0." };
      const rate = type === "Mortgage" ? 6.2 : type === "Auto" ? 5.4 : type === "Student" ? 4.8 : 9.9;
      const monthlyPayment = (amount * (rate / 100 / 12)) / (1 - Math.pow(1 + rate / 100 / 12, -termMonths));

      setLoans((prev) => [
        {
          id: nextId("loan"),
          type,
          status: "pending",
          originalAmount: amount,
          balance: amount,
          rate,
          monthlyPayment: Math.round(monthlyPayment * 100) / 100,
          nextPaymentDate: todayIso(),
          termMonths,
        },
        ...prev,
      ]);

      addNotification({
        type: "system",
        title: "Loan application submitted",
        message: `Your ${type.toLowerCase()} loan application for ${formatMoney(amount)} is under review.`,
      });

      return { ok: true };
    },
    [addNotification]
  );

  const addLinkedAccount = useCallback(
    ({ bankName, nickname, accountType, last4, routingLast4, instant }: AddLinkedAccountInput): ActionResult => {
      if (!bankName.trim() || !nickname.trim()) {
        return { ok: false, error: "Enter a bank name and nickname." };
      }
      if (!/^\d{4}$/.test(last4) || !/^\d{4}$/.test(routingLast4)) {
        return { ok: false, error: "Enter the last 4 digits of the account and routing numbers." };
      }

      const status = instant ? "verified" : "pending";
      setLinkedBankAccounts((prev) => [
        { id: nextId("linked"), bankName: bankName.trim(), nickname: nickname.trim(), accountType, last4, routingLast4, status },
        ...prev,
      ]);

      addNotification({
        type: "system",
        title: instant ? "External account linked" : "External account verification started",
        message: instant
          ? `${nickname.trim()} at ${bankName.trim()} was verified instantly and is ready to use.`
          : `We sent two small deposits to ${nickname.trim()} at ${bankName.trim()}. Verify them in 1–3 business days to finish linking this account.`,
      });

      return { ok: true };
    },
    [addNotification]
  );

  const removeLinkedAccount = useCallback((id: string) => {
    setLinkedBankAccounts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const transferToExternalBank = useCallback(
    ({ fromAccountId, linkedAccountId, amount, memo }: ExternalBankTransferInput): ActionResult => {
      if (!(amount > 0)) return { ok: false, error: "Enter an amount greater than $0." };
      const from = accounts.find((a) => a.id === fromAccountId);
      const linked = linkedBankAccounts.find((a) => a.id === linkedAccountId);
      if (!linked) return { ok: false, error: "Select an external account." };
      if (linked.status === "pending") {
        return { ok: false, error: "This account is still pending verification." };
      }
      if (!from || from.availableBalance < amount) {
        return { ok: false, error: "Insufficient available balance." };
      }

      setAccounts((prev) =>
        prev.map((a) =>
          a.id === fromAccountId
            ? { ...a, balance: a.balance - amount, availableBalance: a.availableBalance - amount }
            : a
        )
      );
      setTransactions((prev) => [
        {
          id: nextId("t"),
          accountId: fromAccountId,
          date: todayIso(),
          description: memo || `External transfer to ${linked.bankName} ••${linked.last4}`,
          merchant: linked.bankName,
          category: "Transfer",
          amount: -amount,
          status: "pending",
        },
        ...prev,
      ]);

      addNotification({
        type: "transaction",
        title: "External transfer initiated",
        message: `${formatMoney(amount)} is on its way to ${linked.nickname} at ${linked.bankName}. ACH transfers typically arrive within 1–3 business days.`,
      });

      return { ok: true };
    },
    [accounts, linkedBankAccounts, addNotification]
  );

  const scheduleTransfer = useCallback(
    ({ fromAccountId, toLabel, amount, date, frequency, memo, kind }: ScheduleTransferInput): ActionResult => {
      if (!(amount > 0)) return { ok: false, error: "Enter an amount greater than $0." };
      const from = accounts.find((a) => a.id === fromAccountId);
      if (!from) return { ok: false, error: "Select an account to transfer from." };

      setScheduledTransfers((prev) => [
        { id: nextId("sched"), fromAccountId, toLabel, amount, date, frequency, memo, kind },
        ...prev,
      ]);

      const cadence =
        frequency === "once"
          ? `on ${date}`
          : `starting ${date}, ${frequency === "biweekly" ? "every 2 weeks" : frequency}`;
      addNotification({
        type: "system",
        title: "Transfer scheduled",
        message: `${formatMoney(amount)} from ${from.nickname} to ${toLabel} is scheduled ${cadence}.`,
      });

      return { ok: true };
    },
    [accounts, addNotification]
  );

  const cancelScheduledTransfer = useCallback((id: string) => {
    setScheduledTransfers((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const value = useMemo(
    () => ({
      profile: customerProfile,
      updateProfile,
      accounts,
      transactions,
      cards,
      loans,
      bills,
      notifications,
      linkedBankAccounts,
      scheduledTransfers,
      transferFunds,
      sendToRecipient,
      payBill,
      depositCheck,
      toggleCardFreeze,
      payCreditCard,
      applyForLoan,
      markNotificationRead,
      markAllNotificationsRead,
      addLinkedAccount,
      removeLinkedAccount,
      transferToExternalBank,
      scheduleTransfer,
      cancelScheduledTransfer,
    }),
    [
      customerProfile,
      updateProfile,
      accounts,
      transactions,
      cards,
      loans,
      bills,
      notifications,
      linkedBankAccounts,
      scheduledTransfers,
      transferFunds,
      sendToRecipient,
      payBill,
      depositCheck,
      toggleCardFreeze,
      payCreditCard,
      applyForLoan,
      markNotificationRead,
      markAllNotificationsRead,
      addLinkedAccount,
      removeLinkedAccount,
      transferToExternalBank,
      scheduleTransfer,
      cancelScheduledTransfer,
    ]
  );

  return <BankDataContext.Provider value={value}>{children}</BankDataContext.Provider>;
}

export function useBankData() {
  const ctx = useContext(BankDataContext);
  if (!ctx) throw new Error("useBankData must be used within BankDataProvider");
  return ctx;
}

function formatMoney(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
