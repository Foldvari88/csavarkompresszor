"use client";

import { Cookie, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  campaign: boolean;
  savedAt: string;
};

const storageKey = "csavarkompresszor-cookie-preferences-v1";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [campaign, setCampaign] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsVisible(!window.localStorage.getItem(storageKey));
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
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
    setIsVisible(false);
  }

  return (
    <section className="cookie-banner" aria-label="Süti hozzájárulási panel">
      <div className="cookie-banner-shell">
        <div className="cookie-banner-icon" aria-hidden="true">
          <Cookie size={22} />
        </div>

        <div className="cookie-banner-copy">
          <span className="cookie-kicker">
            <ShieldCheck size={15} />
            Süti beállítások
          </span>
          <h2>Sütik kezelése</h2>
          <p>
            A szükséges sütik a weboldal működéséhez kellenek. Az analitikai és
            kampánymérési sütik csak hozzájárulással kapcsolhatók be.
          </p>
          <a href="/sutik">Részletes süti tájékoztató</a>
        </div>

        {isCustomizing ? (
          <div className="cookie-options" aria-label="Süti kategóriák">
            <label className="cookie-option locked">
              <span>
                <strong>Szükséges</strong>
                <small>Alap működés és biztonság</small>
              </span>
              <input checked disabled type="checkbox" />
            </label>
            <label className="cookie-option">
              <span>
                <strong>Analitika</strong>
                <small>Használati és teljesítménymérés</small>
              </span>
              <input
                checked={analytics}
                type="checkbox"
                onChange={(event) => setAnalytics(event.target.checked)}
              />
            </label>
            <label className="cookie-option">
              <span>
                <strong>Kampánymérés</strong>
                <small>Hivatkozási és kampányforrások mérése</small>
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
