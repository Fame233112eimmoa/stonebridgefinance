import Link from "next/link";
import type { ReactNode } from "react";
import Logo from "@/components/Logo";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sand-50 px-6 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-brand-100/70 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <Logo />
        </Link>

        <div className="rounded-3xl border border-white bg-white/90 p-8 shadow-xl shadow-ink-900/5 backdrop-blur-sm sm:p-10">
          <h1 className="text-balance text-center font-serif text-2xl text-ink-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-center text-sm leading-relaxed text-ink-800/60">
              {subtitle}
            </p>
          )}

          <div className="mt-8">{children}</div>
        </div>

        {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
      </div>
    </div>
  );
}
