"use client";

import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/format";
import type { Transaction } from "@/lib/types";

// Validated categorical palette (dataviz skill default) — slots 1-6, in the
// documented order, which is the CVD-safe adjacency for a stacked bar.
const SLOT_COLORS = [
  { light: "#2a78d6", dark: "#3987e5", name: "blue" },
  { light: "#eb6834", dark: "#d95926", name: "orange" },
  { light: "#1baf7a", dark: "#199e70", name: "aqua" },
  { light: "#eda100", dark: "#c98500", name: "yellow" },
  { light: "#e87ba4", dark: "#d55181", name: "magenta" },
  { light: "#008300", dark: "#008300", name: "green" },
];
const OTHER_COLOR = { light: "#9a988f", dark: "#6b6a63" };

export default function CategoryBreakdown({ transactions }: { transactions: Transaction[] }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const segments = useMemo(() => {
    const totals = new Map<string, number>();
    for (const t of transactions) {
      if (t.amount >= 0) continue;
      if (t.category === "Transfer" || t.category === "Interest") continue;
      totals.set(t.category, (totals.get(t.category) ?? 0) + Math.abs(t.amount));
    }
    const sorted = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 6);
    const rest = sorted.slice(6);
    const otherTotal = rest.reduce((s, [, v]) => s + v, 0);

    const items = top.map(([category, amount], i) => ({
      key: category,
      amount,
      color: SLOT_COLORS[i],
    }));
    if (otherTotal > 0) {
      items.push({ key: "Other", amount: otherTotal, color: OTHER_COLOR as (typeof SLOT_COLORS)[number] });
    }

    const total = items.reduce((s, it) => s + it.amount, 0);
    return { items, total };
  }, [transactions]);

  if (segments.total === 0) {
    return <p className="text-sm text-ink-800/50">No spending recorded in this period.</p>;
  }

  return (
    <div>
      <div className="mb-2 text-sm text-ink-800/55">
        Total spending: <span className="font-medium text-ink-900">{formatCurrency(segments.total)}</span>
      </div>

      <div className="flex h-6 w-full overflow-hidden rounded-full" style={{ gap: "2px" }}>
        {segments.items.map((item) => {
          const pct = (item.amount / segments.total) * 100;
          return (
            <div
              key={item.key}
              onMouseEnter={() => setHovered(item.key)}
              onMouseLeave={() => setHovered(null)}
              className="h-full min-w-[3px] transition-opacity"
              style={{
                width: `${pct}%`,
                backgroundColor: item.color.light,
                opacity: hovered && hovered !== item.key ? 0.35 : 1,
              }}
              title={`${item.key}: ${formatCurrency(item.amount)} (${pct.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
        {segments.items.map((item) => {
          const pct = (item.amount / segments.total) * 100;
          return (
            <li
              key={item.key}
              onMouseEnter={() => setHovered(item.key)}
              onMouseLeave={() => setHovered(null)}
              className="flex items-center justify-between gap-3 rounded-lg px-1.5 py-1 text-sm transition-colors"
              style={{ backgroundColor: hovered === item.key ? "rgba(15,30,36,0.04)" : "transparent" }}
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color.light }}
                />
                <span className="truncate text-ink-800">{item.key}</span>
              </span>
              <span className="shrink-0 text-ink-800/55">
                {formatCurrency(item.amount)}{" "}
                <span className="text-ink-800/35">({pct.toFixed(0)}%)</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
