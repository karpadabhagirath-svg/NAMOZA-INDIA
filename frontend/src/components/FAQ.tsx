"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Reveal from "./Reveal";

const FAQS = [
  {
    q: "What kind of photo works best?",
    a: "A clear, well-lit, front-facing photo gives the best results. You can upload up to 6 photos so our artists can capture the right likeness from multiple angles.",
  },
  {
    q: "How long does it take to receive my statue?",
    a: "Most orders are handcrafted and delivered within 3–4 weeks. Large statues on priority production can arrive in 2–3 weeks.",
  },
  {
    q: "Can I request a specific pose or outfit?",
    a: "Yes — there's a notes field in the order form where you can describe the pose, outfit or styling you'd like. Our team will confirm feasibility before production begins.",
  },
  {
    q: "What if I'm not happy with the result?",
    a: "We share a digital preview for approval before final production on larger orders, and offer revisions to make sure you're happy with the likeness.",
  },
  {
    q: "Do you ship across India?",
    a: "Yes, we ship pan-India with tracked, insured delivery. You can follow your order's progress anytime on our Track Order page.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">FAQ</p>
          <h2 className="mt-4 font-display text-3xl text-mist-100 sm:text-4xl">Common questions</h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.05}>
                <div className="overflow-hidden rounded-xl border border-white/5 bg-graphite-900/60">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-medium text-mist-100">{item.q}</span>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown size={18} className="text-gold-400" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm leading-relaxed text-silver-300/75">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
