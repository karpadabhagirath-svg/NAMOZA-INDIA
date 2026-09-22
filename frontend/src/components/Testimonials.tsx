"use client";

import { Star } from "lucide-react";
import Reveal from "./Reveal";

const QUOTES = [
  {
    quote:
      "Namoza India turned my grandmother's favourite photo into something our whole family cherishes. The likeness was uncanny.",
    name: "Ananya R.",
    city: "Bengaluru",
  },
  {
    quote:
      "The ordering process was so smooth, and the updates kept us informed the whole way. It arrived beautifully packaged.",
    name: "Vikram S.",
    city: "Pune",
  },
  {
    quote: "A deeply personal gift for our anniversary — the marble finish looks stunning on our mantel.",
    name: "Priya & Karan",
    city: "Delhi",
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Testimonials</p>
          <h2 className="mt-4 font-display text-3xl text-mist-100 sm:text-4xl">Loved by families across India</h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {QUOTES.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-graphite-900/60 p-7">
                <div className="mb-4 flex gap-1 text-gold-400">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="flex-1 text-sm italic leading-relaxed text-silver-200/85">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-5 text-sm font-medium text-mist-100">
                  {t.name} <span className="font-normal text-silver-300/50">· {t.city}</span>
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
