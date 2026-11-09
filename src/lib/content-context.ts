// Public editorial identifiers only. Keep this catalog small enough for form clients.
export const blogContextCatalog = {
  "csavarkompresszor-karbantartas-szervizterv": { topic: "a csavarkompresszor karbantartásának megtervezése", stage: "discovery", offer: "service" },
  "hutveszarito-vagy-adszorpcios-szarito": { topic: "a sűrített levegő szárításának kiválasztása", stage: "comparison", offer: "replacement" },
  "csavarkompresszor-nyomdaba": { topic: "a nyomda sűrítettlevegő-ellátása", stage: "comparison", offer: "replacement" },
  "csavarkompresszor-autoszervizbe": { topic: "az autószerviz kompresszorának kiválasztása", stage: "comparison", offer: "replacement" },
  "csavarkompresszor-elelmiszeriparba": { topic: "az élelmiszeripari üzem levegőellátási igénye", stage: "decision", offer: "replacement" },
  "csavarkompresszor-faipari-muhelybe": { topic: "a faipari műhely sűrítettlevegő-igénye", stage: "comparison", offer: "replacement" },
  "csavarkompresszor-csomagolouzembe": { topic: "a csomagolóüzem levegőellátása", stage: "comparison", offer: "replacement" },
  "csavarkompresszor-muanyag-feldolgozas": { topic: "a műanyag-feldolgozó üzem működtető levegője", stage: "comparison", offer: "replacement" },
  "csavarkompresszor-cnc-muhelybe": { topic: "a CNC-műhely kompresszorának kiválasztása", stage: "comparison", offer: "replacement" },
  "csavarkompresszor-aramfogyasztas-szamitasa": { topic: "a kompresszor éves áramköltsége", stage: "discovery", offer: "replacement" },
  "csavarkompresszor-csere-megterulese": { topic: "a kompresszorcsere megtérülése", stage: "decision", offer: "replacement" },
  "fix-vagy-vsd-csavarkompresszor": { topic: "a fix és az RS/VSD gép összehasonlítása", stage: "comparison", offer: "replacement" },
  "suritett-levego-szivargas-koltsege": { topic: "a sűrített levegő veszteségeinek feltárása", stage: "discovery", offer: "service" },
  "kompresszor-uzemi-nyomas-energiakoltseg": { topic: "az üzemi nyomás és az energiaköltség", stage: "discovery", offer: "service" },
  "csavarkompresszor-hovisszanyeres": { topic: "a kompresszor hővisszanyerése", stage: "comparison", offer: "replacement" },
  "csavarkompresszor-meretezes-hibak": { topic: "a kompresszor helyes méretezése", stage: "comparison", offer: "replacement" },
  "suritett-levego-energiaaudit-elokeszites": { topic: "a sűrített levegő rendszerének felmérése", stage: "comparison", offer: "replacement" },
  "csavarkompresszor-teljes-elettartam-koltseg": { topic: "a kompresszor teljes üzemeltetési költsége", stage: "decision", offer: "replacement" },
  "kompresszor-kalkulator-adatok": { topic: "a saját kompresszor előkalkulációja", stage: "decision", offer: "replacement" }
} as const;

export type BlogSlug = keyof typeof blogContextCatalog;
export type ContentAction = "calculator" | "quote" | "service";
export type ContentContext = { blogSlug: BlogSlug; blogStage: "discovery" | "comparison" | "decision"; blogAction: ContentAction };

export function isBlogSlug(value: unknown): value is BlogSlug {
  return typeof value === "string" && Object.hasOwn(blogContextCatalog, value);
}

export function parseContentContext(search: string | URLSearchParams): ContentContext | null {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  const slug = params.get("blog");
  const action = params.get("blog_action");
  if (!isBlogSlug(slug) || !["calculator", "quote", "service"].includes(action ?? "")) return null;
  return { blogSlug: slug, blogStage: blogContextCatalog[slug].stage, blogAction: action as ContentAction };
}

export function normalizeContentContext(value: { blogSlug?: unknown; blogAction?: unknown }): ContentContext | null {
  if (!isBlogSlug(value.blogSlug) || typeof value.blogAction !== "string") return null;
  return parseContentContext(new URLSearchParams({ blog: value.blogSlug, blog_action: value.blogAction }));
}

export function contentDestination(slug: BlogSlug, action: ContentAction) {
  const query = new URLSearchParams({ blog: slug, blog_action: action }).toString();
  if (action === "calculator") return `/?${query}#kalkulator` as const;
  if (action === "service") return `/kompresszor-szerviz-ajanlat?${query}#ajanlatkeres` as const;
  return `/kompresszor-csere-ajanlat?${query}#ajanlatkeres` as const;
}

export function calculatorThankYouPath(search: string, emailDelayed: boolean): "/koszonjuk" | `/koszonjuk?${string}` {
  const context = parseContentContext(search);
  const query = new URLSearchParams();
  if (emailDelayed) query.set("email", "kesik");
  if (context) {
    query.set("blog", context.blogSlug);
    query.set("blog_action", context.blogAction);
  }
  if (query.size) return `/koszonjuk?${query}`;
  return "/koszonjuk";
}
