import { listLeads } from "@/lib/leads/store";

export const runtime = "nodejs";

export async function GET() {
  const leads = await listLeads();
  const rows = [
    [
      "createdAt",
      "status",
      "companyName",
      "name",
      "email",
      "phone",
      "brand",
      "category",
      "ageBand",
      "nominalKw",
      "recommendedModel",
      "annualHufSaved",
      "annualKwhSaved",
      "priority",
      "score",
      "machineCount",
      "utmSource",
      "utmCampaign"
    ],
    ...leads.map((lead) => [
      lead.createdAt,
      lead.status,
      lead.input.companyName,
      lead.input.name ?? "",
      lead.input.email,
      lead.input.phone ?? "",
      lead.input.brand,
      lead.input.category,
      lead.input.ageBand,
      String(lead.input.nominalKw),
      lead.result.recommendedModel.model,
      String(lead.result.annualHufSaved),
      String(lead.result.annualKwhSaved),
      lead.result.priority?.label ?? "",
      lead.result.leadScore ? String(lead.result.leadScore.score) : "",
      lead.result.totalMachineCount ? String(lead.result.totalMachineCount) : "1",
      lead.input.tracking?.utmSource ?? "",
      lead.input.tracking?.utmCampaign ?? ""
    ])
  ];

  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=csavarkompresszor-bekuldesek.csv"
    }
  });
}

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}
