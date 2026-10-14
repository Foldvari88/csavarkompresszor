import type { CampaignTracking } from "@/lib/calculator/types";
import { readCookiePreferences } from "./google";

const STORAGE_KEY = "ipari-campaign-session-v1";
const MAX_AGE_MS = 30 * 60 * 1000;
const fields = {
  utmSource: "utm_source", utmMedium: "utm_medium", utmCampaign: "utm_campaign",
  utmContent: "utm_content", utmTerm: "utm_term", gclid: "gclid", gbraid: "gbraid",
  wbraid: "wbraid", liFatId: "li_fat_id"
} as const;

type CampaignBrowser = Pick<Window, "location" | "sessionStorage" | "localStorage"> & { document: Pick<Document, "referrer"> };

export function getCampaignTracking(defaults: CampaignTracking = {}, target?: CampaignBrowser, now = Date.now()): CampaignTracking {
  const browser = target ?? (typeof window === "undefined" ? undefined : window);
  if (!browser) return defaults;
  let consent: ReturnType<typeof readCookiePreferences> = null;
  try { consent = readCookiePreferences(browser.localStorage); } catch { /* Storage blocked. */ }
  const params = new URLSearchParams(browser.location.search);
  const current: CampaignTracking = {};
  for (const [key, query] of Object.entries(fields)) {
    const value = params.get(query) ?? (key === "liFatId" ? params.get("liFatId") : null);
    if (value && !/^\{.+\}$/.test(value)) current[key as keyof CampaignTracking] = value.slice(0, key === "utmCampaign" ? 200 : key.startsWith("utm") ? 160 : 300);
  }
  try {
    const referrer = new URL(browser.document.referrer);
    if (referrer.hostname !== browser.location.hostname) current.referrer = `${referrer.origin}${referrer.pathname}`.slice(0, 500);
  } catch { /* No external referrer. */ }
  const saved: CampaignTracking = {};
  try {
    const raw = browser.sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed?.savedAt > now - MAX_AGE_MS && parsed?.savedAt <= now && parsed.tracking && typeof parsed.tracking === "object") {
      for (const key of [...Object.keys(fields), "referrer"]) {
        const value = parsed.tracking[key];
        if (typeof value === "string") saved[key as keyof CampaignTracking] = value.slice(0, key === "referrer" ? 500 : 300);
      }
    }
  } catch { /* Storage must never prevent a lead. */ }
  const hasCurrentCampaign = Object.keys(fields).some(key => Boolean(current[key as keyof CampaignTracking]));
  const result = hasCurrentCampaign ? current : { ...saved, ...current };
  if (consent?.analytics || consent?.campaign) {
    const persisted = { ...result };
    if (!consent.campaign) {
      delete persisted.gclid; delete persisted.gbraid; delete persisted.wbraid; delete persisted.liFatId;
      delete result.gclid; delete result.gbraid; delete result.wbraid; delete result.liFatId;
    }
    try { browser.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ savedAt: now, tracking: persisted })); } catch { /* Private browsing. */ }
  } else {
    try { browser.sessionStorage.removeItem(STORAGE_KEY); } catch { /* Private browsing. */ }
    // Never reuse previously stored attribution after consent has been withdrawn.
    return { ...defaults, ...current };
  }
  return { ...defaults, ...result };
}
