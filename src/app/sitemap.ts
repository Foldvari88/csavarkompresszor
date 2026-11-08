import type { MetadataRoute } from "next";
import { absoluteUrl, coreSeoRoutes, legalRoutes } from "@/lib/seo";
import { blogPosts, blogPostPath } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl("/blog"),
      lastModified: blogPosts.reduce((latest, post) => post.updatedAt > latest ? post.updatedAt : latest, blogPosts[0].updatedAt),
      changeFrequency: "daily",
      priority: 0.8
    },
    ...blogPosts.map((post) => ({
      url: absoluteUrl(blogPostPath(post)),
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7
    })),
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

