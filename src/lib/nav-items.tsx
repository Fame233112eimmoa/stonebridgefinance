import type { ReactElement } from "react";
import {
  BellIcon,
  CardIcon,
  ChartIcon,
  DepositIcon,
  DocIcon,
  HomeIcon,
  ListIcon,
  PercentIcon,
  ReceiptIcon,
  SupportIcon,
  SwapIcon,
  UserIcon,
  WalletIcon,
} from "@/components/dashboard/icons";

export type NavItem = {
  label: string;
  href: string;
  icon: (props: { className?: string }) => ReactElement;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: HomeIcon },
  { label: "Accounts", href: "/dashboard/accounts", icon: WalletIcon },
  { label: "Transactions", href: "/dashboard/transactions", icon: ListIcon },
  { label: "Transfers", href: "/dashboard/transfers", icon: SwapIcon },
  { label: "Bill Pay", href: "/dashboard/bill-pay", icon: ReceiptIcon },
  { label: "Cards", href: "/dashboard/cards", icon: CardIcon },
  { label: "Loans", href: "/dashboard/loans", icon: PercentIcon },
  { label: "Mobile Deposit", href: "/dashboard/deposit", icon: DepositIcon },
  { label: "Statements", href: "/dashboard/statements", icon: DocIcon },
  { label: "Analytics", href: "/dashboard/analytics", icon: ChartIcon },
  { label: "Notifications", href: "/dashboard/notifications", icon: BellIcon },
  { label: "Profile & Security", href: "/dashboard/profile", icon: UserIcon },
  { label: "Support", href: "/dashboard/support", icon: SupportIcon },
];
