import Link from "next/link";
import { type ReactNode } from "react";
import { siteHref, type Block } from "@/content/journal";
import { SlideIn, SplitHeading } from "./text-reveal";

/** Inline: [text](/path) links and **bold**, nothing else. */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) {
      const href = siteHref(m[2]);
      out.push(
        href.startsWith("/") ? (
          <Link key={k++} href={href}>{m[1]}</Link>
        ) : (
          <a key={k++} href={href} rel="noopener">{m[1]}</a>
        ),
      );
    } else {
      out.push(<strong key={k++}>{m[3]}</strong>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const hasMarkup = (s: string) => /\[[^\]]+\]\([^)]+\)|\*\*/.test(s);

/**
 * Journal body. Headings rise word by word; paragraphs and lists glide in from alternating sides as
 * they reach the screen, so a long read keeps moving without the words themselves jumping around.
 */
export function RichText({ blocks }: { blocks: Block[] }) {
  let side = 0;
  return (
    <div className="copy">
      {blocks.map((b, i) => {
        if (b.type === "h2" || b.type === "h3") {
          side = 0;
          return hasMarkup(b.text) ? (
            <SlideIn key={i} from="up" distance={24}>
              {b.type === "h2" ? <h2>{inline(b.text)}</h2> : <h3>{inline(b.text)}</h3>}
            </SlideIn>
          ) : (
            <SplitHeading key={i} as={b.type} text={b.text} />
          );
        }
        const from = side++ % 2 === 0 ? "left" : "right";
        if (b.type === "ul") {
          return (
            <SlideIn key={i} from={from} distance={40}>
              <ul>
                {b.items.map((it, j) => (
                  <li key={j}>{inline(it)}</li>
                ))}
              </ul>
            </SlideIn>
          );
        }
        return (
          <SlideIn key={i} from={from} distance={40}>
            <p>{inline(b.text)}</p>
          </SlideIn>
        );
      })}
    </div>
  );
}
