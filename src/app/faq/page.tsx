import type { Metadata } from "next";
import Link from "next/link";
import faq from "@/content/faq.json";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Shipping, the Live Arrival Guarantee, quarantine and caring for your new fish, corals and plants.",
};

type Cat = { name: string; items: { q: string; a: string[] }[] };
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function FaqPage() {
  const cats = faq as Cat[];
  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-28 md:px-8 md:pt-32">
      <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">How can we help?</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-2">
        Answers about shipping, our Live Arrival Guarantee, quarantine and settling in your new arrivals.
      </p>
      <div className="mt-14 grid gap-12 lg:grid-cols-[260px_1fr]">
        <nav aria-label="FAQ topics" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
            {cats.map((c) => (
              <li key={c.name}>
                <a href={`#${slug(c.name)}`} className="inline-flex h-10 items-center whitespace-nowrap rounded-full px-4 text-[15px] text-ink-2 hover:bg-paper-2 hover:text-ink lg:w-full">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-16">
          {cats.map((c) => (
            <section key={c.name} id={slug(c.name)} className="scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight">{c.name}</h2>
              <div className="mt-4 divide-y divide-line border-y border-line">
                {c.items.map((it) => (
                  <details key={it.q} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-medium">
                      {it.q}
                      <span className="mt-1 text-2xl leading-none text-ink-3 transition group-open:rotate-45">+</span>
                    </summary>
                    <div className="copy mt-3">
                      {it.a.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
          <div className="rounded-[10px] bg-paper-2 p-8">
            <p className="text-xl font-semibold">Still have a question?</p>
            <p className="mt-2 text-ink-2">
              Email <a href={`mailto:${SITE.email}`} className="underline decoration-coral underline-offset-4">{SITE.email}</a> or see{" "}
              <Link href="/contact" className="underline decoration-coral underline-offset-4">other ways to reach us</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
