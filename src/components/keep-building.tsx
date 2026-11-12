import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./reveal";
import { BIG_CATEGORIES, STILL } from "@/lib/site";
import { SplitHeading } from "./text-reveal";

/** What usually comes next after each department, so a shopper always has a way forward. */
const NEXT: Record<string, [string, string]> = {
  aquariums: ["equipment", "aquascaping-co2"],
  equipment: ["aquascaping-co2", "accessories"],
  "aquascaping-co2": ["plants", "equipment"],
  plants: ["freshwater", "aquascaping-co2"],
  freshwater: ["plants", "food-additives"],
  corals: ["marine-fish", "equipment"],
  "marine-fish": ["inverts", "food-additives"],
  inverts: ["corals", "food-additives"],
  "food-additives": ["accessories", "marine-fish"],
  accessories: ["food-additives", "equipment"],
};

export function KeepBuilding({ from, names }: { from: string; names: Record<string, string> }) {
  const next = NEXT[from];
  if (!next) return null;
  return (
    <section aria-labelledby="keep-building" className="mx-auto max-w-[1400px] px-4 pb-24 md:px-8">
      <SplitHeading id="keep-building" text="Keep building your tank" className="text-3xl font-semibold tracking-tight md:text-4xl" />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {next.map((h, i) => (
          <Reveal key={h} delay={i * 0.08}>
            <Link href={`/category/${h}`} className="group relative block aspect-[16/9] overflow-hidden rounded-[10px] bg-deep text-white">
              <Image src={STILL[h]} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
                <div>
                  <p className="text-2xl font-semibold md:text-3xl">{names[h] ?? h}</p>
                  <p className="mt-1 max-w-sm text-foam">{BIG_CATEGORIES.find((b) => b.handle === h)?.line}</p>
                </div>
                <ArrowUpRight size={28} className="shrink-0 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
