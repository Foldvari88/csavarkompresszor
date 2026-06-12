import {
  adConversionCurrency,
  getLeadAdQuality,
  linkedinAdsQualifiedLeadConversionName,
  normalizeEmail,
  normalizePhone,
  sha256
} from "@/lib/ads/offline-conversions";
import { listLeads } from "@/lib/leads/store";

export const runtime = "nodejs";

export async function GET() {
  const leads = await listLeads();
  const rows = [
    [
      "leadId",
      "readyForLinkedInAds",
      "conversionName",
      "conversionDateTime",
      "conversionValue",
      "currency",
      "adQualityStage",
      "status",
      "statusLabel",
      "customerRating",
      "leadScore",
      "liFatId",
      "hashedEmailSha256",
      "hashedPhoneSha256",
      "companyName",
      "companyWebsite",
      "annualHufSaved",
      "utmSource",
      "utmCampaign",
      "referrer"
    ],
    ...leads.map((lead) => {
      const quality = getLeadAdQuality(lead);

      return [
        lead.id,
        quality.readyForLinkedInAds ? "true" : "false",
        linkedinAdsQualifiedLeadConversionName,
        new Date(lead.createdAt).toISOString(),
        String(quality.conversionValueHuf),
        adConversionCurrency,
        quality.stage,
        quality.status,
        quality.statusLabel,
        quality.rating ? String(quality.rating) : "",
        String(quality.score),
        quality.linkedInClickId,
        sha256(normalizeEmail(lead.input.email)),
        sha256(normalizePhone(lead.input.phone)),
        lead.input.companyName,
        lead.input.companyWebsite ?? "",
        String(quality.annualPotential),
        lead.input.tracking?.utmSource ?? "",
        lead.input.tracking?.utmCampaign ?? "",
        lead.input.tracking?.referrer ?? ""
      ];
    })
  ];

  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=linkedin-ads-lead-quality-export.csv"
    }
  });
}

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}
