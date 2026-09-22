"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MouseEvent, ReactNode, useRef, useState } from "react";
import clsx from "clsx";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "outline";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

/** A button that gently pulls toward the cursor when hovered — the site's signature reactive micro-interaction. */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "solid",
  className,
  type = "button",
  disabled,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    setOffset({ x: relX * 0.25, y: relY * 0.35 });
  };

  const reset = () => setOffset({ x: 0, y: 0 });

  const styles = clsx(
    "relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300",
    variant === "solid"
      ? "bg-gradient-to-r from-gold-500 to-gold-600 text-graphite-950 shadow-glow hover:from-gold-400 hover:to-gold-500"
      : "border border-silver-300/30 text-mist-100 hover:border-gold-400/70 hover:text-gold-300",
    disabled && "pointer-events-none opacity-50",
    className
  );

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.4 }}
      data-cursor-hover
    >
      <span className={styles}>{children}</span>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} aria-disabled={disabled}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className="inline-block">
      {content}
    </button>
  );
}
