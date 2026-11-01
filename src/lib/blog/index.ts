import { absoluteUrl, siteName } from "@/lib/seo";
import { blogPosts } from "./posts";
import type { BlogPost } from "./types";

export { blogPosts };
export { blogSources } from "./types";
export { buyerPaths, buyerRoleLabels, blogStageLabels } from "./journeys";
export type { BlogPost, BlogSection, BlogStage, BuyerRole } from "./types";

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function blogPostPath(post: Pick<BlogPost, "slug">): `/blog/${string}` {
  return `/blog/${post.slug}`;
}

export function getReadingMinutes(post: BlogPost) {
  const text = [post.title, post.journey.quickAnswer, post.journey.outcome, ...post.journey.checklist, ...post.intro, ...post.takeaways,
    ...post.sections.flatMap((section) => [section.title, ...section.paragraphs,
      ...(section.bullets ?? []), section.formula ?? "",
      ...(section.table?.rows.flat() ?? [])]),
    ...post.faq.flatMap((item) => [item.question, item.answer])].join(" ");
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 180));
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric", month: "long", day: "numeric", timeZone: "Europe/Budapest"
  }).format(new Date(`${date}T12:00:00+01:00`));
}

export function buildBlogPostJsonLd(post: BlogPost) {
  const url = absoluteUrl(blogPostPath(post));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        datePublished: `${post.publishedAt}T12:00:00+01:00`,
        dateModified: `${post.updatedAt}T12:00:00+01:00`,
        isAccessibleForFree: true,
        inLanguage: "hu-HU",
        articleSection: post.category,
        mainEntityOfPage: url,
        image: absoluteUrl("/images/industrial-compressor-og.jpg"),
        author: { "@type": "Organization", name: siteName, url: absoluteUrl("/") },
        publisher: { "@type": "Organization", name: siteName, url: absoluteUrl("/") },
        isPartOf: { "@type": "Blog", "@id": absoluteUrl("/blog#blog"), name: "Csavarkompresszor tudástár", url: absoluteUrl("/blog") }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Kalkulátor", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Tudástár", item: absoluteUrl("/blog") },
          { "@type": "ListItem", position: 3, name: post.title, item: url }
        ]
      }
    ]
  };
}
