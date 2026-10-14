"use client";

import { Cookie, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCampaignTracking } from "@/lib/tracking/campaign";
import {
  applyGoogleConsent,
  COOKIE_PREFERENCES_STORAGE_KEY,
  readCookiePreferences,
  type CookiePreferences
} from "@/lib/tracking/google";

export function CookieBanner() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [campaign, setCampaign] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      let savedPreferences: CookiePreferences | null = null;
      try { savedPreferences = readCookiePreferences(window.localStorage); } catch { /* Storage may be blocked. */ }
      if (savedPreferences) {
        setAnalytics(savedPreferences.analytics);
        setCampaign(savedPreferences.campaign);
        applyGoogleConsent(savedPreferences);
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (pathname.startsWith("/admin")) return null;
  if (!isVisible) return <button type="button" className="cookie-settings-trigger" aria-haspopup="dialog" onClick={() => { setIsCustomizing(true); setIsVisible(true); }}>Sütibeállítások</button>;

  function savePreferences(preferences: Omit<CookiePreferences, "necessary" | "savedAt">) {
    const payload: CookiePreferences = {
      necessary: true,
      analytics: preferences.analytics,
      campaign: preferences.campaign,
      savedAt: new Date().toISOString()
    };
    try {
      window.localStorage.setItem(
        COOKIE_PREFERENCES_STORAGE_KEY,
        JSON.stringify(payload)
      );
    } catch {
      // The choice still applies to the current page if storage is unavailable.
    }
    applyGoogleConsent(payload);
    getCampaignTracking();
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
