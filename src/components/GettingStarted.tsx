import Link from "next/link";
import Reveal from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Apply Online",
    description:
      "Tell us a bit about yourself. Most applications take less than 5 minutes to complete.",
  },
  {
    n: "02",
    title: "Verify Your Identity",
    description:
      "We confirm who you are to keep your account secure — typically done within 1–2 business days.",
  },
  {
    n: "03",
    title: "Start Banking",
    description:
      "Set up your card, link your paycheck, and start sending money the same day you're approved.",
  },
];

export default function GettingStarted() {
  return (
    <section id="get-started" className="bg-ink-900 py-20 text-white lg:py-28">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-6">
            <span className="text-xs font-medium tracking-[0.25em] text-brand-300 uppercase">
              Getting Started
            </span>
            <h2 className="mt-4 text-balance font-serif text-3xl leading-tight sm:text-4xl">
              Open your account in three steps.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
            <p className="text-lg leading-relaxed text-white/60">
              No branch visit, no paperwork to mail in. Everything happens
              right from your phone or computer.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-white/10 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.1}>
              <div className="h-full bg-ink-900 p-8 lg:p-9">
                <span className="font-serif text-3xl text-brand-400">{step.n}</span>
                <h3 className="mt-5 font-serif text-xl">{step.title}</h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-white/55">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="mt-10 text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-medium text-white shadow-sm shadow-brand-600/25 transition-colors hover:bg-brand-700"
            >
              Open an Account
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
