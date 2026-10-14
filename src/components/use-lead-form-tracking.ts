"use client";

import { useEffect, useRef } from "react";
import { trackLeadFormEvent } from "@/lib/tracking/google";

export function useLeadFormTracking<T extends HTMLElement = HTMLFormElement>(formType: string) {
  const ref = useRef<T>(null);
  const started = useRef(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        trackLeadFormEvent("lead_form_view", formType);
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [formType]);
  return {
    ref,
    onFocusCapture() {
      if (!started.current) {
        started.current = true;
        trackLeadFormEvent("lead_form_start", formType);
      }
    },
    attempt() { trackLeadFormEvent("lead_form_attempt", formType); },
    errors(fields: string[], errorType: "validation" | "server" = "validation") {
      for (const field of fields) trackLeadFormEvent("lead_form_error", formType, { field_name: field, error_type: errorType });
    }
  };
}
