import Link from "next/link";
import type { ProductSummary } from "@/lib/medusa";
import { ProductCard } from "./product-card";

export const PAGE_SIZE = 36;

export const SORTS = [
  { value: "", label: "Featured" },
  { value: "title", label: "Name, A to Z" },
  { value: "-title", label: "Name, Z to A" },
] as const;

/** Product grid with sort links and numbered pagination. Server-rendered, plain links. */
export function ProductGrid({
  products,
  count,
  page,
  sort,
  basePath,
  query = {},
}: {
  products: ProductSummary[];
  count: number;
  page: number;
  sort: string;
  basePath: string;
  query?: Record<string, string>;
}) {
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const href = (p: number, s = sort) => {
    const params = new URLSearchParams({ ...query });
    if (s) params.set("sort", s);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ""}#products`;
  };
  const from = count ? (page - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(count, page * PAGE_SIZE);

  const numbers = (() => {
    const set = new Set([1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages));
    return [...set].sort((a, b) => a - b);
  })();

  return (
    <div id="products" className="scroll-mt-24">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <p className="text-sm text-ink-3">
          {count ? `Showing ${from} to ${to} of ${count.toLocaleString("en-AU")}` : "No products yet"}
        </p>
        <div className="flex items-center gap-2" role="group" aria-label="Sort products">
          {SORTS.map((s) => (
            <Link
              key={s.value}
              href={href(1, s.value)}
              scroll={false}
              className={`h-9 rounded-full px-4 text-sm leading-9 transition ${
                sort === s.value ? "bg-ink text-white" : "text-ink-2 hover:bg-paper-2"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {products.length ? (
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <li key={p.id}>
              <ProductCard product={p} priority={i < 4} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-[10px] bg-paper-2 px-6 py-16 text-center">
          <p className="text-lg font-medium">Nothing here yet.</p>
          <p className="mt-2 text-ink-3">New stock lands often. Try another department in the meantime.</p>
          <Link href="/shop" className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-6 text-[15px] font-medium text-white">
            Browse all products
          </Link>
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="Pages" className="mt-14 flex flex-wrap items-center justify-center gap-2">
          {page > 1 && (
            <Link href={href(page - 1)} className="h-11 rounded-full border border-line px-5 text-[15px] leading-[42px] hover:border-ink">
              Previous
            </Link>
          )}
          {numbers.map((n, i) => (
            <span key={n} className="flex items-center gap-2">
              {i > 0 && n - numbers[i - 1] > 1 && <span className="px-1 text-ink-3">&hellip;</span>}
              <Link
                href={href(n)}
                aria-current={n === page ? "page" : undefined}
                className={`h-11 min-w-11 rounded-full px-3 text-center text-[15px] leading-[44px] ${n === page ? "bg-ink text-white" : "hover:bg-paper-2"}`}
              >
                {n}
              </Link>
            </span>
          ))}
          {page < pages && (
            <Link href={href(page + 1)} className="h-11 rounded-full border border-line px-5 text-[15px] leading-[42px] hover:border-ink">
              Next
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
