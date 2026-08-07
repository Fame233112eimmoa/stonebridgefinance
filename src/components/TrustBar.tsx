import Reveal from "./Reveal";

const ITEMS = [
  { value: "500K+", label: "Customers nationwide" },
  { value: "$2.8B+", label: "In deposits" },
  { value: "24/7", label: "Fraud monitoring" },
  { value: "4.9/5", label: "Average app rating*" },
];

export default function TrustBar() {
  return (
    <section className="border-y border-ink-900/8 bg-white py-8">
      <div className="container-page">
        <Reveal>
          <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {ITEMS.map((item) => (
              <div key={item.label} className="text-center sm:text-left">
                <dt className="font-serif text-2xl text-ink-900 sm:text-3xl">
                  {item.value}
                </dt>
                <dd className="mt-1 text-xs text-ink-800/50 sm:text-sm">{item.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
