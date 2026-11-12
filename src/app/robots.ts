import type { MetadataRoute } from "next";

/* Not launched: keep crawlers out until the owner switches the site on (also set per page in layout). */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
