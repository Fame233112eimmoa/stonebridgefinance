"use client";

import { useId } from "react";

type LogoProps = {
  variant?: "dark" | "light";
  className?: string;
};

// Original mark: a minimal cable-stayed bridge, drawn from scratch for this
// brand — not modeled on any real company's logo.
export default function Logo({ variant = "dark", className = "" }: LogoProps) {
  const gradientId = useId();
  const textColor = variant === "light" ? "text-white" : "text-ink-900";
  const subColor = variant === "light" ? "text-brand-200" : "text-brand-600";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <rect width="36" height="36" rx="9" fill={`url(#${gradientId})`} />
        <path
          d="M18 8.5V25M18 8.5L10.5 25M18 8.5L25.5 25M6.5 25H29.5M9 25V27.5M27 25V27.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#071a20" />
            <stop offset="1" stopColor="#16474b" />
          </linearGradient>
        </defs>
      </svg>
      <span className={`font-serif leading-none ${textColor}`}>
        <span className="block text-[1.05rem] tracking-wide">Stonebridge</span>
        <span className={`block text-[0.62rem] tracking-[0.3em] uppercase ${subColor}`}>
          Finance
        </span>
      </span>
    </span>
  );
}
