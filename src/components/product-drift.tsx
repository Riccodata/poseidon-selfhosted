"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useTransform } from "motion/react";
import { useSectionProgress } from "./use-section-progress";
import { SplitHeading } from "./text-reveal";

type Item = { handle: string; title: string; image: string };

function Row({ items, from, to, progress }: { items: Item[]; from: string; to: string; progress: ReturnType<typeof useSectionProgress> }) {
  const reduce = useReducedMotion();
  const x = useTransform(progress, [0, 1], [from, to]);
  return (
    <motion.ul style={reduce ? undefined : { x }} className="flex w-max gap-4">
      {items.map((p) => (
        <li key={p.handle}>
          <Link href={`/products/${p.handle}`} className="group block w-40 md:w-52">
            <div className="relative aspect-square overflow-hidden rounded-[10px] bg-tile">
              <Image src={p.image} alt="" fill sizes="208px" className="object-contain p-2 transition duration-500 group-hover:scale-110" />
            </div>
            <p className="mt-2 line-clamp-1 text-sm text-ink-2 group-hover:text-coral">{p.title}</p>
          </Link>
        </li>
      ))}
    </motion.ul>
  );
}

/** Two rows of real livestock drifting in opposite directions as the section passes through. */
export function ProductDrift({ top, bottom, count }: { top: Item[]; bottom: Item[]; count: number }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useSectionProgress(ref, "through");
  return (
    <section ref={ref} aria-labelledby="drift" className="overflow-hidden bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <SplitHeading id="drift" text={`${count.toLocaleString("en-AU")} corals, fish and invertebrates to choose from.`} className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl" />
      </div>
      <div className="mt-12 space-y-6">
        <Row items={top} from="2%" to="-28%" progress={progress} />
        <Row items={bottom} from="-30%" to="0%" progress={progress} />
      </div>
    </section>
  );
}
