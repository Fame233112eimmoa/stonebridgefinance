export type AccountType = "checking" | "savings";

export type Account = {
  id: string;
  type: AccountType;
  nickname: string;
  accountNumberMasked: string;
  routingNumberMasked: string;
  balance: number;
  availableBalance: number;
  apy?: number;
  openedDate: string;
};

export type TransactionCategory =
  | "Groceries"
  | "Dining"
  | "Transfer"
  | "Income"
  | "Utilities"
  | "Entertainment"
  | "Housing"
  | "Shopping"
  | "Health"
  | "Travel"
  | "ATM"
  | "Interest"
  | "Fee"
  | "Bill Payment";

export type Transaction = {
  id: string;
  accountId: string;
  date: string;
  description: string;
  merchant: string;
  category: TransactionCategory;
  amount: number; // negative = debit, positive = credit
  status: "posted" | "pending";
};

export type CardType = "debit" | "credit";

export type Card = {
  id: string;
  type: CardType;
  network: "Visa" | "Mastercard";
  last4: string;
  expiry: string;
  holderName: string;
  status: "active" | "frozen" | "locked";
  accountId?: string;
  creditLimit?: number;
  currentBalance?: number;
  apr?: number;
  dueDate?: string;
  minimumPayment?: number;
};

export type LoanType = "Auto" | "Personal" | "Mortgage" | "Student";

export type Loan = {
  id: string;
  type: LoanType;
  status: "active" | "pending" | "paid-off";
  originalAmount: number;
  balance: number;
  rate: number;
  monthlyPayment: number;
  nextPaymentDate: string;
  termMonths: number;
};

export type Payee = {
  id: string;
  name: string;
  category: string;
  accountNumberMasked: string;
  initial: string;
};

export type Bill = {
  id: string;
  payeeId: string;
  amount: number;
  dueDate: string;
  status: "upcoming" | "paid" | "overdue";
  autopay: boolean;
};

export type NotificationType = "security" | "transaction" | "bill" | "promo" | "system";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
};

export type Statement = {
  id: string;
  period: string;
  label: string;
  accountId: string;
};

export type CustomerProfile = {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  address: string;
};

export type LinkedBankAccount = {
  id: string;
  bankName: string;
  nickname: string;
  accountType: AccountType;
  last4: string;
  routingLast4: string;
  status: "verified" | "pending";
};

export type TransferFrequency = "once" | "weekly" | "biweekly" | "monthly";

export type ScheduledTransfer = {
  id: string;
  fromAccountId: string;
  toLabel: string;
  amount: number;
  date: string;
  frequency: TransferFrequency;
  memo?: string;
  kind: "internal" | "external-bank";
};
