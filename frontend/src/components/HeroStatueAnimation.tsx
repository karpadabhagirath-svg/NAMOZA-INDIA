"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent, useMemo } from "react";

const PARTICLES = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  cx: 40 + Math.random() * 220,
  cy: 30 + Math.random() * 340,
  r: 1 + Math.random() * 2.2,
  delay: Math.random() * 3,
  duration: 4 + Math.random() * 4,
}));

/**
 * The hero centerpiece: a photograph silhouette that "resolves" into a carved
 * bust on a pedestal, drawn on with an SVG stroke animation, surrounded by
 * drifting gold particles, and gently tilting toward the cursor (parallax) —
 * the site's signature reactive moment.
 */
export default function HeroStatueAnimation() {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 80, damping: 14 });
  const springY = useSpring(rotateY, { stiffness: 80, damping: 14 });

  const glowX = useTransform(springY, [-12, 12], [-20, 20]);
  const glowY = useTransform(springX, [-12, 12], [20, -20]);

  const particles = useMemo(() => PARTICLES, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 18);
    rotateX.set(-py * 18);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      className="relative mx-auto flex h-[420px] w-full max-w-md items-center justify-center [perspective:1200px] sm:h-[520px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
    >
      {/* ambient glow that drifts opposite the tilt, like light catching stone */}
      <motion.div
        className="pointer-events-none absolute h-64 w-64 rounded-full bg-gold-500/20 blur-3xl"
        style={{ x: glowX, y: glowY }}
      />

      <motion.div style={{ rotateX: springX, rotateY: springY }} className="relative [transform-style:preserve-3d]">
        <svg viewBox="0 0 300 400" width="300" height="400" className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]">
          <defs>
            <linearGradient id="statueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C7A876" />
              <stop offset="55%" stopColor="#B08D57" />
              <stop offset="100%" stopColor="#8E703F" />
            </linearGradient>
            <radialGradient id="haloGradient" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="rgba(199,168,118,0.35)" />
              <stop offset="100%" stopColor="rgba(199,168,118,0)" />
            </radialGradient>
          </defs>

          {/* soft halo behind the head */}
          <motion.circle
            cx="150"
            cy="120"
            r="95"
            fill="url(#haloGradient)"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />

          {/* pedestal */}
          <motion.rect
            x="90"
            y="345"
            width="120"
            height="18"
            rx="3"
            fill="none"
            stroke="url(#statueGradient)"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 1.1, ease: "easeInOut" }}
          />
          <motion.rect
            x="105"
            y="330"
            width="90"
            height="15"
            rx="2"
            fill="none"
            stroke="url(#statueGradient)"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
          />

          {/* bust: shoulders / torso */}
          <motion.path
            d="M 95 330 C 95 250 105 210 150 205 C 195 210 205 250 205 330"
            fill="none"
            stroke="url(#statueGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.5, ease: "easeInOut" }}
          />

          {/* head */}
          <motion.circle
            cx="150"
            cy="145"
            r="58"
            fill="none"
            stroke="url(#statueGradient)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.15, ease: "easeInOut" }}
          />

          {/* a few carved detail lines for a "sculpted" feel */}
          <motion.path
            d="M 118 155 Q 150 175 182 155"
            fill="none"
            stroke="url(#statueGradient)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity={0.7}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ duration: 1, delay: 1.5, ease: "easeInOut" }}
          />
        </svg>

        {/* drifting particles, representing the photo dissolving into form */}
        <svg viewBox="0 0 300 400" width="300" height="400" className="absolute inset-0">
          {particles.map((p) => (
            <motion.circle
              key={p.id}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill="#DDC79B"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.9, 0],
                cy: [p.cy, p.cy - 24, p.cy],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
}
