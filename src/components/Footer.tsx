import Logo from "./Logo";

const COLUMNS = [
  {
    title: "Banking",
    links: ["Checking & Savings", "Cards", "Loans", "Bill Pay"],
  },
  {
    title: "Company",
    links: ["About", "Leadership", "Approach", "Careers"],
  },
  {
    title: "Resources",
    links: ["Insights", "Client Login", "Contact", "Privacy Policy"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink-900 pt-16 text-white/70">
      <div className="container-page">
        <div className="grid grid-cols-2 gap-10 pb-14 sm:grid-cols-4 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-5">
            <Logo variant="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
              Everyday checking and savings, cards, and loans — managed
              online, with support when you need it.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="lg:col-span-2 lg:col-start-auto">
              <h4 className="text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/60 transition-colors hover:text-brand-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-8 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Stonebridge Finance. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-brand-300">
              Terms
            </a>
            <a href="#" className="hover:text-brand-300">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
