import { describe, expect, it, vi } from "vitest";
import {
  applyGoogleConsent,
  COOKIE_PREFERENCES_STORAGE_KEY,
  GOOGLE_ADS_LEAD_DESTINATION,
  getGoogleConsentUpdate,
  parseCookiePreferences,
  readCookiePreferences,
  trackSuccessfulLead,
  type CookiePreferences
} from "./google";

const grantedPreferences: CookiePreferences = {
  necessary: true,
  analytics: true,
  campaign: true,
  savedAt: "2026-09-22T10:00:00.000Z"
};

describe("Google consent and conversion tracking", () => {
  it("validates saved cookie preferences", () => {
    expect(parseCookiePreferences(JSON.stringify(grantedPreferences))).toEqual(
      grantedPreferences
    );
    expect(parseCookiePreferences("not-json")).toBeNull();
    expect(parseCookiePreferences(JSON.stringify({ campaign: true }))).toBeNull();
  });

  it("reads the current consent preference key", () => {
    const storage = {
      getItem: vi.fn((key: string) =>
        key === COOKIE_PREFERENCES_STORAGE_KEY
          ? JSON.stringify(grantedPreferences)
          : null
      )
    };

    expect(readCookiePreferences(storage)).toEqual(grantedPreferences);
  });

  it("updates Google consent before publishing the GTM event", () => {
    const calls: Array<Array<unknown>> = [];
    const dataLayer: Array<unknown> = [];
    const targetWindow = {
      dataLayer,
      gtag: (...args: Array<unknown>) => calls.push(args)
    } as unknown as Window & {
      dataLayer: Array<unknown>;
      gtag: (...args: Array<unknown>) => void;
    };

    applyGoogleConsent(grantedPreferences, targetWindow);

    expect(calls[0]).toEqual([
      "consent",
      "update",
      getGoogleConsentUpdate(grantedPreferences)
    ]);
    expect(dataLayer[0]).toEqual({
      event: "cookie_consent_update",
      ...getGoogleConsentUpdate(grantedPreferences)
    });
  });

  it("sends the successful lead to the real Google Ads destination", () => {
    const calls: Array<Array<unknown>> = [];
    const dataLayer: Array<unknown> = [];
    const targetWindow = {
      dataLayer,
      localStorage: { getItem: () => JSON.stringify(grantedPreferences) },
      gtag: (...args: Array<unknown>) => calls.push(args)
    } as unknown as Window & {
      dataLayer: Array<unknown>;
      gtag: (...args: Array<unknown>) => void;
    };

    const tracked = trackSuccessfulLead(
      {
        leadId: "lead-123",
        email: "  TESZT@EXAMPLE.COM ",
        phone: "+36 70 123 4567"
      },
      targetWindow,
      grantedPreferences
    );

    expect(tracked).toBe(true);
    expect(calls[0]).toEqual([
      "set",
      "user_data",
      { email: "teszt@example.com", phone_number: "+36701234567" }
    ]);
    expect(calls).toContainEqual([
      "event",
      "conversion",
      {
        send_to: GOOGLE_ADS_LEAD_DESTINATION,
        currency: "HUF",
        value: 1,
        transaction_id: "lead-123"
      }
    ]);
    expect(dataLayer[0]).toMatchObject({
      event: "lead_submit_success",
      lead_id: "lead-123",
      enhanced_conversion_data: {
        email: "teszt@example.com",
        phone_number: "+36701234567"
      }
    });
  });

  it("does not attach user data when campaign consent is denied", () => {
    const calls: Array<Array<unknown>> = [];
    const targetWindow = {
      dataLayer: [],
      localStorage: { getItem: () => null },
      gtag: (...args: Array<unknown>) => calls.push(args)
    } as unknown as Window & {
      dataLayer: Array<unknown>;
      gtag: (...args: Array<unknown>) => void;
    };

    trackSuccessfulLead(
      { leadId: "lead-456", email: "teszt@example.com", phone: "+36701234567" },
      targetWindow,
      null
    );

    expect(calls.some((call) => call[0] === "set" && call[1] === "user_data")).toBe(
      false
    );
    expect(calls).toContainEqual([
      "event",
      "conversion",
      {
        send_to: GOOGLE_ADS_LEAD_DESTINATION,
        currency: "HUF",
        value: 1,
        transaction_id: "lead-456"
      }
    ]);
  });
});
