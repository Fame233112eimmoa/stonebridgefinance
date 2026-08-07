"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { BellIcon, ChevronDownIcon, LogoutIcon, MenuIcon } from "@/components/dashboard/icons";
import { useAuth } from "@/lib/auth-context";
import { useBankData } from "@/lib/bank-data-context";
import { NAV_ITEMS } from "@/lib/nav-items";

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeProfile, logout } = useAuth();
  const customerName = activeProfile?.name ?? "";
  const { notifications } = useBankData();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentLabel =
    NAV_ITEMS.find((item) =>
      item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)
    )?.label ?? "Overview";

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const initials = customerName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-ink-900/8 bg-white/90 px-5 backdrop-blur-md sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-800 hover:bg-sand-100 lg:hidden"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <h1 className="font-serif text-xl text-ink-900">{currentLabel}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href="/dashboard/notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-800/70 hover:bg-sand-100 hover:text-ink-900"
          aria-label="Notifications"
        >
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 hover:bg-sand-100"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
              {initials}
            </span>
            <span className="hidden text-sm font-medium text-ink-800 sm:block">
              {customerName}
            </span>
            <ChevronDownIcon className="h-4 w-4 text-ink-800/50" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-ink-900/8 bg-white py-1.5 shadow-xl shadow-ink-900/10"
                >
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-ink-800 hover:bg-sand-100"
                  >
                    Profile & Security
                  </Link>
                  <Link
                    href="/dashboard/support"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-ink-800 hover:bg-sand-100"
                  >
                    Support
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t border-ink-900/8 px-4 py-2.5 text-left text-sm text-ink-800 hover:bg-sand-100"
                  >
                    <LogoutIcon className="h-4 w-4" />
                    Log Out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-ink-900/40 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-50 flex h-dvh w-72 flex-col bg-white lg:hidden"
            >
              <div className="flex h-20 items-center justify-between px-6">
                <Logo />
                <button
                  aria-label="Close menu"
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-800 hover:bg-sand-100"
                >
                  ✕
                </button>
              </div>
              <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-4 pb-6">
                {NAV_ITEMS.map((item) => {
                  const active =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-brand-50 text-brand-700"
                          : "text-ink-800/70 hover:bg-sand-100 hover:text-ink-900"
                      }`}
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-800/70 hover:bg-sand-100 hover:text-ink-900"
                >
                  <LogoutIcon className="h-[18px] w-[18px]" />
                  Log Out
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
