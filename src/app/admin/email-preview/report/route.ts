import { generateLeadPdf } from "@/lib/leads/pdf";
import { createPreviewLead } from "@/lib/leads/preview";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  const lead = createPreviewLead();
  const pdf = generateLeadPdf(lead);

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="csavarkompresszor-riport-minta.pdf"'
    }
  });
}
