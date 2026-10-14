import { describe, expect, it } from "vitest";

import { campaignInquiryInputSchema } from "./schema";

const baseInquiry = {
  kind: "service" as const,
  pageSource: "/kompresszor-szerviz-ajanlat",
  companyName: "Minta Ipari Kft.",
  name: "Minta Márton",
  consentPrivacy: true as const
};

describe("campaignInquiryInputSchema", () => {
  it("accepts an inquiry with only an email address", () => {
    const result = campaignInquiryInputSchema.safeParse({
      ...baseInquiry,
      email: "marton@example.com"
    });

    expect(result.success).toBe(true);
  });

  it("accepts an inquiry with only a Hungarian phone number", () => {
    const result = campaignInquiryInputSchema.safeParse({
      ...baseInquiry,
      phone: "+36301234567"
    });

    expect(result.success).toBe(true);
  });

  it("rejects an inquiry without an email address or phone number", () => {
    const result = campaignInquiryInputSchema.safeParse(baseInquiry);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining(["email", "phone"])
      );
    }
  });

  it("normalizes readable phone notation on the server too", () => {
    const result = campaignInquiryInputSchema.safeParse({
      ...baseInquiry,
      phone: "06 30 123 4567"
    });

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.phone).toBe("+36301234567");
  });

  it("keeps campaign and consent metadata", () => {
    const result = campaignInquiryInputSchema.parse({
      ...baseInquiry,
      email: "marton@example.com",
      consentMarketing: true,
      consentAdsPersonalization: true,
      tracking: {
        utmSource: "google",
        utmCampaign: "customer_match_service"
      }
    });

    expect(result.consentMarketing).toBe(true);
    expect(result.consentAdsPersonalization).toBe(true);
    expect(result.tracking?.utmSource).toBe("google");
  });
});
