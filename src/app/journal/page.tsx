import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { POSTS } from "@/content/journal";
import { Reveal } from "@/components/reveal";
import { SlideIn, SplitHeading } from "@/components/text-reveal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Care guides and buying advice for reef, marine and freshwater aquariums from the Poseidon's Eden team.",
};

const fmt = (d: string) => new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

export default function JournalPage() {
  const [lead, ...rest] = POSTS;
  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-28 md:px-8 md:pt-32">
      <SplitHeading as="h1" text="Journal" className="text-4xl font-semibold tracking-tight md:text-6xl" />
      <SlideIn from="left" delay={0.15}>
        <p className="mt-4 max-w-xl text-lg text-ink-2">Care guides and honest buying advice from our team.</p>
      </SlideIn>

      <Reveal className="mt-14">
        <Link href={`/journal/${lead.slug}`} className="group grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-deep-2">
            <Image src={lead.cover} alt={lead.coverAlt} fill priority sizes="(min-width: 768px) 60vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
          </div>
          <div>
            <p className="text-sm text-ink-3">{fmt(lead.date)} &middot; {lead.minutes} min read</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight group-hover:text-coral md:text-4xl">{lead.title}</h2>
            <p className="mt-4 text-ink-2">{lead.excerpt}</p>
          </div>
        </Link>
      </Reveal>

      <ul className="mt-20 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={i * 0.05}>
            <Link href={`/journal/${p.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-deep-2">
                <Image src={p.cover} alt={p.coverAlt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
              </div>
              <p className="mt-4 text-sm text-ink-3">{p.minutes} min read</p>
              <h2 className="mt-1 text-xl font-semibold leading-snug group-hover:text-coral">{p.title}</h2>
              <p className="mt-2 line-clamp-3 text-ink-2">{p.excerpt}</p>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
