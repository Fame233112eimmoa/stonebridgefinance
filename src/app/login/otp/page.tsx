"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { useAuth } from "@/lib/auth-context";
import { maskPhone } from "@/lib/format";

const LENGTH = 6;

export default function OtpPage() {
  const router = useRouter();
  const { status, isLoaded, pendingProfile, verifyOtp, resendOtp } = useAuth();
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resent, setResent] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!isLoaded) return;
    if (status === "authenticated") {
      router.replace("/dashboard");
    } else if (status === "signed-out") {
      router.replace("/login");
    }
  }, [isLoaded, status, router]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  function updateDigit(index: number, value: string) {
    const clean = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean;
      return next;
    });
    if (clean && index < LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  }

  function handleSubmit() {
    const code = digits.join("");
    if (code.length !== LENGTH) {
      setError("Enter all 6 digits.");
      return;
    }
    setError("");
    setSubmitting(true);
    window.setTimeout(() => {
      const result = verifyOtp(code);
      setSubmitting(false);
      if (!result.ok) {
        setError(result.error ?? "Invalid code.");
        setDigits(Array(LENGTH).fill(""));
        inputsRef.current[0]?.focus();
        return;
      }
      router.push("/dashboard");
    }, 500);
  }

  function handleResend() {
    resendOtp();
    setResent(true);
    setDigits(Array(LENGTH).fill(""));
    inputsRef.current[0]?.focus();
    window.setTimeout(() => setResent(false), 3000);
  }

  return (
    <AuthShell
      title="Enter your verification code"
      subtitle={
        pendingProfile
          ? `We've sent a 6-digit code to your mobile phone at ${maskPhone(pendingProfile.phone)}.`
          : "We've sent a 6-digit code to your mobile phone."
      }
    >
      <div
        className="flex justify-between gap-2"
        onPaste={handlePaste}
      >
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => updateDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="h-14 w-full max-w-[3rem] rounded-xl border border-ink-900/15 bg-white text-center font-serif text-2xl text-ink-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-6 w-full rounded-full bg-brand-600 px-6 py-3.5 text-sm font-medium text-white shadow-sm shadow-brand-600/25 transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Verifying…" : "Verify & Continue"}
      </button>

      <button
        type="button"
        onClick={handleResend}
        className="mt-4 w-full text-center text-sm font-medium text-brand-700 hover:underline"
      >
        {resent ? "Code resent" : "Resend code"}
      </button>
    </AuthShell>
  );
}
