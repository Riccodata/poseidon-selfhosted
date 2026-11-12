"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

const MAX_DEPTH = 1100; // metres at the bottom of any page
const ZONES = [
  { until: 200, name: "Sunlight zone" },
  { until: 1000, name: "Twilight zone" },
  { until: Infinity, name: "Midnight zone" },
];
const TICKS = 22;

/**
 * A dive computer on the right edge: page scroll is read as depth (0 m at the top, 1,100 m at the
 * footer) with the ocean zone named underneath. It reads the section beneath it (data-tone="dark")
 * to stay legible over water and paper. Desktop only; hidden for reduced motion.
 */
export function DepthGauge() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const progress = useMotionValue(0);
  const eased = useSpring(progress, { stiffness: 140, damping: 28, mass: 0.4 });
  const markerY = useTransform(eased, [0, 1], ["0%", "100%"]);
  const fill = useTransform(eased, [0, 1], [0, 1]);
  const readout = useRef<HTMLSpanElement>(null);
  const zone = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [dark, setDark] = useState(true);
  const [active, setActive] = useState(false);
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sample = () => {
    const el = root.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const hits = document.elementsFromPoint(r.left - 24, r.top + r.height / 2);
    const tone = hits.map((h) => h.closest<HTMLElement>("[data-tone]")).find(Boolean);
    const isDark = tone?.dataset.tone === "dark";
    setDark((d) => (d === isDark ? d : isDark));
  };

  const update = (y: number) => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, y / max));
    progress.set(p);
    const depth = Math.round(p * MAX_DEPTH);
    if (readout.current) readout.current.textContent = `${depth.toLocaleString("en-AU")} m`;
    if (zone.current) zone.current.textContent = ZONES.find((z) => depth < z.until)!.name;
    sample();
  };

  /* the readout surfaces while the page moves and settles out of the way when it stops */
  const wake = () => {
    setActive((a) => a || true);
    if (idle.current) clearTimeout(idle.current);
    idle.current = setTimeout(() => setActive(false), 1400);
  };

  useEffect(() => {
    update(window.scrollY);
    const ro = new ResizeObserver(() => update(window.scrollY));
    ro.observe(document.body);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useMotionValueEvent(scrollY, "change", (y) => {
    update(y);
    wake();
  });

  if (reduce) return null;

  const line = dark ? "bg-white/25" : "bg-ink/20";
  const tick = dark ? "bg-white/40" : "bg-ink/30";
  const text = dark ? "text-white" : "text-ink";
  const sub = dark ? "text-white/60" : "text-ink-3";

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed right-5 top-1/2 z-30 hidden h-[44vh] -translate-y-1/2 xl:block"
    >
      <div className={`relative h-full w-px ${line} transition-colors duration-500`}>
        <motion.div style={{ scaleY: fill }} className="absolute inset-0 origin-top bg-coral" />
        {Array.from({ length: TICKS + 1 }).map((_, i) => (
          <span
            key={i}
            className={`absolute right-0 h-px ${i % 5 === 0 ? "w-3" : "w-1.5"} ${tick} transition-colors duration-500`}
            style={{ top: `${(i / TICKS) * 100}%` }}
          />
        ))}
        <motion.div style={{ top: markerY }} className="absolute right-0 -translate-y-1/2">
          <div className="flex items-center gap-2">
            <div className={`rounded-full px-3 py-1.5 text-right transition-all duration-500 ${dark ? "bg-deep/70" : "bg-paper/90"} ${active ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"} ${text}`}>
              <span ref={readout} className="block text-[13px] font-semibold tabular-nums leading-none">0 m</span>
              <span ref={zone} className={`mt-1 block whitespace-nowrap text-[10px] font-medium leading-none ${sub}`}>Sunlight zone</span>
            </div>
            <span className="h-2.5 w-2.5 translate-x-[5px] rounded-full border-2 border-coral bg-paper" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
