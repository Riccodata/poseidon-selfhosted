import Image from "next/image";
import { Reveal } from "./reveal";
import { CARE_STEPS } from "./care-stack";
import { SplitHeading } from "./text-reveal";

/** The four care steps as a compact strip on livestock product pages. */
export function HowItGetsToYou() {
  return (
    <section aria-labelledby="journey" className="mt-24">
      <SplitHeading id="journey" text="How it gets to you" className="text-2xl font-semibold tracking-tight md:text-3xl" />
      <ol className="no-scrollbar mt-6 grid snap-x snap-mandatory auto-cols-[78%] grid-flow-col gap-4 overflow-x-auto md:grid-flow-row md:grid-cols-4 md:overflow-visible">
        {CARE_STEPS.map((s, i) => (
          <Reveal as="li" key={s.media} delay={i * 0.08} className="snap-start">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-deep">
              <Image src={`/media/stills/${s.media}.jpg`} alt="" fill sizes="(min-width: 768px) 25vw, 78vw" className="object-cover" />
            </div>
            <h3 className="mt-3 font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-ink-2">{s.body}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
