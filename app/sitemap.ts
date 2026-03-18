import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://postbox-pantho.vercel.app",
      lastModified: new Date(),
    },
    {
      url: "https://postbox-pantho.vercel.app/postbox",
      lastModified: new Date(),
    },
  ];
}