"use client";

import { useState } from "react";
import { Card } from "@/components/dashboard/Card";
import { BellIcon, CardIcon, ReceiptIcon, SupportIcon, UserIcon } from "@/components/dashboard/icons";
import { useBankData } from "@/lib/bank-data-context";
import { formatDate } from "@/lib/format";
import type { NotificationType } from "@/lib/types";

const TYPE_ICON: Record<NotificationType, typeof BellIcon> = {
  security: UserIcon,
  transaction: CardIcon,
  bill: ReceiptIcon,
  promo: SupportIcon,
  system: BellIcon,
};

const TYPE_STYLE: Record<NotificationType, string> = {
  security: "bg-red-50 text-red-600",
  transaction: "bg-brand-50 text-brand-600",
  bill: "bg-amber-50 text-amber-600",
  promo: "bg-violet-50 text-violet-600",
  system: "bg-sky-50 text-sky-600",
};

const FILTERS: { label: string; value: "all" | NotificationType }[] = [
  { label: "All", value: "all" },
  { label: "Security", value: "security" },
  { label: "Transactions", value: "transaction" },
  { label: "Bills", value: "bill" },
  { label: "Offers", value: "promo" },
];

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useBankData();
  const [filter, setFilter] = useState<"all" | NotificationType>("all");

  const filtered = notifications.filter((n) => filter === "all" || n.type === filter);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">Notifications</h2>
          <p className="mt-1.5 text-sm text-ink-800/55">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="self-start rounded-full border border-ink-900/15 px-4 py-2.5 text-xs font-medium text-ink-800 hover:border-brand-500/40 sm:self-auto"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              filter === f.value
                ? "bg-brand-600 text-white"
                : "bg-white text-ink-800/60 hover:bg-sand-100 border border-ink-900/8"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card>
        <ul className="divide-y divide-ink-900/6">
          {filtered.map((n) => {
            const Icon = TYPE_ICON[n.type];
            return (
              <li
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`flex cursor-pointer gap-4 py-4 transition-colors hover:bg-sand-50/60 ${
                  n.read ? "" : "bg-brand-50/30"
                }`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${TYPE_STYLE[n.type]}`}>
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-ink-900">{n.title}</p>
                    {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-600" />}
                  </div>
                  <p className="mt-1 text-sm text-ink-800/60">{n.message}</p>
                  <p className="mt-1.5 text-xs text-ink-800/40">{formatDate(n.date)}</p>
                </div>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-ink-800/50">No notifications here.</p>
          )}
        </ul>
      </Card>
    </div>
  );
}
