import type { Metadata } from "next";
import { ProductGrid, PAGE_SIZE } from "@/components/product-grid";
import { listProducts } from "@/lib/medusa";

export const metadata: Metadata = { title: "Search" };

type Props = { searchParams: Promise<{ q?: string; page?: string; sort?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 100);
  const page = Math.max(1, Number(sp.page) || 1);
  const { products, count } = q
    ? await listProducts({ q, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE, order: ["title", "-title"].includes(sp.sort ?? "") ? sp.sort : undefined })
    : { products: [], count: 0 };
  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-28 md:px-8 md:pt-32">
      <form action="/search" role="search" className="max-w-2xl">
        <label htmlFor="q" className="text-sm font-medium text-ink-2">Search the shop</label>
        <div className="mt-2 flex gap-2">
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Try clownfish, zoanthids, anubias or return pump"
            className="h-13 w-full rounded-full border border-line bg-tile px-5 text-lg outline-none placeholder:text-ink-3 focus:border-ink"
          />
          <button type="submit" className="h-13 shrink-0 rounded-full bg-ink px-7 font-medium text-white hover:bg-deep-3">Search</button>
        </div>
      </form>
      {q && (
        <h1 className="mt-12 text-3xl font-semibold tracking-tight md:text-4xl">
          {count ? `Results for “${q}”` : `Nothing found for “${q}”`}
        </h1>
      )}
      {q && (
        <div className="mt-8">
          <ProductGrid products={products} count={count} page={page} sort={sp.sort ?? ""} basePath="/search" query={{ q }} />
        </div>
      )}
    </div>
  );
}
