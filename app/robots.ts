import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/postbox", "/sitemap.xml", "/favicon.ico", "/assets/"],
      disallow: ["/private/", "/api/"],
    },
    sitemap: `https://postbox-pantho.vercel.app/sitemap.xml`,
  };
}