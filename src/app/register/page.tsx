"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { useAuth } from "@/lib/auth-context";

type Fields = {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  password: string;
  confirmPassword: string;
};

const EMPTY: Fields = {
  fullName: "",
  email: "",
  phone: "",
  dob: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const { register } = useAuth();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (fields.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (fields.password !== fields.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setError("");
    setSubmitting(true);
    window.setTimeout(() => {
      register();
      setSubmitting(false);
      setDone(true);
    }, 600);
  }

  if (done) {
    return (
      <AuthShell title="Application received">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
              <path d="M4 12.5l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-ink-800/70">
            Thanks, {fields.fullName || "there"}. Your application is now in
            identity verification — new accounts are typically activated
            within 1–2 business days once that's complete.
          </p>

          <Link
            href="/login"
            className="mt-6 block w-full rounded-full bg-brand-600 px-6 py-3.5 text-sm font-medium text-white shadow-sm shadow-brand-600/25 transition-colors hover:bg-brand-700"
          >
            Go to Log In
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Open an account"
      subtitle="It only takes a few minutes — we'll verify your identity and set up your new Customer ID."
      footer={
        <span className="text-ink-800/60">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-700 hover:underline">
            Log in
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name">
          <input
            required
            value={fields.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="Jane Doe"
            className={inputClass}
          />
        </Field>

        <Field label="Email address">
          <input
            required
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone">
            <input
              required
              type="tel"
              autoComplete="tel"
              value={fields.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="(555) 555-0100"
              className={inputClass}
            />
          </Field>
          <Field label="Date of birth">
            <input
              required
              type="date"
              value={fields.dob}
              onChange={(e) => update("dob", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Password">
          <input
            required
            type="password"
            autoComplete="new-password"
            value={fields.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder="At least 8 characters"
            className={inputClass}
          />
        </Field>

        <Field label="Confirm password">
          <input
            required
            type="password"
            autoComplete="new-password"
            value={fields.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
            placeholder="Re-enter your password"
            className={inputClass}
          />
        </Field>

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
          {submitting ? "Submitting…" : "Create Account"}
        </button>
      </form>
    </AuthShell>
  );
}

const inputClass =
  "w-full rounded-xl border border-ink-900/15 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-800">{label}</label>
      {children}
    </div>
  );
}
