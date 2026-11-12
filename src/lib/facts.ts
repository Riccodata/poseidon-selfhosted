export type Fact = { label: string; value: string };

const HEAD =
  /<h3>\s*(Quick Care Guide|Product Details|Specifications)\s*<\/h3>|<p>\s*<strong>\s*(Quick Care Guide|Product Details|Specifications)\s*<\/strong>\s*<\/p>/i;
const NEXT_HEAD = /<h3>|<p>\s*<strong>[^<]{2,40}<\/strong>\s*<\/p>/gi;
const PAIR = /<strong>\s*([^<:]{2,40}?)\s*:?\s*<\/strong>\s*:?\s*([\s\S]*?)(?=<\/li>|<\/p>|<br\s*\/?>)/gi;

const strip = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Pulls the "Quick Care Guide" / "Product Details" label-value list out of a product description so it
 * can be shown as fact tiles. The heading and the label lines are removed from the prose; anything
 * else in that block (an intro sentence, say) stays. Returns the description untouched when fewer
 * than three facts are found.
 */
export function splitFacts(html: string): { title: string | null; facts: Fact[]; html: string } {
  const m = HEAD.exec(html);
  if (!m) return { title: null, facts: [], html };
  const start = m.index;
  const afterHead = start + m[0].length;
  NEXT_HEAD.lastIndex = afterHead;
  const n = NEXT_HEAD.exec(html);
  const end = n ? n.index : html.length;
  const block = html.slice(afterHead, end);

  const facts: Fact[] = [];
  for (const [, label, value] of block.matchAll(PAIR)) {
    const v = strip(value);
    if (v && v.length <= 160) facts.push({ label: strip(label), value: v });
  }
  if (facts.length < 3) return { title: null, facts: [], html };

  const hasPair = (s: string) => /<strong>\s*[^<:]{2,40}?\s*:?\s*<\/strong>/i.test(s);
  const rest = block
    .replace(/<ul>[\s\S]*?<\/ul>/gi, (ul) => (hasPair(ul) ? "" : ul))
    .replace(/<p>[\s\S]*?<\/p>/gi, (p) => (hasPair(p) && /^<p>\s*<strong>/i.test(p) ? "" : p))
    .replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, "");

  return { title: (m[1] ?? m[2]).trim(), facts, html: html.slice(0, start) + rest + html.slice(end) };
}
