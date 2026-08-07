"use client";

import { useState } from "react";
import { Card, CardHeader, StatusPill } from "@/components/dashboard/Card";
import { LockIcon, SnowflakeIcon } from "@/components/dashboard/icons";
import { useBankData } from "@/lib/bank-data-context";
import { formatCurrency, formatDate } from "@/lib/format";

export default function CardsPage() {
  const { cards, accounts, toggleCardFreeze, payCreditCard } = useBankData();
  const [payAmount, setPayAmount] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function handlePay(cardId: string) {
    const amount = Number(payAmount[cardId] ?? 0);
    const result = payCreditCard({ cardId, accountId: accounts[0].id, amount });
    if (!result.ok) {
      setMessage({ type: "err", text: result.error ?? "Payment failed." });
      return;
    }
    setMessage({ type: "ok", text: "Payment applied to your card." });
    setPayAmount((prev) => ({ ...prev, [cardId]: "" }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">Cards</h2>
        <p className="mt-1.5 text-sm text-ink-800/55">
          Manage your debit and credit cards, freeze status, and payments.
        </p>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {cards.map((card) => (
          <Card key={card.id}>
            <div
              className={`relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl p-6 text-white transition-opacity ${
                card.status === "frozen" ? "opacity-60" : ""
              } ${
                card.type === "credit"
                  ? "bg-gradient-to-br from-brand-700 to-ink-900"
                  : "bg-gradient-to-br from-ink-900 to-ink-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs tracking-[0.2em] uppercase text-white/60">
                  Stonebridge Finance
                </span>
                <span className="font-serif text-lg italic">{card.network}</span>
              </div>
              <div className="mt-8 font-mono text-lg tracking-[0.25em] sm:text-xl">
                •••• •••• •••• {card.last4}
              </div>
              <div className="mt-6 flex items-end justify-between text-xs">
                <div>
                  <div className="text-white/50">Card Holder</div>
                  <div className="mt-0.5 tracking-wide">{card.holderName}</div>
                </div>
                <div>
                  <div className="text-white/50">Expires</div>
                  <div className="mt-0.5">{card.expiry}</div>
                </div>
              </div>
              {card.status === "frozen" && (
                <div className="absolute inset-0 flex items-center justify-center bg-ink-900/40 backdrop-blur-[1px]">
                  <span className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-medium text-ink-900">
                    <SnowflakeIcon className="h-3.5 w-3.5" /> Frozen
                  </span>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium tracking-[0.1em] text-ink-800/45 uppercase">
                  {card.type} card
                </span>
                <div className="mt-1">
                  <StatusPill status={card.status} />
                </div>
              </div>
              <button
                onClick={() => toggleCardFreeze(card.id)}
                className="flex items-center gap-2 rounded-full border border-ink-900/15 px-4 py-2 text-xs font-medium text-ink-800 hover:border-brand-500/40"
              >
                {card.status === "frozen" ? (
                  <>
                    <LockIcon className="h-3.5 w-3.5" /> Unfreeze Card
                  </>
                ) : (
                  <>
                    <SnowflakeIcon className="h-3.5 w-3.5" /> Freeze Card
                  </>
                )}
              </button>
            </div>

            {card.type === "credit" ? (
              <div className="mt-5 space-y-3 border-t border-ink-900/6 pt-5">
                <Row label="Current balance" value={formatCurrency(card.currentBalance ?? 0)} />
                <Row
                  label="Available credit"
                  value={formatCurrency((card.creditLimit ?? 0) - (card.currentBalance ?? 0))}
                />
                <Row label="Credit limit" value={formatCurrency(card.creditLimit ?? 0)} />
                <Row label="APR" value={`${card.apr?.toFixed(2)}%`} />
                <Row label="Payment due" value={card.dueDate ? formatDate(card.dueDate) : "—"} />
                <Row label="Minimum payment" value={formatCurrency(card.minimumPayment ?? 0)} />

                <div className="flex gap-2 pt-2">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-ink-800/50">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Payment amount"
                      value={payAmount[card.id] ?? ""}
                      onChange={(e) =>
                        setPayAmount((prev) => ({ ...prev, [card.id]: e.target.value }))
                      }
                      className="w-full rounded-xl border border-ink-900/15 bg-white py-2.5 pl-7 pr-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                  <button
                    onClick={() => handlePay(card.id)}
                    className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
                  >
                    Make Payment
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-5 border-t border-ink-900/6 pt-5">
                <Row
                  label="Linked account"
                  value={
                    accounts.find((a) => a.id === card.accountId)?.nickname ?? "—"
                  }
                />
              </div>
            )}
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Card Controls" subtitle="Additional settings for your cards" />
        <div className="grid grid-cols-1 gap-4 text-sm text-ink-800/65 sm:grid-cols-3">
          <ControlNote title="Report lost or stolen" text="Instantly freeze a card and request a replacement." />
          <ControlNote title="Set spending limits" text="Cap daily purchase or ATM withdrawal amounts." />
          <ControlNote title="Travel notice" text="Let us know before you travel to avoid blocked transactions." />
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-sm text-ink-800/55">{label}</span>
      <span className="text-sm font-medium text-ink-900">{value}</span>
    </div>
  );
}

function ControlNote({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-ink-900/8 p-4">
      <p className="text-sm font-medium text-ink-900">{title}</p>
      <p className="mt-1 text-xs text-ink-800/55">{text}</p>
    </div>
  );
}
