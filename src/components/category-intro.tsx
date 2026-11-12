"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { useSectionProgress } from "./use-section-progress";

function Word({ word, i, n, progress }: { word: string; i: number; n: number; progress: MotionValue<number> }) {
  const start = 0.18 + (i / n) * 0.42;
  const opacity = useTransform(progress, [start, start + 0.06], [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {word}{" "}
    </motion.span>
  );
}

/**
 * The department's own description, read out word by word as it scrolls past, beside a still that
 * drifts slower than the page. Reduced motion shows it plainly.
 */
export function CategoryIntro({ text, image, name }: { text: string; image: string; name: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const progress = useSectionProgress(ref, "through");
  const imgY = useTransform(progress, [0, 1], ["-8%", "8%"]);
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return null;
  return (
    <section ref={ref} aria-label={`About ${name}`} className="mx-auto max-w-[1400px] px-4 pt-20 md:px-8 md:pt-28">
      <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <p className="text-3xl font-semibold leading-[1.18] tracking-tight text-ink md:text-[2.6rem]">
          {reduce ? text : words.map((w, i) => <Word key={i} word={w} i={i} n={words.length} progress={progress} />)}
        </p>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] bg-deep">
          <motion.div style={reduce ? undefined : { y: imgY }} className="absolute -inset-y-[10%] inset-x-0">
            <Image src={image} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
