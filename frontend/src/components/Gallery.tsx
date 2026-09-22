"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { MouseEvent } from "react";
import Reveal from "./Reveal";

const PIECES = [
  { title: "Grandmother, Bronze Finish", size: "12 inch" },
  { title: "Wedding Portrait, Marble Finish", size: "18 inch" },
  { title: "Family Pet, Resin Painted", size: "6 inch" },
  { title: "Father & Son, Wood Finish", size: "12 inch" },
  { title: "In Loving Memory, Bronze Finish", size: "18 inch" },
  { title: "Anniversary Gift, Marble Finish", size: "12 inch" },
];

function GalleryCard({ title, size }: { title: string; size: string }) {
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
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/5 [perspective:800px]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-graphite-800 via-graphite-900 to-graphite-950" />
      <div className="absolute inset-0 bg-royal-radial opacity-70" />
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="70" height="90" viewBox="0 0 70 90" className="opacity-40 transition-opacity duration-500 group-hover:opacity-70">
          <circle cx="35" cy="24" r="16" fill="none" stroke="#C7A876" strokeWidth="1.5" />
          <path d="M14 85 C14 55 20 40 35 38 C50 40 56 55 56 85" fill="none" stroke="#C7A876" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-graphite-950 via-graphite-950/70 to-transparent p-5">
        <p className="font-display text-sm text-mist-100">{title}</p>
        <p className="text-xs text-silver-300/60">{size}</p>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  return (
    <section id="gallery" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Gallery</p>
          <h2 className="mt-4 font-display text-3xl text-mist-100 sm:text-4xl">
            A few tributes we&apos;ve crafted
          </h2>
          <p className="mt-4 text-sm text-silver-300/70">
            Placeholder frames shown here — swap in real studio photography before launch.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PIECES.map((piece, i) => (
            <Reveal key={piece.title} delay={i * 0.08}>
              <GalleryCard {...piece} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
