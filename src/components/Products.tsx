import Link from "next/link";
import Reveal from "./Reveal";
import {
  CardIcon,
  DepositIcon,
  PercentIcon,
  ReceiptIcon,
  SwapIcon,
  WalletIcon,
} from "@/components/dashboard/icons";

const PRODUCTS = [
  {
    title: "Checking & Savings",
    description:
      "No monthly fees, no minimum balance, and a savings APY that actually adds up.",
    icon: WalletIcon,
  },
  {
    title: "Debit & Credit Cards",
    description:
      "Freeze a card instantly from the app if it's lost — no phone call required.",
    icon: CardIcon,
  },
  {
    title: "Money Transfers",
    description:
      "Send with Zelle in minutes, or pay through PayPal, Cash App, and Venmo.",
    icon: SwapIcon,
  },
  {
    title: "Bill Pay",
    description:
      "Pay any payee directly from your account and turn on autopay so nothing's late.",
    icon: ReceiptIcon,
  },
  {
    title: "Loans",
    description:
      "Apply for a personal, auto, or student loan and get a rate estimate in seconds.",
    icon: PercentIcon,
  },
  {
    title: "Mobile Check Deposit",
    description:
      "Snap a photo of a check and deposit it — most funds post the next business day.",
    icon: DepositIcon,
  },
];

export default function Products() {
  return (
    <section id="products" className="bg-white py-20 lg:py-28">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-5">
            <span className="text-xs font-medium tracking-[0.25em] text-brand-600 uppercase">
              Accounts & Services
            </span>
            <h2 className="mt-4 text-balance font-serif text-3xl leading-tight text-ink-900 sm:text-4xl">
              Everything you need, none of the clutter.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <p className="text-lg leading-relaxed text-ink-800/65">
              One account gets you everyday banking, transfers, bill pay, and
              credit — all in a single app, with real people behind support
              when you need them.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-ink-900/8 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product, i) => (
            <Reveal key={product.title} delay={(i % 3) * 0.08}>
              <div className="group h-full bg-white p-8 transition-colors hover:bg-sand-50 lg:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <product.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 font-serif text-xl text-ink-900">
                  {product.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-800/60">
                  {product.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
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
