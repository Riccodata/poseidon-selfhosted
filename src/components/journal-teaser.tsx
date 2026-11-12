import Image from "next/image";
import Link from "next/link";
import { POSTS } from "@/content/journal";
import { Reveal } from "./reveal";
import { SplitHeading } from "./text-reveal";

const fmt = (d: string) => new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

export function JournalTeaser() {
  const [lead, ...rest] = POSTS;
  return (
    <section data-tone="dark" aria-labelledby="journal" className="bg-deep text-white">
      <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-20 md:px-8 md:pt-28">
        <div className="flex items-end justify-between gap-6">
          <SplitHeading id="journal" text="From the journal" className="text-4xl font-semibold tracking-tight md:text-5xl" />
          <Link href="/journal" className="hidden text-[15px] font-medium text-foam underline decoration-coral underline-offset-4 hover:text-white md:inline">
            All articles
          </Link>
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.25fr_1fr]">
          <Reveal>
            <Link href={`/journal/${lead.slug}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-deep-2">
                <Image src={lead.cover} alt={lead.coverAlt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
              </div>
              <p className="mt-5 text-sm text-foam-2">{fmt(lead.date)} &middot; {lead.minutes} min read</p>
              <h3 className="mt-2 max-w-xl text-2xl font-semibold leading-snug group-hover:text-foam md:text-3xl">{lead.title}</h3>
              <p className="mt-3 max-w-xl text-foam-2">{lead.excerpt}</p>
            </Link>
          </Reveal>
          <ul className="divide-y divide-deep-3 border-y border-deep-3">
            {rest.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 0.05}>
                <Link href={`/journal/${p.slug}`} className="group flex gap-5 py-5">
                  <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-[10px] bg-deep-2">
                    <Image src={p.cover} alt="" fill sizes="96px" className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold leading-snug group-hover:text-foam">{p.title}</h3>
                    <p className="mt-1 text-sm text-foam-2">{p.minutes} min read</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
