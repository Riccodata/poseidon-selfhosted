import Image from "next/image";
import Link from "next/link";
import type { ProductSummary } from "@/lib/medusa";
import { shownBrand } from "@/lib/site";

/**
 * One product in a grid or rail. Photos sit on a near-white tile so the many cut-outs on white blend in;
 * the second photo fades in on hover where there is one. No price: the range is shown before pricing.
 */
export function ProductCard({ product, sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw", priority = false }: {
  product: ProductSummary;
  sizes?: string;
  priority?: boolean;
}) {
  const first = product.thumbnail ?? product.images[0]?.url ?? null;
  const second = product.images.find((i) => i.url !== first)?.url ?? null;
  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-[10px] bg-tile">
        {first ? (
          <>
            <Image
              src={first}
              alt=""
              fill
              sizes={sizes}
              priority={priority}
              className={`object-contain p-[3%] transition duration-500 ease-[var(--ease-tide)] group-hover:scale-[1.04] ${second ? "group-hover:opacity-0" : ""}`}
            />
            {second && (
              <Image src={second} alt="" fill sizes={sizes} className="object-contain p-[3%] opacity-0 transition duration-500 group-hover:opacity-100" />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-ink-3">Photo coming soon</div>
        )}
      </div>
      <div className="mt-3 space-y-1 pr-2">
        {shownBrand(product.brand) && <p className="text-[13px] text-ink-3">{shownBrand(product.brand)}</p>}
        <h3 className="line-clamp-2 text-[15px] font-medium leading-snug text-ink group-hover:text-coral">{product.title}</h3>
        {product.optionSummary && <p className="text-[13px] text-ink-3">{product.optionSummary}</p>}
      </div>
    </Link>
  );
}
