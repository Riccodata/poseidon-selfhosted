"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useMotionValue, useScroll, useMotionValueEvent, type MotionValue } from "motion/react";

/**
 * 0..1 progress of the page scroll through a section, computed in JS from the page scroll position.
 *
 * mode "pin":  0 when the section's top reaches the viewport top, 1 when its bottom reaches the
 *              viewport bottom (the span a sticky child stays pinned).
 * mode "exit": 0 at the section's top at the viewport top, 1 when its bottom leaves the top.
 *
 * Deliberately not useScroll({ target }): its hardware-accelerated path mapped our ranges
 * inconsistently, and every effect here needs exact, monotonic progress.
 */
export function useSectionProgress(ref: RefObject<HTMLElement | null>, mode: "pin" | "exit" = "pin"): MotionValue<number> {
  const { scrollY } = useScroll();
  const progress = useMotionValue(0);
  const box = useRef({ top: 0, height: 1 });

  const update = (y: number) => {
    const { top, height } = box.current;
    const span = mode === "pin" ? Math.max(1, height - window.innerHeight) : Math.max(1, height);
    progress.set(Math.min(1, Math.max(0, (y - top) / span)));
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      box.current = { top: r.top + window.scrollY, height: r.height };
      update(window.scrollY);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, mode]);

  useMotionValueEvent(scrollY, "change", update);
  return progress;
}
