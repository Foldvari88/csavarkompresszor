import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/koszonjuk"]
      },
      {
        userAgent: ["Googlebot", "Bingbot", "OAI-SearchBot", "PerplexityBot"],
        allow: "/",
        disallow: ["/admin", "/api", "/koszonjuk"]
      }
    ],
    sitemap: absoluteUrl("/sitemap.xml")
  };
}
