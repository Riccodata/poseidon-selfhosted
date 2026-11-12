import type { Metadata } from "next";
import Link from "next/link";
import faq from "@/content/faq.json";
import { SITE, loopSrc } from "@/lib/site";
import { LoopVideo } from "@/components/loop-video";
import { FaqAccordion } from "@/components/faq-accordion";
import { Reveal } from "@/components/reveal";
import { SlideIn, SplitHeading } from "@/components/text-reveal";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Shipping, the Live Arrival Guarantee, quarantine and caring for your new fish, corals and plants.",
};

type Cat = { name: string; items: { q: string; a: string[] }[] };
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function FaqPage() {
  const cats = faq as Cat[];
  return (
    <>
      <section data-hero data-tone="dark" className="relative isolate flex min-h-[62dvh] items-end overflow-hidden bg-deep text-white">
        <div className="absolute inset-0 -z-10">
          <LoopVideo {...loopSrc("care-arrival")} priority />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-deep/85 via-deep/40 to-transparent" />
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-14 pt-32 md:px-8 md:pb-20">
          <SplitHeading as="h1" text="How can we help?" className="text-5xl font-semibold leading-[0.98] tracking-tight md:text-7xl" />
          <p className="mt-5 max-w-xl text-lg text-foam md:text-xl">
            Shipping, our Live Arrival Guarantee, quarantine and settling in your new arrivals.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-16 md:px-8 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
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
              <Reveal as="section" key={c.name}>
                <div id={slug(c.name)} className="scroll-mt-24">
                  <SplitHeading text={c.name} className="text-2xl font-semibold tracking-tight" />
                  <div className="mt-4">
                    <FaqAccordion items={c.items} />
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal>
              <div className="rounded-[10px] bg-paper-2 p-8">
                <p className="text-xl font-semibold">Still have a question?</p>
                <p className="mt-2 text-ink-2">
                  Email <a href={`mailto:${SITE.email}`} className="underline decoration-coral underline-offset-4">{SITE.email}</a> or see{" "}
                  <Link href="/contact" className="underline decoration-coral underline-offset-4">other ways to reach us</Link>.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
}
