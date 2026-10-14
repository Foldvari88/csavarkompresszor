import { Resend } from "resend";
import type { CampaignInquiryRecord } from "./types";
import { attemptEmailSend, getDeliveryMode, type EmailOutcome } from "@/lib/email-delivery";

let resend: Resend | null = null;

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!resend) resend = new Resend(apiKey);
  return resend;
}

export async function sendCampaignInquiryEmails(inquiry: CampaignInquiryRecord) {
  const client = getResend();
  if (!client) {
    console.info("RESEND_API_KEY is not configured; campaign inquiry emails were skipped.", {
      inquiryId: inquiry.id
    });
    return { mode: "skipped" as const };
  }

  const from = process.env.EMAIL_FROM ?? "iparikalkulator.hu <onboarding@resend.dev>";
  const replyTo = process.env.EMAIL_REPLY_TO?.trim() || "info@iparikalkulator.hu";
  const notificationTo =
    process.env.CAMPAIGN_INQUIRY_NOTIFICATION_TO?.trim() ||
    process.env.REPORT_NOTIFICATION_TO?.trim() ||
    "info@iparikalkulator.hu";
  const label = getKindLabel(inquiry.input.kind);
  const internalHtml = renderInternalEmail(inquiry, label);

  const notification = await attemptEmailSend(() => client.emails.send(
    {
      from,
      replyTo,
      to: notificationTo.split(",").map((value) => value.trim()).filter(Boolean),
      subject: `Új ${label.toLowerCase()} ajánlatkérés: ${inquiry.input.companyName}`,
      html: internalHtml,
      text: stripHtml(internalHtml),
      tags: [
        { name: "category", value: "customer-reactivation" },
        { name: "inquiryId", value: inquiry.id }
      ]
    },
    { headers: { "Idempotency-Key": `campaign-inquiry-${inquiry.id}` } }
  ));

  let customer: EmailOutcome = { status: "skipped" };
  const customerAddress = inquiry.input.email;
  if (customerAddress) {
    const confirmationHtml = renderConfirmationEmail(inquiry, label);
    customer = await attemptEmailSend(() => client.emails.send(
      {
        from,
        replyTo,
        to: customerAddress,
        subject: `Ajánlatkérését rögzítettük – ${label}`,
        html: confirmationHtml,
        text: stripHtml(confirmationHtml),
        tags: [
          { name: "category", value: "customer-reactivation-confirmation" },
          { name: "inquiryId", value: inquiry.id }
        ]
      },
      { headers: { "Idempotency-Key": `campaign-inquiry-confirmation-${inquiry.id}` } }
    ));
  }

  return {
    mode: getDeliveryMode([notification, customer]),
    customer,
    notification,
    notificationId: notification.id ?? null,
    confirmationId: customer.id ?? null
  };
}

function renderInternalEmail(inquiry: CampaignInquiryRecord, label: string) {
  const input = inquiry.input;
  const rows = [
    ["Típus", label],
    ["Cég", input.companyName],
    ["Kapcsolattartó", input.name],
    ["E-mail", input.email ?? "—"],
    ["Telefon", input.phone ?? "—"],
    ["Márka", input.equipmentBrand ?? "—"],
    ["Típus / modell", input.equipmentModel ?? "—"],
    ["Elsődleges adat", input.primaryDetail ?? "—"],
    ["Másodlagos adat", input.secondaryDetail ?? "—"],
    ["Megjegyzés", input.message ?? "—"],
    ["Oldal", input.pageSource],
    ["UTM kampány", input.tracking?.utmCampaign ?? "—"],
    ["UTM kreatív", input.tracking?.utmContent ?? "—"],
    ["Google click ID", input.tracking?.gclid ?? input.tracking?.gbraid ?? input.tracking?.wbraid ?? "—"],
    ["Marketing hozzájárulás", input.consentMarketing ? "igen" : "nem"],
    ["Hirdetési személyre szabás", input.consentAdsPersonalization ? "igen" : "nem"]
  ];

  return `
    <div style="font-family:Arial,sans-serif;color:#172033;line-height:1.55;max-width:720px;margin:auto">
      <h1 style="font-size:24px">Új ${escapeHtml(label.toLowerCase())} ajánlatkérés</h1>
      <p>Azonosító: <strong>${escapeHtml(inquiry.id)}</strong></p>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([key, value]) =>
              `<tr><th style="text-align:left;padding:9px;border-bottom:1px solid #dfe4ec;width:34%">${escapeHtml(key)}</th><td style="padding:9px;border-bottom:1px solid #dfe4ec">${escapeHtml(value)}</td></tr>`
          )
          .join("")}
      </table>
    </div>`;
}

function renderConfirmationEmail(inquiry: CampaignInquiryRecord, label: string) {
  return `
    <div style="font-family:Arial,sans-serif;color:#172033;line-height:1.6;max-width:640px;margin:auto">
      <p style="color:#c6202d;font-weight:700">IMEX szakmai ajánlatkérés</p>
      <h1 style="font-size:26px">Köszönjük, rögzítettük megkeresését.</h1>
      <p>Kedves ${escapeHtml(inquiry.input.name)}!</p>
      <p>A(z) <strong>${escapeHtml(label.toLowerCase())}</strong> témájú ajánlatkérését továbbítottuk szakmai feldolgozásra. A megadott elérhetőségek egyikén jelentkezünk.</p>
      <p style="color:#5b6577;font-size:13px">Hivatkozási szám: ${escapeHtml(inquiry.id.slice(0, 8))}</p>
    </div>`;
}

function getKindLabel(kind: CampaignInquiryRecord["input"]["kind"]) {
  if (kind === "service") return "Kompresszorszerviz";
  if (kind === "compressor-replacement") return "Csavarkompresszor-csere";
  if (kind === "nitrogen") return "Nitrogéngenerátor";
  return "Ipari levegőtechnikai";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
