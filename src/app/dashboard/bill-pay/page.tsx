"use client";

import { useState } from "react";
import { Card, CardHeader, StatusPill } from "@/components/dashboard/Card";
import { useBankData } from "@/lib/bank-data-context";
import { payees as payeeDirectory } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";

export default function BillPayPage() {
  const { accounts, bills, payBill } = useBankData();
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [payingId, setPayingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function handlePay(billId: string) {
    setMessage(null);
    setPayingId(billId);
    window.setTimeout(() => {
      const result = payBill({ billId, accountId });
      setPayingId(null);
      if (!result.ok) {
        setMessage({ type: "err", text: result.error ?? "Payment failed." });
        return;
      }
      setMessage({ type: "ok", text: "Payment submitted successfully." });
    }, 500);
  }

  const sorted = [...bills].sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">Bill Pay</h2>
          <p className="mt-1.5 text-sm text-ink-800/55">
            Manage payees and pay upcoming bills.
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-800/60">
            Pay from
          </label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="rounded-xl border border-ink-900/15 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nickname}
              </option>
            ))}
          </select>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader title="Payees" subtitle={`${payeeDirectory.length} saved payees`} />
        <ul className="divide-y divide-ink-900/6">
          {sorted.map((bill) => {
            const payee = payeeDirectory.find((p) => p.id === bill.payeeId);
            if (!payee) return null;
            const isPending = payingId === bill.id;
            return (
              <li
                key={bill.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 font-serif text-sm text-brand-700">
                    {payee.initial}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink-900">{payee.name}</p>
                    <p className="text-xs text-ink-800/50">
                      {payee.category} · Acct {payee.accountNumberMasked} · Due{" "}
                      {formatDate(bill.dueDate)}
                      {bill.autopay && " · Autopay on"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <span className="font-medium tabular-nums text-ink-900">
                    {formatCurrency(bill.amount)}
                  </span>
                  <StatusPill status={bill.status} />
                  {bill.status !== "paid" && (
                    <button
                      onClick={() => handlePay(bill.id)}
                      disabled={isPending}
                      className="rounded-full bg-brand-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isPending ? "Paying…" : "Pay Now"}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
