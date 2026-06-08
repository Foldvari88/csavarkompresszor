import { notFound } from "next/navigation";
import { generateLeadPdf } from "@/lib/leads/pdf";
import { getLead } from "@/lib/leads/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLead(id);

  if (!lead) {
    notFound();
  }

  const pdf = generateLeadPdf(lead);
  const safeCompanyName = lead.input.companyName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="csavarkompresszor-riport-${
        safeCompanyName || lead.id.slice(0, 8)
      }.pdf"`
    }
  });
}
