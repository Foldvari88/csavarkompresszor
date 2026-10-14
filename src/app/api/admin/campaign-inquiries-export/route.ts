import { listCampaignInquiries } from "@/lib/campaign-inquiries/store";

export const runtime = "nodejs";

export async function GET() {
  const inquiries = await listCampaignInquiries();
  const rows = [
    [
      "id", "createdAt", "status", "kind", "companyName", "name", "email", "phone",
      "equipmentBrand", "equipmentModel", "primaryDetail", "secondaryDetail", "message",
      "consentMarketing", "consentAdsPersonalization", "utmSource", "utmMedium", "utmCampaign",
      "utmContent", "gclid", "gbraid", "wbraid", "liFatId", "referrer"
    ],
    ...inquiries.map((inquiry) => [
      inquiry.id,
      inquiry.createdAt,
      inquiry.status,
      inquiry.input.kind,
      inquiry.input.companyName,
      inquiry.input.name,
      inquiry.input.email ?? "",
      inquiry.input.phone ?? "",
      inquiry.input.equipmentBrand ?? "",
      inquiry.input.equipmentModel ?? "",
      inquiry.input.primaryDetail ?? "",
      inquiry.input.secondaryDetail ?? "",
      inquiry.input.message ?? "",
      inquiry.input.consentMarketing ? "true" : "false",
      inquiry.input.consentAdsPersonalization ? "true" : "false",
      inquiry.input.tracking?.utmSource ?? "",
      inquiry.input.tracking?.utmMedium ?? "",
      inquiry.input.tracking?.utmCampaign ?? "",
      inquiry.input.tracking?.utmContent ?? "",
      inquiry.input.tracking?.gclid ?? "",
      inquiry.input.tracking?.gbraid ?? "",
      inquiry.input.tracking?.wbraid ?? "",
      inquiry.input.tracking?.liFatId ?? "",
      inquiry.input.tracking?.referrer ?? ""
    ])
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=ugyfel-ujraaktivalasi-leadek.csv"
    }
  });
}

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}
