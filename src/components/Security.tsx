import Reveal from "./Reveal";

const PILLARS = [
  "Two-step verification on every sign-in, with a one-time code sent to your phone",
  "Freeze a card instantly from the app the moment you notice something's off",
  "24/7 automated fraud monitoring watching every transaction on your account",
  "Bank-grade encryption protects your data in transit and at rest",
];

export default function Security() {
  return (
    <section id="security" className="relative bg-white py-20 lg:py-28">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5" y={32}>
            <SecurityGraphic />
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <span className="text-xs font-medium tracking-[0.25em] text-brand-600 uppercase">
                Security
              </span>
              <h2 className="mt-4 text-balance font-serif text-3xl leading-tight text-ink-900 sm:text-4xl">
                Your money, watched over around the clock.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-ink-800/65">
                Security shouldn't be something you have to think about. It's
                built into every sign-in, every card tap, and every transfer.
              </p>
            </Reveal>

            <ul className="mt-10 space-y-4">
              {PILLARS.map((pillar, i) => (
                <Reveal key={pillar} delay={0.06 * i}>
                  <li className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600/10 text-brand-600">
                      <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                        <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-[0.98rem] leading-relaxed text-ink-800/75">
                      {pillar}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function SecurityGraphic() {
  return (
    <div className="relative mx-auto max-w-md">
      <div className="absolute -inset-6 -z-10 rounded-full bg-brand-200/30 blur-3xl" />
      <div className="aspect-square w-full rounded-[1.75rem] border border-white bg-gradient-to-br from-ink-900 to-brand-900 p-8 shadow-xl shadow-ink-900/10">
        <div className="flex h-full flex-col items-center justify-center text-center text-white">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
              <path
                d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <p className="mt-6 font-serif text-xl">Protected, always</p>
          <p className="mt-2 max-w-[16rem] text-sm text-white/60">
            Every account is backed by continuous fraud monitoring and
            two-step verification.
          </p>

          <div className="mt-8 grid w-full grid-cols-2 gap-3 border-t border-white/10 pt-6 text-left">
            <div>
              <div className="text-xs text-white/40">Verification</div>
              <div className="mt-1 text-sm">2-Step</div>
            </div>
            <div>
              <div className="text-xs text-white/40">Monitoring</div>
              <div className="mt-1 text-sm">24/7</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
