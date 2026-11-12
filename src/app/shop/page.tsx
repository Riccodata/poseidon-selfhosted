import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid, PAGE_SIZE, SORTS } from "@/components/product-grid";
import { getCategoryTree, listProducts } from "@/lib/medusa";
import { BIG_CATEGORIES } from "@/lib/site";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Shop all", description: "Every coral, fish, plant and aquarium product in the Poseidon's Eden range." };

type Props = { searchParams: Promise<{ page?: string; sort?: string }> };

export default async function ShopPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const sort = SORTS.some((s) => s.value === sp.sort) ? (sp.sort as string) : "";
  const [{ products, count }, { byHandle }] = await Promise.all([
    listProducts({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE, order: sort || undefined }),
    getCategoryTree(),
  ]);
  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-28 md:px-8 md:pt-32">
      <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">Shop all</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-2">
        {count.toLocaleString("en-AU")} corals, fish, plants and supplies. Pick a department or browse everything.
      </p>
      <ul className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1">
        {BIG_CATEGORIES.map((b) => byHandle.get(b.handle)).filter(Boolean).map((c) => (
          <li key={c!.handle}>
            <Link href={`/category/${c!.handle}`} className="inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-full border border-line px-4 text-[15px] hover:border-ink">
              {c!.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <ProductGrid products={products} count={count} page={page} sort={sort} basePath="/shop" />
      </div>
    </div>
  );
}
