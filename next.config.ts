import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    /* Product photos: this store's folder in the shared R2 bucket. static.wixstatic.com stays allowed
       until every photo has been copied off Wix (migrate-images-to-storage on the backend). */
    remotePatterns: [
      { protocol: "https", hostname: "photos.hello-shop.app", pathname: "/poseidon/**" },
      { protocol: "https", hostname: "static.wixstatic.com", pathname: "/media/**" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [96, 160, 240, 320, 420, 560],
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    return [
      /* Old Wix paths, in case anyone kept a link from the preview */
      { source: "/category/all-products", destination: "/shop", permanent: true },
      { source: "/product-page/:handle", destination: "/products/:handle", permanent: true },
      { source: "/post/:slug", destination: "/journal/:slug", permanent: true },
      { source: "/blog", destination: "/journal", permanent: true },
      { source: "/terms-of-service", destination: "/terms", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/corals", destination: "/category/corals", permanent: false },
      { source: "/marine-fish", destination: "/category/marine-fish", permanent: false },
      { source: "/freshwater", destination: "/category/freshwater", permanent: false },
      { source: "/plants", destination: "/category/plants", permanent: false },
    ];
  },
};

export default nextConfig;
