"use client";

import { useMemo, useSyncExternalStore } from "react";
import { blogContextCatalog, parseContentContext, type ContentContext } from "@/lib/content-context";
import "./content-entry.css";

function subscribeToNavigation(listener: () => void) {
  window.addEventListener("popstate", listener);
  return () => window.removeEventListener("popstate", listener);
}
const browserSearch = () => window.location.search;
const serverSearch = () => "";

export function useContentContext(): ContentContext | null {
  const search = useSyncExternalStore(subscribeToNavigation, browserSearch, serverSearch);
  return useMemo(() => parseContentContext(search), [search]);
}

export function ContentEntryNotice({ mode }: { mode: "calculator" | "offer" }) {
  const context = useContentContext();
  if (!context) return null;
  return (
    <aside className="content-entry-note" aria-label="A cikkhez kapcsolódó saját következő lépés">
      <strong>{mode === "calculator" ? "A cikk után most a saját gépe következik" : "A cikk témájáról egyeztetne?"}</strong>
      <p>Téma: {blogContextCatalog[context.blogSlug].topic}.</p>
      <span>{mode === "calculator"
        ? "Hat adatból indulhat: márka, kW, gépkor, éves üzemóra, saját áramár és terhelés. A részletes riportot e-mailben is kérheti; ehhez telefon nem kötelező."
        : "A témát az üzenetben előkészítettük. Egészítse ki a saját gépével és kérdésével. Az első egyeztetéshez nem szükséges minden műszaki adatot ismernie."}</span>
    </aside>
  );
}
