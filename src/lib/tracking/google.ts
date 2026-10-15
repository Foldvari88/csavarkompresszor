import { normalizeHungarianPhone } from "@/lib/phone";

export const GOOGLE_ADS_ID = "AW-17711633820";
export const GOOGLE_ADS_LEAD_DESTINATION =
  "AW-17711633820/J6JBCIui-IccEJyryP1B";
export const GOOGLE_ANALYTICS_ID = "G-DJ2FNH8J2J";
export const COOKIE_PREFERENCES_STORAGE_KEY =
  "csavarkompresszor-cookie-preferences-v2";

export type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  campaign: boolean;
  savedAt: string;
};

type GoogleConsentUpdate = {
  ad_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
  analytics_storage: "granted" | "denied";
};

type Gtag = (...args: Array<unknown>) => void;

type TrackingWindow = Window & {
  dataLayer?: Array<unknown>;
  gtag?: Gtag;
  __ipariTrackedLeads?: Set<string>;
};

type SuccessfulLead = {
  leadId: string;
  email?: string;
  phone?: string;
  formType?: string;
  enhancedConversionConsent?: boolean;
};

export function isMeasurementAllowed(targetWindow: TrackingWindow) {
  if (!targetWindow.location) return true; // Unit-test targets do not have a DOM.
  return !targetWindow.location.pathname.startsWith("/admin") &&
    (["iparikalkulator.hu", "www.iparikalkulator.hu"].includes(targetWindow.location.hostname) ||
      process.env.NEXT_PUBLIC_MEASUREMENT_DEBUG === "true");
}

export function trackLeadFormEvent(
  name: "lead_form_view" | "lead_form_start" | "lead_form_attempt" | "lead_form_error" | "phone_click",
  formType: string,
  detail: { field_name?: string; error_type?: "validation" | "server" } = {}
) {
  const target = getBrowserWindow();
  if (!target || !isMeasurementAllowed(target)) return false;
  ensureGtag(target)("event", name, { send_to: GOOGLE_ANALYTICS_ID, form_type: formType, ...detail });
  return true;
}

export function parseCookiePreferences(value: string | null): CookiePreferences | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<CookiePreferences>;
    if (
      parsed.necessary !== true ||
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.campaign !== "boolean" ||
      typeof parsed.savedAt !== "string"
    ) {
      return null;
    }

    return parsed as CookiePreferences;
  } catch {
    return null;
  }
}

export function readCookiePreferences(
  storage: Pick<Storage, "getItem"> | null | undefined
): CookiePreferences | null {
  if (!storage) return null;

  try {
    return parseCookiePreferences(storage.getItem(COOKIE_PREFERENCES_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function getLeadMeasurementConsent(targetWindow: TrackingWindow | undefined = getBrowserWindow()) {
  if (!targetWindow) return undefined;
  try {
    const preferences = readCookiePreferences(targetWindow.localStorage);
    if (!preferences || !Number.isFinite(Date.parse(preferences.savedAt))) return undefined;
    return { campaign: preferences.campaign, savedAt: new Date(preferences.savedAt).toISOString() };
  } catch {
    return undefined;
  }
}

export function getGoogleConsentUpdate(
  preferences: Pick<CookiePreferences, "analytics" | "campaign">
): GoogleConsentUpdate {
  return {
    ad_storage: preferences.campaign ? "granted" : "denied",
    ad_user_data: preferences.campaign ? "granted" : "denied",
    ad_personalization: preferences.campaign ? "granted" : "denied",
    analytics_storage: preferences.analytics ? "granted" : "denied"
  };
}

export function applyGoogleConsent(
  preferences: Pick<CookiePreferences, "analytics" | "campaign">,
  targetWindow: TrackingWindow | undefined = getBrowserWindow()
) {
  if (!targetWindow) return false;

  const gtag = ensureGtag(targetWindow);
  const consentUpdate = getGoogleConsentUpdate(preferences);

  // Consent must be updated before the custom event reaches GTM.
  gtag("consent", "update", consentUpdate);
  if (!preferences.campaign) gtag("set", "user_data", {});
  targetWindow.dataLayer?.push({
    event: "cookie_consent_update",
    ...consentUpdate
  });

  return true;
}

export function trackSuccessfulLead(
  lead: SuccessfulLead,
  targetWindow: TrackingWindow | undefined = getBrowserWindow(),
  preferences?: CookiePreferences | null
) {
  if (!targetWindow || !isMeasurementAllowed(targetWindow) || !lead.leadId || lead.leadId === "accepted") return false;

  try {
    const tracked = targetWindow.__ipariTrackedLeads ??= new Set();
    if (tracked.has(lead.leadId)) return false;
    const gtag = ensureGtag(targetWindow);
    let savedPreferences = preferences ?? null;
    if (preferences === undefined) {
      try { savedPreferences = readCookiePreferences(targetWindow.localStorage); } catch { /* Treat blocked storage as no consent. */ }
    }
    const enhancedConversionData = savedPreferences?.campaign && lead.enhancedConversionConsent !== false
      ? {
          ...(lead.email ? { email: lead.email.trim().toLowerCase() } : {}),
          ...(lead.phone ? { phone_number: normalizeHungarianPhone(lead.phone) } : {})
        }
      : null;

    if (enhancedConversionData && Object.keys(enhancedConversionData).length > 0) {
      gtag("set", "user_data", enhancedConversionData);
    } else if (lead.enhancedConversionConsent === false) {
      // A form-level refusal must also clear data set by a previous submission.
      gtag("set", "user_data", {});
    }

    const eventParameters = {
      currency: "HUF",
      value: 1,
      transaction_id: lead.leadId
    };

    targetWindow.dataLayer?.push({
      event: "lead_submit_success",
      form_type: lead.formType ?? "calculator",
      lead_id: lead.leadId,
      ...eventParameters,
      ...(enhancedConversionData && Object.keys(enhancedConversionData).length > 0
        ? { enhanced_conversion_data: enhancedConversionData }
        : {})
    });

    gtag("event", "generate_lead", {
      send_to: GOOGLE_ANALYTICS_ID,
      form_type: lead.formType ?? "calculator",
      lead_id: lead.leadId,
      ...eventParameters
    });
    gtag("event", "conversion", {
      send_to: GOOGLE_ADS_LEAD_DESTINATION,
      ...eventParameters
    });

    tracked.add(lead.leadId);

    return true;
  } catch {
    // Measurement must never turn a successfully stored lead into a UI error.
    return false;
  }
}

function ensureGtag(targetWindow: TrackingWindow): Gtag {
  targetWindow.dataLayer = targetWindow.dataLayer || [];
  targetWindow.gtag =
    targetWindow.gtag ||
    (function () {
      // Google command queues expect Arguments objects, not ordinary arrays.
      // eslint-disable-next-line prefer-rest-params -- Preserve Google's command queue format.
      targetWindow.dataLayer?.push(arguments);
    });
  return targetWindow.gtag;
}

function getBrowserWindow(): TrackingWindow | undefined {
  return typeof window === "undefined" ? undefined : (window as TrackingWindow);
}
