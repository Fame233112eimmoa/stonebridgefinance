"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardHeader, StatusPill } from "@/components/dashboard/Card";
import { useBankData, type TransferProvider } from "@/lib/bank-data-context";
import { formatCurrency, formatDate } from "@/lib/format";
import type { AccountType, TransferFrequency } from "@/lib/types";

type SummaryRow = { label: string; value: string };
type Stage = "idle" | "confirm" | "loading" | "failed";

type Mode = "internal" | "external-bank" | "zelle" | "app";

type AppProvider = Extract<TransferProvider, "PayPal" | "Cash App" | "Venmo">;

const APP_PROVIDERS: {
  id: AppProvider;
  badge: string;
  color: string;
  handleLabel: string;
  placeholder: string;
}[] = [
  { id: "PayPal", badge: "P", color: "#0070ba", handleLabel: "PayPal email", placeholder: "alex@example.com" },
  { id: "Cash App", badge: "$", color: "#00c244", handleLabel: "$Cashtag", placeholder: "$alexrivera" },
  { id: "Venmo", badge: "V", color: "#008cff", handleLabel: "Venmo username", placeholder: "@alex-rivera" },
];

const FREQUENCIES: { id: TransferFrequency; label: string }[] = [
  { id: "once", label: "One-time" },
  { id: "weekly", label: "Weekly" },
  { id: "biweekly", label: "Every 2 weeks" },
  { id: "monthly", label: "Monthly" },
];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function TransfersPage() {
  const {
    accounts,
    linkedBankAccounts,
    scheduledTransfers,
    addLinkedAccount,
    removeLinkedAccount,
    cancelScheduledTransfer,
  } = useBankData();

  const [mode, setMode] = useState<Mode>("internal");
  const [appProvider, setAppProvider] = useState<AppProvider>("PayPal");

  const [fromId, setFromId] = useState(accounts[0]?.id ?? "");
  const [toId, setToId] = useState(accounts[1]?.id ?? "");
  const [recipientName, setRecipientName] = useState("");
  const [contact, setContact] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  const [date, setDate] = useState(todayStr());
  const [frequency, setFrequency] = useState<TransferFrequency>("once");
  const [linkedAccountId, setLinkedAccountId] = useState(linkedBankAccounts[0]?.id ?? "");
  const [showAddLinked, setShowAddLinked] = useState(false);

  const [error, setError] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [summary, setSummary] = useState<SummaryRow[]>([]);

  function switchMode(m: Mode) {
    setMode(m);
    setError("");
  }

  function buildSummary(numericAmount: number): SummaryRow[] {
    const rows: SummaryRow[] = [];
    const from = accounts.find((a) => a.id === fromId);
    rows.push({ label: "From", value: from?.nickname ?? "" });

    if (mode === "internal") {
      const to = accounts.find((a) => a.id === toId);
      rows.push({ label: "To", value: to?.nickname ?? "" });
    } else if (mode === "external-bank") {
      const linked = linkedBankAccounts.find((a) => a.id === linkedAccountId);
      rows.push({
        label: "To",
        value: linked ? `${linked.nickname} · ${linked.bankName} ••${linked.last4}` : "",
      });
    } else {
      rows.push({ label: "Recipient", value: recipientName.trim() });
      rows.push({
        label: mode === "zelle" ? "Email or mobile" : activeApp.handleLabel,
        value: contact.trim(),
      });
      rows.push({ label: "Method", value: mode === "zelle" ? "Zelle" : appProvider });
    }

    rows.push({ label: "Amount", value: formatCurrency(numericAmount) });
    if (memo.trim()) rows.push({ label: "Memo", value: memo.trim() });

    if (mode === "internal" || mode === "external-bank") {
      rows.push({
        label: "When",
        value: isImmediate
          ? "Immediately"
          : `${formatDate(date)} · ${FREQUENCIES.find((f) => f.id === frequency)?.label}`,
      });
    }

    return rows;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const numericAmount = Number(amount);
    const from = accounts.find((a) => a.id === fromId);

    if (!(numericAmount > 0)) return setError("Enter an amount greater than $0.");
    if (!from || from.availableBalance < numericAmount) {
      return setError("Insufficient available balance.");
    }

    if (mode === "internal" && fromId === toId) {
      return setError("Choose two different accounts.");
    }
    if (mode === "external-bank" && !linkedAccountId) {
      return setError("Select or add an external bank account.");
    }
    if ((mode === "zelle" || mode === "app") && (!recipientName.trim() || !contact.trim())) {
      return setError("Enter a recipient name and contact.");
    }

    setSummary(buildSummary(numericAmount));
    setStage("confirm");
  }

  function handleConfirm() {
    setStage("loading");
    window.setTimeout(() => {
      setStage("failed");
    }, 5000);
  }

  function closeStatus() {
    setStage("idle");
  }

  const fromAccount = accounts.find((a) => a.id === fromId);
  const activeApp = APP_PROVIDERS.find((p) => p.id === appProvider)!;
  const isImmediate = date === todayStr() && frequency === "once";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">Transfers</h2>
        <p className="mt-1.5 text-sm text-ink-800/55">
          Move money between your accounts, send to another bank, schedule a
          recurring transfer, or pay through Zelle and linked apps.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-6 flex flex-wrap gap-1 rounded-full bg-sand-100 p-1">
            {(
              [
                { id: "internal", label: "My Accounts" },
                { id: "external-bank", label: "External Bank" },
                { id: "zelle", label: "Zelle" },
                { id: "app", label: "External Apps" },
              ] as { id: Mode; label: string }[]
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => switchMode(m.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  mode === m.id ? "bg-white text-brand-700 shadow-sm" : "text-ink-800/55"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {mode === "zelle" && (
            <div className="mb-6 flex items-center gap-4">
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-sm"
                style={{ backgroundColor: "#6d1ed4" }}
              >
                Z
              </span>
              <p className="font-serif text-xl text-ink-900">Zelle</p>
            </div>
          )}

          {mode === "app" && (
            <div className="mb-6 grid grid-cols-3 gap-3">
              {APP_PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setAppProvider(p.id)}
                  className={`flex flex-col items-center gap-2.5 rounded-2xl border-2 py-5 transition-colors ${
                    appProvider === p.id ? "" : "border-ink-900/10 hover:border-ink-900/20"
                  }`}
                  style={
                    appProvider === p.id
                      ? { borderColor: p.color, backgroundColor: `${p.color}0d` }
                      : undefined
                  }
                >
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-sm"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.badge}
                  </span>
                  <span className="text-sm font-medium text-ink-900">{p.id}</span>
                </button>
              ))}
            </div>
          )}

          {mode === "external-bank" && (
            <ExternalBankPanel
              linkedAccounts={linkedBankAccounts}
              selectedId={linkedAccountId}
              onSelect={setLinkedAccountId}
              showAddForm={showAddLinked}
              onToggleAddForm={() => setShowAddLinked((v) => !v)}
              onAdd={(input) => {
                const result = addLinkedAccount(input);
                if (result.ok) {
                  setShowAddLinked(false);
                }
                return result;
              }}
              onRemove={(id) => {
                removeLinkedAccount(id);
                if (linkedAccountId === id) setLinkedAccountId("");
              }}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "internal" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-800">From</label>
                  <select value={fromId} onChange={(e) => setFromId(e.target.value)} className={selectClass}>
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nickname} — {formatCurrency(a.availableBalance)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-800">To</label>
                  <select value={toId} onChange={(e) => setToId(e.target.value)} className={selectClass}>
                    {accounts
                      .filter((a) => a.id !== fromId)
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.nickname}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            )}

            {mode === "external-bank" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-800">From</label>
                <select value={fromId} onChange={(e) => setFromId(e.target.value)} className={selectClass}>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nickname} — {formatCurrency(a.availableBalance)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(mode === "zelle" || mode === "app") && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-800">From</label>
                  <select value={fromId} onChange={(e) => setFromId(e.target.value)} className={selectClass}>
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nickname} — {formatCurrency(a.availableBalance)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-800">
                    Recipient name
                  </label>
                  <input
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {mode === "zelle" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-800">
                  Email or mobile number
                </label>
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="alex@example.com"
                  className={inputClass}
                />
              </div>
            )}

            {mode === "app" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-800">
                  {activeApp.handleLabel}
                </label>
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder={activeApp.placeholder}
                  className={inputClass}
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-800">Amount</label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-ink-800/50">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    className={`${inputClass} pl-7`}
                  />
                </div>
                {fromAccount && (
                  <p className="mt-1.5 text-xs text-ink-800/45">
                    Available: {formatCurrency(fromAccount.availableBalance)}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-800">
                  Memo (optional)
                </label>
                <input
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="What's this for?"
                  className={inputClass}
                />
              </div>
            </div>

            {(mode === "internal" || mode === "external-bank") && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-800">Date</label>
                  <input
                    type="date"
                    min={todayStr()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-800">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as TransferFrequency)}
                    className={selectClass}
                  >
                    {FREQUENCIES.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-brand-600 px-6 py-3.5 text-sm font-medium text-white shadow-sm shadow-brand-600/25 transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {mode === "internal" || mode === "external-bank"
                ? isImmediate
                  ? "Transfer Funds"
                  : "Schedule Transfer"
                : `Send with ${mode === "zelle" ? "Zelle" : appProvider}`}
            </button>
          </form>
        </Card>

        <Card>
          <h3 className="font-serif text-lg text-ink-900">Good to know</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-800/60">
            <li>Transfers between your own accounts post immediately.</li>
            <li>External bank transfers move over ACH and typically take 1–3 business days to arrive.</li>
            <li>Zelle payments move directly between banks, so they typically arrive within minutes.</li>
            <li>PayPal, Cash App, and Venmo payments route through each provider&rsquo;s own network and may take longer to settle.</li>
            <li>Schedule a future or recurring transfer and it'll show up under Scheduled Transfers below.</li>
            <li>Daily transfer limits and automated fraud monitoring help keep your account secure.</li>
          </ul>
        </Card>
      </div>

      {scheduledTransfers.length > 0 && (
        <Card>
          <CardHeader
            title="Scheduled & Recurring Transfers"
            subtitle="Upcoming transfers that haven't posted yet"
          />
          <ul className="divide-y divide-ink-900/6">
            {scheduledTransfers.map((s) => {
              const from = accounts.find((a) => a.id === s.fromAccountId);
              const freqLabel = FREQUENCIES.find((f) => f.id === s.frequency)?.label ?? s.frequency;
              return (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="text-sm font-medium text-ink-900">
                      {from?.nickname ?? "Account"} → {s.toLabel}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-800/50">
                      {formatDate(s.date)} · {freqLabel}
                      {s.memo ? ` · ${s.memo}` : ""}
                      {s.kind === "external-bank" ? " · External bank" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium tabular-nums text-ink-900">
                      {formatCurrency(s.amount)}
                    </span>
                    <button
                      onClick={() => cancelScheduledTransfer(s.id)}
                      className="rounded-full border border-ink-900/15 px-3.5 py-1.5 text-xs font-medium text-ink-800 hover:border-red-300 hover:text-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <TransferStatusModal
        stage={stage}
        summary={summary}
        onCancel={closeStatus}
        onConfirm={handleConfirm}
        onDismiss={closeStatus}
      />
    </div>
  );
}

function TransferStatusModal({
  stage,
  summary,
  onCancel,
  onConfirm,
  onDismiss,
}: {
  stage: Stage;
  summary: SummaryRow[];
  onCancel: () => void;
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  return (
    <AnimatePresence>
      {stage !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
            onClick={stage === "confirm" ? onCancel : undefined}
          />

          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl shadow-ink-900/20"
          >
            {stage === "confirm" && (
              <>
                <h3 className="font-serif text-xl text-ink-900">Confirm Transfer</h3>
                <p className="mt-1 text-sm text-ink-800/55">
                  Review the details below before sending.
                </p>

                <dl className="mt-5 space-y-3 border-t border-ink-900/8 pt-5">
                  {summary.map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-4 text-sm">
                      <dt className="text-ink-800/50">{row.label}</dt>
                      <dd className="text-right font-medium text-ink-900">{row.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-7 flex gap-3">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 rounded-full border border-ink-900/15 px-5 py-3 text-sm font-medium text-ink-800 hover:border-ink-900/30"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onConfirm}
                    className="flex-1 rounded-full bg-brand-600 px-5 py-3 text-sm font-medium text-white hover:bg-brand-700"
                  >
                    Confirm & Send
                  </button>
                </div>
              </>
            )}

            {stage === "loading" && (
              <div className="flex flex-col items-center py-6 text-center">
                <span className="relative flex h-14 w-14 items-center justify-center">
                  <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-600" />
                </span>
                <p className="mt-5 font-serif text-lg text-ink-900">Processing your transfer…</p>
                <p className="mt-1.5 text-sm text-ink-800/50">This usually takes just a moment.</p>
              </div>
            )}

            {stage === "failed" && (
              <div className="flex flex-col items-center py-2 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
                    <path
                      d="M12 8v5M12 16v.01M10.29 3.86l-8.18 14.16A1.5 1.5 0 003.4 20.5h17.2a1.5 1.5 0 001.29-2.48L13.71 3.86a1.5 1.5 0 00-2.42 0z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3 className="mt-5 font-serif text-xl text-ink-900">Transfer Failed</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-800/60">
                  We couldn&rsquo;t complete this transfer. Your funds have not been moved.
                  Please try again in a few minutes, or contact support if the problem
                  continues.
                </p>
                <div className="mt-7 flex w-full gap-3">
                  <a
                    href="/dashboard/support"
                    className="flex-1 rounded-full border border-ink-900/15 px-5 py-3 text-center text-sm font-medium text-ink-800 hover:border-ink-900/30"
                  >
                    Contact Support
                  </a>
                  <button
                    type="button"
                    onClick={onDismiss}
                    className="flex-1 rounded-full bg-brand-600 px-5 py-3 text-sm font-medium text-white hover:bg-brand-700"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ExternalBankPanel({
  linkedAccounts,
  selectedId,
  onSelect,
  showAddForm,
  onToggleAddForm,
  onAdd,
  onRemove,
}: {
  linkedAccounts: { id: string; bankName: string; nickname: string; accountType: AccountType; last4: string; routingLast4: string; status: "verified" | "pending" }[];
  selectedId: string;
  onSelect: (id: string) => void;
  showAddForm: boolean;
  onToggleAddForm: () => void;
  onAdd: (input: {
    bankName: string;
    nickname: string;
    accountType: AccountType;
    last4: string;
    routingLast4: string;
    instant: boolean;
  }) => { ok: boolean; error?: string };
  onRemove: (id: string) => void;
}) {
  const [bankName, setBankName] = useState("");
  const [nickname, setNickname] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("checking");
  const [last4, setLast4] = useState("");
  const [routingLast4, setRoutingLast4] = useState("");
  const [instant, setInstant] = useState(true);
  const [formError, setFormError] = useState("");

  function handleAdd() {
    const result = onAdd({ bankName, nickname, accountType, last4, routingLast4, instant });
    if (!result.ok) {
      setFormError(result.error ?? "Couldn't link that account.");
      return;
    }
    setBankName("");
    setNickname("");
    setLast4("");
    setRoutingLast4("");
    setFormError("");
  }

  return (
    <div className="mb-5 space-y-3">
      {linkedAccounts.length > 0 && (
        <div className="space-y-2">
          {linkedAccounts.map((a) => (
            <label
              key={a.id}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors ${
                selectedId === a.id ? "border-brand-500 bg-brand-50/50" : "border-ink-900/10 hover:border-brand-500/30"
              }`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="linked-account"
                  checked={selectedId === a.id}
                  onChange={() => onSelect(a.id)}
                  className="h-4 w-4 accent-brand-600"
                />
                <span>
                  <span className="block text-sm font-medium text-ink-900">
                    {a.nickname} · {a.bankName}
                  </span>
                  <span className="block text-xs text-ink-800/50">
                    {a.accountType === "checking" ? "Checking" : "Savings"} ••{a.last4} · Routing ••{a.routingLast4}
                  </span>
                </span>
              </span>
              <span className="flex items-center gap-2">
                <StatusPill status={a.status} />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onRemove(a.id);
                  }}
                  className="text-xs font-medium text-ink-800/40 hover:text-red-600"
                >
                  Remove
                </button>
              </span>
            </label>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onToggleAddForm}
        className="text-sm font-medium text-brand-700 hover:underline"
      >
        {showAddForm ? "Cancel" : "+ Add an external bank account"}
      </button>

      {showAddForm && (
        <div className="space-y-3 rounded-xl border border-ink-900/10 bg-sand-50 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Bank name"
              className={inputClass}
            />
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Nickname (e.g. Chase Checking)"
              className={inputClass}
            />
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as AccountType)}
              className={selectClass}
            >
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
            </select>
            <input
              value={routingLast4}
              onChange={(e) => setRoutingLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="Last 4 of routing number"
              inputMode="numeric"
              className={inputClass}
            />
            <input
              value={last4}
              onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="Last 4 of account number"
              inputMode="numeric"
              className={`${inputClass} sm:col-span-2`}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-ink-800">
              <input
                type="radio"
                checked={instant}
                onChange={() => setInstant(true)}
                className="h-4 w-4 accent-brand-600"
              />
              Verify instantly with your online banking login
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-800">
              <input
                type="radio"
                checked={!instant}
                onChange={() => setInstant(false)}
                className="h-4 w-4 accent-brand-600"
              />
              Verify with two small deposits (1–3 business days)
            </label>
          </div>

          {formError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {formError}
            </div>
          )}

          <button
            type="button"
            onClick={handleAdd}
            className="rounded-full bg-brand-600 px-5 py-2.5 text-xs font-medium text-white hover:bg-brand-700"
          >
            Link Account
          </button>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-ink-900/15 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";
const selectClass = inputClass;
