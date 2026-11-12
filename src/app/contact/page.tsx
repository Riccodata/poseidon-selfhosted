import type { Metadata } from "next";
import Link from "next/link";
import { EnvelopeSimple, Phone, Question } from "@phosphor-icons/react/dist/ssr";
import { SITE } from "@/lib/site";
import { SlideIn, SplitHeading } from "@/components/text-reveal";

export const metadata: Metadata = { title: "Contact us", description: "Email or call the Poseidon's Eden team." };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-28 md:px-8 md:pt-32">
      <SplitHeading as="h1" text="Hi, how may I help you?" className="text-4xl font-semibold tracking-tight md:text-6xl" />
      <p className="mt-4 max-w-xl text-lg text-ink-2">We&rsquo;re happy to help with orders, livestock and anything about your tank.</p>
      <div className="mt-14 grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <a href={`mailto:${SITE.email}`} className="group flex min-h-[280px] flex-col rounded-[10px] bg-deep p-8 text-white">
          <EnvelopeSimple size={28} />
          <p className="mt-auto text-sm text-foam-2">Email us</p>
          <p className="mt-1 text-2xl font-semibold group-hover:text-foam md:text-3xl">{SITE.email}</p>
          <p className="mt-3 max-w-md text-foam">Send a brief message with your name and your question, and we&rsquo;ll respond as soon as possible.</p>
        </a>
        <div className="grid gap-4">
          <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="group flex flex-col rounded-[10px] bg-tile p-8">
            <Phone size={24} />
            <p className="mt-6 text-sm text-ink-3">Call us</p>
            <p className="mt-1 text-xl font-semibold group-hover:text-coral">{SITE.phone}</p>
          </a>
          <Link href="/faq" className="group flex flex-col rounded-[10px] bg-tile p-8">
            <Question size={24} />
            <p className="mt-6 text-sm text-ink-3">Quick answers</p>
            <p className="mt-1 text-xl font-semibold group-hover:text-coral">Read our FAQ</p>
            <p className="mt-2 text-ink-2">Shipping, our Live Arrival Guarantee, quarantine and more.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
