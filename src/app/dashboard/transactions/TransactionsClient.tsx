"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Card, StatusPill } from "@/components/dashboard/Card";
import { useBankData } from "@/lib/bank-data-context";
import { formatCurrency, formatDate } from "@/lib/format";
import type { TransactionCategory } from "@/lib/types";

export default function TransactionsClient() {
  const { accounts, transactions } = useBankData();
  const searchParams = useSearchParams();
  const initialAccount = searchParams.get("account") ?? "all";

  const [accountFilter, setAccountFilter] = useState(initialAccount);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(transactions.map((t) => t.category))) as TransactionCategory[],
    [transactions]
  );

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => accountFilter === "all" || t.accountId === accountFilter)
      .filter((t) => categoryFilter === "all" || t.category === categoryFilter)
      .filter((t) =>
        query.trim() === ""
          ? true
          : t.merchant.toLowerCase().includes(query.trim().toLowerCase()) ||
            t.description.toLowerCase().includes(query.trim().toLowerCase())
      )
      .sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1));
  }, [transactions, accountFilter, categoryFilter, query]);

  function exportCsv() {
    const header = "Date,Description,Merchant,Category,Amount,Status\n";
    const rows = filtered
      .map((t) =>
        [t.date, t.description, t.merchant, t.category, t.amount.toFixed(2), t.status]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">Transactions</h2>
          <p className="mt-1.5 text-sm text-ink-800/55">
            Search and filter activity across your accounts.
          </p>
        </div>
        <button
          onClick={exportCsv}
          className="self-start rounded-full border border-ink-900/15 px-4 py-2.5 text-xs font-medium text-ink-800 hover:border-brand-500/40 sm:self-auto"
        >
          Export CSV
        </button>
      </div>

      <Card>
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input
            type="text"
            placeholder="Search merchant or description…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-xl border border-ink-900/15 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="rounded-xl border border-ink-900/15 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="all">All accounts</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nickname}
              </option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-ink-900/15 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/8 text-xs uppercase tracking-wide text-ink-800/45">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Merchant</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 pr-1 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/6">
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className="py-3 whitespace-nowrap text-ink-800/60">
                    {formatDate(t.date)}
                  </td>
                  <td className="py-3">
                    <div className="font-medium text-ink-900">{t.merchant}</div>
                    <div className="text-xs text-ink-800/45">{t.description}</div>
                  </td>
                  <td className="py-3 text-ink-800/60">{t.category}</td>
                  <td className="py-3">
                    <StatusPill status={t.status} />
                  </td>
                  <td
                    className={`py-3 pr-1 text-right font-medium tabular-nums ${
                      t.amount < 0 ? "text-ink-900" : "text-emerald-600"
                    }`}
                  >
                    {t.amount < 0 ? "-" : "+"}
                    {formatCurrency(Math.abs(t.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-ink-800/50">
              No transactions match your filters.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
