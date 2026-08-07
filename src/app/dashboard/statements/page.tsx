"use client";

import { Card, CardHeader } from "@/components/dashboard/Card";
import { useBankData } from "@/lib/bank-data-context";
import { generateStatementPdf } from "@/lib/generate-statement-pdf";
import { statements } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";

export default function StatementsPage() {
  const { profile, accounts, transactions } = useBankData();

  function downloadStatement(period: string, accountId: string, label: string) {
    const account = accounts.find((a) => a.id === accountId);
    if (!account) return;

    const monthTx = transactions
      .filter((t) => t.accountId === accountId && t.date.startsWith(period))
      .sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? -1 : 1));

    const doc = generateStatementPdf({
      profile,
      account,
      periodLabel: label,
      transactions: monthTx,
    });
    doc.save(`statement-${accountId}-${period}.pdf`);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">Statements</h2>
        <p className="mt-1.5 text-sm text-ink-800/55">
          Download monthly statements for your records.
        </p>
      </div>

      {accounts.map((account) => {
        const accountStatements = statements.filter((s) => s.accountId === account.id);
        return (
          <Card key={account.id}>
            <CardHeader
              title={account.nickname}
              subtitle={`Account ${account.accountNumberMasked}`}
            />
            <ul className="divide-y divide-ink-900/6">
              {accountStatements.map((s) => (
                <li key={s.id} className="flex items-center justify-between py-3.5">
                  <div>
                    <p className="text-sm font-medium text-ink-900">{s.label}</p>
                    <p className="text-xs text-ink-800/45">
                      Generated {formatDate(`${s.period}-01`)}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadStatement(s.period, s.accountId, s.label)}
                    className="rounded-full border border-ink-900/15 px-4 py-2 text-xs font-medium text-ink-800 transition-colors hover:border-brand-500/40 hover:text-brand-700"
                  >
                    Download PDF
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        );
      })}

      <p className="text-xs text-ink-800/40">
        Each statement is a formatted PDF with the full transaction history
        for that month, along with total credits and debits.
      </p>
    </div>
  );
}
