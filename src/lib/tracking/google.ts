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
};

type SuccessfulLead = {
  leadId: string;
  email: string;
  phone: string;
};

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
  if (!targetWindow) return false;

  try {
    const gtag = ensureGtag(targetWindow);
    const savedPreferences =
      preferences === undefined
        ? readCookiePreferences(targetWindow.localStorage)
        : preferences;
    const enhancedConversionData = savedPreferences?.campaign
      ? {
          email: lead.email.trim().toLowerCase(),
          phone_number: normalizePhone(lead.phone)
        }
      : null;

    if (enhancedConversionData) {
      gtag("set", "user_data", enhancedConversionData);
    }

    const eventParameters = {
      currency: "HUF",
      value: 1,
      transaction_id: lead.leadId
    };

    targetWindow.dataLayer?.push({
      event: "lead_submit_success",
      lead_id: lead.leadId,
      ...eventParameters,
      ...(enhancedConversionData
        ? { enhanced_conversion_data: enhancedConversionData }
        : {})
    });

    gtag("event", "generate_lead", {
      send_to: GOOGLE_ANALYTICS_ID,
      lead_id: lead.leadId,
      ...eventParameters
    });
    gtag("event", "conversion", {
      send_to: GOOGLE_ADS_LEAD_DESTINATION,
      ...eventParameters
    });

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
    ((...args: Array<unknown>) => {
      targetWindow.dataLayer?.push(args);
    });
  return targetWindow.gtag;
}

function getBrowserWindow(): TrackingWindow | undefined {
  return typeof window === "undefined" ? undefined : (window as TrackingWindow);
}

function normalizePhone(phone: string) {
  return phone.trim().replace(/[^\d+]/g, "");
}
