import { SlideIn, SplitHeading } from "./text-reveal";

type Doc = { updated: string; sections: { heading: string; paras: string[] }[] };

const tidy = (h: string) =>
  h.replace(/^SECTION (\d+) - /, "$1. ").replace(/\b([A-Z])([A-Z']+)\b/g, (_, a, b) => a + b.toLowerCase());

/** Terms and Privacy: a readable single column with a jump list. */
export function LegalPage({ title, doc }: { title: string; doc: Doc }) {
  const named = doc.sections.filter((s) => s.heading);
  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-28 md:px-8 md:pt-32">
      <SplitHeading as="h1" text={title} className="text-4xl font-semibold tracking-tight md:text-6xl" />
      <p className="mt-3 text-ink-3">Last updated {doc.updated}</p>
      <div className="mt-12 grid gap-12 lg:grid-cols-[280px_1fr]">
        <nav aria-label="Sections" className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <ul className="max-h-[70vh] space-y-1 overflow-y-auto pr-4 text-sm">
            {named.map((s, i) => (
              <li key={i}>
                <a href={`#s-${i}`} className="block py-1 text-ink-3 hover:text-ink">{tidy(s.heading)}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="copy max-w-[72ch]">
          {doc.sections.map((s, i) => {
            const idx = named.indexOf(s);
            return (
              <SlideIn as="section" key={i} from={i % 2 === 0 ? "left" : "right"} distance={32}>
                <div id={idx >= 0 ? `s-${idx}` : undefined} className="scroll-mt-24">
                  {s.heading && <h2>{tidy(s.heading)}</h2>}
                  {s.paras.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </SlideIn>
            );
          })}
        </div>
      </div>
    </div>
  );
}
