"use client";

import { useEffect } from "react";
import { readCookiePreferences, trackBlogEvent } from "@/lib/tracking/google";
import type { BlogSlug, ContentAction } from "@/lib/content-context";

export function BlogEngagement({ slug }: { slug: BlogSlug }) {
  useEffect(() => {
    let viewed = false;
    let engaged = false;
    let consented = false;
    let visibleMilliseconds = 0;
    let lastTick = Date.now();
    const consentChanged = () => {
      try { consented = readCookiePreferences(window.localStorage)?.analytics === true; } catch { consented = false; }
      if (!viewed && consented) viewed = trackBlogEvent("article_view", slug);
      lastTick = Date.now();
    };
    const tick = () => {
      const now = Date.now();
      if (consented && document.visibilityState === "visible") visibleMilliseconds += Math.min(now - lastTick, 2000);
      lastTick = now;
      const article = document.querySelector<HTMLElement>("[data-blog-article]");
      if (!article || engaged || !consented || visibleMilliseconds < 45000) return;
      const bounds = article.getBoundingClientRect();
      if (bounds.height > 0 && (window.innerHeight - bounds.top) / bounds.height >= 0.5) {
        engaged = trackBlogEvent("article_engaged", slug);
      }
    };
    const clicked = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[data-blog-action]") : null;
      if (!link) return;
      const action = link.dataset.blogAction;
      if (action === "next_article") {
        trackBlogEvent("blog_next_article_click", slug, { action, destination: link.dataset.blogDestination });
      } else if (["calculator", "quote", "service"].includes(action ?? "")) {
        trackBlogEvent("blog_cta_click", slug, { action: action as ContentAction, placement: link.dataset.blogPlacement });
      }
    };
    consentChanged();
    const timer = window.setInterval(tick, 1000);
    window.addEventListener("ipari:consent-change", consentChanged);
    window.addEventListener("storage", consentChanged);
    document.addEventListener("click", clicked, { passive: true });
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("ipari:consent-change", consentChanged);
      window.removeEventListener("storage", consentChanged);
      document.removeEventListener("click", clicked);
    };
  }, [slug]);
  return null;
}
