"use client";

import { animate, useInView, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function AnimatedNumber({ value, duration = 1.2, className }: { value: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useMotionValueEvent(mv, "change", (v) => setDisplay(Math.round(v)));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, value, duration, mv]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
