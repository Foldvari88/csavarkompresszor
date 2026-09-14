"use client";

import { Cookie, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  campaign: boolean;
  savedAt: string;
};

const storageKey = "csavarkompresszor-cookie-preferences-v2";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [campaign, setCampaign] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        setIsVisible(!window.localStorage.getItem(storageKey));
      } catch {
        setIsVisible(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!isVisible) return null;

  function savePreferences(preferences: Omit<CookiePreferences, "necessary" | "savedAt">) {
    const payload: CookiePreferences = {
      necessary: true,
      analytics: preferences.analytics,
      campaign: preferences.campaign,
      savedAt: new Date().toISOString()
    };
    const trackedWindow = window as typeof window & {
      dataLayer?: Array<unknown>;
      gtag?: (...args: Array<unknown>) => void;
    };
    const consentUpdate = {
      ad_storage: preferences.campaign ? "granted" : "denied",
      ad_user_data: preferences.campaign ? "granted" : "denied",
      ad_personalization: preferences.campaign ? "granted" : "denied",
      analytics_storage: preferences.analytics ? "granted" : "denied"
    };

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // The choice still applies to the current page if storage is unavailable.
    }
    trackedWindow.dataLayer = trackedWindow.dataLayer || [];
    trackedWindow.dataLayer.push({
      event: "cookie_consent_update",
      ...consentUpdate
    });
    trackedWindow.gtag?.("consent", "update", consentUpdate);
    setIsVisible(false);
  }

  return (
    <section
      aria-describedby="cookie-banner-description"
      aria-labelledby="cookie-banner-title"
      className="cookie-banner"
      role="dialog"
    >
      <div className="cookie-banner-shell">
        <div className="cookie-banner-heading">
          <div className="cookie-banner-icon" aria-hidden="true">
            <Cookie size={22} />
          </div>
          <div className="cookie-banner-copy">
            <span className="cookie-kicker">
              <ShieldCheck size={15} />
              Adatvédelem
            </span>
            <h2 id="cookie-banner-title">Ön dönt a sütikről</h2>
          </div>
        </div>

        <div className="cookie-banner-copy cookie-banner-details">
          <p id="cookie-banner-description">
            Az oldal működéséhez szükséges sütik mindig aktívak. Az analitikai
            és hirdetési sütiket csak az Ön engedélyével használjuk.
          </p>
          <a href="/sutik">Részletek és süti tájékoztató</a>
        </div>

        {isCustomizing ? (
          <div className="cookie-options" aria-label="Süti kategóriák">
            <label className="cookie-option locked">
              <span>
                <strong>Szükséges sütik</strong>
                <small>Az oldal alap működése és biztonsága</small>
              </span>
              <input checked disabled type="checkbox" />
            </label>
            <label className="cookie-option">
              <span>
                <strong>Analitika</strong>
                <small>Az oldal használatának mérése</small>
              </span>
              <input
                checked={analytics}
                type="checkbox"
                onChange={(event) => setAnalytics(event.target.checked)}
              />
            </label>
            <label className="cookie-option">
              <span>
                <strong>Hirdetések és kampánymérés</strong>
                <small>Google Ads és remarketing</small>
              </span>
              <input
                checked={campaign}
                type="checkbox"
                onChange={(event) => setCampaign(event.target.checked)}
              />
            </label>
          </div>
        ) : null}

        <div className="cookie-actions">
          <button
            className="cookie-button ghost"
            type="button"
            onClick={() => savePreferences({ analytics: false, campaign: false })}
          >
            Csak szükséges
          </button>
          <button
            className="cookie-button secondary"
            type="button"
            onClick={() =>
              isCustomizing
                ? savePreferences({ analytics, campaign })
                : setIsCustomizing(true)
            }
          >
            <SlidersHorizontal size={16} />
            {isCustomizing ? "Beállítások mentése" : "Beállítások"}
          </button>
          <button
            className="cookie-button primary"
            type="button"
            onClick={() => savePreferences({ analytics: true, campaign: true })}
          >
            Elfogadom
          </button>
        </div>
      </div>
    </section>
  );
}
