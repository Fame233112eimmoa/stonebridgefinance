import Link from "next/link";
import Reveal from "./Reveal";

const FEATURES = [
  "Real-time alerts for every deposit, purchase, and payment",
  "Freeze a lost or stolen card in one tap — no phone call needed",
  "Spending broken down by category automatically, every month",
  "Deposit checks from your phone, no branch visit required",
];

export default function AppShowcase() {
  return (
    <section className="bg-sand-50 py-20 lg:py-28">
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="text-xs font-medium tracking-[0.25em] text-brand-600 uppercase">
                Online & Mobile Banking
              </span>
              <h2 className="mt-4 text-balance font-serif text-3xl leading-tight text-ink-900 sm:text-4xl">
                Your whole account, in view at a glance.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-800/65">
                Check balances, move money, and see exactly where it went —
                without digging through statements.
              </p>
            </Reveal>

            <ul className="mt-8 space-y-4">
              {FEATURES.map((feature, i) => (
                <Reveal key={feature} delay={0.06 * i}>
                  <li className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600/10 text-brand-600">
                      <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                        <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-[0.98rem] leading-relaxed text-ink-800/75">
                      {feature}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.3}>
              <Link
                href="/register"
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-medium text-white shadow-sm shadow-brand-600/25 transition-colors hover:bg-brand-700"
              >
                Open an Account
              </Link>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.2} y={32}>
              <DashboardPreview />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand-200/30 blur-3xl" />
      <div className="overflow-hidden rounded-2xl border border-white bg-white shadow-2xl shadow-ink-900/10">
        <div className="flex items-center gap-1.5 border-b border-ink-900/6 bg-sand-50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-900/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-900/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-900/15" />
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-5 sm:p-6">
          <div className="space-y-4 sm:col-span-3">
            <div className="rounded-xl bg-gradient-to-br from-ink-900 to-brand-900 p-4 text-white">
              <span className="text-[0.65rem] tracking-[0.2em] text-white/50 uppercase">
                Total Balance
              </span>
              <div className="mt-1 font-serif text-2xl">$23,158.68</div>
              <div className="mt-0.5 text-xs text-brand-300">Across 2 accounts</div>
            </div>

            <div className="rounded-xl border border-ink-900/8 p-4">
              <span className="text-xs font-medium text-ink-800/50">
                Spending by category
              </span>
              <div className="mt-3 flex h-4 w-full overflow-hidden rounded-full" style={{ gap: "2px" }}>
                <div className="h-full" style={{ width: "45%", backgroundColor: "#2a78d6" }} />
                <div className="h-full" style={{ width: "20%", backgroundColor: "#eb6834" }} />
                <div className="h-full" style={{ width: "17%", backgroundColor: "#1baf7a" }} />
                <div className="h-full" style={{ width: "18%", backgroundColor: "#eda100" }} />
              </div>
              <div className="mt-3 space-y-1.5 text-[0.7rem] text-ink-800/55">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#2a78d6" }} />
                    Housing
                  </span>
                  <span>$1,450.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#eb6834" }} />
                    Bill Payment
                  </span>
                  <span>$452.10</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 sm:col-span-2">
            <span className="text-xs font-medium text-ink-800/50">Recent activity</span>
            {[
              { label: "Green Leaf Grocers", amount: "-$64.12" },
              { label: "Northbridge Media Inc.", amount: "+$2,840.00", positive: true },
              { label: "Ridgeline Coffee Co.", amount: "-$6.75" },
              { label: "Alex Rivera · Zelle", amount: "-$40.00" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-lg border border-ink-900/6 px-3 py-2.5"
              >
                <span className="truncate text-xs text-ink-800/75">{row.label}</span>
                <span
                  className={`shrink-0 text-xs font-medium ${
                    row.positive ? "text-emerald-600" : "text-ink-900"
                  }`}
                >
                  {row.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
