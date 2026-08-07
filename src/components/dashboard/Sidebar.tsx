"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { LogoutIcon } from "@/components/dashboard/icons";
import { useAuth } from "@/lib/auth-context";
import { NAV_ITEMS } from "@/lib/nav-items";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className="hidden lg:flex lg:w-72 lg:shrink-0 lg:flex-col lg:border-r lg:border-ink-900/8 lg:bg-white">
      <div className="flex h-20 items-center px-7">
        <Link href="/dashboard">
          <Logo />
        </Link>
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
      </nav>

      <div className="border-t border-ink-900/8 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-800/70 transition-colors hover:bg-sand-100 hover:text-ink-900"
        >
          <LogoutIcon className="h-[18px] w-[18px]" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
