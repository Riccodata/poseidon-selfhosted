import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryHero } from "@/components/category-hero";
import { ProductGrid, PAGE_SIZE, SORTS } from "@/components/product-grid";
import { SubcategoryTiles, type Tile } from "@/components/subcategory-tiles";
import { Reveal } from "@/components/reveal";
import { CategoryIntro } from "@/components/category-intro";
import { KeepBuilding } from "@/components/keep-building";
import { ancestry, getCategoryTree, listProducts, type Category } from "@/lib/medusa";
import { BIG_CATEGORIES, STILL, lowerName } from "@/lib/site";
import { SlideIn, SplitHeading } from "@/components/text-reveal";

export const revalidate = 3600;
export const dynamicParams = true;
export async function generateStaticParams() {
  return BIG_CATEGORIES.map((b) => ({ handle: b.handle }));
}

type Props = { params: Promise<{ handle: string }>; searchParams: Promise<{ page?: string; sort?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const { byHandle } = await getCategoryTree();
  const cat = byHandle.get(handle);
  if (!cat) return {};
  return { title: cat.name, description: cat.description || undefined };
}

async function tilesFor(children: Category[]): Promise<Tile[]> {
  return Promise.all(
    children.map(async (c) => {
      const { products, count } = await listProducts({ categoryId: c.id, limit: 1 });
      const p = products[0];
      return {
        name: c.name,
        handle: c.handle,
        count,
        image: p?.thumbnail ?? p?.images[0]?.url ?? null,
        description: c.description,
        children: [...c.children].sort((a, b) => a.name.localeCompare(b.name)).map((g) => ({ name: g.name, handle: g.handle })),
      };
    }),
  );
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const sp = await searchParams;
  const { byHandle, byId } = await getCategoryTree();
  const cat = byHandle.get(handle);
  if (!cat) notFound();

  const page = Math.max(1, Number(sp.page) || 1);
  const sort = SORTS.some((s) => s.value === sp.sort) ? (sp.sort as string) : "";
  const big = BIG_CATEGORIES.find((b) => b.handle === handle);
  const chain = ancestry(cat, byId);
  const children = [...cat.children].sort((a, b) => (big ? a.name.localeCompare(b.name) : a.name.localeCompare(b.name)));

  const [{ products, count }, tiles] = await Promise.all([
    listProducts({ categoryId: cat.id, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE, order: sort || undefined }),
    big ? tilesFor(children) : Promise.resolve([] as Tile[]),
  ]);

  const crumbs = [{ name: "Shop", href: "/shop" }, ...chain.slice(0, -1).map((c) => ({ name: c.name, href: `/category/${c.handle}` }))];
  const names = Object.fromEntries(BIG_CATEGORIES.map((b) => [b.handle, byHandle.get(b.handle)?.name ?? b.handle]));
  const root = chain[0];

  if (big) {
    return (
      <>
        <CategoryHero
          name={cat.name}
          line={big.line}
          description=""
          count={count}
          media={big.media}
          crumbs={crumbs}
        />
        {cat.description && <CategoryIntro text={cat.description} image={STILL[handle]} name={cat.name} />}
        {tiles.length > 0 && (
          <section className="mx-auto max-w-[1400px] px-4 pt-16 md:px-8 md:pt-24">
            <SplitHeading text={`Browse ${lowerName(cat.name)}`} className="text-3xl font-semibold tracking-tight md:text-4xl" />
            <div className="mt-8">
              <SubcategoryTiles tiles={tiles} />
            </div>
          </section>
        )}
        <section className="mx-auto max-w-[1400px] px-4 pb-24 pt-16 md:px-8 md:pt-24">
          <SplitHeading text={`All ${lowerName(cat.name)}`} className="mb-6 text-3xl font-semibold tracking-tight md:text-4xl" />
          <ProductGrid products={products} count={count} page={page} sort={sort} basePath={`/category/${handle}`} />
        </section>
        <KeepBuilding from={handle} names={names} />
      </>
    );
  }

  const parent = cat.parentId ? byId.get(cat.parentId) : undefined;
  const siblings = parent ? [...parent.children].sort((a, b) => a.name.localeCompare(b.name)) : [];
  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-28 md:px-8 md:pt-32">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-3">
        {crumbs.map((c, i) => (
          <span key={c.href}>
            {i > 0 && <span className="mx-2">/</span>}
            <Link href={c.href} className="hover:text-ink">{c.name}</Link>
          </span>
        ))}
      </nav>
      <SplitHeading as="h1" text={cat.name} className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl" />
      {cat.description && (
        <SlideIn from="left" delay={0.15}>
          <p className="mt-4 max-w-2xl text-lg text-ink-2">{cat.description}</p>
        </SlideIn>
      )}

      {children.length > 0 && (
        <ul className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1">
          {children.map((c) => (
            <li key={c.handle}>
              <Link href={`/category/${c.handle}`} className="inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-full border border-line px-4 text-[15px] hover:border-ink">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {!children.length && siblings.length > 1 && (
        <ul className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1">
          {siblings.map((c) => (
            <li key={c.handle}>
              <Link
                href={`/category/${c.handle}`}
                aria-current={c.handle === handle ? "page" : undefined}
                className={`inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-full px-4 text-[15px] ${
                  c.handle === handle ? "bg-ink text-white" : "border border-line hover:border-ink"
                }`}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10">
        <ProductGrid products={products} count={count} page={page} sort={sort} basePath={`/category/${handle}`} />
      </div>
      <div className="-mx-4 mt-24 md:-mx-8">
        <KeepBuilding from={root.handle} names={names} />
      </div>
    </div>
  );
}
