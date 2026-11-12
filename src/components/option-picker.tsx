"use client";

import { useMemo, useState } from "react";

type Opt = { title: string; values: string[] };
type Variant = { title: string; options: Record<string, string> };

/**
 * Size / origin / pack choices. Only combinations that exist are selectable: picking one value greys
 * out the values of the other options that would make a combination this product doesn't come in.
 */
export function OptionPicker({ options, variants }: { options: Opt[]; variants: Variant[] }) {
  const [chosen, setChosen] = useState<Record<string, string>>(() => variants[0]?.options ?? {});
  const available = useMemo(() => {
    const ok: Record<string, Set<string>> = {};
    for (const o of options) {
      ok[o.title] = new Set(
        variants
          .filter((v) => options.every((other) => other.title === o.title || !chosen[other.title] || v.options[other.title] === chosen[other.title]))
          .map((v) => v.options[o.title]),
      );
    }
    return ok;
  }, [options, variants, chosen]);

  if (!options.length) return null;
  return (
    <div className="space-y-5">
      {options.map((o) => (
        <fieldset key={o.title}>
          <legend className="text-sm font-medium text-ink">
            {o.title}
            {chosen[o.title] && <span className="ml-2 font-normal text-ink-3">{chosen[o.title]}</span>}
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {o.values.map((v) => {
              const on = chosen[o.title] === v;
              const can = available[o.title]?.has(v);
              return (
                <button
                  key={v}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    const next = { ...chosen, [o.title]: v };
                    // if the new pick has no exact match, jump to the first variant that has it
                    if (!variants.some((x) => options.every((oo) => x.options[oo.title] === next[oo.title]))) {
                      const fallback = variants.find((x) => x.options[o.title] === v);
                      setChosen(fallback ? { ...fallback.options } : next);
                    } else setChosen(next);
                  }}
                  className={`min-h-10 rounded-full px-4 text-[14px] transition ${
                    on
                      ? "bg-ink text-white"
                      : can
                        ? "border border-line bg-tile text-ink hover:border-ink"
                        : "border border-dashed border-line text-ink-3 hover:border-ink-3"
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
