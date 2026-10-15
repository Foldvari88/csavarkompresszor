import { z } from "zod";
import type { AdQualification, LeadRecord } from "@/lib/calculator/types";

export const qualificationInputSchema = z.object({
  qualified: z.boolean(),
  qualifiedAt: z.string().datetime({ offset: true }).optional(),
  valueHuf: z.number().finite().min(0).max(1_000_000_000).optional()
});

export function validQualificationDate(qualifiedAt: string, createdAt: string, now = Date.now()) {
  const time = Date.parse(qualifiedAt);
  const created = Date.parse(createdAt);
  return Number.isFinite(time) && Number.isFinite(created) && time >= created && time <= now;
}

export function getGoogleOfflineQualification(lead: LeadRecord, now = Date.now()) {
  const qualification = lead.adQualification;
  const consent = lead.input.measurementConsent;
  const consentTime = Date.parse(consent?.savedAt ?? "");
  const hasConsent = consent?.campaign === true && Number.isFinite(consentTime) &&
    consentTime <= Date.parse(lead.createdAt) + 5 * 60_000;
  let blockReason = "";
  if (!qualification) blockReason = "missing_sales_qualification";
  else if (!validQualificationDate(qualification.qualifiedAt, lead.createdAt, now) ||
    !Number.isFinite(Date.parse(qualification.recordedAt)) ||
    Date.parse(qualification.recordedAt) < Date.parse(qualification.qualifiedAt) ||
    Date.parse(qualification.recordedAt) > now ||
    (qualification.valueHuf !== undefined && (!Number.isFinite(qualification.valueHuf) || qualification.valueHuf < 0 || qualification.valueHuf > 1_000_000_000))) {
    blockReason = "invalid_qualification";
  } else if (lead.status === "lost") blockReason = "lost_lead";
  else if (!hasConsent) blockReason = "missing_ad_consent_record";
  else if (!(lead.input.tracking?.gclid || lead.input.tracking?.gbraid || lead.input.tracking?.wbraid)) {
    blockReason = "missing_google_click_id";
  }
  return {
    ready: blockReason === "",
    blockReason,
    hasConsent,
    qualifiedAt: qualification?.qualifiedAt ?? null,
    valueHuf: qualification?.valueHuf ?? null,
    qualification: qualification as AdQualification | null | undefined
  };
}
