import { BannerHero } from "@/components/banner-hero";
import { CategoryIndex, type IndexItem } from "@/components/category-index";
import { ProductRail, type RailTab } from "@/components/product-rail";
import { DiveStory } from "@/components/dive-story";
import { JournalTeaser } from "@/components/journal-teaser";
import { countProducts, getCategoryTree, listProducts } from "@/lib/medusa";
import { BIG_CATEGORIES } from "@/lib/site";

export const revalidate = 3600;

const RAIL = ["corals", "marine-fish", "freshwater", "plants", "aquariums"];

export default async function Home() {
  const { byHandle } = await getCategoryTree();
  const big = BIG_CATEGORIES.map((b) => ({ ...b, cat: byHandle.get(b.handle) })).filter((b) => b.cat);

  const [counts, rails] = await Promise.all([
    Promise.all(big.map((b) => countProducts(b.cat!.id))),
    Promise.all(
      RAIL.map(async (h) => {
        const cat = byHandle.get(h);
        if (!cat) return null;
        const { products } = await listProducts({ categoryId: cat.id, limit: 14 });
        return { handle: h, name: cat.name, products } satisfies RailTab;
      }),
    ),
  ]);

  const items: IndexItem[] = big.map((b, i) => ({
    handle: b.handle,
    name: b.cat!.name,
    count: counts[i],
    line: b.line,
    media: b.media,
  }));
  const quick = ["corals", "marine-fish", "freshwater", "plants"].map((h) => ({ handle: h, name: byHandle.get(h)?.name ?? h }));

  return (
    <>
      <BannerHero quick={quick} />
      <CategoryIndex items={items} />
      <ProductRail title="Fresh in the tanks" tabs={rails.filter(Boolean) as RailTab[]} />
      <DiveStory />
      <JournalTeaser />
    </>
  );
}
