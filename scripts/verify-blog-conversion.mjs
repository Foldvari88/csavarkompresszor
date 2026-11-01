import assert from "node:assert/strict";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";

// This targeted check uses Node's existing TypeScript support, without installing project dependencies.
const root = new URL("../", import.meta.url);
registerHooks({
  resolve(specifier, context, nextResolve) {
    let candidate;
    if (specifier.startsWith("@/")) candidate = new URL(`src/${specifier.slice(2)}`, root);
    else if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) candidate = new URL(specifier, context.parentURL);
    if (candidate && !/\.(?:mjs|js|ts|json)$/.test(candidate.pathname)) {
      const file = new URL(`${candidate.href}.ts`);
      const index = new URL(`${candidate.href}/index.ts`);
      if (existsSync(fileURLToPath(file))) return nextResolve(file.href, context);
      if (existsSync(fileURLToPath(index))) return nextResolve(index.href, context);
    }
    return nextResolve(specifier, context);
  }
});

const { blogPosts } = await import("../src/lib/blog/posts.ts");
const { buyerPaths } = await import("../src/lib/blog/journeys.ts");
const { blogContextCatalog, parseContentContext, normalizeContentContext, contentDestination, calculatorThankYouPath } = await import("../src/lib/content-context.ts");
const { getCampaignTracking } = await import("../src/lib/tracking/campaign.ts");
const { trackBlogEvent, trackSuccessfulLead, COOKIE_PREFERENCES_STORAGE_KEY } = await import("../src/lib/tracking/google.ts");

const checks = [];
function check(name, action) {
  action(); checks.push({ name, status: "passed" });
}
const wordCounts = [];
check("Exactly ten distinct articles and matching attribution catalog", () => {
  assert.equal(blogPosts.length, 10);
  assert.equal(new Set(blogPosts.map(p => p.slug)).size, 10);
  assert.deepEqual(blogPosts.map(p => p.slug).sort(), Object.keys(blogContextCatalog).sort());
});
check("Every article has unique buyer copy, an actionable checklist and valid next step", () => {
  for (const post of blogPosts) {
    assert.equal(post.journey.stage, blogContextCatalog[post.slug].stage);
    assert.equal(post.journey.offer, blogContextCatalog[post.slug].offer);
    assert.ok(post.journey.audience.length);
    assert.equal(post.journey.checklist.length, 3);
    assert.ok(post.journey.objections.length >= 2);
    assert.ok(post.sections.length >= 6);
    assert.equal(new Set(post.sections.map(s => s.id)).size, post.sections.length);
    assert.ok(blogPosts.some(p => p.slug === post.journey.nextSlug));
    assert.notEqual(post.slug, post.journey.nextSlug);
    for (const related of post.relatedSlugs) assert.ok(blogPosts.some(p => p.slug === related));
    assert.ok(post.seoTitle.length <= 65, `${post.slug}: SEO title too long`);
    assert.ok(post.description.length <= 180, `${post.slug}: description too long`);
    const body = [post.title, post.journey.quickAnswer, post.journey.outcome, ...post.intro,
      ...post.takeaways, ...post.sections.flatMap(s => [s.title, ...s.paragraphs, ...(s.bullets ?? [])]),
      ...post.faq.flatMap(f => [f.question, f.answer]), ...post.journey.checklist,
      post.journey.midCta.title, post.journey.midCta.text, post.cta.title, post.cta.text,
      post.journey.offerText].join(" ");
    const words = body.split(/\s+/).length;
    assert.ok(words >= 750, `${post.slug}: insufficient substantive content (${words})`);
    assert.ok(!body.includes("\uFFFD"), `${post.slug}: broken UTF-8`);
    wordCounts.push({ slug: post.slug, words, stage: post.journey.stage });
  }
  for (const field of ["title", "quickAnswer", "outcome"]) {
    assert.equal(new Set(blogPosts.map(p => p.journey[field])).size, 10, `${field} is generic or repeated`);
  }
});
check("All three buyer paths use real articles and progress toward a decision", () => {
  assert.equal(buyerPaths.length, 3);
  for (const path of buyerPaths) {
    assert.equal(path.slugs.length, 3);
    for (const slug of path.slugs) assert.ok(blogPosts.some(p => p.slug === slug));
  }
  for (const post of blogPosts) {
    let current = post;
    const seen = new Set();
    while (current.journey.stage !== "decision") {
      assert.ok(!seen.has(current.slug), `Non-converting reading loop at ${post.slug}`);
      seen.add(current.slug);
      current = blogPosts.find(p => p.slug === current.journey.nextSlug);
      assert.ok(current);
    }
  }
});
check("Every CTA retains article context and reaches the intended form or calculator", () => {
  for (const post of blogPosts) {
    for (const action of ["calculator", "quote", "service"]) {
      const url = new URL(contentDestination(post.slug, action), "https://www.iparikalkulator.hu");
      assert.equal(url.origin, "https://www.iparikalkulator.hu");
      assert.equal(url.searchParams.size, 2);
      assert.equal(url.searchParams.get("utm_source"), null);
      assert.equal(parseContentContext(url.search)?.blogSlug, post.slug);
      assert.equal(url.hash, action === "calculator" ? "#kalkulator" : "#ajanlatkeres");
      assert.equal(url.pathname, action === "calculator" ? "/" : action === "quote" ? "/kompresszor-csere-ajanlat" : "/kompresszor-szerviz-ajanlat");
    }
  }
});
check("Unknown article identifiers, unsafe actions and forged stages cannot enter the journey", () => {
  for (const slug of ["__proto__", "constructor", "https://external.example", "user@example.com", "missing-article"]) {
    assert.equal(parseContentContext(`blog=${encodeURIComponent(slug)}&blog_action=quote`), null);
  }
  assert.equal(parseContentContext("blog=kompresszor-kalkulator-adatok&blog_action=external"), null);
  assert.equal(normalizeContentContext({ blogSlug: "kompresszor-kalkulator-adatok", blogAction: "quote", blogStage: "discovery" }).blogStage, "decision");
});
check("Report thank-you pages retain the public article context, without personal URL data", () => {
  const source = "?blog=kompresszor-kalkulator-adatok&blog_action=calculator&email=person@example.com&gclid=secret";
  const destination = new URL(calculatorThankYouPath(source, true), "https://www.iparikalkulator.hu");
  assert.equal(destination.searchParams.get("email"), "kesik");
  assert.equal(destination.searchParams.get("blog"), "kompresszor-kalkulator-adatok");
  assert.equal(destination.searchParams.get("gclid"), null);
  assert.ok(!destination.href.includes("person%40"));
  assert.equal(calculatorThankYouPath("", false), "/koszonjuk");
});

function makeBrowser(analytics = true, campaign = true) {
  const session = new Map();
  const events = [];
  let consent = { necessary: true, analytics, campaign, savedAt: "2026-11-01T12:00:00.000Z" };
  const browser = {
    location: { hostname: "www.iparikalkulator.hu", pathname: "/", search: "?utm_source=googleads&utm_campaign=gepek&gclid=original-click" },
    document: { referrer: "https://google.com/search?q=private-query" },
    localStorage: { getItem: key => key === COOKIE_PREFERENCES_STORAGE_KEY ? JSON.stringify(consent) : null },
    sessionStorage: { getItem: key => session.get(key) ?? null, setItem: (key, value) => session.set(key, value), removeItem: key => session.delete(key) },
    gtag: (...args) => events.push(args), dataLayer: []
  };
  return { browser, session, events, setConsent: (analytics, campaign) => { consent = { ...consent, analytics, campaign }; } };
}
check("Paid campaign attribution survives article → calculator → quote navigation", () => {
  const { browser } = makeBrowser();
  getCampaignTracking({}, browser, 1000);
  browser.location.search = "?blog=csavarkompresszor-csere-megterulese&blog_action=calculator";
  browser.document.referrer = "https://www.iparikalkulator.hu/blog/csavarkompresszor-csere-megterulese";
  const calculator = getCampaignTracking({}, browser, 2000);
  assert.equal(calculator.gclid, "original-click"); assert.equal(calculator.utmSource, "googleads");
  assert.equal(calculator.blogSlug, "csavarkompresszor-csere-megterulese");
  browser.location.search = "?blog=csavarkompresszor-csere-megterulese&blog_action=quote";
  const quote = getCampaignTracking({}, browser, 3000);
  assert.equal(quote.blogAction, "quote"); assert.equal(quote.gclid, "original-click");
  assert.equal(quote.referrer, "https://google.com/search");
});
check("A new external campaign starts clean, without stale ad IDs or article attribution", () => {
  const { browser } = makeBrowser();
  getCampaignTracking({}, browser, 1000);
  browser.location.search = "?blog=kompresszor-kalkulator-adatok&blog_action=calculator";
  getCampaignTracking({}, browser, 2000);
  browser.location.search = "?utm_source=email&utm_campaign=uj";
  const next = getCampaignTracking({}, browser, 3000);
  assert.equal(next.gclid, undefined); assert.equal(next.blogSlug, undefined); assert.equal(next.utmSource, "email");
});
check("Refusing or withdrawing consent clears stored content and ad attribution", () => {
  const { browser, session, setConsent } = makeBrowser();
  getCampaignTracking({}, browser, 1000);
  browser.location.search = "?blog=kompresszor-kalkulator-adatok&blog_action=quote";
  getCampaignTracking({}, browser, 2000);
  setConsent(false, false);
  const result = getCampaignTracking({ blogSlug: "kompresszor-kalkulator-adatok", gclid: "default-id" }, browser, 3000);
  assert.equal(result.blogSlug, undefined); assert.equal(result.gclid, undefined); assert.equal(session.size, 0);
});
check("Analytics-only consent preserves content attribution without advertising identifiers", () => {
  const { browser } = makeBrowser(true, false);
  browser.location.search = "?blog=kompresszor-kalkulator-adatok&blog_action=quote&gclid=blocked";
  const result = getCampaignTracking({}, browser, 1000);
  assert.equal(result.blogSlug, "kompresszor-kalkulator-adatok"); assert.equal(result.gclid, undefined);
});
check("Article attribution expires with the existing 30-minute session", () => {
  const { browser } = makeBrowser();
  browser.location.search = "?blog=kompresszor-kalkulator-adatok&blog_action=calculator";
  getCampaignTracking({}, browser, 1000);
  browser.location.search = ""; browser.document.referrer = "";
  assert.equal(getCampaignTracking({}, browser, 1801001).blogSlug, undefined);
});
check("Article events require analytics consent and never count as leads", () => {
  const { browser, events, setConsent } = makeBrowser(false, false);
  assert.equal(trackBlogEvent("blog_cta_click", "kompresszor-kalkulator-adatok", { action: "quote" }, browser), false);
  assert.equal(events.length, 0);
  setConsent(true, false);
  assert.equal(trackBlogEvent("blog_cta_click", "kompresszor-kalkulator-adatok", { action: "quote", placement: "closing" }, browser), true);
  assert.equal(events[0][1], "blog_cta_click");
  assert.equal(events[0][2].content_stage, "decision");
  assert.ok(!events.some(e => ["generate_lead", "conversion"].includes(e[1])));
  browser.location.pathname = "/admin";
  assert.equal(trackBlogEvent("article_view", "kompresszor-kalkulator-adatok", {}, browser), false);
});
check("Actual successful leads receive article context once, with no click-based fake conversion", () => {
  const { browser, events } = makeBrowser();
  const lead = { leadId: "qa-stored-lead", formType: "compressor-replacement", contentContext: { blogSlug: "kompresszor-kalkulator-adatok", blogStage: "decision", blogAction: "quote" } };
  assert.equal(trackSuccessfulLead(lead, browser), true);
  assert.equal(trackSuccessfulLead(lead, browser), false);
  const generated = events.filter(e => e[0] === "event" && e[1] === "generate_lead");
  assert.equal(generated.length, 1); assert.equal(generated[0][2].content_slug, lead.contentContext.blogSlug);
  const refused = makeBrowser(false, false);
  trackSuccessfulLead({ ...lead, leadId: "qa-second-lead" }, refused.browser);
  assert.equal(refused.events.find(e => e[1] === "generate_lead")[2].content_slug, undefined);
});
check("Public article scripts cannot introduce mail sends or forced navigation", () => {
  const client = readFileSync(new URL("src/components/blog-engagement.tsx", root), "utf8");
  assert.ok(!client.includes("preventDefault")); assert.ok(!client.includes("generate_lead"));
  assert.ok(client.includes("passive: true")); assert.ok(client.includes("45000"));
});

const report = { generatedAt: new Date().toISOString(), checks, articles: wordCounts, passed: checks.length, failed: 0 };
console.log(JSON.stringify(report, null, 2));
const reportPath = process.argv.find(arg => arg.startsWith("--report="))?.slice(9);
if (reportPath) writeFileSync(reportPath, JSON.stringify(report, null, 2));
