import { describe, it, expect } from "vitest";
import { getCampaignTracking } from "./campaign";

function setup() {
  const values = new Map<string, string>();
  let consent = { necessary: true, campaign: true, analytics: true, savedAt: "2026-10-14" };
  const browser = { location: { search: "?utm_source=googleads&utm_campaign=gepek&gclid=test-click", hostname: "www.iparikalkulator.hu" },
    document: { referrer: "https://google.com/search?q=compressor" },
    localStorage: { getItem: () => JSON.stringify(consent) },
    sessionStorage: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } }
  };
  return { browser, values, deny: () => { consent = { ...consent, campaign: false, analytics: false }; } };
}
type Target = NonNullable<Parameters<typeof getCampaignTracking>[1]>;
describe("campaign continuity with consent", () => {
  it("preserves the paid entry during navigation and removes referrer query data", () => {
    const { browser } = setup();
    const first = getCampaignTracking({}, browser as unknown as Target, 1000);
    expect(first).toMatchObject({ gclid: "test-click", utmCampaign: "gepek", referrer: "https://google.com/search" });
    browser.location.search = ""; browser.document.referrer = "https://www.iparikalkulator.hu/";
    expect(getCampaignTracking({}, browser as unknown as Target, 2000)).toMatchObject({ gclid: "test-click", utmCampaign: "gepek" });
  });
  it("does not reuse attribution after consent withdrawal or expiry", () => {
    const { browser, deny, values } = setup();
    getCampaignTracking({}, browser as unknown as Target, 1000);
    browser.location.search = ""; browser.document.referrer = "";
    expect(getCampaignTracking({}, browser as unknown as Target, 2000000)).toEqual({});
    browser.location.search = "?gclid=new-click";
    getCampaignTracking({}, browser as unknown as Target, 2001000);
    deny(); browser.location.search = "";
    expect(getCampaignTracking({}, browser as unknown as Target, 2002000)).toEqual({});
    expect(values.size).toBe(0);
  });
  it("does not combine a new campaign with a previous click ID", () => {
    const { browser } = setup();
    getCampaignTracking({}, browser as unknown as Target, 1000);
    browser.location.search = "?utm_source=email&utm_campaign=ugyfelek";
    const next = getCampaignTracking({}, browser as unknown as Target, 2000);
    expect(next.utmSource).toBe("email"); expect(next.gclid).toBeUndefined();
  });
});
