import { createHash } from "node:crypto";
import { listLeads } from "@/lib/leads/store";

export const runtime = "nodejs";

const conversionName = "Csavarkompresszor minősített lead";
const currency = "HUF";

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
      "customerRating",
      "gclid",
      "gbraid",
      "wbraid",
      "hashedEmailSha256",
      "hashedPhoneSha256",
      "status",
      "companyName",
      "annualHufSaved",
      "utmSource",
      "utmCampaign"
    ],
    ...leads.map((lead) => {
      const hasClickId = Boolean(
        lead.input.tracking?.gclid || lead.input.tracking?.gbraid || lead.input.tracking?.wbraid
      );
      const readyForGoogleAds = Boolean(hasClickId && lead.customerRating);

      return [
        lead.id,
        readyForGoogleAds ? "true" : "false",
        conversionName,
        toGoogleAdsDateTime(new Date(lead.createdAt)),
        String(toConversionValue(lead.customerRating)),
        currency,
        lead.customerRating ? String(lead.customerRating) : "",
        lead.input.tracking?.gclid ?? "",
        lead.input.tracking?.gbraid ?? "",
        lead.input.tracking?.wbraid ?? "",
        sha256(normalizeEmail(lead.input.email)),
        sha256(normalizePhone(lead.input.phone)),
        lead.status,
        lead.input.companyName,
        String(lead.result.annualHufSaved),
        lead.input.tracking?.utmSource ?? "",
        lead.input.tracking?.utmCampaign ?? ""
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

function toConversionValue(rating: number | null) {
  if (!rating) return 0;
  return rating * 10000;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string) {
  return phone.trim().replace(/[^\d+]/g, "");
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
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
