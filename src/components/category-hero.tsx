"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useTransform } from "motion/react";
import { useSectionProgress } from "./use-section-progress";
import { LoopVideo } from "./loop-video";
import { loopSrc } from "@/lib/site";

/**
 * Department landing hero: the department's Higgsfield loop, sinking slightly slower than the page
 * (parallax) while the title lifts away. Left-aligned, products one click below.
 */
export function CategoryHero({
  name,
  line,
  description,
  count,
  media,
  crumbs,
}: {
  name: string;
  line: string;
  description: string;
  count: number;
  media: string;
  crumbs: { name: string; href: string }[];
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const scrollYProgress = useSectionProgress(ref, "exit");
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const src = loopSrc(media);

  return (
    <section ref={ref} data-hero className="relative isolate flex min-h-[78dvh] items-end overflow-hidden bg-deep text-white">
      <motion.div style={reduce ? undefined : { y: videoY }} className="absolute inset-0 -z-10 scale-110">
        <LoopVideo {...src} priority />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-deep/80 via-deep/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-deep/80 to-transparent" />
      <motion.div style={reduce ? undefined : { y: textY, opacity: textOpacity }} className="mx-auto w-full max-w-[1400px] px-4 pb-14 pt-32 md:px-8 md:pb-20">
        <nav aria-label="Breadcrumb" className="text-sm text-foam-2">
          {crumbs.map((c, i) => (
            <span key={c.href}>
              {i > 0 && <span className="mx-2">/</span>}
              <Link href={c.href} className="hover:text-white">{c.name}</Link>
            </span>
          ))}
        </nav>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 text-5xl font-semibold leading-[0.98] tracking-tight md:text-7xl"
        >
          {name}
        </motion.h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-xl text-lg text-foam md:text-xl"
        >
          {line}
        </motion.p>
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <a href="#products" className="inline-flex h-12 items-center rounded-full bg-coral px-7 text-[15px] font-semibold text-white transition hover:bg-coral-hover active:scale-[0.98]">
            Shop {count.toLocaleString("en-AU")} products
          </a>
          {description && <p className="max-w-md text-sm leading-relaxed text-foam-2">{description}</p>}
        </motion.div>
      </motion.div>
    </section>
  );
}
