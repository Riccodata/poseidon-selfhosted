"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { useSectionProgress } from "./use-section-progress";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * A heading whose words rise into place from behind a mask, one after another, when it scrolls into
 * view. The text stays a single real heading for screen readers and search.
 */
export function SplitHeading({
  text,
  as = "h2",
  className = "",
  delay = 0,
  id,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  id?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    const Plain = as;
    return <Plain id={id} className={className}>{text}</Plain>;
  }
  // The heading itself is what's watched for visibility: the words start below their masks, and a
  // clipped element never counts as "in view", so watching the words would never fire.
  const Tag = motion[as];
  const words = text.split(" ");
  return (
    <Tag
      id={id}
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: 0.045, delayChildren: delay }}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom -mb-[0.12em]">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: "110%" }, shown: { y: "0%", transition: { duration: 0.9, ease: EASE } } }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** A block that glides in from the left, the right or below as it enters the viewport. */
export function SlideIn({
  children,
  from = "left",
  distance = 48,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  from?: "left" | "right" | "up";
  distance?: number;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "p";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const initial = from === "up" ? { opacity: 0, y: distance } : { opacity: 0, x: from === "left" ? -distance : distance };
  return (
    <Tag
      className={className}
      initial={reduce ? false : initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

function ScrollWord({ word, i, n, progress, from, to }: { word: string; i: number; n: number; progress: MotionValue<number>; from: number; to: number }) {
  const start = from + (i / n) * (to - from);
  const opacity = useTransform(progress, [start, start + 0.05], [0.14, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

/** A statement that lights up word by word as it scrolls through the screen. */
export function ScrollWords({ text, className = "", as = "p" }: { text: string; className?: string; as?: "p" | "h2" }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const progress = useSectionProgress(ref, "through");
  const Tag = as;
  if (reduce) return <Tag className={className}>{text}</Tag>;
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <ScrollWord key={i} word={w} i={i} n={words.length} progress={progress} from={0.2} to={0.62} />
        ))}
      </span>
    </Tag>
  );
}
