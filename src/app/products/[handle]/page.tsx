import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnvelopeSimple, Truck, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { ProductGallery } from "@/components/product-gallery";
import { OptionPicker } from "@/components/option-picker";
import { ProductCard } from "@/components/product-card";
import { FactTiles } from "@/components/fact-tiles";
import { HowItGetsToYou } from "@/components/how-it-gets-to-you";
import { KeepBuilding } from "@/components/keep-building";
import { Reveal } from "@/components/reveal";
import { splitFacts } from "@/lib/facts";
import { ancestry, getCategoryTree, getProduct, listProducts } from "@/lib/medusa";
import { BIG_CATEGORIES, askHref, lowerName, shownBrand } from "@/lib/site";
import { SlideIn, SplitHeading } from "@/components/text-reveal";

export const revalidate = 3600;
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ handle: string }> };

const plain = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const p = await getProduct(handle);
  if (!p) return {};
  const desc = plain(p.description).slice(0, 155);
  const img = p.thumbnail ?? p.images[0]?.url;
  return { title: p.title, description: desc, openGraph: { title: p.title, description: desc, images: img ? [img] : [] } };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const [p, tree] = await Promise.all([getProduct(handle), getCategoryTree()]);
  if (!p) notFound();

  // breadcrumb from the deepest category this product sits in
  const deepest = p.categories
    .map((c) => tree.byId.get(c.id))
    .filter(Boolean)
    .map((c) => ancestry(c!, tree.byId))
    .sort((a, b) => b.length - a.length)[0];
  const leaf = deepest?.[deepest.length - 1];

  const options = p.options
    .filter((o) => !(o.title === "Default" && o.values.length === 1))
    .map((o) => ({ title: o.title, values: o.values.map((v) => v.value) }));
  const variants = p.variants.map((v) => ({
    title: v.title,
    options: Object.fromEntries(v.options.map((o) => [o.option?.title ?? "", o.value])),
  }));
  const images = [...new Set([p.thumbnail, ...p.images.map((i) => i.url)].filter(Boolean) as string[])];

  const root = deepest?.[0];
  const livestock = ["corals", "marine-fish", "freshwater", "inverts", "plants"].includes(root?.handle ?? "");
  const { title: factsTitle, facts, html: prose } = splitFacts(p.description);
  const names = Object.fromEntries(BIG_CATEGORIES.map((b) => [b.handle, tree.byHandle.get(b.handle)?.name ?? b.handle]));

  const related = leaf
    ? (await listProducts({ categoryId: leaf.id, limit: 9 })).products.filter((x) => x.id !== p.id).slice(0, 8)
    : [];

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-24 md:px-8 md:pt-28">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-3">
        <Link href="/shop" className="hover:text-ink">Shop</Link>
        {deepest?.map((c) => (
          <span key={c.id}>
            <span className="mx-2">/</span>
            <Link href={`/category/${c.handle}`} className="hover:text-ink">{c.name}</Link>
          </span>
        ))}
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery images={images} title={p.title} />
        </div>

        <div>
          {shownBrand(p.brand) && <p className="text-sm text-ink-3">{shownBrand(p.brand)}</p>}
          <SplitHeading as="h1" text={p.title} className="mt-1 text-3xl font-semibold leading-tight tracking-tight md:text-4xl" />

          <div className="mt-6 rounded-[10px] bg-paper-2 px-5 py-4">
            <p className="font-medium">Pricing coming soon</p>
            <p className="mt-1 text-sm text-ink-2">We&rsquo;re finalising prices for our new shop. Ask us about availability in the meantime.</p>
          </div>

          {options.length > 0 && (
            <div className="mt-8">
              <OptionPicker options={options} variants={variants} />
            </div>
          )}

          <a
            href={askHref(`Question about ${p.title}`)}
            className="mt-8 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-coral px-8 text-[15px] font-semibold text-white transition hover:bg-coral-hover active:scale-[0.98] sm:w-auto sm:min-w-64 sm:inline-flex"
          >
            <EnvelopeSimple size={18} /> Ask about this
          </a>

          <ul className="mt-8 space-y-3 border-t border-line pt-6 text-sm text-ink-2">
            <li className="flex gap-3"><Truck size={20} className="shrink-0 text-ink" />Livestock ships within Australia in insulated boxes, bagged with oxygen.</li>
            <li className="flex gap-3"><ShieldCheck size={20} className="shrink-0 text-ink" />Live Arrival Guarantee: tell us within 24 hours for store credit or a replacement.</li>
          </ul>

          {factsTitle && facts.length > 0 && <FactTiles title={factsTitle} facts={facts} />}

          {(prose.trim() || p.infoSections.length > 0) && (
            <Reveal className="mt-10 border-t border-line pt-8">
              <h2 className="text-lg font-semibold">About this product</h2>
              <div className="copy mt-3" dangerouslySetInnerHTML={{ __html: prose }} />
              {p.infoSections.map((s) => (
                <details key={s.title} className="group border-t border-line py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    {s.title}
                    <span className="text-xl leading-none text-ink-3 transition group-open:rotate-45">+</span>
                  </summary>
                  <div className="copy mt-3" dangerouslySetInnerHTML={{ __html: s.html }} />
                </details>
              ))}
            </Reveal>
          )}
        </div>
      </div>

      {livestock && <HowItGetsToYou />}

      {related.length > 0 && leaf && (
        <section className="mt-24">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">More {lowerName(leaf.name)}</h2>
            <Link href={`/category/${leaf.handle}`} className="text-[15px] font-medium underline decoration-coral underline-offset-4 hover:text-coral">
              See all
            </Link>
          </div>
          <ul className="no-scrollbar mt-6 grid snap-x snap-mandatory auto-cols-[46%] grid-flow-col gap-4 overflow-x-auto md:auto-cols-[30%] lg:auto-cols-[23%]">
            {related.map((r) => (
              <li key={r.id} className="snap-start">
                <ProductCard product={r} sizes="(min-width: 1024px) 23vw, (min-width: 768px) 30vw, 46vw" />
              </li>
            ))}
          </ul>
        </section>
      )}
      {root && (
        <div className="-mx-4 mt-24 md:-mx-8">
          <KeepBuilding from={root.handle} names={names} />
        </div>
      )}
    </div>
  );
}
