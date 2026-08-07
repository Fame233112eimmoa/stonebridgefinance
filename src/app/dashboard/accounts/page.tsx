"use client";

import Link from "next/link";
import { Card } from "@/components/dashboard/Card";
import { useBankData } from "@/lib/bank-data-context";
import { formatCurrency, formatDateShort } from "@/lib/format";

export default function AccountsPage() {
  const { accounts, transactions } = useBankData();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">Accounts</h2>
        <p className="mt-1.5 text-sm text-ink-800/55">
          Checking and savings balances, updated as of today.
        </p>
      </div>

      <div className="space-y-6">
        {accounts.map((account) => {
          const recent = transactions.filter((t) => t.accountId === account.id).slice(0, 4);
          return (
            <Card key={account.id}>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="lg:w-72 lg:shrink-0">
                  <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-medium capitalize text-brand-700">
                    {account.type}
                  </span>
                  <h3 className="mt-3 font-serif text-xl text-ink-900">
                    {account.nickname}
                  </h3>
                  <p className="mt-1 text-sm text-ink-800/50">
                    Account {account.accountNumberMasked} · Routing{" "}
                    {account.routingNumberMasked}
                  </p>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-ink-800/55">Current balance</span>
                      <span className="font-serif text-xl text-ink-900">
                        {formatCurrency(account.balance)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-ink-800/55">Available balance</span>
                      <span className="text-sm font-medium text-ink-800">
                        {formatCurrency(account.availableBalance)}
                      </span>
                    </div>
                    {account.apy && (
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm text-ink-800/55">APY</span>
                        <span className="text-sm font-medium text-brand-700">
                          {account.apy.toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2.5">
                    <Link
                      href="/dashboard/transfers"
                      className="rounded-full bg-brand-600 px-4 py-2 text-xs font-medium text-white hover:bg-brand-700"
                    >
                      Transfer
                    </Link>
                    <Link
                      href="/dashboard/statements"
                      className="rounded-full border border-ink-900/15 px-4 py-2 text-xs font-medium text-ink-800 hover:border-brand-500/40"
                    >
                      Statements
                    </Link>
                  </div>
                </div>

                <div className="flex-1 border-t border-ink-900/6 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-medium text-ink-800/70">Recent activity</h4>
                    <Link
                      href={`/dashboard/transactions?account=${account.id}`}
                      className="text-xs font-medium text-brand-700 hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                  <ul className="divide-y divide-ink-900/6">
                    {recent.map((t) => (
                      <li key={t.id} className="flex items-center justify-between py-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-sm text-ink-900">{t.merchant}</p>
                          <p className="text-xs text-ink-800/45">{formatDateShort(t.date)}</p>
                        </div>
                        <span
                          className={`shrink-0 text-sm font-medium tabular-nums ${
                            t.amount < 0 ? "text-ink-900" : "text-emerald-600"
                          }`}
                        >
                          {t.amount < 0 ? "-" : "+"}
                          {formatCurrency(Math.abs(t.amount))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
