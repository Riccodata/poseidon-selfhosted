import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./reveal";
import { lowerName } from "@/lib/site";

export type Tile = {
  name: string;
  handle: string;
  count: number;
  image: string | null;
  description?: string;
  children?: { name: string; handle: string }[];
};

const ROWS: Record<number, string> = { 1: "", 2: "md:grid-rows-2", 3: "md:grid-rows-3" };

/**
 * A department's sub-categories, each shown with a real product photo from inside it.
 * Few (2 to 4): a feature layout, first tile large with its own sub-categories listed.
 * Many: a compact photo grid.
 */
export function SubcategoryTiles({ tiles }: { tiles: Tile[] }) {
  if (!tiles.length) return null;

  if (tiles.length <= 4) {
    const [lead, ...rest] = tiles;
    if (!rest.length) return <FeatureTile tile={lead} large />;
    return (
      <div className="grid gap-4 md:grid-cols-[1.35fr_1fr]">
        <FeatureTile tile={lead} large />
        <div className={`grid gap-4 ${ROWS[rest.length] ?? ""}`}>
          {rest.map((t) => (
            <FeatureTile key={t.handle} tile={t} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
      {tiles.map((t, i) => (
        <Reveal as="li" key={t.handle} delay={Math.min(i, 10) * 0.03} y={16}>
          <Link href={`/category/${t.handle}`} className="group block">
            <div className="relative aspect-square overflow-hidden rounded-[10px] bg-tile">
              {t.image && (
                <Image src={t.image} alt="" fill sizes="(min-width: 1280px) 15vw, (min-width: 1024px) 18vw, (min-width: 640px) 30vw, 46vw" className="object-contain p-[10%] transition duration-500 group-hover:scale-105" />
              )}
            </div>
            <p className="mt-2 text-[15px] font-medium leading-tight group-hover:text-coral">{t.name}</p>
            <p className="text-[13px] text-ink-3">{t.count.toLocaleString("en-AU")}</p>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}

function FeatureTile({ tile, large = false }: { tile: Tile; large?: boolean }) {
  const href = `/category/${tile.handle}`;
  return (
    <Reveal className="h-full">
      <div className={`group relative flex h-full flex-col overflow-hidden rounded-[10px] bg-tile md:flex-row ${large ? "md:min-h-[440px]" : "md:min-h-[200px]"}`}>
        <div className="flex flex-1 flex-col p-6 md:p-8">
          <Link href={href} className={`font-semibold tracking-tight hover:text-coral ${large ? "text-3xl md:text-4xl" : "text-2xl"}`}>
            {tile.name}
          </Link>
          <p className="mt-1 text-sm text-ink-3">{tile.count.toLocaleString("en-AU")} products</p>
          {large && tile.description && <p className="mt-4 max-w-sm text-ink-2">{tile.description}</p>}
          {large && tile.children && tile.children.length > 0 && (
            <ul className="mt-6 flex max-w-md flex-wrap gap-2">
              {tile.children.slice(0, 10).map((c) => (
                <li key={c.handle}>
                  <Link href={`/category/${c.handle}`} className="inline-flex h-8 items-center rounded-full border border-line bg-paper px-3 text-[13px] hover:border-ink">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link href={href} className="mt-auto inline-flex items-center gap-1 pt-6 text-[15px] font-medium hover:text-coral">
            Shop {lowerName(tile.name)} <ArrowUpRight size={16} />
          </Link>
        </div>
        {tile.image && (
          <Link href={href} tabIndex={-1} aria-hidden="true" className={`relative block ${large ? "aspect-square md:aspect-auto md:w-[48%]" : "aspect-[4/3] md:aspect-auto md:w-[42%]"}`}>
            <Image src={tile.image} alt="" fill sizes="(min-width: 768px) 30vw, 90vw" className="object-contain p-[8%] transition duration-700 group-hover:scale-[1.05]" />
          </Link>
        )}
      </div>
    </Reveal>
  );
}
