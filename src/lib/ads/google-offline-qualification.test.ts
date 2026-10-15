import { describe, expect, it, vi } from "vitest";
import type { LeadRecord } from "@/lib/calculator/types";
import { getGoogleOfflineQualification, qualificationInputSchema } from "./google-offline-qualification";
import { getLeadAdQuality } from "./offline-conversions";

function fixture(): LeadRecord {
  return {
    id: "qualification-test", createdAt: "2026-10-14T09:00:00Z", status: "new", customerRating: 5,
    input: { email: "test@example.com", phone: "+36700000000", companyName: "AUDIT TESZT", tracking: { gclid: "synthetic-click" },
      measurementConsent: { campaign: true, savedAt: "2026-10-14T08:59:00Z" } },
    result: { annualHufSaved: 50_000_000, leadScore: { score: 100 } }
  } as unknown as LeadRecord;
}
const now = Date.parse("2026-10-15T10:00:00Z");
function qualified(): LeadRecord {
  return { ...fixture(), adQualification: { qualifiedAt: "2026-10-15T08:00:00Z", recordedAt: "2026-10-15T08:30:00Z", valueHuf: 12_000 } };
}

describe("Google offline sales qualification", () => {
  it("never qualifies a new lead from score, rating or savings alone", () => {
    expect(getGoogleOfflineQualification(fixture(), now).blockReason).toBe("missing_sales_qualification");
    expect(getLeadAdQuality(fixture()).readyForGoogleAds).toBe(false);
  });
  it("uses the actual qualification time and manually entered value", () => {
    expect(getGoogleOfflineQualification(qualified(), now)).toMatchObject({ ready: true, qualifiedAt: "2026-10-15T08:00:00Z", valueHuf: 12000 });
  });
  it("leaves monetary value absent unless it was explicitly entered", () => {
    const lead = qualified(); delete lead.adQualification!.valueHuf;
    expect(getGoogleOfflineQualification(lead, now)).toMatchObject({ ready: true, valueHuf: null });
  });
  it("requires recorded ad consent, not just an imported click ID", () => {
    const lead = qualified(); delete lead.input.measurementConsent;
    expect(getGoogleOfflineQualification(lead, now)).toMatchObject({ ready: false, hasConsent: false, blockReason: "missing_ad_consent_record" });
    lead.input.measurementConsent = { campaign: false, savedAt: "2026-10-14T08:59:00Z" };
    expect(getGoogleOfflineQualification(lead, now).ready).toBe(false);
  });
  it("rejects impossible qualification times and a future consent record", () => {
    const lead = qualified();
    for (const date of ["2026-10-13T08:00:00Z", "2026-10-16T08:00:00Z", "not-a-date"]) {
      lead.adQualification!.qualifiedAt = date;
      expect(getGoogleOfflineQualification(lead, now).blockReason).toBe("invalid_qualification");
    }
    lead.adQualification = qualified().adQualification;
    lead.input.measurementConsent!.savedAt = "2026-10-16T08:00:00Z";
    expect(getGoogleOfflineQualification(lead, now).ready).toBe(false);
  });
  it("excludes lost leads and leads without a Google click ID", () => {
    const lead = qualified(); lead.status = "lost";
    expect(getGoogleOfflineQualification(lead, now).blockReason).toBe("lost_lead");
    lead.status = "contacted"; lead.input.tracking = {};
    expect(getGoogleOfflineQualification(lead, now).blockReason).toBe("missing_google_click_id");
  });
  it("does not accept negative, infinite or oversized manual values", () => {
    for (const valueHuf of [-1, Infinity, 1_000_000_001]) {
      expect(qualificationInputSchema.safeParse({ qualified: true, qualifiedAt: "2026-10-15T08:00:00Z", valueHuf }).success).toBe(false);
    }
  });
});

vi.mock("@/lib/leads/store", () => ({ listLeads: vi.fn() }));
import { listLeads } from "@/lib/leads/store";
import { GET } from "@/app/admin/google-ads-export/route";

describe("Google qualification review CSV", () => {
  it("never exports a fabricated conversion value or submission time as qualification time", async () => {
    vi.useFakeTimers(); vi.setSystemTime(now);
    try {
      const accepted = qualified(); accepted.id = "qualified-row"; delete accepted.adQualification!.valueHuf;
      const legacy = qualified(); legacy.id = "legacy-row"; delete legacy.input.measurementConsent;
      vi.mocked(listLeads).mockResolvedValue([fixture(), accepted, legacy]);
      const csv = await (await GET()).text();
      const lines = csv.split("\n").map(line => line.slice(1, -1).split('\",\"'));
      const read = (row: number, field: string) => lines[row][lines[0].indexOf(field)];
      expect(read(1, "readyForGoogleAds")).toBe("false");
      expect(read(1, "conversionName")).toBe("");
      expect(read(1, "conversionValue")).toBe("");
      expect(read(2, "readyForGoogleAds")).toBe("true");
      expect(read(2, "conversionDateTime")).toBe("2026-10-15 10:00:00+02:00");
      expect(read(2, "conversionValue")).toBe("");
      expect(read(2, "hashedEmailSha256")).toHaveLength(64);
      expect(read(3, "gclid")).toBe("");
      expect(read(3, "hashedEmailSha256")).toBe("");
      expect(read(3, "hashedPhoneSha256")).toBe("");
      expect(read(3, "exportBlockReason")).toBe("missing_ad_consent_record");
    } finally { vi.useRealTimers(); }
  });
});
