"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin gold progress bar pinned to the top of the viewport, reacting to scroll position. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[90] h-[2px] origin-left bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600"
      style={{ scaleX }}
    />
  );
}
