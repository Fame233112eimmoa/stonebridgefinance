"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Reveal from "./Reveal";

const QUOTES = [
  {
    quote:
      "My wallet got lifted on a trip to Lisbon. I froze my card from the app before I even got back to the hotel, and not one fraudulent charge went through.",
    name: "Maria Delgado",
    role: "Debit card customer — froze a stolen card from abroad",
  },
  {
    quote:
      "My old bank charged $12 a month just to have an account, plus $35 every time I dipped under $100. I switched to Stonebridge and haven't paid a fee since.",
    name: "James Okafor",
    role: "Checking customer — switched from a national bank",
  },
  {
    quote:
      "Three roommates, one landlord, and everyone always 'sending it later.' Zelle inside the app means rent actually gets to me on the first, every month.",
    name: "Priya Anand",
    role: "Checking customer — splits rent with Zelle",
  },
  {
    quote:
      "I do contract work out of state half the year. Photographing a check and depositing it from a job site has saved me a two-hour drive to a branch more times than I can count.",
    name: "Tom Bishop",
    role: "Everyday Checking customer — contractor",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % QUOTES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-page">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-medium tracking-[0.25em] text-brand-600 uppercase">
            Customer Stories
          </span>

          <div className="relative mt-10 min-h-[220px] sm:min-h-[180px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute inset-x-0"
              >
                <p className="text-balance font-serif text-2xl leading-snug text-ink-900 sm:text-3xl">
                  “{QUOTES[index].quote}”
                </p>
                <div className="mt-6 text-sm text-ink-800/50">
                  <span className="font-medium text-ink-800/80">
                    {QUOTES[index].name}
                  </span>{" "}
                  · {QUOTES[index].role}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex justify-center gap-2.5">
            {QUOTES.map((_, i) => (
              <button
                key={i}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-7 bg-brand-600" : "w-1.5 bg-ink-900/15"
                }`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
