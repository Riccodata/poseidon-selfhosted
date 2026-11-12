import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-[1400px] flex-col justify-center px-4 pt-24 md:px-8">
      <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">This page swam off.</h1>
      <p className="mt-4 max-w-md text-lg text-ink-2">The link may be old, or the product may have moved. The shop is still right here.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/shop" className="inline-flex h-12 items-center rounded-full bg-coral px-7 text-[15px] font-semibold text-white hover:bg-coral-hover">Browse the shop</Link>
        <Link href="/" className="inline-flex h-12 items-center rounded-full border border-line px-7 text-[15px] font-semibold hover:border-ink">Home</Link>
      </div>
    </div>
  );
}
