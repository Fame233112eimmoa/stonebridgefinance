"use client";

import { useState, type FormEvent } from "react";
import { Card, CardHeader } from "@/components/dashboard/Card";
import { useBankData } from "@/lib/bank-data-context";
import { formatDate } from "@/lib/format";

const SESSIONS = [
  { id: "s1", device: "Chrome on macOS", location: "Rivermont, ST", current: true, lastActive: "Active now" },
  { id: "s2", device: "Stonebridge iOS App", location: "Rivermont, ST", current: false, lastActive: "2 days ago" },
  { id: "s3", device: "Safari on iPad", location: "Rivermont, ST", current: false, lastActive: "1 week ago" },
];

const LOGIN_ACTIVITY = [
  { id: "l1", date: "2026-08-06", device: "Chrome on macOS", status: "Success" },
  { id: "l2", date: "2026-08-03", device: "Stonebridge iOS App", status: "Success" },
  { id: "l3", date: "2026-07-29", device: "Unknown device — Chrome on Windows", status: "Blocked" },
  { id: "l4", date: "2026-07-22", device: "Safari on iPad", status: "Success" },
];

export default function ProfilePage() {
  const { profile, updateProfile } = useBankData();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessions, setSessions] = useState(SESSIONS);

  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  function saveProfile() {
    updateProfile(draft);
    setEditing(false);
  }

  function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    if (!pwCurrent || !pwNew || !pwConfirm) {
      setPwError("Fill in all password fields.");
      return;
    }
    if (pwNew.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (pwNew !== pwConfirm) {
      setPwError("New passwords don't match.");
      return;
    }
    setPwSuccess("Your password has been updated. You'll need to sign in again on any other devices using your new password.");
    setPwCurrent("");
    setPwNew("");
    setPwConfirm("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">Profile & Security</h2>
        <p className="mt-1.5 text-sm text-ink-800/55">
          Manage your personal information and account security.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Personal Information"
          subtitle={`Customer ID ${profile.customerId} · Member since ${formatDate(profile.memberSince)}`}
          action={
            editing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setDraft(profile);
                    setEditing(false);
                  }}
                  className="rounded-full border border-ink-900/15 px-4 py-2 text-xs font-medium text-ink-800"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  className="rounded-full bg-brand-600 px-4 py-2 text-xs font-medium text-white hover:bg-brand-700"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="rounded-full border border-ink-900/15 px-4 py-2 text-xs font-medium text-ink-800 hover:border-brand-500/40"
              >
                Edit
              </button>
            )
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldRow
            label="Full name"
            value={draft.name}
            editing={editing}
            onChange={(v) => setDraft((d) => ({ ...d, name: v }))}
          />
          <FieldRow
            label="Email"
            value={draft.email}
            editing={editing}
            onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
          />
          <FieldRow
            label="Phone"
            value={draft.phone}
            editing={editing}
            onChange={(v) => setDraft((d) => ({ ...d, phone: v }))}
          />
          <FieldRow
            label="Mailing address"
            value={draft.address}
            editing={editing}
            onChange={(v) => setDraft((d) => ({ ...d, address: v }))}
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="Change Password" />
        <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-4">
          <PwField label="Current password" value={pwCurrent} onChange={setPwCurrent} />
          <PwField label="New password" value={pwNew} onChange={setPwNew} />
          <PwField label="Confirm new password" value={pwConfirm} onChange={setPwConfirm} />

          {pwError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {pwError}
            </div>
          )}
          {pwSuccess && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {pwSuccess}
            </div>
          )}

          <button
            type="submit"
            className="rounded-full bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700"
          >
            Update Password
          </button>
        </form>
      </Card>

      <Card>
        <CardHeader title="Two-Factor Authentication" subtitle="Required at every sign-in" />
        <div className="flex items-center justify-between rounded-xl border border-ink-900/8 p-4">
          <div>
            <p className="text-sm font-medium text-ink-900">SMS one-time codes</p>
            <p className="mt-0.5 text-xs text-ink-800/55">
              A 6-digit code is required in addition to your password.
            </p>
          </div>
          <button
            onClick={() => setTwoFactor((v) => !v)}
            role="switch"
            aria-checked={twoFactor}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
              twoFactor ? "bg-brand-600" : "bg-ink-900/15"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                twoFactor ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Active Sessions" subtitle="Devices currently signed in" />
        <ul className="divide-y divide-ink-900/6">
          {sessions.map((s) => (
            <li key={s.id} className="flex items-center justify-between py-3.5">
              <div>
                <p className="text-sm font-medium text-ink-900">
                  {s.device} {s.current && <span className="text-brand-700">(this device)</span>}
                </p>
                <p className="text-xs text-ink-800/50">
                  {s.location} · {s.lastActive}
                </p>
              </div>
              {!s.current && (
                <button
                  onClick={() => setSessions((prev) => prev.filter((sess) => sess.id !== s.id))}
                  className="rounded-full border border-ink-900/15 px-3.5 py-1.5 text-xs font-medium text-ink-800 hover:border-red-300 hover:text-red-600"
                >
                  Sign out
                </button>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader title="Recent Login Activity" />
        <ul className="divide-y divide-ink-900/6">
          {LOGIN_ACTIVITY.map((l) => (
            <li key={l.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm text-ink-900">{l.device}</p>
                <p className="text-xs text-ink-800/45">{formatDate(l.date)}</p>
              </div>
              <span
                className={`text-xs font-medium ${
                  l.status === "Success" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {l.status}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function FieldRow({
  label,
  value,
  editing,
  onChange,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-ink-800/50">{label}</label>
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-ink-900/15 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
      ) : (
        <p className="text-sm text-ink-900">{value}</p>
      )}
    </div>
  );
}

function PwField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-800">{label}</label>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-ink-900/15 bg-white px-4 py-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      />
    </div>
  );
}
