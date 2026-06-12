import { randomUUID } from "node:crypto";
import { notFound } from "next/navigation";
import { sendLeadEngagementNotification } from "@/lib/leads/email";
import { generateLeadPdf } from "@/lib/leads/pdf";
import { getLead, recordLeadEngagementEvent } from "@/lib/leads/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLead(id);

  if (!lead) {
    notFound();
  }

  const pdf = generateLeadPdf(lead);
  const occurredAt = new Date();

  try {
    const event = await recordLeadEngagementEvent({
      id: `report-download:${lead.id}:${occurredAt.toISOString()}:${randomUUID()}`,
      leadId: lead.id,
      type: "report.downloaded",
      occurredAt,
      metadata: {
        userAgent: request.headers.get("user-agent"),
        referer: request.headers.get("referer")
      }
    });

    if (event.recorded && event.lead) {
      await sendLeadEngagementNotification({
        lead: event.lead,
        type: "report.downloaded",
        occurredAt
      });
    }
  } catch (error) {
    console.error("Lead report download tracking failed.", { leadId: lead.id, error });
  }

  const safeCompanyName = lead.input.companyName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(pdf.byteLength),
      "Content-Disposition": `attachment; filename="csavarkompresszor-riport-${
        safeCompanyName || lead.id.slice(0, 8)
      }.pdf"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
