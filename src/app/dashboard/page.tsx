"use client";

import Link from "next/link";
import { Card, CardHeader, StatusPill } from "@/components/dashboard/Card";
import {
  CardIcon,
  DepositIcon,
  ReceiptIcon,
  SwapIcon,
} from "@/components/dashboard/icons";
import { useAuth } from "@/lib/auth-context";
import { useBankData } from "@/lib/bank-data-context";
import { formatCurrency, formatDateShort } from "@/lib/format";

const QUICK_ACTIONS = [
  { label: "Transfer Money", href: "/dashboard/transfers", icon: SwapIcon },
  { label: "Pay a Bill", href: "/dashboard/bill-pay", icon: ReceiptIcon },
  { label: "Deposit a Check", href: "/dashboard/deposit", icon: DepositIcon },
  { label: "Manage Cards", href: "/dashboard/cards", icon: CardIcon },
];

export default function DashboardOverview() {
  const { accounts, transactions, notifications } = useBankData();
  const { activeProfile } = useAuth();
  const firstName = activeProfile?.name.split(" ")[0] ?? "there";
  const recentTransactions = transactions.slice(0, 6);
  const recentAlerts = notifications.slice(0, 3);
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-balance font-serif text-2xl text-ink-900 sm:text-3xl">
          Welcome back, {firstName}.
        </h2>
        <p className="mt-1.5 text-sm text-ink-800/55">
          Here&rsquo;s what&rsquo;s happening across your accounts today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-ink-900 to-brand-900 p-6 text-white sm:col-span-2 lg:col-span-1">
          <span className="text-xs tracking-[0.2em] text-white/50 uppercase">
            Total Balance
          </span>
          <div className="mt-3 font-serif text-3xl">{formatCurrency(totalBalance)}</div>
          <p className="mt-1 text-xs text-brand-300">Across {accounts.length} accounts</p>
        </div>

        {accounts.map((account) => (
          <Link
            key={account.id}
            href="/dashboard/accounts"
            className="group rounded-2xl border border-ink-900/8 bg-white p-6 transition-shadow hover:shadow-md hover:shadow-ink-900/5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tracking-[0.15em] text-ink-800/45 uppercase">
                {account.nickname}
              </span>
              <span className="text-xs text-ink-800/40">{account.accountNumberMasked}</span>
            </div>
            <div className="mt-3 font-serif text-2xl text-ink-900">
              {formatCurrency(account.balance)}
            </div>
            <p className="mt-1 text-xs text-ink-800/50">
              Available {formatCurrency(account.availableBalance)}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex flex-col items-center gap-3 rounded-2xl border border-ink-900/8 bg-white px-4 py-5 text-center transition-colors hover:border-brand-500/30 hover:bg-brand-50/40"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <action.icon className="h-5 w-5" />
            </span>
            <span className="text-xs font-medium text-ink-800">{action.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent Transactions"
            subtitle="Latest activity across your accounts"
            action={
              <Link
                href="/dashboard/transactions"
                className="text-sm font-medium text-brand-700 hover:underline"
              >
                View all
              </Link>
            }
          />
          <ul className="divide-y divide-ink-900/6">
            {recentTransactions.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-900">{t.merchant}</p>
                  <p className="mt-0.5 text-xs text-ink-800/50">
                    {formatDateShort(t.date)} · {t.category}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {t.status === "pending" && <StatusPill status="pending" />}
                  <span
                    className={`text-sm font-medium tabular-nums ${
                      t.amount < 0 ? "text-ink-900" : "text-emerald-600"
                    }`}
                  >
                    {t.amount < 0 ? "-" : "+"}
                    {formatCurrency(Math.abs(t.amount))}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Alerts"
            action={
              <Link
                href="/dashboard/notifications"
                className="text-sm font-medium text-brand-700 hover:underline"
              >
                View all
              </Link>
            }
          />
          <ul className="space-y-4">
            {recentAlerts.map((n) => (
              <li key={n.id} className="flex gap-3">
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                    n.read ? "bg-ink-900/15" : "bg-brand-600"
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-900">{n.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-ink-800/55">{n.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
