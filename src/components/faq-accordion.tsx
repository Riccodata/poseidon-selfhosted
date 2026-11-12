"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "@phosphor-icons/react";

export type QA = { q: string; a: string[] };

/** Animated FAQ list: one open at a time, height eases open. Tone follows the section it sits in. */
export function FaqAccordion({ items, tone = "light", defaultOpen = -1 }: { items: QA[]; tone?: "light" | "dark"; defaultOpen?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  const reduce = useReducedMotion();
  const line = tone === "dark" ? "divide-deep-3 border-deep-3" : "divide-line border-line";
  const body = tone === "dark" ? "text-foam" : "text-ink-2";
  return (
    <ul className={`divide-y border-y ${line}`}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <li key={it.q}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-start justify-between gap-6 py-5 text-left text-lg font-medium"
            >
              {it.q}
              <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.25 }} className="mt-1 shrink-0">
                <Plus size={20} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className={`max-w-[68ch] space-y-3 pb-6 leading-relaxed ${body}`}>
                    {it.a.map((p, k) => (
                      <p key={k}>{p}</p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
