import {
  adConversionCurrency,
  getLeadAdQuality,
  googleAdsQualifiedLeadConversionName,
  normalizeEmail,
  normalizePhone,
  sha256
} from "@/lib/ads/offline-conversions";
import { listLeads } from "@/lib/leads/store";
import { getGoogleOfflineQualification } from "@/lib/ads/google-offline-qualification";

export const runtime = "nodejs";

export async function GET() {
  const leads = await listLeads();
  const rows = [
    [
      "leadId",
      "readyForGoogleAds",
      "conversionName",
      "conversionDateTime",
      "conversionValue",
      "currency",
      "adQualityStage",
      "status",
      "statusLabel",
      "customerRating",
      "leadScore",
      "googleClickIdType",
      "gclid",
      "gbraid",
      "wbraid",
      "hashedEmailSha256",
      "hashedPhoneSha256",
      "companyName",
      "annualHufSaved",
      "utmSource",
      "utmCampaign",
      "exportBlockReason",
      "qualificationRecordedAt",
      "valueSource"
    ],
    ...leads.map((lead) => {
      const quality = getLeadAdQuality(lead);
      const qualification = getGoogleOfflineQualification(lead);

      return [
        lead.id,
        qualification.ready ? "true" : "false",
        qualification.ready ? googleAdsQualifiedLeadConversionName : "",
        qualification.ready ? toGoogleAdsDateTime(new Date(qualification.qualifiedAt!)) : "",
        qualification.ready && qualification.valueHuf !== null ? String(qualification.valueHuf) : "",
        qualification.ready ? adConversionCurrency : "",
        qualification.qualification ? "lead_qualified" : quality.stage,
        quality.status,
        quality.statusLabel,
        quality.rating ? String(quality.rating) : "",
        String(quality.score),
        quality.googleClickIdType,
        qualification.hasConsent ? lead.input.tracking?.gclid ?? "" : "",
        qualification.hasConsent ? lead.input.tracking?.gbraid ?? "" : "",
        qualification.hasConsent ? lead.input.tracking?.wbraid ?? "" : "",
        qualification.ready && lead.input.email ? sha256(normalizeEmail(lead.input.email)) : "",
        qualification.ready && lead.input.phone ? sha256(normalizePhone(lead.input.phone)) : "",
        lead.input.companyName,
        String(quality.annualPotential),
        lead.input.tracking?.utmSource ?? "",
        lead.input.tracking?.utmCampaign ?? "",
        qualification.blockReason,
        qualification.qualification?.recordedAt ?? "",
        qualification.ready && qualification.valueHuf !== null ? "sales_entered_lead_value" : ""
      ];
    })
  ];

  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=google-ads-lead-quality-export.csv"
    }
  });
}

function toGoogleAdsDateTime(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Budapest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "shortOffset"
  }).formatToParts(date);

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const offset = normalizeOffset(get("timeZoneName"));

  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}${offset}`;
}

function normalizeOffset(value: string) {
  const match = value.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return "+00:00";
  const [, sign, hour, minute = "00"] = match;
  return `${sign}${hour.padStart(2, "0")}:${minute}`;
}

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}
