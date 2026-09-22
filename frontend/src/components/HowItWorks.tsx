"use client";

import { Camera, Palette, PackageCheck, Truck } from "lucide-react";
import Reveal from "./Reveal";

const STEPS = [
  {
    icon: Camera,
    title: "Upload a Photo",
    desc: "Share one or more clear photographs of your loved one — we'll guide you on what works best.",
  },
  {
    icon: Palette,
    title: "Choose Your Style",
    desc: "Pick a size, finish and material — resin, marble-effect, bronze or wood — and add any personal touches.",
  },
  {
    icon: PackageCheck,
    title: "We Handcraft It",
    desc: "Our studio sculpts and finishes your statue by hand, with a quality check before it leaves us.",
  },
  {
    icon: Truck,
    title: "Delivered to You",
    desc: "Your statue is carefully packaged and shipped, with tracking available the whole way.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">How It Works</p>
          <h2 className="mt-4 font-display text-3xl text-mist-100 sm:text-4xl">
            From photograph to keepsake, in four steps
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1}>
              <div className="group relative rounded-2xl border border-white/5 bg-graphite-900/60 p-7 transition-colors hover:border-gold-400/30">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/30 bg-gold-500/10 text-gold-300 transition-transform duration-300 group-hover:scale-110">
                  <step.icon size={20} />
                </div>
                <p className="mb-1 text-xs font-medium text-silver-300/50">Step {i + 1}</p>
                <h3 className="mb-2 font-display text-lg text-mist-100">{step.title}</h3>
                <p className="text-sm leading-relaxed text-silver-300/70">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
