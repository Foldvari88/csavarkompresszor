import { describe, expect, it, vi } from "vitest";
import {
  applyGoogleConsent,
  COOKIE_PREFERENCES_STORAGE_KEY,
  GOOGLE_ADS_LEAD_DESTINATION,
  getGoogleConsentUpdate,
  getLeadMeasurementConsent,
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
  it("records the current saved ad choice without inventing consent for legacy or blocked storage", () => {
    const target = { localStorage: { getItem: () => JSON.stringify(grantedPreferences) } } as unknown as Window;
    expect(getLeadMeasurementConsent(target)).toEqual({ campaign: true, savedAt: grantedPreferences.savedAt });
    expect(getLeadMeasurementConsent({ localStorage: { getItem: () => null } } as unknown as Window)).toBeUndefined();
    expect(getLeadMeasurementConsent({ get localStorage() { throw new Error("blocked"); } } as unknown as Window)).toBeUndefined();
  });
  it("queues Google-compatible Arguments commands before gtag is available", () => {
    const initialEvent = { event: "gtm.js" };
    const dataLayer: unknown[] = [initialEvent];
    const target = { dataLayer } as unknown as Window;
    applyGoogleConsent({ analytics: true, campaign: false }, target);
    expect(trackSuccessfulLead({ leadId: "queued-lead" }, target, null)).toBe(true);
    expect(dataLayer[0]).toBe(initialEvent);
    const commands = dataLayer.filter(item => Object.prototype.toString.call(item) === "[object Arguments]") as IArguments[];
    expect(commands.map(command => Array.from(command))).toContainEqual([
      "consent", "update", getGoogleConsentUpdate({ analytics: true, campaign: false })
    ]);
    expect(commands.map(command => Array.from(command))).toContainEqual([
      "event", "conversion", {
        send_to: GOOGLE_ADS_LEAD_DESTINATION, currency: "HUF", value: 1, transaction_id: "queued-lead"
      }
    ]);
    expect(dataLayer.some(Array.isArray)).toBe(false);
  });
  it("honours an explicit form refusal even when advertising cookies are allowed", () => {
    const calls: unknown[][] = [];
    const dataLayer: unknown[] = [];
    const target = { dataLayer, gtag: (...args: unknown[]) => calls.push(args) } as unknown as Window;
    expect(trackSuccessfulLead({
      leadId: "form-refused", email: "test@example.com", phone: "+36700000000", enhancedConversionConsent: false
    }, target, grantedPreferences)).toBe(true);
    expect(calls.filter(call => call[1] === "user_data")).toEqual([["set", "user_data", {}]]);
    expect(dataLayer[0]).not.toHaveProperty("enhanced_conversion_data");
    expect(calls.some(call => call[1] === "generate_lead")).toBe(true);
    expect(calls.some(call => call[1] === "conversion")).toBe(true);
  });
  it("still emits a consent-safe conversion if browser storage is blocked", () => {
    const calls: unknown[][] = [];
    const target = { dataLayer: [], get localStorage() { throw new Error("SecurityError"); }, gtag: (...args: unknown[]) => calls.push(args) } as unknown as Window;
    expect(trackSuccessfulLead({ leadId: "private-browser-lead" }, target)).toBe(true);
    expect(calls.some(call => call[1] === "conversion")).toBe(true);
    expect(calls.some(call => call[1] === "user_data")).toBe(false);
  });
  it("emits a stored lead once and never counts a honeypot acknowledgement", () => {
    const calls: unknown[][] = [];
    const target = { dataLayer: [], localStorage: { getItem: () => null }, gtag: (...args: unknown[]) => calls.push(args) } as unknown as Window;
    expect(trackSuccessfulLead({ leadId: "accepted" }, target, null)).toBe(false);
    expect(trackSuccessfulLead({ leadId: "id-unique", formType: "service" }, target, null)).toBe(true);
    expect(trackSuccessfulLead({ leadId: "id-unique", formType: "service" }, target, null)).toBe(false);
    expect(calls.filter(call => call[1] === "conversion")).toHaveLength(1);
    expect(calls.find(call => call[1] === "generate_lead")?.[2]).toMatchObject({ form_type: "service" });
  });
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
