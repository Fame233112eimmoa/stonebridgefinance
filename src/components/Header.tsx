"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "Accounts", href: "#products" },
  { label: "Security", href: "#security" },
  { label: "Get Started", href: "#get-started" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(15,30,36,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between">
        <a href="#top" className="shrink-0">
          <Logo variant={scrolled ? "dark" : "dark"} />
        </a>

        <nav className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.92rem] font-medium text-ink-800/80 hover:text-brand-700 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/login"
            className="text-[0.92rem] font-medium text-ink-800/80 hover:text-brand-700 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-brand-600 px-5 py-2.5 text-[0.92rem] font-medium text-white shadow-sm shadow-brand-600/20 transition-colors hover:bg-brand-700"
          >
            Open an Account
          </Link>
        </div>

        <Link
          href="/login"
          className="shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-ink-800/80 hover:bg-sand-100 hover:text-brand-700 lg:hidden"
        >
          Log In
        </Link>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden relative z-50 ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-[5px]">
            <motion.span
              animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
              className="h-[1.5px] w-6 bg-ink-900"
            />
            <motion.span
              animate={{ opacity: open ? 0 : 1 }}
              className="h-[1.5px] w-6 bg-ink-900"
            />
            <motion.span
              animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
              className="h-[1.5px] w-6 bg-ink-900"
            />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-white border-t border-ink-900/5"
          >
            <div className="container-page flex flex-col gap-1 py-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-ink-800 hover:bg-sand-100"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-3 rounded-lg px-3 py-3 text-base font-medium text-ink-800 hover:bg-sand-100"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-full bg-brand-600 px-5 py-3 text-center text-base font-medium text-white"
              >
                Open an Account
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
