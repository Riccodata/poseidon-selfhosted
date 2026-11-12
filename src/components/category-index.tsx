"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { LoopVideo } from "./loop-video";
import { loopSrc, STILL } from "@/lib/site";

export type IndexItem = { handle: string; name: string; count: number; line: string; media: string };

/**
 * The ten departments as a large type index. Desktop: hovering a row swaps the pinned preview to
 * that department's Higgsfield loop. Phones: a two-column grid of stills.
 */
export function CategoryIndex({ items }: { items: IndexItem[] }) {
  const [active, setActive] = useState(items[0]?.handle);
  const reduce = useReducedMotion();
  const current = items.find((i) => i.handle === active) ?? items[0];

  return (
    <section aria-labelledby="departments" className="relative z-10 -mt-px bg-paper">
      <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
        <h2 id="departments" className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          Shop the whole aquarium.
        </h2>
        <p className="mt-4 max-w-xl text-lg text-ink-2">
          Ten departments, every product photographed and described by our team.
        </p>

        {/* desktop: index + pinned preview */}
        <div className="mt-14 hidden grid-cols-[1.1fr_1fr] gap-14 lg:grid">
          <ul className="border-t border-line">
            {items.map((it) => (
              <li key={it.handle} className="border-b border-line">
                <Link
                  href={`/category/${it.handle}`}
                  onMouseEnter={() => setActive(it.handle)}
                  onFocus={() => setActive(it.handle)}
                  className="group flex items-baseline gap-6 py-5"
                >
                  <span
                    className={`text-[2.6rem] font-semibold leading-none tracking-tight transition-colors duration-300 ${
                      active === it.handle ? "text-ink" : "text-ink/35"
                    } group-hover:text-ink`}
                  >
                    {it.name}
                  </span>
                  <span className="text-sm tabular-nums text-ink-3">{it.count.toLocaleString("en-AU")}</span>
                  <ArrowUpRight
                    size={22}
                    className={`ml-auto self-center transition duration-300 ${active === it.handle ? "translate-x-0 text-coral opacity-100" : "-translate-x-2 opacity-0"}`}
                  />
                </Link>
              </li>
            ))}
          </ul>
          <div className="relative">
            <div className="sticky top-24 aspect-[4/5] overflow-hidden rounded-[10px] bg-deep">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={current.handle}
                  initial={reduce ? false : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <LoopVideo {...loopSrc(current.media)} />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep/85 via-deep/30 to-transparent p-8 pt-24 text-white">
                <p className="text-2xl font-semibold">{current.name}</p>
                <p className="mt-1 max-w-sm text-foam">{current.line}</p>
              </div>
            </div>
          </div>
        </div>

        {/* phones and tablets */}
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:hidden">
          {items.map((it) => (
            <li key={it.handle}>
              <Link href={`/category/${it.handle}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[10px] bg-deep">
                <Image src={STILL[it.handle]} alt="" fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep/85 to-transparent p-3 pt-12 text-white">
                  <span className="block text-[15px] font-semibold leading-tight">{it.name}</span>
                  <span className="text-xs text-foam-2">{it.count.toLocaleString("en-AU")} products</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
