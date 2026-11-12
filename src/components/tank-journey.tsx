"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { LoopVideo } from "./loop-video";
import { Reveal } from "./reveal";
import { useSectionProgress } from "./use-section-progress";
import { loopSrc } from "@/lib/site";
import { SlideIn, SplitHeading } from "./text-reveal";

export type JourneyStep = {
  key: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  media: string;
  links?: { name: string; href: string }[];
  products: { handle: string; title: string; image: string | null }[];
};

function StepPanel({ step }: { step: JourneyStep }) {
  return (
    <div className="grid h-full grid-rows-[1fr_auto] gap-0 overflow-hidden rounded-[10px] bg-tile md:grid-cols-[1fr_1.15fr] md:grid-rows-1">
      <div className="flex flex-col p-7 md:p-10">
        <h3 className="text-4xl font-semibold leading-[1.02] tracking-tight md:text-5xl">{step.title}</h3>
        <p className="mt-4 max-w-md text-lg text-ink-2">{step.body}</p>
        {step.links && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {step.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex h-9 items-center rounded-full border border-line px-4 text-sm hover:border-ink">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <ul className="mt-auto grid grid-cols-4 gap-2 pt-8">
          {step.products.map((p) => (
            <li key={p.handle}>
              <Link href={`/products/${p.handle}`} title={p.title} className="group block aspect-square overflow-hidden rounded-[10px] bg-paper">
                {p.image && (
                  <Image src={p.image} alt={p.title} width={160} height={160} loading="eager" className="h-full w-full object-contain p-1.5 transition duration-500 group-hover:scale-110" />
                )}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={step.href} className="mt-6 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-white transition hover:bg-deep-3 active:scale-[0.98]">
          {step.cta} <ArrowRight size={16} />
        </Link>
      </div>
      <div className="relative min-h-[260px] overflow-hidden bg-deep">
        <LoopVideo {...loopSrc(step.media)} />
      </div>
    </div>
  );
}

function StepLabel({ i, n, progress, label }: { i: number; n: number; progress: MotionValue<number>; label: string }) {
  const at = i / (n - 1);
  const opacity = useTransform(progress, [at - 0.2, at, at + 0.2], [0.4, 1, 0.4]);
  return (
    <motion.span style={{ opacity }} className="text-sm font-medium">
      {label}
    </motion.span>
  );
}

/**
 * "Build your tank": five steps from choosing an aquarium to feeding it. Desktop pins the section and
 * turns vertical scroll into a sideways pan across the steps, with a progress rail underneath.
 * Phones and reduced motion get the steps stacked.
 */
export function TankJourney({ steps }: { steps: JourneyStep[] }) {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [pinned, setPinned] = useState(false);
  const progress = useSectionProgress(ref, "pin");
  const distance = useMotionValue(0);
  const x = useTransform(() => -progress.get() * distance.get());
  const rail = useTransform(progress, [0, 1], [0, 1]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const set = () => setPinned(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useEffect(() => {
    const t = track.current;
    if (!t || !pinned) return;
    const measure = () => distance.set(Math.max(0, t.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned, distance]);

  const heading = (
    <div className="max-w-2xl">
      <SplitHeading text="Build your tank, start to finish." className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl" />
      <SlideIn from="left" delay={0.2}>
        <p className="mt-4 text-lg text-ink-2">Everything for a new aquarium, in the order you&rsquo;ll need it.</p>
      </SlideIn>
    </div>
  );

  if (!pinned || reduce) {
    return (
      <section ref={ref} aria-label="Build your tank" className="bg-paper">
        <div className="mx-auto max-w-[1400px] px-4 pb-20 md:px-8">
          {heading}
          <ol className="mt-10 space-y-4">
            {steps.map((s) => (
              <Reveal as="li" key={s.key}>
                <StepPanel step={s} />
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-label="Build your tank" className="relative bg-paper" style={{ height: `${steps.length * 85 + 40}vh` }}>
      <div className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden pt-24">
        <div className="mx-auto w-full max-w-[1400px] px-8">{heading}</div>
        <motion.div ref={track} style={{ x }} className="mt-8 flex h-[58vh] min-h-[440px] gap-6 pl-[max(2rem,calc((100vw-1400px)/2+2rem))] pr-8">
          {steps.map((s) => (
            <div key={s.key} className="h-full w-[min(78vw,1080px)] shrink-0">
              <StepPanel step={s} />
            </div>
          ))}
        </motion.div>
        <div className="mx-auto mt-6 w-full max-w-[1400px] px-8">
          <div className="relative h-px bg-line">
            <motion.div style={{ scaleX: rail }} className="absolute inset-0 origin-left bg-coral" />
          </div>
          <div className="mt-3 flex justify-between">
            {steps.map((s, i) => (
              <StepLabel key={s.key} i={i} n={steps.length} progress={progress} label={s.title} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
