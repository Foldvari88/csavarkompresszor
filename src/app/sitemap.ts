import type { MetadataRoute } from "next";
import { absoluteUrl, coreSeoRoutes, legalRoutes } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...coreSeoRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority
    })),
    ...legalRoutes.map((path) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.35
    }))
  ];
}

