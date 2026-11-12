"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import type { ProductSummary } from "@/lib/medusa";
import { ProductCard } from "./product-card";
import { lowerName } from "@/lib/site";
import { SplitHeading } from "./text-reveal";

export type RailTab = { handle: string; name: string; products: ProductSummary[] };

/** One horizontal product rail with department tabs, scroll-snap and arrow buttons. */
export function ProductRail({ title, tabs }: { title: string; tabs: RailTab[] }) {
  const [tab, setTab] = useState(tabs[0]?.handle);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const current = tabs.find((t) => t.handle === tab) ?? tabs[0];
  const nudge = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section aria-labelledby="rail-title" className="bg-paper">
      <div className="mx-auto max-w-[1400px] px-4 pb-24 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SplitHeading id="rail-title" text={title} className="text-3xl font-semibold tracking-tight md:text-4xl" />
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => nudge(-1)} aria-label="Scroll back" className="flex h-11 w-11 items-center justify-center rounded-full border border-line hover:border-ink">
              <ArrowLeft size={18} />
            </button>
            <button type="button" onClick={() => nudge(1)} aria-label="Scroll forward" className="flex h-11 w-11 items-center justify-center rounded-full border border-line hover:border-ink">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <div role="tablist" aria-label="Departments" className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.handle}
              role="tab"
              aria-selected={t.handle === tab}
              onClick={() => {
                setTab(t.handle);
                track.current?.scrollTo({ left: 0 });
              }}
              className={`h-10 shrink-0 rounded-full px-5 text-[15px] font-medium transition ${
                t.handle === tab ? "bg-ink text-white" : "border border-line text-ink-2 hover:border-ink hover:text-ink"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.handle}
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div ref={track} className="no-scrollbar mt-8 grid snap-x snap-mandatory auto-cols-[46%] grid-flow-col gap-4 overflow-x-auto md:auto-cols-[30%] lg:auto-cols-[23%] xl:auto-cols-[18.5%]">
              {current.products.map((p) => (
                <div key={p.id} className="snap-start">
                  <ProductCard product={p} sizes="(min-width: 1280px) 18vw, (min-width: 768px) 30vw, 46vw" />
                </div>
              ))}
            </div>
            <Link href={`/category/${current.handle}`} className="mt-8 inline-flex items-center gap-2 text-[15px] font-medium text-ink underline decoration-coral underline-offset-4 hover:text-coral">
              Shop all {lowerName(current.name)} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
