"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useTransform, useReducedMotion, type MotionValue } from "motion/react";
import { useSectionProgress } from "./use-section-progress";
import { ArrowRight } from "@phosphor-icons/react";
import { FrameSequence } from "./frame-sequence";
import { Reveal } from "./reveal";

const BEATS = [
  { title: "Delivered to your door", body: "We ship livestock within Australia in insulated boxes, each animal bagged with oxygen by our team." },
  { title: "Live Arrival Guarantee", body: "If an animal doesn't arrive alive, tell us within 24 hours for store credit or a replacement." },
  { title: "Two weeks in quarantine", body: "Every fish spends at least two weeks in quarantine, medicated and eating well, before it's sold." },
  { title: "Help for beginners", body: "New to fishkeeping? Our team can help you pick hardy fish that get along with your tank mates." },
];

function Beat({ i, progress, title, body }: { i: number; progress: MotionValue<number>; title: string; body: string }) {
  const start = 0.12 + i * 0.2;
  const opacity = useTransform(progress, [start, start + 0.06, start + 0.15, start + 0.2], [0, 1, 1, i === BEATS.length - 1 ? 1 : 0]);
  const y = useTransform(progress, [start, start + 0.08], [36, 0]);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 bottom-[16vh] mx-auto max-w-[1400px] px-8">
      <h3 className="max-w-2xl text-5xl font-semibold leading-[1.04] tracking-tight text-white">{title}</h3>
      <p className="mt-5 max-w-lg text-lg leading-relaxed text-foam">{body}</p>
    </motion.div>
  );
}

/**
 * The descent: from the reef drop-off into the deep, scrubbed by scroll, while the shop's four
 * promises (the Wix "Why Shop With Us" copy) surface one at a time. It ends in the dark water the
 * journal and footer sit in.
 */
export function DiveStory() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [pinned, setPinned] = useState(false);
  const scrollYProgress = useSectionProgress(ref, "pin");
  const frames = useTransform(scrollYProgress, [0, 0.95], [0, 1], { clamp: true });
  const introOpacity = useTransform(scrollYProgress, [0, 0.04, 0.1], [1, 1, 0]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const set = () => setPinned(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  if (!pinned || reduce) {
    return (
      <section ref={ref} aria-labelledby="promise" className="grain relative overflow-hidden bg-deep text-white">
        <Image src="/media/stills/dive-1-dropoff.jpg" alt="" fill sizes="100vw" className="object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-deep/30 via-deep/70 to-deep" />
        <div className="relative mx-auto max-w-[1400px] px-4 py-24 md:px-8">
          <h2 id="promise" className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight">Cared for before it ships.</h2>
          <p className="mt-4 max-w-md text-lg text-foam">Every animal is held and checked by our team before it ships, and we&rsquo;re here to help long after your order arrives.</p>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2">
            {BEATS.map((b, i) => (
              <Reveal as="li" key={b.title} delay={i * 0.06} className="border-t border-deep-3 pt-6">
                <h3 className="text-xl font-semibold">{b.title}</h3>
                <p className="mt-2 text-foam">{b.body}</p>
              </Reveal>
            ))}
          </ul>
          <Link href="/faq" className="mt-12 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-ink hover:bg-foam">
            Read our FAQ <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-labelledby="promise" className="relative h-[420vh] bg-deep">
      <div className="grain sticky top-0 h-[100dvh] overflow-hidden">
        <Image src="/media/seq/dive-deep/001.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <FrameSequence base="/media/seq/dive-deep" count={64} progress={frames} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-deep/70 via-deep/20 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-deep/70 to-transparent" />
        <motion.div style={{ opacity: introOpacity }} className="absolute inset-x-0 bottom-[16vh] mx-auto max-w-[1400px] px-8">
          <h2 id="promise" className="max-w-2xl text-6xl font-semibold leading-[1.02] tracking-tight text-white">Cared for before it ships.</h2>
          <p className="mt-5 max-w-lg text-lg text-foam">Every animal is held and checked by our team before it ships, and we&rsquo;re here to help long after your order arrives.</p>
        </motion.div>
        {BEATS.map((b, i) => (
          <Beat key={b.title} i={i} progress={scrollYProgress} title={b.title} body={b.body} />
        ))}
        <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 xl:block">
          <Link href="/faq" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 px-6 text-[15px] font-semibold text-white hover:border-white hover:bg-white hover:text-ink">
            Read our FAQ <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
