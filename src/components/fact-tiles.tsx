import type { Fact } from "@/lib/facts";
import { Reveal } from "./reveal";

/** Care-guide or spec facts as tiles that rise in one after another. */
export function FactTiles({ title, facts }: { title: string; facts: Fact[] }) {
  const wide = (f: Fact) => f.value.length > 42;
  return (
    <section aria-label={title} className="mt-10">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-4 grid grid-cols-2 gap-2">
        {facts.map((f, i) => (
          <Reveal as="li" key={f.label + i} delay={Math.min(i, 8) * 0.05} y={14} className={wide(f) ? "col-span-2" : ""}>
            <div className="h-full rounded-[10px] bg-tile px-4 py-3">
              <p className="text-[12px] font-medium text-ink-3">{f.label}</p>
              <p className="mt-0.5 text-[15px] font-medium leading-snug text-ink">{f.value}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
