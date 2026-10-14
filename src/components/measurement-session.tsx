"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getCampaignTracking } from "@/lib/tracking/campaign";
import { trackLeadFormEvent } from "@/lib/tracking/google";

export function MeasurementSession() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    getCampaignTracking();
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="tel:"]') : null;
      if (link && link.dataset.gtmEvent !== "compair_phone_click") trackLeadFormEvent("phone_click", pathname === "/" ? "calculator" : pathname.slice(1));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);
  return null;
}
