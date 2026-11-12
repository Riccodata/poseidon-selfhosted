"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useTransform, useReducedMotion } from "motion/react";
import { useSectionProgress } from "./use-section-progress";
import { LoopVideo } from "./loop-video";
import { FrameSequence } from "./frame-sequence";
import { loopSrc, SITE } from "@/lib/site";

const DIVE = { base: "/media/seq/dive-reef", count: 64 };

/**
 * The Wix banner Ricco likes (reef image, POSEIDON'S EDEN wordmark, tagline, Explore the Eden), brought
 * to life with its Higgsfield loop. On desktop the banner is pinned for one extra screen of scroll:
 * the camera dives down the reef wall (pre-rendered frames scrubbed by scroll), the wordmark lifts
 * away, and the four main departments surface in the deeper water before the shop slides up.
 * Phones and reduced motion get the plain animated banner.
 */
export function BannerHero({ quick }: { quick: { name: string; handle: string }[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [pinned, setPinned] = useState(false);
  const scrollYProgress = useSectionProgress(ref, "pin");

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const set = () => setPinned(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const dive = useTransform(scrollYProgress, [0.02, 0.9], [0, 1], { clamp: true });
  const loopOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);
  const brandY = useTransform(scrollYProgress, [0, 0.35], ["0vh", "-14vh"]);
  const brandScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.9]);
  const brandOpacity = useTransform(scrollYProgress, [0.05, 0.28], [1, 0]);
  const deepen = useTransform(scrollYProgress, [0.25, 1], [0, 0.55]);
  const arriveOpacity = useTransform(scrollYProgress, [0.48, 0.68], [0, 1]);
  const arriveY = useTransform(scrollYProgress, [0.48, 0.7], [40, 0]);

  const banner = loopSrc("banner");
  const live = pinned && !reduce;

  return (
    <section ref={ref} data-hero aria-label="Welcome" className="relative h-[100dvh] bg-deep lg:h-[230vh] motion-reduce:lg:h-[100dvh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {live && <FrameSequence base={DIVE.base} count={DIVE.count} progress={dive} />}
        <motion.div style={live ? { opacity: loopOpacity } : undefined} className="absolute inset-0">
          <LoopVideo desktop={banner.desktop} mobile={banner.mobile} poster={banner.poster} priority />
        </motion.div>
        {/* bottom fade so the white type always has water behind it */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-deep/50 to-transparent" />
        {live && <motion.div style={{ opacity: deepen }} className="pointer-events-none absolute inset-0 bg-deep" />}

        <motion.div
          style={live ? { y: brandY, scale: brandScale, opacity: brandOpacity } : undefined}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-[4vh] text-center"
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-[min(78vw,640px)]"
          >
            <h1 className="sr-only">{SITE.name}</h1>
            <Image src="/media/logo-wordmark.png" alt="" width={1513} height={519} priority sizes="(min-width: 768px) 640px, 78vw" className="h-auto w-full drop-shadow-[0_2px_12px_rgba(8,22,27,0.35)]" />
          </motion.div>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-6 text-[13px] font-medium uppercase tracking-[0.32em] text-white/90 md:text-[15px]"
          >
            {SITE.tagline}
          </motion.p>
          <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}>
            <Link
              href="/shop"
              className="mt-8 inline-flex h-12 items-center rounded-full bg-sea px-8 text-[14px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-deep-3 active:scale-[0.98]"
            >
              Explore the Eden
            </Link>
          </motion.div>
        </motion.div>

        {live && (
          <motion.div style={{ opacity: arriveOpacity, y: arriveY }} className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-8 pb-[12vh] text-white">
            <p className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight xl:text-5xl">
              From the reef wall to the riverbed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {quick.map((c) => (
                <Link
                  key={c.handle}
                  href={`/category/${c.handle}`}
                  className="inline-flex h-11 items-center rounded-full border border-white/40 px-5 text-[15px] font-medium transition hover:border-white hover:bg-white hover:text-ink"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
