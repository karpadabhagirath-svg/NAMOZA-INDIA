"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import HeroStatueAnimation from "./HeroStatueAnimation";
import MagneticButton from "./MagneticButton";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-36 sm:pt-44">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-8 lg:px-10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-500/5 px-4 py-1.5 text-xs font-medium tracking-wide text-gold-300"
          >
            <Sparkles size={14} /> Handcrafted in India, shipped nationwide
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-balance font-display text-4xl leading-[1.1] text-mist-100 sm:text-5xl lg:text-6xl"
          >
            Turn a cherished photograph into a <span className="gold-text">timeless statue</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-lg text-balance text-base leading-relaxed text-silver-300/80 sm:text-lg"
          >
            Namoza India transforms your favourite photo of a loved one into a hand-finished 3D
            statue — a personal, enduring tribute for your home, or a gift that lasts generations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="/customize">Start Customizing</MagneticButton>
            <MagneticButton href="#how-it-works" variant="outline">
              See How It Works
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 flex items-center gap-8 text-sm text-silver-300/60"
          >
            <div>
              <p className="font-display text-2xl text-mist-100">2,000+</p>
              <p>Statues crafted</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="font-display text-2xl text-mist-100">4.9/5</p>
              <p>Customer rating</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="font-display text-2xl text-mist-100">28</p>
              <p>States delivered to</p>
            </div>
          </motion.div>
        </div>

        <HeroStatueAnimation />
      </div>
    </section>
  );
}
