"use client";

import { PhoneCall } from "lucide-react";

const phoneDisplay = "+36 70 595 0285";
const phoneHref = "tel:+36705950285";
const phonePlain = "+36705950285";
const googleAdsConversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_PHONE_CONVERSION_ID?.trim();
const googleAdsConversionLabel =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_PHONE_CONVERSION_LABEL?.trim();
const googleAdsSendTo =
  googleAdsConversionId && googleAdsConversionLabel
    ? `${googleAdsConversionId}/${googleAdsConversionLabel}`
    : undefined;

type CompairPhoneCtaProps = {
  className?: string;
  location: "header" | "hero" | "sticky_mobile" | "form";
};

export function CompairPhoneCta({ className, location }: CompairPhoneCtaProps) {
  function trackPhoneClick() {
    const trackedWindow = window as typeof window & {
      dataLayer?: Array<unknown>;
      gtag?: (...args: Array<unknown>) => void;
    };

    const eventPayload = {
      event: "compair_phone_click",
      event_category: "lead",
      event_action: "phone_click",
      event_label: phoneDisplay,
      campaign_name: "compairkampany",
      conversion_name: "compair_phone_call",
      link_url: phoneHref,
      phone_number: phonePlain,
      cta_location: location
    };

    trackedWindow.dataLayer = trackedWindow.dataLayer || [];
    trackedWindow.dataLayer.push(eventPayload);

    if (googleAdsSendTo) {
      trackedWindow.gtag?.("event", "conversion", {
        send_to: googleAdsSendTo,
        value: 1,
        currency: "HUF",
        event_callback: () => undefined,
        ...eventPayload
      });
    }
  }

  return (
    <a
      aria-label="Telefonálok most"
      className={["campaign-phone-cta", className].filter(Boolean).join(" ")}
      data-ads-conversion="compair_phone_call"
      data-gtm-event="compair_phone_click"
      data-phone-number={phonePlain}
      href={phoneHref}
      onClick={trackPhoneClick}
    >
      <PhoneCall size={18} />
      <em>Azonnali hívás</em>
      <strong>Telefonálok MOST!</strong>
    </a>
  );
}
