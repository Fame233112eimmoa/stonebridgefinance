"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-sand-50 pt-32 pb-20 lg:pt-40 lg:pb-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-brand-100/70 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.35]" aria-hidden="true">
          <defs>
            <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M56 0H0V56" fill="none" stroke="rgba(15,30,36,0.06)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container-page relative">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-600/20 bg-brand-50 px-4 py-1.5 text-xs font-medium tracking-wide text-brand-700 uppercase">
                Checking · Savings · Loans · Cards
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-7 text-balance font-serif text-[2.6rem] leading-[1.08] text-ink-900 sm:text-6xl lg:text-[3.4rem]">
                Banking that fits in your{" "}
                <span className="text-brand-600">pocket</span>, not your way.
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-7 max-w-lg text-lg leading-relaxed text-ink-800/70">
                Open a checking or savings account in minutes, send money
                instantly with Zelle, and keep an eye on every dollar — all
                from one app, with no hidden fees.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="rounded-full bg-brand-600 px-7 py-3.5 text-[0.95rem] font-medium text-white shadow-lg shadow-brand-600/25 transition-colors hover:bg-brand-700"
                >
                  Open an Account
                </Link>
                <a
                  href="#products"
                  className="rounded-full border border-ink-900/15 px-7 py-3.5 text-[0.95rem] font-medium text-ink-900 transition-colors hover:border-brand-600/40 hover:text-brand-700"
                >
                  Explore Accounts
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <dl className="mt-12 grid grid-cols-3 gap-8 border-t border-ink-900/10 pt-8 max-w-lg">
                <Stat value="500K+" label="Customers" />
                <Stat value="$0" label="Monthly Fees*" />
                <Stat value="4.9/5" label="App Rating*" />
              </dl>
              <p className="mt-3 text-xs text-ink-800/40">
                *On our Everyday Checking account. See account terms for details.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={0.2} y={32}>
              <HeroPhoneMockup />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroPhoneMockup() {
  return (
    <div className="relative mx-auto flex max-w-sm justify-center">
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-brand-500/20 to-brand-200/10 blur-3xl" />

      {/* Floating stat card */}
      <motion.div
        initial={{ opacity: 0, y: 12, x: -10 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="absolute -left-10 -top-10 z-20 hidden w-44 rounded-2xl border border-white bg-white/95 p-4 shadow-xl shadow-ink-900/10 backdrop-blur-sm sm:block lg:-left-14 lg:-top-12"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="M4 12.5l5 5L20 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-xs font-medium text-ink-800">Zelle sent</span>
        </div>
        <p className="mt-2 text-sm font-medium text-ink-900">$40.00 to Alex R.</p>
        <p className="text-[0.7rem] text-ink-800/45">Just now</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12, x: 10 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="absolute -right-4 bottom-24 z-20 hidden w-40 rounded-2xl border border-white bg-white/95 p-3.5 shadow-xl shadow-ink-900/10 backdrop-blur-sm sm:block lg:-right-8"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
              <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M8 10.5V7.5a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-xs font-medium text-ink-800">Card frozen</span>
        </div>
        <p className="mt-1.5 text-[0.7rem] leading-snug text-ink-800/50">
          Debit card locked instantly from the app.
        </p>
      </motion.div>

      {/* Phone frame */}
      <div className="relative w-full max-w-[300px] rounded-[2.75rem] border-[6px] border-ink-900 bg-ink-900 p-2.5 shadow-2xl shadow-ink-900/25">
        <div className="absolute left-1/2 top-2.5 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-ink-900" />
        <div className="overflow-hidden rounded-[2.1rem] bg-sand-50">
          <div className="flex items-center justify-between px-5 pt-4 pb-2 text-[0.65rem] font-medium text-ink-800/50">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-ink-800/30" />
              <span className="h-2 w-3 rounded-sm bg-ink-800/30" />
            </div>
          </div>

          <div className="px-5 pb-6">
            <p className="mt-1 text-xs text-ink-800/50">Good morning,</p>
            <p className="font-serif text-lg text-ink-900">Jordan</p>

            <div className="mt-4 rounded-2xl bg-gradient-to-br from-ink-900 to-brand-900 p-4 text-white">
              <span className="text-[0.6rem] tracking-[0.2em] text-white/50 uppercase">
                Everyday Checking
              </span>
              <div className="mt-1.5 font-serif text-2xl">$4,218.56</div>
              <div className="mt-3 flex items-end gap-1 h-10">
                {[30, 45, 38, 58, 50, 66, 54, 72].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.05, ease: "easeOut" }}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-brand-500 to-brand-300"
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {[
                { label: "Transfer", icon: "↔" },
                { label: "Pay Bill", icon: "▤" },
                { label: "Deposit", icon: "◎" },
                { label: "Cards", icon: "▭" },
              ].map((a) => (
                <div key={a.label} className="flex flex-col items-center gap-1.5 rounded-xl bg-white py-3 shadow-sm shadow-ink-900/5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-xs text-brand-600">
                    {a.icon}
                  </span>
                  <span className="text-center text-[0.55rem] font-medium text-ink-800/70">
                    {a.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2.5 rounded-xl bg-white p-3.5 shadow-sm shadow-ink-900/5">
              <Row label="Ridgeline Coffee Co." amount="-$6.75" />
              <Row label="Northbridge Media Inc." amount="+$2,840.00" positive />
              <Row label="Transit Authority" amount="-$32.00" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, amount, positive = false }: { label: string; amount: string; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="truncate text-[0.65rem] text-ink-800/70">{label}</span>
      <span className={`shrink-0 text-[0.65rem] font-medium ${positive ? "text-emerald-600" : "text-ink-900"}`}>
        {amount}
      </span>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-2xl text-ink-900 sm:text-3xl">{value}</div>
      <div className="mt-1 text-xs text-ink-800/55">{label}</div>
    </div>
  );
}
