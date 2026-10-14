"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { GOOGLE_ADS_ID } from "@/lib/tracking/google";

const gtmId = "GTM-KRCLFCGK";

function useExcludeMeasurement() {
  const pathname = usePathname();
  return pathname.startsWith("/admin") ||
    (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_MEASUREMENT_DEBUG !== "true");
}

export function GoogleTagManager() {
  const excluded = useExcludeMeasurement();
  if (excluded) return null;
  return (
    <script
      id="google-tag-manager"
      dangerouslySetInnerHTML={{
        __html: `
(function(w,d,s,l,i){if(!['iparikalkulator.hu','www.iparikalkulator.hu'].includes(w.location.hostname)&&${process.env.NEXT_PUBLIC_MEASUREMENT_DEBUG !== "true"})return;
w[l]=w[l]||[];w.gtag=w.gtag||function(){w[l].push(arguments)};
w.gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',
ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KRCLFCGK');
`.trim()
      }}
    />
  );
}

export function GoogleTagManagerNoScript() {
  const excluded = useExcludeMeasurement();
  if (excluded) return null;
  return (
    <noscript>
      <iframe
        height="0"
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
        width="0"
      />
    </noscript>
  );
}

export function GoogleAdsTag() {
  const excluded = useExcludeMeasurement();
  if (excluded) return null;
  return (
    <>
      <Script
        id="google-ads-tag"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-ads-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
(function(){if(!['iparikalkulator.hu','www.iparikalkulator.hu'].includes(window.location.hostname)&&${process.env.NEXT_PUBLIC_MEASUREMENT_DEBUG !== "true"})return;
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
window.gtag('js', new Date());
window.gtag('config', '${GOOGLE_ADS_ID}');
})();
`.trim()
        }}
      />
    </>
  );
}
