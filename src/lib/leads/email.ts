import { Resend } from "resend";
import { formatHuf, formatKw, formatNumber } from "@/lib/format";
import type { LeadRecord } from "@/lib/calculator/types";
import { generateLeadPdf } from "./pdf";

type SequenceScheduleResult =
  | {
      mode: "scheduled";
      emails: Array<{ id: string; scheduledAt: string; resendId: string | null }>;
    }
  | { mode: "skipped"; reason: string }
  | { mode: "failed"; reason: string };

let resend: Resend | null = null;

const defaultAppointmentUrl =
  "https://calendly.com/csavarkompresszor-kalkulator/15-perces-muszakiegyeztetes";

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
    cta: "Foglalok egy 15 perces egyeztetést"
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

export async function sendLeadEmails(lead: LeadRecord) {
  const client = getResend();
  const from = process.env.EMAIL_FROM ?? "Csavarkompresszor kalkulátor <onboarding@resend.dev>";
  const replyTo = process.env.EMAIL_REPLY_TO;
  const notificationTo = process.env.REPORT_NOTIFICATION_TO;

  if (!client) {
    console.info("RESEND_API_KEY is not configured; lead emails were skipped.", {
      leadId: lead.id,
      email: lead.input.email
    });
    return { mode: "skipped" as const };
  }

  const pdf = generateLeadPdf(lead);
  const customerEmail = await client.emails.send(
    {
      from,
      replyTo,
      to: lead.input.email,
      subject: "Az Ön csavarkompresszor energiahatékonysági kalkulációja",
      html: renderCustomerEmail(lead),
      attachments: [
        {
          filename: `csavarkompresszor-riport-${lead.id.slice(0, 8)}.pdf`,
          content: pdf,
          contentType: "application/pdf"
        }
      ],
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

  const sequence = await scheduleLeadSequence({ client, from, lead, replyTo });

  if (notificationTo) {
    await client.emails.send(
      {
        from,
        replyTo,
        to: notificationTo.split(",").map((email) => email.trim()),
        subject: `Új csavarkompresszor kalkuláció: ${lead.input.companyName}`,
        html: renderInternalNotificationEmail(lead, sequence),
        attachments: [
          {
            filename: `csavarkompresszor-riport-${lead.id.slice(0, 8)}.pdf`,
            content: pdf,
            contentType: "application/pdf"
          }
        ],
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
  }

  return {
    mode: "sent" as const,
    customerEmailId: customerEmail.data?.id ?? null,
    sequence
  };
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
      const response = await client.emails.send(
        {
          from,
          replyTo,
          to: lead.input.email,
          subject: step.subject,
          html: renderSequenceEmail(lead, step),
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

export function renderCustomerEmail(lead: LeadRecord) {
  const { result, input } = lead;
  const appointmentUrl = getAppointmentUrl();
  return emailShell(`
    <p>Köszönjük a kalkulációt. A megadott adatok alapján az ajánlott ${escapeHtml(result.recommendedModel.model)} modell várható éves megtakarítása:</p>
    <div class="metric">${formatHuf(result.annualHufSaved)} / év</div>
    <p>Ez körülbelül ${formatNumber(result.annualKwhSaved)} kWh villamosenergia-megtakarítás évente, ${formatNumber(input.annualHours)} üzemórával és ${formatHuf(input.energyPriceHufKwh)} / kWh áramárral számolva.</p>
    <table>
      <tr><td>Jelenlegi gép</td><td>${escapeHtml(input.brand)} - ${formatKw(input.nominalKw)}</td></tr>
      <tr><td>Ajánlott modell</td><td>${escapeHtml(result.recommendedModel.model)} - ${formatKw(result.recommendedModel.nominalKw)}</td></tr>
      <tr><td>Régi felvett teljesítmény</td><td>${formatNumber(result.selectedLegacy.degradedInputKw, 2)} kW</td></tr>
      <tr><td>Ajánlott modell felvett teljesítménye</td><td>${formatNumber(result.recommendedModel.inputKw, 2)} kW</td></tr>
      <tr><td>Megtérülési becslés</td><td>${formatPayback(result.estimatedPaybackYears)}</td></tr>
      <tr><td>Lead prioritás</td><td>${escapeHtml(result.priority.label)}</td></tr>
    </table>
    <p>${escapeHtml(result.priority.description)}</p>
    <p><a class="cta" href="${escapeHtml(appointmentUrl)}">15 perces műszaki egyeztetés foglalása</a></p>
    <p class="fine">${result.assumptions.map(escapeHtml).join("<br>")}</p>
  `);
}

function renderSequenceEmail(lead: LeadRecord, step: (typeof sequenceSteps)[number]) {
  const appointmentUrl = getAppointmentUrl();
  const { result, input } = lead;
  return emailShell(`
    <div class="preheader">${escapeHtml(step.preview)}</div>
    <h1>${escapeHtml(step.heading)}</h1>
    <p>Kedves ${escapeHtml(input.name)}!</p>
    <p>${escapeHtml(step.intro)}</p>
    <div class="summary-box">
      <strong>${escapeHtml(input.companyName)} kalkulációs összefoglaló</strong>
      <table>
        <tr><td>Becsült éves megtakarítás</td><td>${formatHuf(result.annualHufSaved)}</td></tr>
        <tr><td>5 éves potenciál</td><td>${formatHuf(result.fiveYearHufSaved)}</td></tr>
        <tr><td>Ajánlott modell</td><td>${escapeHtml(result.recommendedModel.model)} - ${formatKw(result.recommendedModel.nominalKw)}</td></tr>
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
  return emailShell(`
    <p>Új kalkulációs beküldés érkezett a csavarkompresszor kalkulátorból.</p>
    <table>
      <tr><td>Cég</td><td>${escapeHtml(lead.input.companyName)}</td></tr>
      <tr><td>Kapcsolattartó</td><td>${escapeHtml(lead.input.name || "-")}</td></tr>
      <tr><td>Email</td><td>${escapeHtml(lead.input.email)}</td></tr>
      <tr><td>Telefon</td><td>${escapeHtml(lead.input.phone || "-")}</td></tr>
      <tr><td>Marketing hozzájárulás</td><td>${lead.input.consentMarketing ? "igen" : "nem"}</td></tr>
      <tr><td>Email szekvencia</td><td>${escapeHtml(formatSequenceStatus(sequence))}</td></tr>
      <tr><td>Éves megtakarítás</td><td>${formatHuf(lead.result.annualHufSaved)}</td></tr>
      <tr><td>Prioritás</td><td>${escapeHtml(lead.result.priority.label)}</td></tr>
      <tr><td>Score</td><td>${lead.result.leadScore.score}/100 - ${escapeHtml(lead.result.leadScore.label)}</td></tr>
      <tr><td>Benchmark</td><td>${escapeHtml(lead.result.benchmark.label)}</td></tr>
      <tr><td>Gépek száma</td><td>${lead.result.totalMachineCount}</td></tr>
      <tr><td>Ajánlott modell</td><td>${escapeHtml(lead.result.recommendedModel.model)}</td></tr>
    </table>
    <p>${escapeHtml(lead.result.leadScore.reasons.join(" "))}</p>
  `);
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

function getAppointmentUrl() {
  return process.env.APPOINTMENT_URL ?? defaultAppointmentUrl;
}

function formatPayback(years: number | null) {
  if (years === null) return "gépár megadása után számolható";
  return `${formatNumber(years, 1)} év`;
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
          .summary-box { background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:16px; margin:18px 0; }
          table { width:100%; border-collapse:collapse; margin:18px 0; }
          td { border-bottom:1px solid #e2e8f0; padding:12px 0; vertical-align:top; }
          td:first-child { color:#64748b; width:44%; }
          .cta { background:#d92d20; border-radius:8px; color:#ffffff !important; display:inline-block; font-weight:700; padding:12px 16px; text-decoration:none; }
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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
