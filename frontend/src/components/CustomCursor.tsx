"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * A reactive, mouse-following cursor: a soft gold ring that trails the pointer
 * with spring physics and grows/brightens over interactive elements.
 * Disabled automatically on touch devices.
 */
export default function CustomCursor() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 28, stiffness: 320, mass: 0.4 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) {
      setEnabled(false);
      document.body.classList.remove("has-custom-cursor");
      return;
    }
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) return;
    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 14);
      cursorY.set(e.clientY - 14);
      const target = e.target as HTMLElement;
      setIsHovering(Boolean(target.closest("a, button, [data-cursor-hover]")));
    };
    const down = () => setIsPressed(true);
    const up = () => setIsPressed(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.body.classList.remove("has-custom-cursor");
    };
  }, [cursorX, cursorY, isAdmin]);

  if (!enabled || isAdmin) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-gold-400/70"
      style={{
        x,
        y,
        width: 28,
        height: 28,
        backgroundColor: isPressed ? "rgba(176,141,87,0.35)" : "rgba(176,141,87,0.12)",
      }}
      animate={{
        scale: isHovering ? 1.9 : isPressed ? 0.8 : 1,
        borderColor: isHovering ? "rgba(199,168,118,0.95)" : "rgba(176,141,87,0.6)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    />
  );
}
