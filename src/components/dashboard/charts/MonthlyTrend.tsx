"use client";

import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/format";
import type { Transaction } from "@/lib/types";

const INCOME_COLOR = "#128488"; // brand-600 — consistent with app identity
const SPENDING_COLOR = "#eb6834"; // categorical slot 2 (orange) — safe pairing vs brand hue

const MONTH_LABELS: Record<string, string> = {
  "2026-06": "June",
  "2026-07": "July",
  "2026-08": "Aug",
};

export default function MonthlyTrend({ transactions }: { transactions: Transaction[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const months = useMemo(() => {
    const byMonth = new Map<string, { income: number; spending: number }>();
    for (const t of transactions) {
      const key = t.date.slice(0, 7);
      if (!byMonth.has(key)) byMonth.set(key, { income: 0, spending: 0 });
      const bucket = byMonth.get(key)!;
      if (t.amount > 0 && t.category !== "Transfer") bucket.income += t.amount;
      if (t.amount < 0 && t.category !== "Transfer") bucket.spending += Math.abs(t.amount);
    }
    return Array.from(byMonth.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([key, v]) => ({ key, label: MONTH_LABELS[key] ?? key, ...v }));
  }, [transactions]);

  const max = Math.max(1, ...months.flatMap((m) => [m.income, m.spending]));
  const niceMax = Math.ceil(max / 500) * 500;
  const gridSteps = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(niceMax * f));

  const chartHeight = 220;
  const barWidth = 22;
  const groupGap = 46;

  return (
    <div>
      <div className="mb-5 flex items-center gap-5 text-sm">
        <Legend color={INCOME_COLOR} label="Income" />
        <Legend color={SPENDING_COLOR} label="Spending" />
      </div>

      <div className="relative">
        <div className="flex">
          {/* Y-axis labels */}
          <div
            className="flex flex-col justify-between pr-3 text-right text-xs text-ink-800/40"
            style={{ height: chartHeight }}
          >
            {[...gridSteps].reverse().map((v) => (
              <span key={v}>{v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}</span>
            ))}
          </div>

          <div className="relative flex-1 overflow-x-auto">
            <svg
              viewBox={`0 0 ${months.length * (barWidth * 2 + groupGap)} ${chartHeight}`}
              width="100%"
              height={chartHeight}
              preserveAspectRatio="xMinYMid meet"
            >
              {gridSteps.map((v) => {
                const y = chartHeight - (v / niceMax) * chartHeight;
                return (
                  <line
                    key={v}
                    x1={0}
                    x2={months.length * (barWidth * 2 + groupGap)}
                    y1={y}
                    y2={y}
                    stroke="#e1e0d9"
                    strokeWidth={1}
                  />
                );
              })}

              {months.map((m, i) => {
                const groupX = i * (barWidth * 2 + groupGap) + groupGap / 2;
                const incomeH = (m.income / niceMax) * chartHeight;
                const spendingH = (m.spending / niceMax) * chartHeight;
                const isHovered = hoverIndex === i;
                return (
                  <g
                    key={m.key}
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <rect x={groupX - 6} y={0} width={barWidth * 2 + 12} height={chartHeight} fill="transparent" />
                    <rect
                      x={groupX}
                      y={chartHeight - incomeH}
                      width={barWidth}
                      height={Math.max(incomeH, 2)}
                      rx={4}
                      fill={INCOME_COLOR}
                      opacity={isHovered || hoverIndex === null ? 1 : 0.4}
                    />
                    <rect
                      x={groupX + barWidth + 2}
                      y={chartHeight - spendingH}
                      width={barWidth}
                      height={Math.max(spendingH, 2)}
                      rx={4}
                      fill={SPENDING_COLOR}
                      opacity={isHovered || hoverIndex === null ? 1 : 0.4}
                    />
                  </g>
                );
              })}
            </svg>

            <div className="mt-2 flex text-xs text-ink-800/50">
              {months.map((m) => (
                <span
                  key={m.key}
                  className="text-center"
                  style={{ width: barWidth * 2 + groupGap }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            {hoverIndex !== null && months[hoverIndex] && (
              <div
                className="pointer-events-none absolute top-0 rounded-lg border border-ink-900/8 bg-white px-3 py-2 text-xs shadow-lg shadow-ink-900/10"
                style={{
                  left: hoverIndex * (barWidth * 2 + groupGap) + groupGap / 2,
                }}
              >
                <p className="font-medium text-ink-900">{months[hoverIndex].label}</p>
                <p className="mt-1 text-ink-800/60">
                  Income {formatCurrency(months[hoverIndex].income)}
                </p>
                <p className="text-ink-800/60">
                  Spending {formatCurrency(months[hoverIndex].spending)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-ink-800/70">{label}</span>
    </span>
  );
}
