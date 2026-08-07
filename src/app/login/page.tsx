"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [customerId, setCustomerId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // Simulate a brief network round-trip for realism.
    window.setTimeout(() => {
      const result = login(customerId, password);
      setSubmitting(false);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }
      router.push("/login/otp");
    }, 500);
  }

  return (
    <AuthShell
      title="Log in to your account"
      subtitle="Enter your Customer ID and password to continue."
      footer={
        <span className="text-ink-800/60">
          New here?{" "}
          <Link href="/register" className="font-medium text-brand-700 hover:underline">
            Open an account
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="customerId" className="mb-1.5 block text-sm font-medium text-ink-800">
            Customer ID
          </label>
          <input
            id="customerId"
            type="text"
            autoCapitalize="characters"
            autoComplete="username"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="e.g. SBF-10293"
            required
            className="w-full rounded-xl border border-ink-900/15 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-ink-800">
              Password
            </label>
            <Link href="#" className="text-xs font-medium text-brand-700 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-xl border border-ink-900/15 bg-white px-4 py-3 pr-12 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-ink-800/50 hover:text-brand-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
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
          {submitting ? "Verifying…" : "Continue"}
        </button>
      </form>
    </AuthShell>
  );
}
