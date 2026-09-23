"use client";

import { Check } from "lucide-react";
import Reveal from "./Reveal";
import MagneticButton from "./MagneticButton";

const PLANS = [
  {
    name: "Small",
    size: "6 inch",
    price: "₹899",
    features: ["Hand-painted resin", "1 reference photo", "Standard pedestal", "3–4 week delivery"],
  },
  {
    name: "Medium",
    size: "12 inch",
    price: "₹1,799",
    popular: true,
    features: ["Choice of 4 finishes", "Up to 3 reference photos", "Engraved base text", "3–4 week delivery"],
  },
  {
    name: "Large",
    size: "18 inch",
    price: "₹2,999",
    features: ["Choice of 4 finishes", "Up to 6 reference photos", "Engraved base text", "Priority 2–3 week delivery"],
  },
];

export default function MaterialsPricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Pricing</p>
          <h2 className="mt-4 font-display text-3xl text-mist-100 sm:text-4xl">
            A size and finish for every tribute
          </h2>
          <p className="mt-4 text-sm text-silver-300/70">
            Final quote is confirmed after we review your photos. Bronze and marble finishes add a
            small premium at checkout.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.1}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-8 ${
                  plan.popular
                    ? "border-gold-400/50 bg-graphite-900 shadow-glow"
                    : "border-white/5 bg-graphite-900/60"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-1 text-xs font-medium text-graphite-950">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-xl text-mist-100">{plan.name}</h3>
                <p className="mt-1 text-sm text-silver-300/60">{plan.size} statue</p>
                <p className="mt-6 font-display text-3xl text-mist-100">
                  {plan.price} <span className="text-sm font-sans text-silver-300/50">onwards</span>
                </p>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-silver-200/80">
                      <Check size={16} className="mt-0.5 shrink-0 text-gold-400" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <MagneticButton href="/customize" variant={plan.popular ? "solid" : "outline"} className="w-full">
                    Choose {plan.name}
                  </MagneticButton>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
