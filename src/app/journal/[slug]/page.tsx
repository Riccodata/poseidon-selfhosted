import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, findPost } from "@/content/journal";
import { RichText } from "@/components/rich-text";
import { ReadingProgress } from "@/components/reading-progress";
import { Reveal } from "@/components/reveal";
import { SlideIn, SplitHeading } from "@/components/text-reveal";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = findPost((await params).slug);
  if (!post) return {};
  return {
    title: { absolute: post.seoTitle },
    description: post.seoDescription,
    openGraph: { type: "article", title: post.title, description: post.seoDescription, images: [post.cover] },
  };
}

const fmt = (d: string) => new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

export default async function PostPage({ params }: Props) {
  const post = findPost((await params).slug);
  if (!post) notFound();
  const others = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  return (
    <article className="pb-24 pt-28 md:pt-32">
      <header className="mx-auto max-w-3xl px-4">
        <Link href="/journal" className="text-sm text-ink-3 hover:text-ink">Journal</Link>
        <SplitHeading as="h1" text={post.title} className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl" />
        <p className="mt-5 text-ink-3">
          {post.author} &middot; {fmt(post.date)} &middot; {post.minutes} min read
        </p>
      </header>
      <div className="mx-auto mt-10 max-w-5xl px-4">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[10px] bg-deep-2">
          <Image src={post.cover} alt={post.coverAlt} fill priority sizes="(min-width: 1024px) 1000px, 100vw" className="object-cover" />
        </div>
      </div>
      <ReadingProgress>
        <Reveal className="mx-auto mt-12 max-w-3xl px-4 text-[17px]">
          <RichText blocks={post.body} />
        </Reveal>
      </ReadingProgress>
      <aside className="mx-auto mt-20 max-w-5xl border-t border-line px-4 pt-10">
        <h2 className="text-xl font-semibold">Keep reading</h2>
        <ul className="mt-6 grid gap-8 sm:grid-cols-3">
          {others.map((p) => (
            <li key={p.slug}>
              <Link href={`/journal/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-deep-2">
                  <Image src={p.cover} alt="" fill sizes="(min-width: 640px) 30vw, 100vw" className="object-cover" />
                </div>
                <p className="mt-3 font-semibold leading-snug group-hover:text-coral">{p.title}</p>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </article>
  );
}
