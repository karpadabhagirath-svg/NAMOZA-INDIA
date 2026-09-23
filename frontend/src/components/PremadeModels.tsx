"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { MouseEvent } from "react";
import MagneticButton from "./MagneticButton";
import Reveal from "./Reveal";

interface PremadeDesign {
  name: string;
  category: string;
  size: string;
  price: string;
}

/**
 * Ready-made designs customers can order directly, without uploading a
 * reference photo. Deliberately a separate, smaller catalogue from the
 * custom photo-to-statue flow — priced at the same base tiers so the
 * numbers stay consistent with MaterialsPricing / lib/pricing.ts.
 */
const DESIGNS: PremadeDesign[] = [
  { name: "Serene Buddha", category: "Spiritual", size: "6 inch", price: "₹899" },
  { name: "Ganesha Idol", category: "Spiritual", size: "12 inch", price: "₹1,799" },
  { name: "Guardian Lion Pair", category: "Mythology", size: "12 inch", price: "₹1,799" },
  { name: "Loyal Companion", category: "Pets & Animals", size: "6 inch", price: "₹899" },
  { name: "Classical Bust", category: "Portrait Classics", size: "12 inch", price: "₹1,799" },
  { name: "Modern Abstract Form", category: "Modern Decor", size: "18 inch", price: "₹2,999" },
];

function DesignCard({ design }: { design: PremadeDesign }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const sX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const sY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 10);
    rotateX.set(-py * 10);
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
      style={{ rotateX: sX, rotateY: sY, transformStyle: "preserve-3d" }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 [perspective:800px]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-graphite-800 via-graphite-900 to-graphite-950" />
        <div className="absolute inset-0 bg-royal-radial opacity-70" />
        <span className="absolute left-4 top-4 rounded-full border border-gold-400/30 bg-graphite-950/70 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-gold-300 backdrop-blur-sm">
          {design.category}
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="70" height="90" viewBox="0 0 70 90" className="opacity-40 transition-opacity duration-500 group-hover:opacity-70">
            <circle cx="35" cy="24" r="16" fill="none" stroke="#C7A876" strokeWidth="1.5" />
            <path d="M14 85 C14 55 20 40 35 38 C50 40 56 55 56 85" fill="none" stroke="#C7A876" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 bg-graphite-900/60 p-5">
        <div>
          <p className="font-display text-lg text-mist-100">{design.name}</p>
          <p className="mt-1 text-xs text-silver-300/60">{design.size} statue</p>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <p className="font-display text-xl text-gold-300">
            {design.price} <span className="text-xs font-sans text-silver-300/50">onwards</span>
          </p>
          <MagneticButton href="/customize" variant="outline" className="!px-5 !py-2.5 !text-xs">
            Order This
          </MagneticButton>
        </div>
      </div>
    </motion.div>
  );
}

export default function PremadeModels() {
  return (
    <section id="premade" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Premade 3D Models</p>
          <h2 className="mt-4 font-display text-3xl text-mist-100 sm:text-4xl">
            No photo? Choose a ready-made design
          </h2>
          <p className="mt-4 text-sm text-silver-300/70">
            Hand-finished designs, ready to order in your choice of size and finish — no reference
            photo required.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DESIGNS.map((design, i) => (
            <Reveal key={design.name} delay={i * 0.08}>
              <DesignCard design={design} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

