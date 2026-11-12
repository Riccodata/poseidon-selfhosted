"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { useSectionProgress } from "./use-section-progress";

/** A thin coral line under the header that fills as you read the article it wraps. */
export function ReadingProgress({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const p = useSectionProgress(ref, "pin");
  const scaleX = useSpring(p, { stiffness: 160, damping: 30 });
  return (
    <div ref={ref}>
      {!reduce && <motion.div aria-hidden="true" style={{ scaleX }} className="fixed inset-x-0 top-16 z-30 h-[3px] origin-left bg-coral" />}
      {children}
    </div>
  );
}
