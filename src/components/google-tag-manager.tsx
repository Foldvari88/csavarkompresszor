import Script from "next/script";
import { GOOGLE_ADS_ID } from "@/lib/tracking/google";

const gtmId = "GTM-KRCLFCGK";

export function GoogleTagManager() {
  return (
    <Script
      id="google-tag-manager"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w.gtag=w.gtag||function(){w[l].push(arguments)};
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
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
window.gtag('js', new Date());
window.gtag('config', '${GOOGLE_ADS_ID}');
`.trim()
        }}
      />
    </>
  );
}
