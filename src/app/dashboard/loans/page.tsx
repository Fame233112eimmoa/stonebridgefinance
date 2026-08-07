"use client";

import { useState, type FormEvent } from "react";
import { Card, CardHeader, StatusPill } from "@/components/dashboard/Card";
import { useBankData } from "@/lib/bank-data-context";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Loan } from "@/lib/types";

const LOAN_TYPES: Loan["type"][] = ["Personal", "Auto", "Mortgage", "Student"];
const TERM_OPTIONS = [12, 24, 36, 48, 60, 84, 120];

export default function LoansPage() {
  const { loans, applyForLoan } = useBankData();
  const [type, setType] = useState<Loan["type"]>("Personal");
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState(36);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    window.setTimeout(() => {
      const result = applyForLoan({ type, amount: Number(amount), termMonths: term });
      setSubmitting(false);
      if (!result.ok) return setError(result.error ?? "Application failed.");
      setSuccess("Application submitted. We'll notify you once it's reviewed.");
      setAmount("");
    }, 600);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">Loans</h2>
        <p className="mt-1.5 text-sm text-ink-800/55">
          Track existing loans or apply for something new.
        </p>
      </div>

      <div className="space-y-5">
        {loans.map((loan) => {
          const paidPct = Math.round(
            ((loan.originalAmount - loan.balance) / loan.originalAmount) * 100
          );
          return (
            <Card key={loan.id}>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-serif text-lg text-ink-900">{loan.type} Loan</h3>
                    <StatusPill status={loan.status} />
                  </div>
                  <p className="mt-1 text-sm text-ink-800/50">
                    Originated at {formatCurrency(loan.originalAmount)} · {loan.rate}% APR ·{" "}
                    {loan.termMonths} mo term
                  </p>
                </div>
                <div className="sm:text-right">
                  <div className="font-serif text-xl text-ink-900">
                    {formatCurrency(loan.balance)}
                  </div>
                  <p className="text-xs text-ink-800/50">remaining balance</p>
                </div>
              </div>

              {loan.status === "active" && (
                <>
                  <div className="mt-5">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-ink-900/8">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${paidPct}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-ink-800/50">{paidPct}% paid off</p>
                  </div>

                  <div className="mt-5 flex flex-col gap-2 border-t border-ink-900/6 pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-ink-800/60">
                      Next payment {formatCurrency(loan.monthlyPayment)} due{" "}
                      {formatDate(loan.nextPaymentDate)}
                    </span>
                  </div>
                </>
              )}
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader title="Apply for a Loan" subtitle="Get a rate estimate in seconds" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">Loan type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Loan["type"])}
                className={inputClass}
              >
                {LOAN_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">Amount</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-ink-800/50">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="10,000"
                  className={`${inputClass} pl-7`}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">Term</label>
              <select
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
                className={inputClass}
              >
                {TERM_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t} months
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-brand-600 px-6 py-3.5 text-sm font-medium text-white shadow-sm shadow-brand-600/25 transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit Application"}
          </button>
        </form>
      </Card>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-ink-900/15 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";
