"use client";

import Link from "next/link";
import Reveal from "./Reveal";

export default function CTA() {
  return (
    <section id="contact" className="relative overflow-hidden bg-brand-600 py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-brand-900/20 blur-3xl" />
      </div>

      <div className="container-page relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="text-balance font-serif text-3xl leading-tight text-white sm:text-4xl">
              Ready when you are.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 text-lg leading-relaxed text-white/80">
              Opening an account takes about five minutes — no branch visit,
              no paperwork to mail in.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full flex-1 rounded-full border border-white/25 bg-white/10 px-5 py-3.5 text-white placeholder:text-white/50 outline-none focus:border-white/60"
              />
              <Link
                href="/register"
                className="rounded-full bg-white px-6 py-3.5 text-center text-sm font-medium text-brand-700 transition-colors hover:bg-white/90"
              >
                Get Started
              </Link>
            </form>
            <p className="mt-4 text-xs text-white/60">
              We&rsquo;ll email you a secure link to finish your application,
              or you can{" "}
              <Link href="/register" className="underline underline-offset-2">
                apply now
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
