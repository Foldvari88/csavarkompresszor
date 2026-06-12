import { createHash } from "node:crypto";
import type { LeadRecord, LeadStatus } from "@/lib/calculator/types";
import { formatStatus } from "@/lib/status-label";

export const adConversionCurrency = "HUF";
export const googleAdsQualifiedLeadConversionName = "Csavarkompresszor minositett lead";
export const linkedinAdsQualifiedLeadConversionName = "Csavarkompresszor qualified lead";

const statusStages: Record<LeadStatus, string> = {
  new: "lead_new",
  contacted: "sales_cycle",
  quoted: "sales_cycle",
  closed: "won",
  lost: "lost"
};

const statusMultipliers: Record<LeadStatus, number> = {
  new: 0.75,
  contacted: 1.15,
  quoted: 1.15,
  closed: 2,
  lost: 0
};

export function getLeadAdQuality(lead: LeadRecord) {
  const score = lead.result.leadScore?.score ?? 0;
  const rating = lead.customerRating ?? 0;
  const annualPotential = Math.max(0, lead.result.annualHufSaved ?? 0);
  const potentialValue = Math.min(annualPotential * 0.015, 250000);
  const scoreValue = score * 1200;
  const ratingValue = rating * 20000;
  const multiplier = statusMultipliers[lead.status] ?? 1;
  const conversionValueHuf = Math.round((potentialValue + scoreValue + ratingValue) * multiplier);
  const hasGoogleClickId = Boolean(
    lead.input.tracking?.gclid || lead.input.tracking?.gbraid || lead.input.tracking?.wbraid
  );

  return {
    status: lead.status,
    statusLabel: formatStatus(lead.status),
    stage: statusStages[lead.status] ?? lead.status,
    rating,
    score,
    annualPotential,
    conversionValueHuf,
    readyForGoogleAds: hasGoogleClickId && conversionValueHuf > 0,
    readyForLinkedInAds: Boolean(
      lead.input.tracking?.liFatId || lead.input.email || lead.input.phone
    ) && conversionValueHuf > 0,
    googleClickIdType: getGoogleClickIdType(lead),
    linkedInClickId: lead.input.tracking?.liFatId ?? ""
  };
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizePhone(phone: string) {
  return phone.trim().replace(/[^\d+]/g, "");
}

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function getGoogleClickIdType(lead: LeadRecord) {
  if (lead.input.tracking?.gclid) return "gclid";
  if (lead.input.tracking?.gbraid) return "gbraid";
  if (lead.input.tracking?.wbraid) return "wbraid";
  return "";
}
