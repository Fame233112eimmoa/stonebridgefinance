import type {
  Account,
  Bill,
  Card,
  CustomerProfile,
  LinkedBankAccount,
  Loan,
  LoanType,
  Notification,
  Payee,
  ScheduledTransfer,
  Statement,
  Transaction,
  TransactionCategory,
} from "./types";

// All data below is fabricated for a school-project demo. Nothing here
// connects to a real bank, real accounts, or real people.

export type ProfileSeed = {
  id: string;
  customerId: string;
  password: string;
  otp: string;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  address: string;
  checkingBalance: number;
  checkingAvailable: number;
  checkingLast4: string;
  savingsBalance: number;
  savingsApy: number;
  savingsLast4: string;
  hasCreditCard: boolean;
  debitLast4: string;
  creditLast4: string;
  creditLimit: number;
  creditBalance: number;
  hasLoan: boolean;
  employer: string;
  incomeLabel: string;
  txMultiplier: number;
};

// Every profile is a working professional with the exact same account
// features — checking + savings, a debit and credit card, an auto loan, the
// same employer and bill set. The only thing that varies between them is
// their balances (and the identity fields that necessarily differ: name,
// customer ID, password, OTP, contact info, and masked account numbers).
export const PROFILES: ProfileSeed[] = [
  {
    id: "profile-1",
    customerId: "SBF-10293",
    password: "Passw0rd!",
    otp: "594721",
    name: "Jordan Ellis",
    email: "jordan.ellis@example.com",
    phone: "(555) 019-2244",
    memberSince: "2014-03-12",
    address: "482 Larkspur Ave, Rivermont, ST 04821",
    checkingBalance: 42185.6,
    checkingAvailable: 41285.6,
    checkingLast4: "4821",
    savingsBalance: 3158940.12,
    savingsApy: 3.2,
    savingsLast4: "7734",
    hasCreditCard: true,
    debitLast4: "4821",
    creditLast4: "5590",
    creditLimit: 8000,
    creditBalance: 1240.33,
    hasLoan: true,
    employer: "Northbridge Media Inc.",
    incomeLabel: "Direct Deposit",
    txMultiplier: 1,
  },
  {
    id: "profile-2",
    customerId: "SBF-20481",
    password: "Anand#2847",
    otp: "482915",
    name: "Priya Anand",
    email: "priya.anand@example.com",
    phone: "(555) 042-8813",
    memberSince: "2019-06-01",
    address: "118 Cedarcrest Ln, Rivermont, ST 04821",
    checkingBalance: 31204.4,
    checkingAvailable: 30304.4,
    checkingLast4: "3357",
    savingsBalance: 3275750.8,
    savingsApy: 3.2,
    savingsLast4: "6621",
    hasCreditCard: true,
    debitLast4: "3357",
    creditLast4: "7714",
    creditLimit: 8000,
    creditBalance: 1240.33,
    hasLoan: true,
    employer: "Northbridge Media Inc.",
    incomeLabel: "Direct Deposit",
    txMultiplier: 1,
  },
  {
    id: "profile-3",
    customerId: "SBF-36925",
    password: "WebbCo!572",
    otp: "719203",
    name: "Marcus Webb",
    email: "marcus.webb@example.com",
    phone: "(555) 077-3391",
    memberSince: "2011-09-22",
    address: "27 Founders Way, Rivermont, ST 04821",
    checkingBalance: 65401.0,
    checkingAvailable: 64501.0,
    checkingLast4: "9042",
    savingsBalance: 3412000.55,
    savingsApy: 3.2,
    savingsLast4: "1156",
    hasCreditCard: true,
    debitLast4: "9042",
    creditLast4: "1188",
    creditLimit: 8000,
    creditBalance: 1240.33,
    hasLoan: true,
    employer: "Northbridge Media Inc.",
    incomeLabel: "Direct Deposit",
    txMultiplier: 1,
  },
  {
    id: "profile-4",
    customerId: "SBF-41207",
    password: "Torres@Sun3",
    otp: "365810",
    name: "Elena Torres",
    email: "elena.torres@example.com",
    phone: "(555) 061-4470",
    memberSince: "2005-02-14",
    address: "9 Willowmere Ct, Rivermont, ST 04821",
    checkingBalance: 58753.0,
    checkingAvailable: 57853.0,
    checkingLast4: "5566",
    savingsBalance: 3545600.0,
    savingsApy: 3.2,
    savingsLast4: "3390",
    hasCreditCard: true,
    debitLast4: "5566",
    creditLast4: "2299",
    creditLimit: 8000,
    creditBalance: 1240.33,
    hasLoan: true,
    employer: "Northbridge Media Inc.",
    incomeLabel: "Direct Deposit",
    txMultiplier: 1,
  },
  {
    id: "profile-5",
    customerId: "SBF-58734",
    password: "Bishop!119",
    otp: "904627",
    name: "Sam Bishop",
    email: "sam.bishop@example.com",
    phone: "(555) 093-2256",
    memberSince: "2016-08-20",
    address: "410 Campus Dr Apt 3B, Rivermont, ST 04821",
    checkingBalance: 29807.5,
    checkingAvailable: 28907.5,
    checkingLast4: "7701",
    savingsBalance: 3124300.6,
    savingsApy: 3.2,
    savingsLast4: "4408",
    hasCreditCard: true,
    debitLast4: "7701",
    creditLast4: "6643",
    creditLimit: 8000,
    creditBalance: 1240.33,
    hasLoan: true,
    employer: "Northbridge Media Inc.",
    incomeLabel: "Direct Deposit",
    txMultiplier: 1,
  },
];

export const payees: Payee[] = [
  { id: "payee-1", name: "Harborline Apartments", category: "Rent", accountNumberMasked: "••9981", initial: "H" },
  { id: "payee-2", name: "Northgate Electric", category: "Electric", accountNumberMasked: "••3321", initial: "N" },
  { id: "payee-3", name: "Riverside Natural Gas", category: "Natural Gas", accountNumberMasked: "••5567", initial: "R" },
  { id: "payee-4", name: "Cascade Water & Sewer", category: "Water & Sewer", accountNumberMasked: "••8842", initial: "C" },
  { id: "payee-5", name: "BlueWave Internet", category: "Internet & Cable", accountNumberMasked: "••7743", initial: "B" },
  { id: "payee-6", name: "CrossTown Wireless", category: "Cell Phone", accountNumberMasked: "••2210", initial: "C" },
  { id: "payee-7", name: "Pinnacle Auto Insurance", category: "Car Insurance", accountNumberMasked: "••6690", initial: "P" },
  { id: "payee-8", name: "Horizon Student Loan Servicing", category: "Student Loan", accountNumberMasked: "••4415", initial: "H" },
  { id: "payee-9", name: "Summit Credit Card", category: "Credit Card", accountNumberMasked: "••4432", initial: "S" },
];

export const statements: Statement[] = [
  { id: "st-2026-07-chk", period: "2026-07", label: "July 2026", accountId: "chk-1001" },
  { id: "st-2026-06-chk", period: "2026-06", label: "June 2026", accountId: "chk-1001" },
  { id: "st-2026-05-chk", period: "2026-05", label: "May 2026", accountId: "chk-1001" },
  { id: "st-2026-04-chk", period: "2026-04", label: "April 2026", accountId: "chk-1001" },
  { id: "st-2026-07-sav", period: "2026-07", label: "July 2026", accountId: "sav-2002" },
  { id: "st-2026-06-sav", period: "2026-06", label: "June 2026", accountId: "sav-2002" },
  { id: "st-2026-05-sav", period: "2026-05", label: "May 2026", accountId: "sav-2002" },
  { id: "st-2026-04-sav", period: "2026-04", label: "April 2026", accountId: "sav-2002" },
];

// Shared calendar of transaction activity. "{employer}" and "{income}" are
// substituted per profile; amounts are scaled by the profile's multiplier.
// The Auto Lending entry only appears for profiles with hasLoan.
type TxTemplate = {
  accountId: "chk-1001" | "sav-2002";
  date: string;
  description: string;
  merchant: string;
  category: TransactionCategory;
  amount: number;
  status: "posted" | "pending";
  loanOnly?: boolean;
};

const BASE_TRANSACTIONS: TxTemplate[] = [
  { accountId: "chk-1001", date: "2026-08-06", description: "Card Purchase", merchant: "Green Leaf Grocers", category: "Groceries", amount: -64.12, status: "pending" },
  { accountId: "chk-1001", date: "2026-08-05", description: "Card Purchase", merchant: "Ridgeline Coffee Co.", category: "Dining", amount: -6.75, status: "posted" },
  { accountId: "chk-1001", date: "2026-08-05", description: "{income}", merchant: "{employer}", category: "Income", amount: 2840.0, status: "posted" },
  { accountId: "sav-2002", date: "2026-08-04", description: "Interest Payment", merchant: "Stonebridge Finance", category: "Interest", amount: 48.21, status: "posted" },
  { accountId: "chk-1001", date: "2026-08-04", description: "Card Purchase", merchant: "Transit Authority", category: "Travel", amount: -32.0, status: "posted" },
  { accountId: "chk-1001", date: "2026-08-03", description: "Card Purchase", merchant: "StreamPlex", category: "Entertainment", amount: -15.99, status: "posted" },
  { accountId: "chk-1001", date: "2026-08-02", description: "Bill Payment", merchant: "Harborline Apartments", category: "Housing", amount: -1450.0, status: "posted" },
  { accountId: "chk-1001", date: "2026-08-01", description: "Card Purchase", merchant: "FreshMart", category: "Groceries", amount: -88.43, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-31", description: "Transfer to Savings", merchant: "Internal Transfer", category: "Transfer", amount: -400.0, status: "posted" },
  { accountId: "sav-2002", date: "2026-07-31", description: "Transfer from Checking", merchant: "Internal Transfer", category: "Transfer", amount: 400.0, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-30", description: "Card Purchase", merchant: "Pinecrest Cinema", category: "Entertainment", amount: -24.5, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-29", description: "ATM Withdrawal", merchant: "Stonebridge ATM #402", category: "ATM", amount: -60.0, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-28", description: "Card Purchase", merchant: "Cedar & Vine Kitchen", category: "Dining", amount: -41.2, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-27", description: "Card Purchase", merchant: "Urban Outfitters Co.", category: "Shopping", amount: -76.9, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-25", description: "Bill Payment", merchant: "BlueWave Internet", category: "Utilities", amount: -59.99, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-24", description: "Card Purchase", merchant: "CornerStone Pharmacy", category: "Health", amount: -22.15, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-22", description: "Overdraft Protection Fee", merchant: "Stonebridge Finance", category: "Fee", amount: -5.0, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-21", description: "Card Purchase", merchant: "Green Leaf Grocers", category: "Groceries", amount: -71.34, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-20", description: "{income}", merchant: "{employer}", category: "Income", amount: 2840.0, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-19", description: "Card Purchase", merchant: "Ridgeline Coffee Co.", category: "Dining", amount: -5.5, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-18", description: "Bill Payment", merchant: "Northgate Electric", category: "Utilities", amount: -84.2, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-17", description: "Card Purchase", merchant: "Trailhead Outfitters", category: "Shopping", amount: -138.6, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-15", description: "Card Purchase", merchant: "FreshMart", category: "Groceries", amount: -54.02, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-14", description: "Auto Loan Payment", merchant: "Stonebridge Auto Lending", category: "Bill Payment", amount: -452.1, status: "posted", loanOnly: true },
  { accountId: "chk-1001", date: "2026-07-12", description: "Card Purchase", merchant: "Cedar & Vine Kitchen", category: "Dining", amount: -29.75, status: "posted" },
  { accountId: "sav-2002", date: "2026-07-10", description: "Transfer from Checking", merchant: "Internal Transfer", category: "Transfer", amount: 600.0, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-10", description: "Transfer to Savings", merchant: "Internal Transfer", category: "Transfer", amount: -600.0, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-08", description: "Card Purchase", merchant: "CrossTown Wireless", category: "Utilities", amount: -96.0, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-06", description: "Card Purchase", merchant: "Green Leaf Grocers", category: "Groceries", amount: -59.11, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-05", description: "{income}", merchant: "{employer}", category: "Income", amount: 2840.0, status: "posted" },
  { accountId: "chk-1001", date: "2026-07-03", description: "Card Purchase", merchant: "Skyline Airlines", category: "Travel", amount: -212.4, status: "posted" },
  { accountId: "sav-2002", date: "2026-07-01", description: "Interest Payment", merchant: "Stonebridge Finance", category: "Interest", amount: 46.83, status: "posted" },
  { accountId: "chk-1001", date: "2026-06-28", description: "Card Purchase", merchant: "Pinecrest Cinema", category: "Entertainment", amount: -19.0, status: "posted" },
  { accountId: "chk-1001", date: "2026-06-24", description: "Card Purchase", merchant: "FreshMart", category: "Groceries", amount: -66.87, status: "posted" },
  { accountId: "chk-1001", date: "2026-06-20", description: "{income}", merchant: "{employer}", category: "Income", amount: 2840.0, status: "posted" },
];

type BillTemplate = { payeeId: string; amount: number; dueDate: string; status: Bill["status"]; autopay: boolean };

const BASE_BILLS: BillTemplate[] = [
  { payeeId: "payee-1", amount: 1450.0, dueDate: "2026-08-01", status: "paid", autopay: true },
  { payeeId: "payee-2", amount: 84.2, dueDate: "2026-08-12", status: "upcoming", autopay: true },
  { payeeId: "payee-5", amount: 59.99, dueDate: "2026-08-14", status: "upcoming", autopay: false },
  { payeeId: "payee-3", amount: 52.3, dueDate: "2026-08-16", status: "upcoming", autopay: false },
  { payeeId: "payee-4", amount: 46.75, dueDate: "2026-08-18", status: "upcoming", autopay: true },
  { payeeId: "payee-6", amount: 96.0, dueDate: "2026-08-20", status: "upcoming", autopay: true },
  { payeeId: "payee-7", amount: 142.5, dueDate: "2026-08-22", status: "upcoming", autopay: true },
  { payeeId: "payee-9", amount: 185.4, dueDate: "2026-08-24", status: "upcoming", autopay: false },
  { payeeId: "payee-8", amount: 210.0, dueDate: "2026-07-28", status: "overdue", autopay: false },
];

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function scale(value: number, multiplier: number): number {
  return round2(value * multiplier);
}

export type ProfileDataset = {
  profile: CustomerProfile;
  accounts: Account[];
  transactions: Transaction[];
  cards: Card[];
  loans: Loan[];
  bills: Bill[];
  notifications: Notification[];
  linkedBankAccounts: LinkedBankAccount[];
  scheduledTransfers: ScheduledTransfer[];
};

export function getProfileSeed(profileId: string): ProfileSeed {
  return PROFILES.find((p) => p.id === profileId) ?? PROFILES[0];
}

export function buildProfileDataset(profileId: string): ProfileDataset {
  const seed = getProfileSeed(profileId);
  const m = seed.txMultiplier;

  const profile: CustomerProfile = {
    customerId: seed.customerId,
    name: seed.name,
    email: seed.email,
    phone: seed.phone,
    memberSince: seed.memberSince,
    address: seed.address,
  };

  const accounts: Account[] = [
    {
      id: "chk-1001",
      type: "checking",
      nickname: "Everyday Checking",
      accountNumberMasked: `•••• ${seed.checkingLast4}`,
      routingNumberMasked: "•••• 0021",
      balance: seed.checkingBalance,
      availableBalance: seed.checkingAvailable,
      openedDate: seed.memberSince,
    },
    {
      id: "sav-2002",
      type: "savings",
      nickname: "Premier Savings",
      accountNumberMasked: `•••• ${seed.savingsLast4}`,
      routingNumberMasked: "•••• 0021",
      balance: seed.savingsBalance,
      availableBalance: seed.savingsBalance,
      apy: seed.savingsApy,
      openedDate: seed.memberSince,
    },
  ];

  const transactions: Transaction[] = BASE_TRANSACTIONS.filter((t) => !t.loanOnly || seed.hasLoan).map(
    (t, i) => ({
      id: `${seed.id}-t${i + 1}`,
      accountId: t.accountId,
      date: t.date,
      description: t.description === "{income}" ? seed.incomeLabel : t.description,
      merchant: t.merchant === "{employer}" ? seed.employer : t.merchant,
      category: t.category,
      amount: scale(t.amount, m),
      status: t.status,
    })
  );

  const cards: Card[] = [
    {
      id: `${seed.id}-card-debit`,
      type: "debit",
      network: "Visa",
      last4: seed.debitLast4,
      expiry: "09/29",
      holderName: seed.name.toUpperCase(),
      status: "active",
      accountId: "chk-1001",
    },
  ];
  if (seed.hasCreditCard) {
    cards.push({
      id: `${seed.id}-card-credit`,
      type: "credit",
      network: "Mastercard",
      last4: seed.creditLast4,
      expiry: "02/28",
      holderName: seed.name.toUpperCase(),
      status: "active",
      creditLimit: seed.creditLimit,
      currentBalance: seed.creditBalance,
      apr: 21.99,
      dueDate: "2026-08-18",
      minimumPayment: round2(Math.max(25, seed.creditBalance * 0.03)),
    });
  }

  const loans: Loan[] = seed.hasLoan
    ? [
        {
          id: `${seed.id}-loan-1`,
          type: "Auto" as LoanType,
          status: "active",
          originalAmount: scale(24000, m),
          balance: scale(9120.44, m),
          rate: 5.4,
          monthlyPayment: scale(452.1, m),
          nextPaymentDate: "2026-08-15",
          termMonths: 60,
        },
      ]
    : [];

  const bills: Bill[] = BASE_BILLS.map((b, i) => ({
    id: `${seed.id}-bill${i + 1}`,
    payeeId: b.payeeId,
    amount: scale(b.amount, m),
    dueDate: b.dueDate,
    status: b.status,
    autopay: b.autopay,
  }));

  const blueWaveBill = bills.find((b) => b.payeeId === "payee-5");
  const skylineTx = transactions.find((t) => t.merchant === "Skyline Airlines");

  const notifications: Notification[] = [
    {
      id: `${seed.id}-n1`,
      type: "security",
      title: "New sign-in detected",
      message: "A new sign-in occurred from a Chrome browser on macOS. If this wasn't you, secure your account immediately.",
      date: "2026-08-06",
      read: false,
    },
    {
      id: `${seed.id}-n2`,
      type: "bill",
      title: "Upcoming bill: BlueWave Internet",
      message: `$${(blueWaveBill?.amount ?? 0).toFixed(2)} is due on Aug 14. Autopay is not enabled for this payee.`,
      date: "2026-08-05",
      read: false,
    },
    {
      id: `${seed.id}-n3`,
      type: "transaction",
      title: "Large purchase posted",
      message: `A $${Math.abs(skylineTx?.amount ?? 0).toFixed(2)} purchase at Skyline Airlines was posted to Everyday Checking.`,
      date: "2026-08-03",
      read: true,
    },
    {
      id: `${seed.id}-n4`,
      type: "system",
      title: "Statement ready: July 2026",
      message: "Your July statement for Everyday Checking is ready to view or download.",
      date: "2026-08-01",
      read: true,
    },
    seed.hasLoan
      ? {
          id: `${seed.id}-n5`,
          type: "promo",
          title: "You may qualify for a lower auto rate",
          message: "Based on your payment history, you may be eligible to refinance your auto loan at a reduced APR.",
          date: "2026-07-30",
          read: true,
        }
      : {
          id: `${seed.id}-n5`,
          type: "promo",
          title: "You're earning 3.20% APY",
          message: "Your Premier Savings balance is earning one of our best rates. Set up a recurring transfer to grow it faster.",
          date: "2026-07-30",
          read: true,
        },
    {
      id: `${seed.id}-n6`,
      type: "security",
      title: "Password changed successfully",
      message: "Your online banking password was updated. Contact support if you didn't make this change.",
      date: "2026-07-22",
      read: true,
    },
  ];

  const linkedBankAccounts: LinkedBankAccount[] = [
    {
      id: `${seed.id}-linked-1`,
      bankName: "Rivermont Credit Union",
      nickname: "Rivermont Checking",
      accountType: "checking",
      last4: "8820",
      routingLast4: "0417",
      status: "verified",
    },
  ];

  const scheduledTransfers: ScheduledTransfer[] = [
    {
      id: `${seed.id}-sched-1`,
      fromAccountId: "chk-1001",
      toLabel: "Premier Savings",
      amount: scale(200, m),
      date: "2026-09-01",
      frequency: "monthly",
      memo: "Auto-save",
      kind: "internal",
    },
  ];

  return { profile, accounts, transactions, cards, loans, bills, notifications, linkedBankAccounts, scheduledTransfers };
}
