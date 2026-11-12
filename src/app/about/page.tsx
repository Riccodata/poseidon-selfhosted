import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About us",
  description: "Poseidon's Eden is a team of reef keepers bringing healthy corals, fish and aquarium supplies to your door.",
};

const POINTS = [
  { title: "Healthy, hand-picked livestock", body: "We source quality corals and fish and keep them in our system until they're healthy, colourful and ready for your aquarium." },
  { title: "Safe shipping and guarantee", body: "Every order is packed with care to keep your livestock safe, stable and healthy from our tanks to yours." },
  { title: "Friendly customer support", body: "Questions about your order or your tank? Call, email or message us. We'll reply quickly and help you every step of the way." },
];

export default function AboutPage() {
  return (
    <>
      <section className="grain relative isolate overflow-hidden bg-deep text-white">
        <Image src="/media/stills/cat-aquariums.jpg" alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-60" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-deep via-deep/60 to-transparent" />
        <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-40 md:px-8 md:pb-28 md:pt-48">
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">Welcome to Poseidon&rsquo;s Eden</h1>
          <p className="mt-6 max-w-xl text-lg text-foam md:text-xl">
            We&rsquo;re a team of passionate reef keepers committed to bringing you healthy, vibrant corals, fish and everything your aquarium needs to thrive.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <p className="text-2xl leading-relaxed text-ink md:text-3xl md:leading-snug">
              We believe every reef deserves the best start. From carefully selected corals and fish to quality supplies and complete aquarium setups, we give each order care and attention.
            </p>
            <p className="mt-6 max-w-xl text-lg text-ink-2">
              Our livestock is acclimated in our own system, photographed accurately and packed with care, so what you see is what you get. Whether you&rsquo;re setting up your first tank or growing a mature reef, our team is here to make buying online simple, safe and worry-free.
            </p>
          </Reveal>
          <ul className="space-y-8">
            {POINTS.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.08} className="border-t border-line pt-6">
                <h2 className="text-xl font-semibold">{p.title}</h2>
                <p className="mt-2 text-ink-2">{p.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="mt-16 flex flex-wrap gap-3">
          <Link href="/shop" className="inline-flex h-12 items-center rounded-full bg-coral px-7 text-[15px] font-semibold text-white hover:bg-coral-hover">Browse the shop</Link>
          <Link href="/contact" className="inline-flex h-12 items-center rounded-full border border-line px-7 text-[15px] font-semibold hover:border-ink">Contact us</Link>
        </div>
      </section>
    </>
  );
}
