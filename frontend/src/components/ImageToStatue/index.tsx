"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import MagneticButton from "../MagneticButton";
import Reveal from "../Reveal";
import PhotoCard from "./PhotoCard";

const StatueCanvas = dynamic(() => import("./StatueCanvas"), { ssr: false });

const STAGES = [
  { index: "01", label: "Your Image" },
  { index: "02", label: "Digital Sculpting" },
  { index: "03", label: "3D Modelling" },
  { index: "04", label: "3D Printing" },
  { index: "05", label: "Your Statue" },
];

/**
 * The signature homepage moment: a normal photograph transforms into a
 * finished 3D statue as the visitor scrolls. Fully scroll-linked (scrolling
 * back up reverses it) and pinned for the length of the sequence. Falls back
 * to a static, single-viewport version for reduced-motion users.
 */
export default function ImageToStatueSection() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <StaticFallback />;
  }

  return <ScrollDrivenSequence />;
}

function ScrollDrivenSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const isInView = useInView(containerRef, { once: true, margin: "600px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progressRef.current = value;
  });

  // The photograph separates, tilts and recedes as the sculpture emerges.
  const photoOpacity = useTransform(scrollYProgress, [0, 0.1, 0.3], [1, 1, 0]);
  const photoRotateY = useTransform(scrollYProgress, [0, 0.3], [0, -28]);
  const photoScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.86]);
  const photoX = useTransform(scrollYProgress, [0, 0.3], ["0%", "-6%"]);

  // The 3D canvas fades in as the photograph recedes.
  const canvasOpacity = useTransform(scrollYProgress, [0.06, 0.3], [0, 1]);

  // Background reacts across the sequence: quiet -> darker -> premium spotlight.
  const spotlightOpacity = useTransform(scrollYProgress, [0, 0.5, 0.82, 1], [0.06, 0.16, 0.22, 0.4]);
  const bgDarken = useTransform(scrollYProgress, [0, 0.4], [0, 0.25]);

  // Stage indicator opacities — unrolled (not built in a loop) to keep hook order stable.
  const stage1 = useTransform(scrollYProgress, [0, 0.12, 0.16], [1, 1, 0]);
  const stage2 = useTransform(scrollYProgress, [0.16, 0.22, 0.34, 0.38], [0, 1, 1, 0]);
  const stage3 = useTransform(scrollYProgress, [0.36, 0.42, 0.52, 0.56], [0, 1, 1, 0]);
  const stage4 = useTransform(scrollYProgress, [0.54, 0.6, 0.78, 0.82], [0, 1, 1, 0]);
  const stage5 = useTransform(scrollYProgress, [0.8, 0.87], [0, 1]);
  const stageOpacities = [stage1, stage2, stage3, stage4, stage5];

  // Final message + CTAs, fading in as the statue completes.
  const finalOpacity = useTransform(scrollYProgress, [0.84, 0.94], [0, 1]);
  const finalY = useTransform(scrollYProgress, [0.84, 0.94], [24, 0]);

  return (
    <section ref={containerRef} className="relative h-[420vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(circle at 62% 45%, rgba(199,168,118,0.5), transparent 60%)",
            opacity: spotlightOpacity,
          }}
        />
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: bgDarken }} />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-8 lg:px-10">
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
              From Photograph to Sculpture
            </p>
            <h2 className="mt-4 max-w-md text-balance font-display text-3xl leading-tight text-mist-100 sm:text-4xl">
              Turn Your Memories Into Reality
            </h2>
            <p className="mt-5 max-w-sm text-balance text-sm leading-relaxed text-silver-300/75 sm:text-base">
              Upload a photo. We transform it into a detailed 3D model and bring it to life through 3D printing.
            </p>

            <div className="relative mt-10 h-10">
              {STAGES.map((stage, i) => (
                <motion.div
                  key={stage.index}
                  style={{ opacity: stageOpacities[i] }}
                  className="absolute inset-0 flex items-center gap-3"
                >
                  <span className="font-display text-lg text-gold-400">{stage.index}</span>
                  <span className="h-px w-8 bg-gold-400/40" />
                  <span className="text-sm tracking-wide text-silver-300/80">{stage.label}</span>
                </motion.div>
              ))}
            </div>

            <motion.div style={{ opacity: finalOpacity, y: finalY }} className="mt-10">
              <h3 className="font-display text-2xl text-mist-100 sm:text-3xl">
                Your Memory. <span className="gold-text">Now in 3D.</span>
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-silver-300/75">
                From a simple photograph to a personalized 3D sculpture — designed and printed by
                Namoza India.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <MagneticButton href="/customize">Create Your 3D Statue</MagneticButton>
                <MagneticButton href="#gallery" variant="outline">
                  See Our Work
                </MagneticButton>
              </div>
            </motion.div>
          </div>

          <div className="relative mx-auto flex h-[380px] w-full max-w-lg items-center justify-center sm:h-[480px] lg:h-[600px]">
            <motion.div
              style={{ opacity: photoOpacity, scale: photoScale, rotateY: photoRotateY, x: photoX }}
              className="absolute [perspective:1200px] [transform-style:preserve-3d]"
            >
              <PhotoCard />
            </motion.div>

            <motion.div style={{ opacity: canvasOpacity }} className="absolute inset-0">
              {isInView ? <StatueCanvas progressRef={progressRef} /> : null}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Reduced-motion / no-JS-scroll-jacking fallback: a single static viewport, no pinning, no scroll coupling. */
function StaticFallback() {
  const previewRef = useRef(0.95);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wrapperRef, { once: true, margin: "200px" });

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            From Photograph to Sculpture
          </p>
          <h2 className="mt-4 font-display text-3xl text-mist-100 sm:text-4xl">Your Memory. Now in 3D.</h2>
          <p className="mt-5 text-balance text-base leading-relaxed text-silver-300/80">
            From a simple photograph to a personalized 3D sculpture — designed and printed by Namoza
            India.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-14 flex flex-col items-center justify-center gap-8 sm:flex-row">
          <PhotoCard />

          <svg width="40" height="24" viewBox="0 0 40 24" className="hidden text-gold-400/60 sm:block" fill="none" aria-hidden>
            <path d="M2 12h34m0 0-9-9m9 9-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <div ref={wrapperRef} className="h-[280px] w-full max-w-[300px] overflow-hidden rounded-2xl border border-gold-400/20 bg-gradient-to-b from-graphite-800 to-graphite-950 shadow-glow">
            {isInView ? <StatueCanvas progressRef={previewRef} /> : null}
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-14 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton href="/customize">Create Your 3D Statue</MagneticButton>
          <MagneticButton href="#gallery" variant="outline">
            See Our Work
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}

