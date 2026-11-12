/**
 * Read-only Medusa Store API access for the storefront.
 *
 * Everything here runs on the server and is cached by Next for an hour (catalogue changes are rare and
 * a stale category count for an hour is harmless). Prices are deliberately not requested: the shop
 * shows its range without prices until the pricing session.
 */

const BACKEND = (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "").replace(/\/+$/, "");
const KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "";
const REVALIDATE = 3600;

export type Category = {
  id: string;
  name: string;
  handle: string;
  description: string;
  rank: number;
  parentId: string | null;
  children: Category[];
};

export type ProductImage = { id: string; url: string };
export type ProductOption = { id: string; title: string; values: { id: string; value: string }[] };
export type ProductVariant = {
  id: string;
  title: string;
  options: { option_id?: string; value: string; option?: { title: string } }[];
  metadata?: Record<string, unknown> | null;
};

export type ProductSummary = {
  id: string;
  title: string;
  handle: string;
  thumbnail: string | null;
  images: ProductImage[];
  brand: string | null;
  optionSummary: string | null;
};

export type Product = ProductSummary & {
  description: string;
  options: ProductOption[];
  variants: ProductVariant[];
  categories: { id: string; name: string; handle: string; parent_category_id: string | null }[];
  infoSections: { title: string; html: string }[];
};

async function store<T>(path: string, params: Record<string, string | number | string[] | undefined> = {}): Promise<T> {
  const url = new URL(BACKEND + path);
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) v.forEach((x) => url.searchParams.append(k, x));
    else url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, {
    headers: { "x-publishable-api-key": KEY },
    next: { revalidate: REVALIDATE, tags: ["catalogue"] },
  });
  if (!res.ok) throw new Error(`Medusa ${path} answered ${res.status}`);
  return res.json() as Promise<T>;
}

/* ---- categories ----------------------------------------------------------------------------- */

type RawCategory = {
  id: string;
  name: string;
  handle: string;
  description: string | null;
  rank: number;
  parent_category_id: string | null;
};

export async function getCategoryTree(): Promise<{ roots: Category[]; byHandle: Map<string, Category>; byId: Map<string, Category> }> {
  const all: RawCategory[] = [];
  let offset = 0;
  for (;;) {
    const page = await store<{ product_categories: RawCategory[]; count: number }>("/store/product-categories", {
      limit: 200,
      offset,
      fields: "id,name,handle,description,rank,parent_category_id",
    });
    all.push(...page.product_categories);
    offset += page.product_categories.length;
    if (offset >= page.count || !page.product_categories.length) break;
  }
  const byId = new Map<string, Category>();
  for (const c of all) {
    byId.set(c.id, {
      id: c.id,
      name: c.name,
      handle: c.handle,
      description: c.description ?? "",
      rank: c.rank,
      parentId: c.parent_category_id,
      children: [],
    });
  }
  const roots: Category[] = [];
  for (const c of byId.values()) {
    if (c.parentId && byId.has(c.parentId)) byId.get(c.parentId)!.children.push(c);
    else roots.push(c);
  }
  const sort = (list: Category[]) => {
    list.sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));
    list.forEach((c) => sort(c.children));
  };
  sort(roots);
  const byHandle = new Map([...byId.values()].map((c) => [c.handle, c]));
  return { roots, byHandle, byId };
}

/** Root → … → category, for breadcrumbs. */
export function ancestry(cat: Category, byId: Map<string, Category>): Category[] {
  const chain: Category[] = [cat];
  let cur = cat;
  while (cur.parentId && byId.has(cur.parentId)) {
    cur = byId.get(cur.parentId)!;
    chain.unshift(cur);
  }
  return chain;
}

/* ---- products --------------------------------------------------------------------------------- */

const LIST_FIELDS = "id,title,handle,thumbnail,metadata,*images,options.title,options.values.value";

type RawProduct = {
  id: string;
  title: string;
  handle: string;
  thumbnail: string | null;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
  images?: ProductImage[];
  options?: ProductOption[];
  variants?: ProductVariant[];
  categories?: Product["categories"];
};

function summarise(p: RawProduct): ProductSummary {
  const real = (p.options ?? []).filter((o) => !(o.title === "Default" && o.values?.length === 1));
  let optionSummary: string | null = null;
  if (real.length) {
    const first = real[0];
    const n = first.values?.length ?? 0;
    optionSummary = n > 1 ? `${n} ${first.title.toLowerCase()}${first.title.toLowerCase().endsWith("s") ? "" : "s"}` : null;
  }
  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    thumbnail: p.thumbnail,
    images: p.images ?? [],
    brand: typeof p.metadata?.brand === "string" ? (p.metadata.brand as string) : null,
    optionSummary,
  };
}

export type ProductQuery = {
  categoryId?: string;
  q?: string;
  limit?: number;
  offset?: number;
  order?: string;
};

export async function listProducts(query: ProductQuery = {}): Promise<{ products: ProductSummary[]; count: number }> {
  const data = await store<{ products: RawProduct[]; count: number }>("/store/products", {
    limit: query.limit ?? 36,
    offset: query.offset ?? 0,
    order: query.order,
    q: query.q,
    "category_id[]": query.categoryId ? [query.categoryId] : undefined,
    fields: LIST_FIELDS,
  });
  return { products: data.products.map(summarise), count: data.count };
}

export async function countProducts(categoryId?: string): Promise<number> {
  const data = await store<{ count: number }>("/store/products", {
    limit: 1,
    fields: "id",
    "category_id[]": categoryId ? [categoryId] : undefined,
  });
  return data.count;
}

export async function getProduct(handle: string): Promise<Product | null> {
  const data = await store<{ products: RawProduct[] }>("/store/products", {
    handle,
    limit: 1,
    fields:
      "id,title,handle,thumbnail,description,metadata,*images,*options,*options.values,*variants,*variants.options,*variants.options.option,*categories",
  });
  const p = data.products[0];
  if (!p) return null;
  const info = Array.isArray(p.metadata?.info_sections) ? (p.metadata!.info_sections as Product["infoSections"]) : [];
  return {
    ...summarise(p),
    description: p.description ?? "",
    options: p.options ?? [],
    variants: p.variants ?? [],
    categories: p.categories ?? [],
    infoSections: info,
  };
}
