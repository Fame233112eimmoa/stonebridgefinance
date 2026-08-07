"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Card } from "@/components/dashboard/Card";
import { CameraIcon } from "@/components/dashboard/icons";
import { useBankData } from "@/lib/bank-data-context";
import { formatCurrency } from "@/lib/format";

export default function DepositPage() {
  const { accounts, depositCheck } = useBankData();
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [frontName, setFrontName] = useState("");
  const [backName, setBackName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleFile(setter: (name: string) => void) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) setter(file.name);
    };
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!frontName || !backName) {
      setError("Attach photos of both the front and back of the check.");
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      const result = depositCheck({ accountId, amount: Number(amount) });
      setSubmitting(false);
      if (!result.ok) return setError(result.error ?? "Deposit failed.");
      setSuccess(true);
    }, 700);
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
            <path d="M4 12.5l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl text-ink-900">Deposit submitted</h2>
        <p className="text-sm text-ink-800/60">
          {formatCurrency(Number(amount))} has been submitted for review and will show as
          pending until it clears — typically within 1 business day.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setAmount("");
            setFrontName("");
            setBackName("");
          }}
          className="rounded-full bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700"
        >
          Deposit Another Check
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">Mobile Check Deposit</h2>
        <p className="mt-1.5 text-sm text-ink-800/55">
          Snap photos of your check and deposit it in seconds.
        </p>
      </div>

      <Card className="mx-auto max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800">
              Deposit to
            </label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className={inputClass}
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nickname}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800">
              Check amount
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-ink-800/50">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`${inputClass} pl-7`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UploadTile label="Front of check" fileName={frontName} onChange={handleFile(setFrontName)} />
            <UploadTile label="Back of check" fileName={backName} onChange={handleFile(setBackName)} />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-brand-600 px-6 py-3.5 text-sm font-medium text-white shadow-sm shadow-brand-600/25 transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit Deposit"}
          </button>
          <p className="text-center text-xs text-ink-800/40">
            Make sure all four corners are visible and the check is well-lit
            and in focus before submitting.
          </p>
        </form>
      </Card>
    </div>
  );
}

function UploadTile({
  label,
  fileName,
  onChange,
}: {
  label: string;
  fileName: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-900/15 bg-sand-50 px-4 py-8 text-center transition-colors hover:border-brand-500/40 hover:bg-brand-50/40">
      <CameraIcon className="h-6 w-6 text-ink-800/40" />
      <span className="text-xs font-medium text-ink-800">{label}</span>
      <span className="max-w-full truncate text-[0.7rem] text-ink-800/45">
        {fileName || "Tap to attach photo"}
      </span>
      <input type="file" accept="image/*" onChange={onChange} className="hidden" />
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-ink-900/15 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";
