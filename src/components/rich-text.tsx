import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { siteHref, type Block } from "@/content/journal";

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

export function RichText({ blocks }: { blocks: Block[] }) {
  return (
    <div className="copy">
      {blocks.map((b, i) => (
        <Fragment key={i}>
          {b.type === "p" && <p>{inline(b.text)}</p>}
          {b.type === "h2" && <h2>{inline(b.text)}</h2>}
          {b.type === "h3" && <h3>{inline(b.text)}</h3>}
          {b.type === "ul" && (
            <ul>
              {b.items.map((it, j) => (
                <li key={j}>{inline(it)}</li>
              ))}
            </ul>
          )}
        </Fragment>
      ))}
    </div>
  );
}
