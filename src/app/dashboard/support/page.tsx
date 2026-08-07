"use client";

import { useState, type FormEvent } from "react";
import { Card, CardHeader } from "@/components/dashboard/Card";

const FAQS = [
  {
    q: "How do I dispute a transaction?",
    a: "Go to Transactions, select the charge in question, and choose “Dispute this transaction.” We'll open a case with our claims team and issue a provisional credit while we investigate — most disputes are resolved within 10 business days.",
  },
  {
    q: "How long do mobile check deposits take to clear?",
    a: "Most deposits are available within 1 business day. Larger checks may be held for additional review.",
  },
  {
    q: "Can I change my Customer ID?",
    a: "Customer IDs are assigned at account opening and can't be changed. You can update your password and contact info anytime in Profile & Security.",
  },
  {
    q: "What should I do if I lose my card?",
    a: "Freeze it immediately from the Cards page, then contact support to request a replacement.",
  },
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setSubject("");
    setMessage("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">Support</h2>
        <p className="mt-1.5 text-sm text-ink-800/55">
          Find answers or get in touch with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <ContactTile title="Call us" detail="1-800-555-0199" note="Mon–Fri, 8am–8pm ET" />
        <ContactTile title="Email us" detail="support@stonebridge.example" note="Replies within 1 business day" />
        <ContactTile title="Visit a branch" detail="Find a location" note="200+ branches nationwide" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Frequently Asked Questions" />
          <ul className="divide-y divide-ink-900/6">
            {FAQS.map((faq, i) => {
              const open = openIndex === i;
              return (
                <li key={faq.q}>
                  <button
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  >
                    <span className="text-sm font-medium text-ink-900">{faq.q}</span>
                    <span
                      className={`shrink-0 text-ink-800/40 transition-transform ${open ? "rotate-45" : ""}`}
                    >
                      +
                    </span>
                  </button>
                  {open && (
                    <p className="pb-4 pr-8 text-sm leading-relaxed text-ink-800/60">{faq.a}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Send a Message" />
          {submitted ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Thanks for reaching out — a member of our support team will
              follow up by email within 1 business day.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-800">Subject</label>
                <input
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What do you need help with?"
                  className="w-full rounded-xl border border-ink-900/15 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-800">Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us more…"
                  className="w-full rounded-xl border border-ink-900/15 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700"
              >
                Send Message
              </button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

function ContactTile({ title, detail, note }: { title: string; detail: string; note: string }) {
  return (
    <div className="rounded-2xl border border-ink-900/8 bg-white p-5">
      <p className="text-xs font-medium tracking-[0.1em] text-ink-800/45 uppercase">{title}</p>
      <p className="mt-2 font-serif text-lg text-ink-900">{detail}</p>
      <p className="mt-1 text-xs text-ink-800/50">{note}</p>
    </div>
  );
}
