import journal from "./journal.json";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  tags: string[];
  cover: string;
  coverAlt: string;
  author: string;
  date: string;
  minutes: number;
  body: Block[];
};

export const POSTS = journal as Post[];
export const findPost = (slug: string) => POSTS.find((p) => p.slug === slug);

/** Old Wix landing-page links inside the posts point at what is now a category page. */
export function siteHref(href: string): string {
  const legacy: Record<string, string> = {
    "/freshwater": "/category/freshwater",
    "/corals": "/category/corals",
    "/marine-fish": "/category/marine-fish",
    "/plants": "/category/plants",
    "/category/fish": "/category/marine-fish",
    "/category/all-products": "/shop",
  };
  return legacy[href] ?? href;
}
