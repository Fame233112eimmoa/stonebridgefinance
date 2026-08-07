"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader } from "@/components/dashboard/Card";
import CategoryBreakdown from "@/components/dashboard/charts/CategoryBreakdown";
import MonthlyTrend from "@/components/dashboard/charts/MonthlyTrend";
import { useBankData } from "@/lib/bank-data-context";
import { formatCurrency } from "@/lib/format";

export default function AnalyticsPage() {
  const { transactions } = useBankData();
  const [tableView, setTableView] = useState(false);

  const { totalSpending, totalIncome, categoryTotals } = useMemo(() => {
    let spending = 0;
    let income = 0;
    const byCategory = new Map<string, number>();
    for (const t of transactions) {
      if (t.category === "Transfer") continue;
      if (t.amount < 0) {
        spending += Math.abs(t.amount);
        byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + Math.abs(t.amount));
      } else if (t.category !== "Interest") {
        income += t.amount;
      }
    }
    return {
      totalSpending: spending,
      totalIncome: income,
      categoryTotals: Array.from(byCategory.entries()).sort((a, b) => b[1] - a[1]),
    };
  }, [transactions]);

  const net = totalIncome - totalSpending;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">Spending Analytics</h2>
        <p className="mt-1.5 text-sm text-ink-800/55">
          A look at your income and spending across recent months.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatTile label="Total income" value={formatCurrency(totalIncome)} tone="brand" />
        <StatTile label="Total spending" value={formatCurrency(totalSpending)} tone="default" />
        <StatTile
          label="Net"
          value={`${net >= 0 ? "+" : "-"}${formatCurrency(Math.abs(net))}`}
          tone={net >= 0 ? "brand" : "warn"}
        />
      </div>

      <Card>
        <CardHeader title="Income vs. Spending" subtitle="By month" />
        <MonthlyTrend transactions={transactions} />
      </Card>

      <Card>
        <CardHeader
          title="Spending by Category"
          subtitle="All recorded activity"
          action={
            <button
              onClick={() => setTableView((v) => !v)}
              className="text-xs font-medium text-brand-700 hover:underline"
            >
              {tableView ? "View as chart" : "View as table"}
            </button>
          }
        />
        {tableView ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-900/8 text-xs uppercase tracking-wide text-ink-800/45">
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 text-right font-medium">Amount</th>
                  <th className="pb-3 pr-1 text-right font-medium">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/6">
                {categoryTotals.map(([category, amount]) => (
                  <tr key={category}>
                    <td className="py-2.5 text-ink-900">{category}</td>
                    <td className="py-2.5 text-right tabular-nums text-ink-800">
                      {formatCurrency(amount)}
                    </td>
                    <td className="py-2.5 pr-1 text-right tabular-nums text-ink-800/55">
                      {((amount / totalSpending) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <CategoryBreakdown transactions={transactions} />
        )}
      </Card>
    </div>
  );
}

function StatTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "brand" | "default" | "warn";
}) {
  const toneClass =
    tone === "brand" ? "text-brand-700" : tone === "warn" ? "text-amber-700" : "text-ink-900";
  return (
    <div className="rounded-2xl border border-ink-900/8 bg-white p-6">
      <span className="text-xs font-medium tracking-[0.1em] text-ink-800/45 uppercase">
        {label}
      </span>
      <div className={`mt-2 font-serif text-2xl ${toneClass}`}>{value}</div>
    </div>
  );
}
