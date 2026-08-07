import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Only the public marketing page belongs in the sitemap — /login, /register,
// and everything under /dashboard are noindexed (see their layout.tsx files)
// and intentionally left out here too.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
