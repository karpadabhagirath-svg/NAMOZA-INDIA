"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

const STEPS = ["Photos", "Style", "Your Details", "Review"];

export default function ProgressBar({ current }: { current: number }) {
  return (
    <div className="mx-auto mb-14 max-w-2xl">
      <div className="mb-3 flex justify-between">
        {STEPS.map((label, i) => (
          <span
            key={label}
            className={clsx(
              "text-xs font-medium tracking-wide transition-colors",
              i <= current ? "text-gold-300" : "text-silver-300/40"
            )}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="relative h-1 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold-500 to-gold-400"
          initial={false}
          animate={{ width: `${(current / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
