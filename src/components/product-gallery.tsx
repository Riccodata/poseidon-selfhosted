"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/** Main photo with thumbnails (desktop) and a swipe strip (phones). */
export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  if (!images.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-[10px] bg-tile text-ink-3">Photo coming soon</div>
    );
  }
  return (
    <div>
      {/* phones: swipe */}
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 md:hidden">
        {images.map((src, k) => (
          <div key={src} className="relative aspect-square w-[88%] shrink-0 snap-center overflow-hidden rounded-[10px] bg-tile">
            <Image src={src} alt={k === 0 ? title : `${title}, photo ${k + 1}`} fill priority={k === 0} sizes="88vw" className="object-contain p-[5%]" />
          </div>
        ))}
      </div>

      {/* desktop */}
      <div className="hidden gap-4 md:grid md:grid-cols-[76px_1fr]">
        <ul className="no-scrollbar flex max-h-[640px] flex-col gap-2 overflow-y-auto">
          {images.map((src, k) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setI(k)}
                aria-label={`Show photo ${k + 1}`}
                aria-current={k === i}
                className={`relative block aspect-square w-[76px] overflow-hidden rounded-[10px] bg-tile ring-offset-2 transition ${k === i ? "ring-2 ring-ink" : "opacity-70 hover:opacity-100"}`}
              >
                <Image src={src} alt="" fill sizes="76px" className="object-contain p-1" />
              </button>
            </li>
          ))}
        </ul>
        <div className="relative aspect-square overflow-hidden rounded-[10px] bg-tile">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={images[i]}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              <Image src={images[i]} alt={title} fill priority={i === 0} sizes="(min-width: 1280px) 640px, 55vw" className="object-contain p-[5%]" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
