"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";

const FAQS = [
  {
    q: "Is there a minimum balance or monthly fee?",
    a: "No. Everyday Checking has no monthly fee and no minimum balance requirement — the balance shown on your account is yours to use.",
  },
  {
    q: "How long does it take to open an account?",
    a: "The application itself takes about 5 minutes. Identity verification usually finishes within 1–2 business days, after which your account is ready to use.",
  },
  {
    q: "Can I send money with Zelle, PayPal, or Venmo?",
    a: "Yes. Zelle transfers move directly between banks and typically arrive within minutes. PayPal, Cash App, and Venmo are also supported for sending to linked accounts.",
  },
  {
    q: "What happens if my card is lost or stolen?",
    a: "Freeze it instantly from the Cards page in the app — no call required. You can unfreeze it just as quickly if you find it again, or request a replacement.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-sand-50 py-20 lg:py-28">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <span className="text-xs font-medium tracking-[0.25em] text-brand-600 uppercase">
              FAQ
            </span>
            <h2 className="mt-4 text-balance font-serif text-3xl leading-tight text-ink-900 sm:text-4xl">
              Common questions
            </h2>
            <p className="mt-5 text-[0.98rem] leading-relaxed text-ink-800/60">
              Don&rsquo;t see what you&rsquo;re looking for?{" "}
              <a href="#contact" className="font-medium text-brand-700 hover:underline">
                Get in touch
              </a>{" "}
              or sign in for full account support.
            </p>
          </Reveal>

          <div className="lg:col-span-7 lg:col-start-6">
            <ul className="divide-y divide-ink-900/8 border-t border-ink-900/8">
              {FAQS.map((faq, i) => {
                const open = openIndex === i;
                return (
                  <Reveal key={faq.q} delay={i * 0.05}>
                    <li>
                      <button
                        onClick={() => setOpenIndex(open ? null : i)}
                        className="flex w-full items-center justify-between gap-4 py-5 text-left"
                      >
                        <span className="font-serif text-lg text-ink-900">{faq.q}</span>
                        <span
                          className={`shrink-0 text-xl text-ink-800/40 transition-transform ${
                            open ? "rotate-45" : ""
                          }`}
                        >
                          +
                        </span>
                      </button>
                      {open && (
                        <p className="pb-5 pr-8 text-[0.95rem] leading-relaxed text-ink-800/60">
                          {faq.a}
                        </p>
                      )}
                    </li>
                  </Reveal>
                );
              })}
            </ul>

            <Reveal delay={0.2}>
              <Link
                href="/register"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:underline"
              >
                Ready to open an account? Get started →
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
