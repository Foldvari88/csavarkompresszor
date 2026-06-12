import { Resend } from "resend";
import { formatCompressorModel, formatHuf, formatKw, formatNumber } from "@/lib/format";
import {
  getCompressorProductImage,
  getCompressorProductImageDataUri,
  getCompressorProductImageUrl
} from "@/lib/product-images";
import type { CalculationResult, LeadRecord } from "@/lib/calculator/types";
import { generateLeadPdf } from "./pdf";

type RenderEmailOptions = {
  inlineProductImages?: boolean;
};

type SequenceScheduleResult =
  | {
      mode: "scheduled";
      emails: Array<{ id: string; scheduledAt: string; resendId: string | null }>;
    }
  | { mode: "skipped"; reason: string }
  | { mode: "failed"; reason: string };

let resend: Resend | null = null;

const defaultConsultationNotificationTo = "info@iparikalkulator.hu";
const consultationNotificationTo = "info@iparikalkulator.hu";

const sequenceSteps = [
  {
    id: "01-audit-context",
    delay: "in 1 day",
    subject: "Mi torzíthatja a csavarkompresszor megtakarítási számítást?",
    preview: "A 4 adat, ami a riport után a leggyakrabban pontosításra szorul.",
    heading: "A kalkuláció jó előszűrő. A következő lépés a műszaki pontosítás.",
    intro:
      "A riport megmutatja a várható megtakarítási irányt. A valós döntéshez általában négy tényezőt érdemes gyorsan ellenőrizni: üzemi nyomás, levegőigény ingadozása, szivárgás és tartalékkapacitás.",
    bullets: [
      "Ha a rendszer nyomása magasabb a szükségesnél, a megtakarítás tovább nőhet.",
      "Ingadozó fogyasztásnál az RS/VSD gép gyakran jobb üzemi ponton dolgozik.",
      "Egy rövid helyszíni vagy telefonos adatpontosítás csökkenti a rossz gépválasztás kockázatát."
    ],
    cta: "Kérek műszaki adatpontosítást"
  },
  {
    id: "02-business-case",
    delay: "in 3 days",
    subject: "Így lesz a kompresszor cseréből vezetői döntési anyag",
    preview: "A megtakarítás számai beszerzési és vezetői nyelvre fordítva.",
    heading: "A legtöbb döntés nem gépmodellről indul, hanem megtakarítási érvről.",
    intro:
      "Ha a beruházást jóváhagyásra kell vinni, a legfontosabb kérdések: mennyi az éves áramköltség-hatás, milyen gyors a megtérülés, és milyen termelési kockázatot csökkent az új gép.",
    bullets: [
      "A riportban szereplő éves és 5 éves potenciál jó alap a CAPEX indokláshoz.",
      "A gép árának megadásával a megtérülési ablak pontosítható.",
      "Több gép esetén érdemes priorizálni, melyik csere hozza a leggyorsabb hatást."
    ],
    cta: "Átbeszélem a megtérülési érvrendszert"
  },
  {
    id: "03-leakage-and-load",
    delay: "in 6 days",
    subject: "Nem mindig a kompresszor a legdrágább hiba",
    preview: "Szivárgás, nyomás és terhelési profil: ahol sok ipari rendszer pénzt veszít.",
    heading: "A kompresszorcsere akkor konvertál jól beruházássá, ha a rendszeroldal is tiszta.",
    intro:
      "A régi gép felvett teljesítménye csak az egyik oldal. Ha a rendszer szivárog, túl magas nyomáson fut, vagy rosszul illeszkedik a terheléshez, a potenciál egy része rejtve marad.",
    bullets: [
      "Szivárgásnál a gép feleslegesen termel levegőt, ami közvetlen áramköltség.",
      "A túl magas nyomás minden üzemórában felesleges energiát kérhet.",
      "A terhelési profil alapján dönthető el, mennyire erős érv az RS/VSD technológia."
    ],
    cta: "Kérem a rendszeroldali ellenőrzést"
  },
  {
    id: "04-model-fit",
    delay: "in 10 days",
    subject: "Biztosan a kalkulátor által ajánlott modell a legjobb illeszkedés?",
    preview: "Mikor elég a kalkulátor ajánlása, és mikor kell pontosabb gépméretezés?",
    heading: "Az ajánlott modell irányt ad, de a végső méretezést a valós levegőigény dönti el.",
    intro:
      "A kalkulátor a megadott névleges teljesítmény, üzemóra és fogyasztási adatok alapján ajánl. Ez jó kiindulópont, de a túlméretezés és az alulméretezés is drága lehet.",
    bullets: [
      "Tartalékigény és csúcsüzem mellett más modell lehet optimális.",
      "Több műszakos vagy ingadozó üzemnél fontos a részterhelési viselkedés.",
      "A rosszul méretezett gép csökkentheti a várt megtakarítást."
    ],
    cta: "Ellenőrizzük az ajánlott modellt"
  },
  {
    id: "05-final-consult",
    delay: "in 18 days",
    subject: "Lezárjuk a kompresszor megtakarítási becslést?",
    preview: "Ha a projekt még aktuális, érdemes most pontos ajánlati irányba vinni.",
    heading: "Ha a megtakarítási potenciál még érdekes, innen már érdemes ajánlati irányba lépni.",
    intro:
      "A kalkuláció alapján látszik, van-e érdemi energiahatási lehetőség. A következő lépés egy rövid egyeztetés, ahol a valós üzemi adatok alapján kiderül, érdemes-e ajánlatot kérni.",
    bullets: [
      "15 perc elég a legfontosabb műszaki és gazdasági kérdések tisztázására.",
      "Ha nincs elég potenciál, azt is gyorsan ki lehet mondani.",
      "Ha van, a beszerzés már pontosabb gép- és ROI-iránnyal indulhat."
    ],
    cta: "Konzultációs visszahívás kérése"
  }
] as const;

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!resend) {
    resend = new Resend(apiKey);
  }
  return resend;
}

function getReplyTo() {
  return normalizeOptionalEmail(process.env.EMAIL_REPLY_TO) ?? defaultConsultationNotificationTo;
}

function normalizeOptionalEmail(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function getEmailRecipients(value: string) {
  return value
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

export async function sendLeadEmails(lead: LeadRecord) {
  const client = getResend();
  const from = process.env.EMAIL_FROM ?? "Csavarkompresszor kalkulátor <onboarding@resend.dev>";
  const replyTo = getReplyTo();
  const notificationTo = process.env.REPORT_NOTIFICATION_TO ?? defaultConsultationNotificationTo;

  if (!client) {
    console.info("RESEND_API_KEY is not configured; lead emails were skipped.", {
      leadId: lead.id,
      email: lead.input.email
    });
    return { mode: "skipped" as const };
  }

  const pdf = generateLeadPdf(lead);
  const pdfAttachment = {
    filename: `csavarkompresszor-riport-${lead.id.slice(0, 8)}.pdf`,
    content: pdf,
    contentType: "application/pdf"
  };
  const customerHtml = renderCustomerEmail(lead);
  const customerEmail = await client.emails.send(
    {
      from,
      replyTo,
      to: lead.input.email,
      subject: `Személyre szabott csavarkompresszor riport: ${lead.input.companyName}`,
      html: customerHtml,
      text: renderPlainTextFromHtml(customerHtml),
      attachments: lead.result.companyProfile.engineeringPdfEligible ? [pdfAttachment] : [],
      tags: [
        { name: "category", value: "calculator-result" },
        { name: "leadId", value: lead.id }
      ]
    },
    {
      headers: {
        "Idempotency-Key": `lead-result-${lead.id}`
      }
    }
  );

  let notificationEmailId: string | null = null;

  if (notificationTo) {
    const notificationHtml = renderInternalNotificationEmail(lead);
    const notificationEmail = await client.emails.send(
      {
        from,
        replyTo,
        to: getEmailRecipients(notificationTo),
        subject: `Új csavarkompresszor kalkuláció: ${lead.input.companyName}`,
        html: notificationHtml,
        text: renderPlainTextFromHtml(notificationHtml),
        attachments: [pdfAttachment],
        tags: [
          { name: "category", value: "lead-notification" },
          { name: "leadId", value: lead.id }
        ]
      },
      {
        headers: {
          "Idempotency-Key": `lead-notification-${lead.id}`
        }
      }
    );

    notificationEmailId = notificationEmail.data?.id ?? null;
  }

  const sequence = await scheduleLeadSequence({ client, from, lead, replyTo });

  return {
    mode: "sent" as const,
    customerEmailId: customerEmail.data?.id ?? null,
    notificationEmailId,
    sequence
  };
}

export async function sendLeadEngagementNotification({
  lead,
  type,
  occurredAt,
  detail
}: {
  lead: LeadRecord;
  type: "email.opened" | "email.clicked" | "report.downloaded";
  occurredAt: Date;
  detail?: string;
}) {
  const client = getResend();
  const notificationTo = process.env.REPORT_NOTIFICATION_TO ?? defaultConsultationNotificationTo;

  if (!client) {
    return { mode: "skipped" as const };
  }

  const from = process.env.EMAIL_FROM ?? "Csavarkompresszor kalkulátor <onboarding@resend.dev>";
  const replyTo = getReplyTo();
  const eventLabel = formatEngagementEventType(type);
  const html = renderLeadEngagementNotificationEmail({ lead, type, occurredAt, detail });

  await client.emails.send(
    {
      from,
      replyTo,
      to: getEmailRecipients(notificationTo),
      subject: `${eventLabel}: ${lead.input.companyName}`,
      html,
      text: renderPlainTextFromHtml(html),
      tags: [
        { name: "category", value: "lead-engagement-notification" },
        { name: "leadId", value: lead.id },
        { name: "eventType", value: type.replace(".", "-") }
      ]
    },
    {
      headers: {
        "Idempotency-Key": `lead-engagement-${lead.id}-${type}-${occurredAt.toISOString()}`
      }
    }
  );

  return { mode: "sent" as const };
}

export async function sendConsultationRequestNotification({
  lead,
  occurredAt,
  source
}: {
  lead: LeadRecord;
  occurredAt: Date;
  source: string;
}) {
  const client = getResend();
  const notificationTo = consultationNotificationTo;

  if (!client) {
    return { mode: "skipped" as const };
  }

  const from = process.env.EMAIL_FROM ?? "Csavarkompresszor kalkulátor <onboarding@resend.dev>";
  const replyTo = getReplyTo();
  const html = renderConsultationRequestNotificationEmail({ lead, occurredAt, source });

  await client.emails.send(
    {
      from,
      replyTo,
      to: getEmailRecipients(notificationTo),
      subject: "visszahívást kértek",
      html,
      text: renderPlainTextFromHtml(html),
      tags: [
        { name: "category", value: "consultation-request-notification" },
        { name: "leadId", value: lead.id },
        { name: "source", value: source.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 64) }
      ]
    },
    {
      headers: {
        "Idempotency-Key": `consultation-request-${lead.id}-${source}-${occurredAt.toISOString()}`
      }
    }
  );

  return { mode: "sent" as const };
}

async function scheduleLeadSequence({
  client,
  from,
  lead,
  replyTo
}: {
  client: Resend;
  from: string;
  lead: LeadRecord;
  replyTo?: string;
}): Promise<SequenceScheduleResult> {
  if (process.env.EMAIL_SEQUENCE_ENABLED === "false") {
    return { mode: "skipped", reason: "disabled" };
  }

  if (!lead.input.consentMarketing) {
    return { mode: "skipped", reason: "marketing-consent-missing" };
  }

  try {
    const scheduled = [];

    for (const step of sequenceSteps) {
      const html = renderSequenceEmail(lead, step);
      const response = await client.emails.send(
        {
          from,
          replyTo,
          to: lead.input.email,
          subject: step.subject,
          html,
          text: renderPlainTextFromHtml(html),
          scheduledAt: step.delay,
          tags: [
            { name: "category", value: "lead-sequence" },
            { name: "leadId", value: lead.id },
            { name: "sequenceStep", value: step.id }
          ]
        },
        {
          headers: {
            "Idempotency-Key": `lead-sequence-${lead.id}-${step.id}`
          }
        }
      );

      scheduled.push({
        id: step.id,
        scheduledAt: step.delay,
        resendId: response.data?.id ?? null
      });
    }

    return { mode: "scheduled", emails: scheduled };
  } catch (error) {
    console.error("Lead email sequence scheduling failed.", {
      leadId: lead.id,
      error
    });
    return {
      mode: "failed",
      reason: error instanceof Error ? error.message : "unknown-error"
    };
  }
}

export function renderCustomerEmail(lead: LeadRecord, options: RenderEmailOptions = {}) {
  const { result, input } = lead;
  const appointmentUrl = getTrackedAppointmentUrl(lead, "result-email");
  const reportDownloadUrl = getTrackedReportDownloadUrl(lead);
  const recommendedModelName = formatCompressorModel(result.recommendedModel);
  const personalizedIntro = getPersonalizedIntro(lead);
  const personalizedNextStep = getPersonalizedNextStep(lead);
  const engineeringPdfEligible = result.companyProfile.engineeringPdfEligible;
  const engineeringPdfNotice = engineeringPdfEligible
    ? "A mérnöki PDF riportot csatoltuk az emailhez."
    : "Céges emaillel a rendszer mérnöki PDF-et, részletes géptípus-ajánlást és visszahívási opciót is ad.";
  const html = emailShell(`
    <p>Tisztelt ${escapeHtml(input.name)}!</p>
    <p>Köszönjük, hogy elküldte részünkre a csavarkompresszor energiahatékonysági kalkulációhoz szükséges adatokat.</p>
    <p>${escapeHtml(personalizedIntro)}</p>
    ${renderCompanyProfileEmailBlock(lead)}
    <p>A megadott adatok alapján az ajánlott ${escapeHtml(recommendedModelName)} modell várható éves megtakarítása:</p>
    <div class="metric">${formatHuf(result.annualHufSaved)} / év</div>
    ${engineeringPdfEligible ? renderRecommendedProductImage(result, options) : ""}
    <p>Ez körülbelül ${formatNumber(result.annualKwhSaved)} kWh villamosenergia-megtakarítás évente, ${formatNumber(input.annualHours)} üzemórával és ${formatHuf(input.energyPriceHufKwh)} / kWh áramárral számolva.</p>
    <table>
      <tr><td>Jelenlegi gép</td><td>${escapeHtml(input.brand)} - ${formatKw(input.nominalKw)}</td></tr>
      <tr><td>Ajánlott modell</td><td>${escapeHtml(recommendedModelName)} - ${formatKw(result.recommendedModel.nominalKw)}</td></tr>
      <tr><td>Régi felvett teljesítmény</td><td>${formatNumber(result.selectedLegacy.degradedInputKw, 2)} kW</td></tr>
      <tr><td>Ajánlott modell felvett teljesítménye</td><td>${formatNumber(result.recommendedModel.inputKw, 2)} kW</td></tr>
      ${renderHeatRecoveryRows(result)}
      <tr><td>Lead prioritás</td><td>${escapeHtml(result.priority.label)}</td></tr>
    </table>
    <p>${escapeHtml(engineeringPdfNotice)}</p>
    ${
      engineeringPdfEligible
        ? `<p><a class="secondary-cta" href="${escapeHtml(reportDownloadUrl)}">Mérnöki PDF riport letöltése</a></p>`
        : ""
    }
    <p>${escapeHtml(result.priority.description)}</p>
    <p>${escapeHtml(personalizedNextStep)}</p>
    <p><a class="cta" href="${escapeHtml(appointmentUrl)}">Konzultációs visszahívás kérése</a></p>
    ${renderCustomerEmailSignature()}
    <p class="fine">${result.assumptions.map(escapeHtml).join("<br>")}</p>
  `);
  return engineeringPdfEligible ? html : stripEngineeringDetailsFromCustomerEmail(html, result);
}

function stripEngineeringDetailsFromCustomerEmail(html: string, result: CalculationResult) {
  const recommendedModelName = escapeRegExp(formatCompressorModel(result.recommendedModel));
  const nominalKw = escapeRegExp(formatKw(result.recommendedModel.nominalKw));
  const inputKw = escapeRegExp(formatNumber(result.recommendedModel.inputKw, 2));

  return html
    .replace(
      new RegExp(`<p>[\\s\\S]*?${recommendedModelName}[\\s\\S]*?</p>`, "i"),
      "<p>Köszönjük a kalkulációt. Az általános iparági becslés alapján a várható éves megtakarítási potenciál:</p>"
    )
    .replace(new RegExp(`<tr><td>[^<]*modell</td><td>${recommendedModelName} - ${nominalKw}</td></tr>`, "i"), "")
    .replace(
      new RegExp(`<tr><td>[^<]*modell felvett teljes[^<]*</td><td>${inputKw} kW</td></tr>`, "i"),
      `<tr><td>Pontossági szint</td><td>${escapeHtml(result.companyProfile.label)} - ${escapeHtml(
        result.companyProfile.expectedAccuracy
      )}</td></tr>`
    )
    .replace(/<div class="product-photo">[\s\S]*?<\/div>\s*<\/div>/, "")
    .replace(/<p><a class="cta"[\s\S]*?<\/a><\/p>/, "");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderSequenceEmail(lead: LeadRecord, step: (typeof sequenceSteps)[number]) {
  const appointmentUrl = getTrackedAppointmentUrl(lead, step.id);
  const { result, input } = lead;
  const recommendedModelName = formatCompressorModel(result.recommendedModel);
  return emailShell(`
    <div class="preheader">${escapeHtml(step.preview)}</div>
    <h1>${escapeHtml(step.heading)}</h1>
    <p>Tisztelt ${escapeHtml(input.name)}!</p>
    <p>${escapeHtml(step.intro)}</p>
    <div class="summary-box">
      <strong>${escapeHtml(input.companyName)} kalkulációs összefoglaló</strong>
      ${renderRecommendedProductImage(result)}
      <table>
        <tr><td>Becsült éves megtakarítás</td><td>${formatHuf(result.annualHufSaved)}</td></tr>
        <tr><td>5 éves potenciál</td><td>${formatHuf(result.fiveYearHufSaved)}</td></tr>
        <tr><td>Ajánlott modell</td><td>${escapeHtml(recommendedModelName)} - ${formatKw(result.recommendedModel.nominalKw)}</td></tr>
        ${renderHeatRecoveryRows(result)}
        <tr><td>Prioritás</td><td>${escapeHtml(result.priority.label)}</td></tr>
      </table>
    </div>
    <ul>
      ${step.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
    </ul>
    <p><a class="cta" href="${escapeHtml(appointmentUrl)}">${escapeHtml(step.cta)}</a></p>
    <p class="fine">Azért kapja ezt a szakmai utánkövetést, mert a kalkuláció beküldésekor kérte a kapcsolódó energiahatékonysági és ajánlat-előkészítő információkat.</p>
  `);
}

export function renderInternalNotificationEmail(
  lead: LeadRecord,
  sequence?: SequenceScheduleResult
) {
  const recommendedModelName = formatCompressorModel(lead.result.recommendedModel);
  return emailShell(`
    <p>Új kalkulációs beküldés érkezett a csavarkompresszor kalkulátorból.</p>
    ${renderRecommendedProductImage(lead.result)}
    <table>
      <tr><td>Cég</td><td>${escapeHtml(lead.input.companyName)}</td></tr>
      <tr><td>Kapcsolattartó</td><td>${escapeHtml(lead.input.name || "-")}</td></tr>
      <tr><td>Email</td><td>${escapeHtml(lead.input.email)}</td></tr>
      <tr><td>Telefon</td><td>${escapeHtml(lead.input.phone || "-")}</td></tr>
      <tr><td>Marketing hozzájárulás</td><td>${lead.input.consentMarketing ? "igen" : "nem"}</td></tr>
      <tr><td>Email szekvencia</td><td>${escapeHtml(formatSequenceStatus(sequence))}</td></tr>
      <tr><td>Éves megtakarítás</td><td>${formatHuf(lead.result.annualHufSaved)}</td></tr>
      ${renderHeatRecoveryRows(lead.result)}
      <tr><td>Prioritás</td><td>${escapeHtml(lead.result.priority.label)}</td></tr>
      <tr><td>Score</td><td>${lead.result.leadScore.score}/100 - ${escapeHtml(lead.result.leadScore.label)}</td></tr>
      <tr><td>Benchmark</td><td>${escapeHtml(lead.result.benchmark.label)}</td></tr>
      <tr><td>Gépek száma</td><td>${lead.result.totalMachineCount}</td></tr>
      <tr><td>Ajánlott modell</td><td>${escapeHtml(recommendedModelName)}</td></tr>
    </table>
    <p>${escapeHtml(lead.result.leadScore.reasons.join(" "))}</p>
  `);
}

export function renderLeadEngagementNotificationEmail({
  lead,
  type,
  occurredAt,
  detail
}: {
  lead: LeadRecord;
  type: "email.opened" | "email.clicked" | "report.downloaded";
  occurredAt: Date;
  detail?: string;
}) {
  return emailShell(`
    <p>${escapeHtml(formatEngagementEventType(type))} történt egy kalkulátor leadnél.</p>
    <table>
      <tr><td>Cég</td><td>${escapeHtml(lead.input.companyName)}</td></tr>
      <tr><td>Kapcsolattartó</td><td>${escapeHtml(lead.input.name || "-")}</td></tr>
      <tr><td>Email</td><td>${escapeHtml(lead.input.email)}</td></tr>
      <tr><td>Telefon</td><td>${escapeHtml(lead.input.phone || "-")}</td></tr>
      <tr><td>Esemény</td><td>${escapeHtml(formatEngagementEventType(type))}</td></tr>
      <tr><td>Időpont</td><td>${escapeHtml(
        occurredAt.toLocaleString("hu-HU", { timeZone: "Europe/Budapest" })
      )}</td></tr>
      <tr><td>Email megnyitás</td><td>${formatEngagementSummary(
        lead.engagement.emailOpenedAt,
        lead.engagement.emailOpenCount
      )}</td></tr>
      <tr><td>Riport letöltés</td><td>${formatEngagementSummary(
        lead.engagement.reportDownloadedAt,
        lead.engagement.reportDownloadCount
      )}</td></tr>
      ${detail ? `<tr><td>Részlet</td><td>${escapeHtml(detail)}</td></tr>` : ""}
    </table>
  `);
}

export function renderConsultationRequestNotificationEmail({
  lead,
  occurredAt,
  source
}: {
  lead: LeadRecord;
  occurredAt: Date;
  source: string;
}) {
  return emailShell(`
    <p>Konzultációs visszahívás kérést indított egy kalkulátor lead.</p>
    <table>
      <tr><td>Cég</td><td>${escapeHtml(lead.input.companyName)}</td></tr>
      <tr><td>Kapcsolattartó</td><td>${escapeHtml(lead.input.name || "-")}</td></tr>
      <tr><td>Email</td><td>${escapeHtml(lead.input.email)}</td></tr>
      <tr><td>Telefon</td><td>${escapeHtml(lead.input.phone || "-")}</td></tr>
      <tr><td>Céges weboldal</td><td>${escapeHtml(lead.input.companyWebsite || "-")}</td></tr>
      <tr><td>Tevékenység</td><td>${escapeHtml(lead.input.companyActivity || "-")}</td></tr>
      <tr><td>Forrás CTA</td><td>${escapeHtml(source)}</td></tr>
      <tr><td>Időpont</td><td>${escapeHtml(
        occurredAt.toLocaleString("hu-HU", { timeZone: "Europe/Budapest" })
      )}</td></tr>
      <tr><td>Prioritás</td><td>${escapeHtml(lead.result.priority.label)}</td></tr>
      <tr><td>Lead score</td><td>${lead.result.leadScore.score}/100 - ${escapeHtml(lead.result.leadScore.label)}</td></tr>
      <tr><td>Éves megtakarítás</td><td>${formatHuf(lead.result.annualHufSaved)}</td></tr>
      <tr><td>5 éves potenciál</td><td>${formatHuf(lead.result.fiveYearHufSaved)}</td></tr>
      <tr><td>Jelenlegi gép</td><td>${escapeHtml(lead.input.brand)} - ${formatKw(lead.input.nominalKw)}</td></tr>
      <tr><td>Üzemóra</td><td>${formatNumber(lead.input.annualHours)} óra/év</td></tr>
      <tr><td>Áramár</td><td>${formatHuf(lead.input.energyPriceHufKwh)} / kWh</td></tr>
      <tr><td>Ajánlott modell</td><td>${escapeHtml(
        formatCompressorModel(lead.result.recommendedModel)
      )}</td></tr>
      <tr><td>Lead azonosító</td><td>${escapeHtml(lead.id)}</td></tr>
    </table>
    <p>Erre a leadre érdemes gyorsan visszatelefonálni, mert aktív telefonos konzultációs szándékot jelzett.</p>
  `);
}

function renderRecommendedProductImage(
  result: CalculationResult,
  options: RenderEmailOptions = {}
) {
  const image = getCompressorProductImage(result.recommendedModel);
  const imageUrl = options.inlineProductImages
    ? getCompressorProductImageDataUri(result.recommendedModel)
    : getCompressorProductImageUrl(result.recommendedModel);
  const recommendedModelName = formatCompressorModel(result.recommendedModel);

  return `
    <div class="product-photo">
      <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(image.alt)}" />
      <div>
        <span>Ajánlott gépcsalád</span>
        <strong>${escapeHtml(recommendedModelName)}</strong>
        <small>${formatKw(result.recommendedModel.nominalKw)} névleges teljesítmény</small>
      </div>
    </div>
  `;
}

function renderHeatRecoveryRows(result: CalculationResult) {
  const heat = result.heatRecovery;
  if (!heat) return "";

  return `
      <tr><td>Hővisszanyerés alapja</td><td>${escapeHtml(heat.compressorModelName)} - ${formatKw(heat.compressorNominalKw)}</td></tr>
      <tr><td>Kompresszor üzemóra / év</td><td>${formatNumber(heat.annualHours)} óra</td></tr>
      <tr><td>Visszanyerhető hőteljesítmény</td><td>${formatNumber(heat.recoverableHeatKw, 2)} kW</td></tr>
      <tr><td>Visszanyerhető hőteljesítmény veszteséggel</td><td>${formatNumber(heat.usefulHeatKw, 2)} kW</td></tr>
      <tr><td>Földgáz ára</td><td>${formatHuf(heat.gasPriceHufPerM3)} / m3</td></tr>
      <tr><td>HMV jelentése</td><td>használati melegvíz</td></tr>
      <tr><td>Hővisszanyerési megtakarítás</td><td>${formatHuf(heat.seasonalSavingsHuf)} / év</td></tr>
      <tr><td>Elméleti hővisszanyerési hatás</td><td>${formatHuf(heat.theoreticalSavingsHuf)} / év</td></tr>
      <tr><td>Kiváltható földgáz fűtés/HMV kombinációval</td><td>${formatNumber(heat.seasonalGasSavedM3)} m3 / év</td></tr>
      <tr><td>Kiváltható földgáz folyamatos HMV/ipari felhasználásnál</td><td>${formatNumber(heat.theoreticalGasSavedM3)} m3 / év</td></tr>
      <tr><td>Hasznosítható hőenergia</td><td>${formatNumber(heat.annualUsefulHeatKwh)} kWh / év</td></tr>
      <tr><td>Fűtés/HMV kombinációval kiváltható gázköltség</td><td>${formatHuf(heat.seasonalSavingsHuf)} / év</td></tr>
    `;
}

function renderCompanyProfileEmailBlock(lead: LeadRecord) {
  const { input, result } = lead;
  const detectedContext = [
    ...result.companyProfile.detectedSegments,
    ...result.companyProfile.operatingSignals,
    ...result.companyProfile.airQualitySignals
  ].slice(0, 5);

  return `
    <div class="profile-box">
      <strong>${escapeHtml(input.companyName)} cégprofil alapján súlyozott kalkuláció</strong>
      <p>A megadott weboldal és tevékenység alapján a riport nem általános sablonként, hanem a várható felhasználási környezethez igazítva készült.</p>
      <table>
        <tr><td>Céges weboldal</td><td>${escapeHtml(input.companyWebsite || "-")}</td></tr>
        <tr><td>Tevékenység</td><td>${escapeHtml(input.companyActivity || "-")}</td></tr>
        <tr><td>Pontossági szint</td><td>${escapeHtml(result.companyProfile.label)} - ${escapeHtml(
          result.companyProfile.expectedAccuracy
        )}</td></tr>
        <tr><td>Kompatibilitási jelzés</td><td>${escapeHtml(result.companyProfile.compatibilityLabel)}</td></tr>
        <tr><td>Terhelési súlyozás</td><td>${escapeHtml(formatLoadProfileAdjustment(result.companyProfile.loadProfileAdjustment))}</td></tr>
      </table>
      ${
        detectedContext.length
          ? `<p class="profile-tags">${detectedContext.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</p>`
          : ""
      }
    </div>
  `;
}

function renderCustomerEmailSignature() {
  return `
    <div class="signature">
      <p>Tisztelettel,</p>
      <strong>az IpariKalkulator.hu csapata</strong>
    </div>
  `;
}

function getPersonalizedIntro(lead: LeadRecord) {
  const { input, result } = lead;
  const websitePart = input.companyWebsite ? ` (${input.companyWebsite})` : "";
  const activityPart = input.companyActivity
    ? `, ${input.companyActivity.toLowerCase()} jellegű felhasználás mellett`
    : "";

  return `${input.companyName}${websitePart} részére elkészítettük a csavarkompresszor energiahatékonysági előkalkulációt${activityPart}. A számítás a megadott üzemórát, áramdíjat, jelenlegi gépadatokat és a cégprofil alapján becsült felhasználási környezetet veszi figyelembe. Pontossági szint: ${result.companyProfile.label}, várható pontosság: ${result.companyProfile.expectedAccuracy}.`;
}

function getPersonalizedNextStep(lead: LeadRecord) {
  const { input, result } = lead;
  const activity = input.companyActivity ? `${input.companyActivity} környezetben` : "az Ön üzemében";

  if (result.heatRecovery) {
    return `${input.companyName} esetében a következő szakmai lépés annak ellenőrzése, hogy ${activity} a hővisszanyerés milyen arányban használható fűtésre vagy HMV célra, és mekkora gázköltség váltható ki valós üzemi adatokkal.`;
  }

  if (result.companyProfile.loadProfileAdjustment === "intensive") {
    return `${input.companyName} esetében érdemes a terhelési profilt és a részterhelési üzemet külön pontosítani, mert intenzívebb felhasználásnál az RS/VSD technológia megtakarítási hatása erősebben jelentkezhet.`;
  }

  return `${input.companyName} esetében a következő lépés a tényleges levegőigény, üzemi nyomás és tartalékkapacitás rövid pontosítása, hogy az ajánlott géptartomány üzemi oldalról is illeszkedjen.`;
}

function formatLoadProfileAdjustment(value: CalculationResult["companyProfile"]["loadProfileAdjustment"]) {
  if (value === "intensive") return "intenzívebb üzemi súlyozás";
  if (value === "conservative") return "konzervatívabb üzemi súlyozás";
  return "standard üzemi súlyozás";
}

function formatSequenceStatus(sequence?: SequenceScheduleResult) {
  if (!sequence) return "nem futott";
  if (sequence.mode === "scheduled") {
    return `${sequence.emails.length} follow-up email időzítve`;
  }
  if (sequence.mode === "failed") {
    return `sikertelen időzítés: ${sequence.reason}`;
  }
  return `kihagyva: ${sequence.reason}`;
}

function getTrackedReportDownloadUrl(lead: LeadRecord) {
  return `${getPublicBaseUrl()}/api/reports/${lead.id}/download`;
}

function getTrackedAppointmentUrl(lead: LeadRecord, source: string) {
  return `${getPublicBaseUrl()}/api/leads/${lead.id}/appointment?source=${encodeURIComponent(source)}`;
}

function getPublicBaseUrl() {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "https://iparikalkulator.hu";

  return configured.replace(/\/+$/, "");
}

function formatEngagementEventType(type: "email.opened" | "email.clicked" | "report.downloaded") {
  if (type === "email.opened") return "Email megnyitva";
  if (type === "email.clicked") return "Email link kattintás";
  return "Riport letöltve";
}

function formatEngagementSummary(firstAt: string | null, count: number) {
  if (!firstAt) return "még nem történt";
  return `${new Date(firstAt).toLocaleString("hu-HU", { timeZone: "Europe/Budapest" })} (${count}x)`;
}

function emailShell(content: string) {
  return `
    <html>
      <head>
        <style>
          body { background:#f3f6f8; color:#17202a; font-family:Arial,sans-serif; padding:24px; }
          .wrap { max-width:680px; margin:0 auto; background:#ffffff; border:1px solid #d7dee8; border-radius:12px; padding:28px; }
          .brand { color:#d92d20; font-weight:800; letter-spacing:.08em; text-transform:uppercase; }
          .preheader { display:none; max-height:0; overflow:hidden; opacity:0; }
          h1 { color:#17202a; font-size:24px; line-height:1.25; margin:22px 0 12px; }
          p { color:#334155; font-size:15px; line-height:1.7; }
          ul { color:#334155; line-height:1.7; padding-left:22px; }
          li { margin:8px 0; }
          .metric { font-size:32px; font-weight:800; color:#17202a; margin:18px 0; }
          .product-photo { background:#f8fafc; border:1px solid #d7dee8; border-radius:12px; margin:18px 0; overflow:hidden; }
          .product-photo img { display:block; width:100%; max-height:260px; object-fit:contain; background:#ffffff; }
          .product-photo div { border-top:1px solid #e2e8f0; padding:14px 16px 16px; }
          .product-photo span { color:#64748b; display:block; font-size:12px; font-weight:800; letter-spacing:.07em; margin-bottom:6px; text-transform:uppercase; }
          .product-photo strong { color:#17202a; display:block; font-size:20px; line-height:1.25; }
          .product-photo small { color:#64748b; display:block; font-size:13px; margin-top:5px; }
          .summary-box { background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:16px; margin:18px 0; }
          .profile-box { background:#f8fafc; border:1px solid #d7dee8; border-left:4px solid #303184; border-radius:10px; padding:16px; margin:18px 0; }
          .profile-box strong { color:#17202a; display:block; font-size:16px; margin-bottom:8px; }
          .profile-box table { margin:12px 0; }
          .profile-tags { margin:10px 0 0; }
          .profile-tags span { background:#eef2ff; border:1px solid #dbe3ff; border-radius:999px; color:#303184; display:inline-block; font-size:12px; font-weight:700; margin:0 6px 6px 0; padding:6px 9px; }
          .signature { border-top:1px solid #d7dee8; margin-top:24px; padding-top:18px; }
          .signature p { margin:0 0 6px; }
          .signature strong { color:#17202a; display:block; font-size:16px; margin-bottom:4px; }
          .signature span { color:#64748b; display:block; font-size:13px; line-height:1.5; }
          table { width:100%; border-collapse:collapse; margin:18px 0; }
          td { border-bottom:1px solid #e2e8f0; padding:12px 0; vertical-align:top; }
          td:first-child { color:#64748b; width:44%; }
          .cta { background:#d92d20; border-radius:8px; color:#ffffff !important; display:inline-block; font-weight:700; padding:12px 16px; text-decoration:none; }
          .secondary-cta { background:#17202a; border-radius:8px; color:#ffffff !important; display:inline-block; font-weight:700; padding:12px 16px; text-decoration:none; }
          .fine { color:#64748b; font-size:13px; line-height:1.6; }
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

function renderPlainTextFromHtml(html: string) {
  return decodeHtmlEntities(
    html
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|h1|h2|h3|tr|table|ul|li)>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

function decodeHtmlEntities(value: string) {
  return value
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
