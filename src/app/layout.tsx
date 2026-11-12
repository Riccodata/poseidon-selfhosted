import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { Header, type NavCategory } from "@/components/header";
import { Footer } from "@/components/footer";
import { DepthGauge } from "@/components/depth-gauge";
import { getCategoryTree } from "@/lib/medusa";
import { BIG_CATEGORIES, SITE } from "@/lib/site";

const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-schibsted",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Poseidon's Eden | Corals, Fish, Plants and Aquarium Supplies", template: "%s | Poseidon's Eden" },
  description:
    "Corals, marine and freshwater fish, aquarium plants, equipment and supplies, hand-picked and cared for before they ship.",
  /* Not launched yet: keep the whole site out of search engines until the owner switches it on. */
  robots: { index: false, follow: false },
  openGraph: { siteName: "Poseidon's Eden", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#08161b",
};

async function navCategories(): Promise<NavCategory[]> {
  try {
    const { byHandle } = await getCategoryTree();
    return BIG_CATEGORIES.map((b) => byHandle.get(b.handle))
      .filter(Boolean)
      .map((c) => ({
        name: c!.name,
        handle: c!.handle,
        children: [...c!.children]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((s) => ({ name: s.name, handle: s.handle })),
      }));
  } catch {
    return [];
  }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const categories = await navCategories();
  return (
    <html lang="en-AU" className={sans.variable}>
      <body className="min-h-dvh bg-paper text-ink">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <Header categories={categories} />
        <main id="main">{children}</main>
        <Footer categories={categories} />
        <DepthGauge />
      </body>
    </html>
  );
}
