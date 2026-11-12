import Link from "next/link";
import Image from "next/image";
import { SITE, BIG_CATEGORIES } from "@/lib/site";
import type { NavCategory } from "./header";

export function Footer({ categories }: { categories: NavCategory[] }) {
  const ordered = BIG_CATEGORIES.map((b) => categories.find((c) => c.handle === b.handle)).filter(Boolean) as NavCategory[];
  return (
    <footer data-tone="dark" className="relative bg-deep text-foam">
      <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-20 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.3fr_2fr]">
          <div>
            <Image src="/media/logo-wordmark.png" alt="Poseidon's Eden" width={1513} height={519} className="h-auto w-56" />
            <p className="mt-4 max-w-sm text-foam-2">
              Corals, marine and freshwater fish, plants and everything your aquarium needs, from our tanks to yours.
            </p>
            <div className="mt-8 space-y-1 text-[15px]">
              <a href={`mailto:${SITE.email}`} className="block hover:text-white">{SITE.email}</a>
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="block hover:text-white">{SITE.phone}</a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-white">Shop</p>
              <ul className="mt-4 space-y-2 text-[15px] text-foam-2">
                {ordered.slice(0, 5).map((c) => (
                  <li key={c.handle}><Link href={`/category/${c.handle}`} className="hover:text-white">{c.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">More to shop</p>
              <ul className="mt-4 space-y-2 text-[15px] text-foam-2">
                {ordered.slice(5).map((c) => (
                  <li key={c.handle}><Link href={`/category/${c.handle}`} className="hover:text-white">{c.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Help</p>
              <ul className="mt-4 space-y-2 text-[15px] text-foam-2">
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/journal" className="hover:text-white">Journal</Link></li>
                <li><Link href="/about" className="hover:text-white">About us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-2 border-t border-deep-3 pt-6 text-sm text-foam-2 md:flex-row md:justify-between">
          <p>&copy; {new Date().getFullYear()} Poseidon&rsquo;s Eden</p>
          <p>Livestock ships within Australia.</p>
        </div>
      </div>
    </footer>
  );
}
