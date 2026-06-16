import { randomUUID } from "node:crypto";
import { sendLeadEngagementNotification } from "@/lib/leads/email";
import { generateLeadPdf } from "@/lib/leads/pdf";
import { getLead, recordLeadEngagementEvent } from "@/lib/leads/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLead(id);

  if (!lead) {
    return new Response(
      `<!doctype html>
      <html lang="hu">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Riport nem található</title>
          <style>
            body { margin:0; background:#f3f6f8; color:#17202a; font-family:Arial,sans-serif; }
            main { max-width:680px; margin:64px auto; padding:28px; background:#fff; border:1px solid #d7dee8; border-radius:12px; }
            h1 { font-size:24px; margin:0 0 12px; }
            p { color:#334155; line-height:1.65; margin:0 0 18px; }
            a { color:#d92d20; font-weight:700; }
          </style>
        </head>
        <body>
          <main>
            <h1>A PDF riport nem található</h1>
            <p>Ez a letöltési link nem érvényes, vagy a riport már nem érhető el ebben a környezetben.</p>
            <p>Kérjük, nyissa meg az emailhez csatolt PDF-et, vagy kérjen új riportot a kalkulátorból.</p>
            <a href="/">Vissza a kalkulátorhoz</a>
          </main>
        </body>
      </html>`,
      {
        status: 404,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store"
        }
      }
    );
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
