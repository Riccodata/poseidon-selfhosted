import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { LoopVideo } from "./loop-video";
import { Reveal } from "./reveal";
import { FaqAccordion, type QA } from "./faq-accordion";
import { loopSrc } from "@/lib/site";
import { SlideIn, SplitHeading } from "./text-reveal";

export const CARE_STEPS = [
  { media: "care-quarantine", title: "Two weeks in quarantine", body: "Every fish spends at least two weeks in quarantine, medicated and eating well, before it's sold." },
  { media: "care-packing", title: "Packed by hand", body: "Each animal is bagged with oxygen by our team and packed into an insulated box." },
  { media: "care-delivery", title: "Delivered to your door", body: "We ship livestock within Australia in insulated boxes, straight to your door." },
  { media: "care-arrival", title: "Live Arrival Guarantee", body: "If an animal doesn't arrive alive, tell us within 24 hours for store credit or a replacement." },
];

/**
 * "From our tanks to yours": the four promises as cards that stack as you scroll (CSS sticky, each
 * card stopping a little lower than the last), then the questions people ask before ordering.
 */
export function CareStack({ faq }: { faq?: QA[] }) {
  return (
    <section data-tone="dark" aria-labelledby="care" className="grain relative bg-deep text-white">
      <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-24 md:px-8 md:pt-32">
        <SplitHeading id="care" text="From our tanks to yours." className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl" />
        <SlideIn from="left" delay={0.2}>
          <p className="mt-4 max-w-xl text-lg text-foam">Every animal is held and checked by our team before it ships, and we&rsquo;re here to help long after your order arrives.</p>
        </SlideIn>

        <ol className="mt-14">
          {CARE_STEPS.map((s, i) => (
            <li key={s.media} className="sticky mb-8 md:mb-[14vh]" style={{ top: `${88 + i * 26}px` }}>
              <div className="grid overflow-hidden rounded-[10px] border border-deep-3 bg-deep-2 shadow-[0_-24px_48px_-24px_rgba(0,0,0,0.6)] md:h-[62vh] md:min-h-[420px] md:grid-cols-[1.3fr_1fr]">
                <div className="relative aspect-[16/10] md:aspect-auto">
                  <LoopVideo {...loopSrc(s.media)} />
                </div>
                <SlideIn from="right" className="flex flex-col justify-end p-7 md:p-10">
                  <SplitHeading as="h3" text={s.title} className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl" />
                  <p className="mt-3 max-w-md text-lg text-foam">{s.body}</p>
                </SlideIn>
              </div>
            </li>
          ))}
        </ol>

        {faq && faq.length > 0 && (
        <div className="mt-20 grid gap-10 md:mt-28 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <SplitHeading as="h3" text="Questions before you order?" className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl" />
            <p className="mt-3 max-w-sm text-foam">The ones we hear most. The rest are on our FAQ page.</p>
            <Link href="/faq" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-ink transition hover:bg-foam active:scale-[0.98]">
              All FAQs <ArrowRight size={16} />
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <FaqAccordion items={faq} tone="dark" defaultOpen={0} />
          </Reveal>
        </div>
        )}
      </div>
    </section>
  );
}
