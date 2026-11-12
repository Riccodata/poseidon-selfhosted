import { BannerHero } from "@/components/banner-hero";
import { CategoryIndex, type IndexItem } from "@/components/category-index";
import { TankJourney, type JourneyStep } from "@/components/tank-journey";
import { ProductDrift } from "@/components/product-drift";
import { ProductRail, type RailTab } from "@/components/product-rail";
import { CareStack } from "@/components/care-stack";
import { JournalTeaser } from "@/components/journal-teaser";
import { countProducts, getCategoryTree, listProducts, type ProductSummary } from "@/lib/medusa";
import { BIG_CATEGORIES } from "@/lib/site";
import faq from "@/content/faq.json";

export const revalidate = 3600;

const RAIL = ["corals", "marine-fish", "freshwater", "plants", "aquariums"];
const FAQ_PICKS = [
  "Do you guarantee live arrival?",
  "What is the quarantine process at Poseidon's Eden?",
  "What does WYSIWYG mean?",
  "What if the weather is extreme where I live?",
  "Does Poseidon's Eden offer guidance for beginners?",
];

const img = (p: ProductSummary) => p.thumbnail ?? p.images[0]?.url ?? null;

export default async function Home() {
  const { byHandle } = await getCategoryTree();
  const id = (h: string) => byHandle.get(h)?.id;
  const big = BIG_CATEGORIES.map((b) => ({ ...b, cat: byHandle.get(b.handle) })).filter((b) => b.cat);
  const take = async (h: string, n: number, offset = 0) => {
    const c = id(h);
    return c ? (await listProducts({ categoryId: c, limit: n, offset })).products : [];
  };

  const [counts, rails, aquariums, equipment, scape, stock, care, corals, fish] = await Promise.all([
    Promise.all(big.map((b) => countProducts(b.cat!.id))),
    Promise.all(
      RAIL.map(async (h) => {
        const cat = byHandle.get(h);
        return cat ? ({ handle: h, name: cat.name, products: await take(h, 14) } satisfies RailTab) : null;
      }),
    ),
    take("aquariums", 4),
    take("equipment", 4, 12),
    take("aquascaping-co2", 4),
    Promise.all([take("corals", 1, 20), take("marine-fish", 1, 5), take("freshwater", 1, 30), take("plants", 1, 10)]).then((r) => r.flat()),
    take("food-additives", 4, 6),
    take("corals", 16, 40),
    take("marine-fish", 16, 20),
  ]);

  const items: IndexItem[] = big.map((b, i) => ({ handle: b.handle, name: b.cat!.name, count: counts[i], line: b.line, media: b.media }));
  const countOf = (h: string) => counts[big.findIndex((b) => b.handle === h)] ?? 0;
  const livestock = ["corals", "marine-fish", "freshwater", "inverts"].reduce((n, h) => n + countOf(h), 0);
  const thumbs = (ps: ProductSummary[]) => ps.map((p) => ({ handle: p.handle, title: p.title, image: img(p) }));
  const drift = (ps: ProductSummary[]) => ps.filter(img).map((p) => ({ handle: p.handle, title: p.title, image: img(p)! }));

  const steps: JourneyStep[] = [
    { key: "choose", title: "Choose your aquarium", body: "All-in-one, peninsula and reef-ready tanks, with matching cabinets on many models.", href: "/category/aquariums", cta: "Shop aquariums", media: "aquariums", products: thumbs(aquariums) },
    { key: "equip", title: "Equip it", body: "Lighting, return pumps, skimmers, heaters and controllers that keep the water stable.", href: "/category/equipment", cta: "Shop equipment", media: "equipment", products: thumbs(equipment) },
    { key: "scape", title: "Scape it", body: "Rock, wood, substrates and CO2, plus the tools to place every piece.", href: "/category/aquascaping-co2", cta: "Shop aquascaping", media: "aquascaping-co2", products: thumbs(scape) },
    {
      key: "stock",
      title: "Stock it",
      body: "Corals, marine and freshwater fish, inverts and live plants, added slowly once your tank has cycled.",
      href: "/category/corals",
      cta: "Shop corals",
      media: "marine-fish",
      links: [
        { name: "Marine Fish", href: "/category/marine-fish" },
        { name: "Freshwater", href: "/category/freshwater" },
        { name: "Inverts", href: "/category/inverts" },
        { name: "Plants", href: "/category/plants" },
      ],
      products: thumbs(stock),
    },
    { key: "care", title: "Feed and care", body: "Foods, supplements, test kits and the maintenance tools for the long run.", href: "/category/food-additives", cta: "Shop food and care", media: "food-additives", products: thumbs(care) },
  ];

  const faqItems = (faq as { items: { q: string; a: string[] }[] }[]).flatMap((c) => c.items);
  const picks = FAQ_PICKS.map((q) => faqItems.find((i) => i.q === q)).filter(Boolean) as { q: string; a: string[] }[];
  const quick = ["corals", "marine-fish", "freshwater", "plants"].map((h) => ({ handle: h, name: byHandle.get(h)?.name ?? h }));

  return (
    <>
      <BannerHero quick={quick} />
      <CategoryIndex items={items} />
      <TankJourney steps={steps} />
      <ProductDrift top={drift(corals)} bottom={drift(fish)} count={livestock} />
      <ProductRail title="In the tanks now" tabs={rails.filter(Boolean) as RailTab[]} />
      <CareStack faq={picks} />
      <JournalTeaser />
    </>
  );
}
