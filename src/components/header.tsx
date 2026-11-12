"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { CaretDown, List, MagnifyingGlass, X, ArrowRight } from "@phosphor-icons/react";
import { STILL, lowerName } from "@/lib/site";

export type NavCategory = { name: string; handle: string; children: { name: string; handle: string }[] };

const QUICK = ["corals", "marine-fish", "freshwater", "plants"];

export function Header({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(!(pathname === "/" || pathname.startsWith("/category/") || pathname === "/about" || pathname === "/faq"));
  const [mega, setMega] = useState(false);
  const [hover, setHover] = useState(categories[0]?.handle ?? "corals");
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* On pages that open with a full-bleed hero (home, department pages) the bar stays clear over the
     water and turns solid once the hero has scrolled away. */
  const heroEnd = () => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    return hero ? hero.offsetTop + hero.offsetHeight - 72 : -1;
  };
  useMotionValueEvent(scrollY, "change", (y) => {
    const end = heroEnd();
    const s = end < 0 || y > end;
    if (s !== solid) setSolid(s);
  });
  useEffect(() => {
    const end = heroEnd();
    setSolid(end < 0 || window.scrollY > end);
    setMega(false);
    setMobile(false);
    setSearch(false);
  }, [pathname]);
  useEffect(() => {
    if (search) inputRef.current?.focus();
  }, [search]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMega(false);
        setSearch(false);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  const light = solid || mega || search;
  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMega(false), 140);
  };
  const quick = QUICK.map((h) => categories.find((c) => c.handle === h)).filter(Boolean) as NavCategory[];
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setSearch(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        light ? "bg-paper/95 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur-sm" : "bg-transparent text-white"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-4 md:px-8">
        <Link href="/" aria-label="Poseidon's Eden home" className="relative flex h-11 w-[128px] shrink-0 items-center">
          {/* the brand wordmark: silver over the water, deep blue once the bar turns light */}
          <Image src="/media/logo-nav-light.png" alt="" width={280} height={96} priority className={`absolute h-11 w-auto transition-opacity duration-300 ${light ? "opacity-0" : "opacity-100"}`} />
          <Image src="/media/logo-nav-dark.png" alt="" width={280} height={96} priority className={`absolute h-11 w-auto transition-opacity duration-300 ${light ? "opacity-100" : "opacity-0"}`} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          <button
            type="button"
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
            onClick={() => setMega((m) => !m)}
            aria-expanded={mega}
            className="flex items-center gap-1 rounded-full px-3 py-2 text-[15px] font-medium"
          >
            Shop <CaretDown size={14} weight="bold" className={`transition-transform ${mega ? "rotate-180" : ""}`} />
          </button>
          {quick.map((c) => (
            <Link key={c.handle} href={`/category/${c.handle}`} className="rounded-full px-3 py-2 text-[15px] font-medium hover:opacity-70">
              {c.name}
            </Link>
          ))}
          <Link href="/journal" className="rounded-full px-3 py-2 text-[15px] font-medium hover:opacity-70">
            Journal
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearch((s) => !s)}
            aria-label="Search products"
            className="flex h-10 items-center gap-2 rounded-full px-3 text-[15px] font-medium"
          >
            <MagnifyingGlass size={20} />
            <span className="hidden md:inline">Search</span>
          </button>
          <Link href="/contact" className="hidden rounded-full px-3 py-2 text-[15px] font-medium md:inline-flex">
            Contact
          </Link>
          <button
            type="button"
            onClick={() => setMobile(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
          >
            <List size={22} />
          </button>
        </div>
      </div>

      {/* Mega menu: all ten big categories with their main sub-categories */}
      <AnimatePresence>
        {mega && (
          <motion.div
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-16 hidden border-t border-line bg-paper text-ink shadow-[0_24px_48px_-24px_rgba(14,29,34,0.25)] lg:block"
          >
            <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_340px] gap-10 px-8 py-8">
              <div className="grid grid-cols-5 gap-x-6 gap-y-8">
                {categories.map((c) => (
                  <div key={c.handle} onMouseEnter={() => setHover(c.handle)}>
                    <Link href={`/category/${c.handle}`} className="text-[15px] font-semibold hover:text-coral">
                      {c.name}
                    </Link>
                    <ul className="mt-2 space-y-1.5">
                      {c.children.slice(0, 6).map((s) => (
                        <li key={s.handle}>
                          <Link href={`/category/${s.handle}`} className="text-sm text-ink-3 hover:text-ink">
                            {s.name}
                          </Link>
                        </li>
                      ))}
                      {c.children.length > 6 && (
                        <li>
                          <Link href={`/category/${c.handle}`} className="text-sm font-medium text-ink hover:text-coral">
                            All {lowerName(c.name)}
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
              <Link href={`/category/${hover}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[10px] bg-deep">
                {STILL[hover] && (
                  <Image src={STILL[hover]} alt="" fill sizes="340px" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                )}
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-deep/80 to-transparent p-5 pt-16 text-white">
                  <span className="text-lg font-semibold">{categories.find((c) => c.handle === hover)?.name}</span>
                  <ArrowRight size={20} />
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <AnimatePresence>
        {search && (
          <motion.form
            onSubmit={submit}
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-16 border-t border-line bg-paper text-ink shadow-[0_24px_48px_-24px_rgba(14,29,34,0.25)]"
            role="search"
          >
            <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-5 md:px-8">
              <label htmlFor="site-search" className="sr-only">
                Search the shop
              </label>
              <MagnifyingGlass size={22} className="shrink-0 text-ink-3" />
              <input
                id="site-search"
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search corals, fish, plants, equipment"
                className="h-12 w-full bg-transparent text-xl outline-none placeholder:text-ink-3"
              />
              <button type="submit" className="h-11 shrink-0 rounded-full bg-ink px-6 text-[15px] font-medium text-white hover:bg-deep-3">
                Search
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-paper text-ink lg:hidden"
          >
            <div className="flex h-16 items-center justify-between px-4">
              <Image src="/media/logo-nav-dark.png" alt="Poseidon's Eden" width={280} height={96} className="h-10 w-auto" />
              <button type="button" onClick={() => setMobile(false)} aria-label="Close menu" className="flex h-10 w-10 items-center justify-center rounded-full">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={submit} className="px-4" role="search">
              <label htmlFor="mobile-search" className="sr-only">
                Search the shop
              </label>
              <div className="flex items-center gap-2 rounded-full border border-line bg-tile px-4">
                <MagnifyingGlass size={18} className="text-ink-3" />
                <input
                  id="mobile-search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search the shop"
                  className="h-12 w-full bg-transparent outline-none placeholder:text-ink-3"
                />
              </div>
            </form>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {categories.map((c) => (
                <li key={c.handle}>
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 text-lg font-medium">
                      {c.name}
                      <CaretDown size={16} className="transition-transform group-open:rotate-180" />
                    </summary>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 pb-5">
                      <li className="col-span-2">
                        <Link href={`/category/${c.handle}`} className="font-medium text-coral">
                          Shop all {lowerName(c.name)}
                        </Link>
                      </li>
                      {c.children.map((s) => (
                        <li key={s.handle}>
                          <Link href={`/category/${s.handle}`} className="text-[15px] text-ink-2">
                            {s.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
            <ul className="space-y-3 px-4 py-6 text-[15px]">
              <li><Link href="/journal">Journal</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/about">About us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
