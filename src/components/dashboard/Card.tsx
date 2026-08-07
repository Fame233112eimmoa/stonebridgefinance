import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-ink-900/8 bg-white p-6 shadow-sm shadow-ink-900/[0.02] ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="font-serif text-lg text-ink-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-ink-800/55">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  posted: "bg-brand-50 text-brand-700",
  pending: "bg-amber-50 text-amber-700",
  upcoming: "bg-brand-50 text-brand-700",
  paid: "bg-emerald-50 text-emerald-700",
  overdue: "bg-red-50 text-red-700",
  active: "bg-emerald-50 text-emerald-700",
  frozen: "bg-sky-50 text-sky-700",
  locked: "bg-red-50 text-red-700",
  "paid-off": "bg-ink-900/5 text-ink-800/60",
  unread: "bg-brand-600 text-white",
};

export function StatusPill({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "bg-ink-900/5 text-ink-800/60";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${style}`}
    >
      {status.replace("-", " ")}
    </span>
  );
}
