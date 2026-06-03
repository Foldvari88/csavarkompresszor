import { Resend } from "resend";
import { formatHuf, formatKw, formatNumber } from "@/lib/format";
import type { LeadRecord } from "@/lib/calculator/types";
import { generateLeadPdf } from "./pdf";

let resend: Resend | null = null;

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!resend) {
    resend = new Resend(apiKey);
  }
  return resend;
}

export async function sendLeadEmails(lead: LeadRecord) {
  const client = getResend();
  const from = process.env.EMAIL_FROM ?? "Csavarkompresszor kalkulátor <onboarding@resend.dev>";
  const notificationTo = process.env.REPORT_NOTIFICATION_TO;

  if (!client) {
    console.info("RESEND_API_KEY is not configured; lead emails were skipped.", {
      leadId: lead.id,
      email: lead.input.email
    });
    return { mode: "skipped" as const };
  }

  await client.emails.send({
    from,
    to: lead.input.email,
    subject: "Az Ön csavarkompresszor energiahatékonysági kalkulációja",
    html: renderCustomerEmail(lead),
    attachments: [
      {
        filename: `csavarkompresszor-riport-${lead.id.slice(0, 8)}.pdf`,
        content: generateLeadPdf(lead),
        contentType: "application/pdf"
      }
    ]
  });

  if (notificationTo) {
    await client.emails.send({
      from,
      to: notificationTo.split(",").map((email) => email.trim()),
      subject: `Új csavarkompresszor kalkuláció: ${lead.input.companyName}`,
      html: renderInternalNotificationEmail(lead),
      attachments: [
        {
          filename: `csavarkompresszor-riport-${lead.id.slice(0, 8)}.pdf`,
          content: generateLeadPdf(lead),
          contentType: "application/pdf"
        }
      ]
    });
  }

  return { mode: "sent" as const };
}

function renderCustomerEmail(lead: LeadRecord) {
  const { result, input } = lead;
  return emailShell(`
    <p>Köszönjük a kalkulációt. A megadott adatok alapján az ajánlott ${escapeHtml(result.recommendedModel.model)} modell várható éves megtakarítása:</p>
    <div class="metric">${formatHuf(result.annualHufSaved)} / év</div>
    <p>Ez körülbelül ${formatNumber(result.annualKwhSaved)} kWh villamosenergia-megtakarítás évente, ${formatNumber(input.annualHours)} üzemórával és ${formatHuf(input.energyPriceHufKwh)} / kWh áramárral számolva.</p>
    <table>
      <tr><td>Jelenlegi gép</td><td>${escapeHtml(input.brand)} - ${formatKw(input.nominalKw)}</td></tr>
      <tr><td>Ajánlott modell</td><td>${escapeHtml(result.recommendedModel.model)} - ${formatKw(result.recommendedModel.nominalKw)}</td></tr>
      <tr><td>Régi felvett teljesítmény</td><td>${formatNumber(result.selectedLegacy.degradedInputKw, 2)} kW</td></tr>
      <tr><td>Ajánlott modell felvett teljesítménye</td><td>${formatNumber(result.recommendedModel.inputKw, 2)} kW</td></tr>
    </table>
    <p class="fine">${result.assumptions.map(escapeHtml).join("<br>")}</p>
  `);
}

function renderInternalNotificationEmail(lead: LeadRecord) {
  return emailShell(`
    <p>Új kalkulációs beküldés érkezett a csavarkompresszor kalkulátorból.</p>
    <table>
      <tr><td>Cég</td><td>${escapeHtml(lead.input.companyName)}</td></tr>
      <tr><td>Kapcsolattartó</td><td>${escapeHtml(lead.input.name || "-")}</td></tr>
      <tr><td>Email</td><td>${escapeHtml(lead.input.email)}</td></tr>
      <tr><td>Telefon</td><td>${escapeHtml(lead.input.phone || "-")}</td></tr>
      <tr><td>Éves megtakarítás</td><td>${formatHuf(lead.result.annualHufSaved)}</td></tr>
      <tr><td>Prioritás</td><td>${escapeHtml(lead.result.priority.label)}</td></tr>
      <tr><td>Score</td><td>${lead.result.leadScore.score}/100 - ${escapeHtml(lead.result.leadScore.label)}</td></tr>
      <tr><td>Benchmark</td><td>${escapeHtml(lead.result.benchmark.label)}</td></tr>
      <tr><td>Gépek száma</td><td>${lead.result.totalMachineCount}</td></tr>
      <tr><td>Ajánlott modell</td><td>${escapeHtml(lead.result.recommendedModel.model)}</td></tr>
    </table>
  `);
}

function emailShell(content: string) {
  return `
    <html>
      <head>
        <style>
          body { background:#0d1117; color:#f4f7fb; font-family:Arial,sans-serif; padding:24px; }
          .wrap { max-width:680px; margin:0 auto; background:#151b24; border:1px solid #293447; border-radius:16px; padding:28px; }
          .brand { color:#ff3b30; font-weight:800; letter-spacing:.08em; text-transform:uppercase; }
          .metric { font-size:32px; font-weight:800; color:#ffffff; margin:18px 0; }
          table { width:100%; border-collapse:collapse; margin:18px 0; }
          td { border-bottom:1px solid #293447; padding:12px 0; vertical-align:top; }
          td:first-child { color:#9aa7b7; }
          .fine { color:#9aa7b7; font-size:13px; line-height:1.6; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="brand">Csavarkompresszor kalkulátor</div>
          ${content}
        </div>
      </body>
    </html>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

