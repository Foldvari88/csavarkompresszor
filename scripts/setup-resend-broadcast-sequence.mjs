import { readFileSync } from "node:fs";
import path from "node:path";
import { Resend } from "resend";

const sequenceNamePrefix = "IPK high intent sequence";
const defaultSegmentName = "IpariKalkulator high intent leads";

const contactProperties = [
  { key: "lead_id", type: "string", fallbackValue: "" },
  { key: "company_name", type: "string", fallbackValue: "az Ön cége" },
  { key: "phone", type: "string", fallbackValue: "" },
  { key: "lead_score", type: "number", fallbackValue: 0 },
  { key: "lead_priority", type: "string", fallbackValue: "érdeklődő" },
  { key: "annual_savings_huf", type: "number", fallbackValue: 0 },
  { key: "annual_kwh_saved", type: "number", fallbackValue: 0 },
  { key: "five_year_savings_huf", type: "number", fallbackValue: 0 },
  { key: "recommended_model", type: "string", fallbackValue: "javasolt kompresszor" },
  { key: "total_machine_count", type: "number", fallbackValue: 1 }
];

const broadcasts = [
  {
    name: `${sequenceNamePrefix} 01 - Műszaki pontosítás`,
    subject: "Mi torzíthatja a csavarkompresszor megtakarítási számítást?",
    previewText: "A 4 adat, ami a riport után a leggyakrabban pontosításra szorul.",
    heading: "A kalkuláció jó előszűrő. A következő lépés a műszaki pontosítás.",
    intro:
      "A riport megmutatja a várható megtakarítási irányt. A valós döntéshez általában négy tényezőt érdemes gyorsan ellenőrizni: üzemi nyomás, levegőigény ingadozása, szivárgás és tartalékkapacitás.",
    bullets: [
      "Ha a rendszer nyomása magasabb a szükségesnél, a megtakarítás tovább nőhet.",
      "Ingadozó fogyasztásnál az RS/VSD gép gyakran jobb üzemi ponton dolgozik.",
      "Egy rövid adatpontosítás csökkenti a rossz gépválasztás kockázatát."
    ]
  },
  {
    name: `${sequenceNamePrefix} 02 - Vezetői döntési anyag`,
    subject: "Így lesz a kompresszor cseréből vezetői döntési anyag",
    previewText: "A megtakarítás számai beszerzési és vezetői nyelvre fordítva.",
    heading: "A legtöbb döntés nem gépmodellről indul, hanem megtakarítási érvről.",
    intro:
      "Ha a beruházást jóváhagyásra kell vinni, a legfontosabb kérdések: mennyi az éves áramköltség-hatás, milyen gyors a megtérülés, és milyen termelési kockázatot csökkent az új gép.",
    bullets: [
      "A riportban szereplő éves és 5 éves potenciál jó alap a CAPEX indokláshoz.",
      "A gép árának megadásával a megtérülési ablak pontosítható.",
      "Több gép esetén érdemes priorizálni, melyik csere hozza a leggyorsabb hatást."
    ]
  },
  {
    name: `${sequenceNamePrefix} 03 - Rendszeroldali veszteségek`,
    subject: "Nem mindig a kompresszor a legdrágább hiba",
    previewText: "Szivárgás, nyomás és terhelési profil: ahol sok ipari rendszer pénzt veszít.",
    heading: "A kompresszorcsere akkor konvertál jól beruházássá, ha a rendszeroldal is tiszta.",
    intro:
      "A régi gép felvett teljesítménye csak az egyik oldal. Ha a rendszer szivárog, túl magas nyomáson fut, vagy rosszul illeszkedik a terheléshez, a potenciál egy része rejtve marad.",
    bullets: [
      "Szivárgásnál a gép feleslegesen termel levegőt, ami közvetlen áramköltség.",
      "A túl magas nyomás minden üzemórában felesleges energiát kérhet.",
      "A terhelési profil alapján dönthető el, mennyire erős érv az RS/VSD technológia."
    ]
  },
  {
    name: `${sequenceNamePrefix} 04 - Modellilleszkedés`,
    subject: "Biztosan a kalkulátor által ajánlott modell a legjobb illeszkedés?",
    previewText: "Mikor elég a kalkulátor ajánlása, és mikor kell pontosabb gépméretezés?",
    heading: "Az ajánlott modell irányt ad, de a végső méretezést a valós levegőigény dönti el.",
    intro:
      "A kalkulátor a megadott névleges teljesítmény, üzemóra és fogyasztási adatok alapján ajánl. Ez jó kiindulópont, de a túlméretezés és az alulméretezés is drága lehet.",
    bullets: [
      "Tartalékigény és csúcsüzem mellett más modell lehet optimális.",
      "Több műszakos vagy ingadozó üzemnél fontos a részterhelési viselkedés.",
      "A rosszul méretezett gép csökkentheti a várt megtakarítást."
    ]
  },
  {
    name: `${sequenceNamePrefix} 05 - Visszahívási szándék`,
    subject: "Lezárjuk a kompresszor megtakarítási becslést?",
    previewText: "Ha a projekt még aktuális, érdemes most pontos ajánlati irányba vinni.",
    heading: "Ha a megtakarítási potenciál még érdekes, innen már érdemes ajánlati irányba lépni.",
    intro:
      "A kalkuláció alapján látszik, van-e érdemi energiahatási lehetőség. A következő lépés egy rövid egyeztetés, ahol a valós üzemi adatok alapján kiderül, érdemes-e ajánlatot kérni.",
    bullets: [
      "15 perc elég a legfontosabb műszaki és gazdasági kérdések tisztázására.",
      "Ha nincs elég potenciál, azt is gyorsan ki lehet mondani.",
      "Ha van, a beszerzés már pontosabb gép- és ROI-iránnyal indulhat."
    ]
  }
];

function parseEnv(file) {
  const env = {};
  const raw = readFileSync(file, "utf8").replace(/^\uFEFF/, "");

  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    env[line.slice(0, index).trim()] = line.slice(index + 1).trim().replace(/^"|"$/g, "");
  }

  return env;
}

function getEnv() {
  const localEnvPath = path.join(process.cwd(), ".env.local");
  const parsed = parseEnv(localEnvPath);
  return { ...parsed, ...process.env };
}

function isAlreadyExists(error) {
  return String(error?.message ?? error).toLowerCase().includes("already");
}

function assertNoError(result, label) {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message ?? JSON.stringify(result.error)}`);
  }
}

async function ensureContactProperties(resend) {
  const created = [];
  const skipped = [];

  for (const property of contactProperties) {
    const response = await resend.contactProperties.create(property);
    if (response.error) {
      if (isAlreadyExists(response.error)) {
        skipped.push(property.key);
        continue;
      }
      throw new Error(`contact property ${property.key}: ${response.error.message}`);
    }
    created.push(property.key);
  }

  return { created, skipped };
}

async function resolveSegment(resend, env) {
  if (env.RESEND_MARKETING_SEGMENT_ID) {
    return { id: env.RESEND_MARKETING_SEGMENT_ID, created: false };
  }

  const name = env.RESEND_MARKETING_SEGMENT_NAME || defaultSegmentName;
  const list = await resend.segments.list({ limit: 100 });
  assertNoError(list, "list segments");

  const existing = list.data?.data?.find((segment) => segment.name === name);
  if (existing) {
    return { id: existing.id, created: false };
  }

  const created = await resend.segments.create({ name });
  assertNoError(created, "create segment");
  return { id: created.data.id, created: true };
}

async function listExistingBroadcastNames(resend) {
  const list = await resend.broadcasts.list({ limit: 100 });
  assertNoError(list, "list broadcasts");
  return new Set((list.data?.data ?? []).map((broadcast) => broadcast.name).filter(Boolean));
}

function renderBroadcastHtml(draft) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.65;color:#17202a;max-width:680px;margin:0 auto;padding:24px;">
      <p style="color:#d92d20;font-weight:700;letter-spacing:.06em;text-transform:uppercase;">IpariKalkulator.hu</p>
      <h1 style="font-size:24px;line-height:1.25;">${draft.heading}</h1>
      <p>Tisztelt {{{contact.first_name|érdeklődő}}}!</p>
      <p>${draft.intro}</p>
      <div style="border:1px solid #e2e8f0;border-radius:10px;padding:16px;background:#f8fafc;">
        <strong>{{{contact.company_name|Az Ön cége}}} kalkulációs összefoglaló</strong>
        <ul>
          <li>Éves becsült megtakarítás: {{{contact.annual_savings_huf|0}}} Ft</li>
          <li>5 éves potenciál: {{{contact.five_year_savings_huf|0}}} Ft</li>
          <li>Éves energiahatás: {{{contact.annual_kwh_saved|0}}} kWh</li>
          <li>Ajánlott modell: {{{contact.recommended_model|javasolt kompresszor}}}</li>
          <li>Lead prioritás: {{{contact.lead_priority|érdeklődő}}}</li>
        </ul>
      </div>
      <ul>
        ${draft.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
      </ul>
      <p style="margin-top:22px;">
        <a href="https://iparikalkulator.hu" style="background:#d92d20;color:#fff;text-decoration:none;padding:12px 16px;border-radius:8px;font-weight:700;">IpariKalkulator.hu megnyitása</a>
      </p>
      <p style="font-size:13px;color:#64748b;">
        Azért kapja ezt az emailt, mert kérte a kalkulációhoz kapcsolódó szakmai utánkövetést.
        <a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Leiratkozás</a>
      </p>
    </div>
  `;
}

function renderBroadcastText(draft) {
  return [
    draft.heading,
    "",
    "Tisztelt {{{contact.first_name|érdeklődő}}}!",
    "",
    draft.intro,
    "",
    "{{{contact.company_name|Az Ön cége}}} kalkulációs összefoglaló:",
    "- Éves becsült megtakarítás: {{{contact.annual_savings_huf|0}}} Ft",
    "- 5 éves potenciál: {{{contact.five_year_savings_huf|0}}} Ft",
    "- Éves energiahatás: {{{contact.annual_kwh_saved|0}}} kWh",
    "- Ajánlott modell: {{{contact.recommended_model|javasolt kompresszor}}}",
    "",
    ...draft.bullets.map((bullet) => `- ${bullet}`),
    "",
    "Leiratkozás: {{{RESEND_UNSUBSCRIBE_URL}}}"
  ].join("\n");
}

async function createBroadcastDrafts(resend, env, segmentId) {
  const from = env.EMAIL_FROM || "IpariKalkulator.hu <riport@iparikalkulator.hu>";
  const replyTo = env.EMAIL_REPLY_TO || "info@iparikalkulator.hu";
  const existingNames = await listExistingBroadcastNames(resend);
  const created = [];
  const skipped = [];

  for (const draft of broadcasts) {
    if (existingNames.has(draft.name)) {
      skipped.push(draft.name);
      continue;
    }

    const response = await resend.broadcasts.create({
      name: draft.name,
      from,
      replyTo,
      segmentId,
      subject: draft.subject,
      previewText: draft.previewText,
      html: renderBroadcastHtml(draft),
      text: renderBroadcastText(draft),
      send: false
    });

    assertNoError(response, `create broadcast ${draft.name}`);
    created.push({ name: draft.name, id: response.data.id });
  }

  return { created, skipped };
}

async function main() {
  const env = getEnv();
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const properties = await ensureContactProperties(resend);
  const segment = await resolveSegment(resend, env);
  const broadcastDrafts = await createBroadcastDrafts(resend, env, segment.id);

  console.log(
    JSON.stringify(
      {
        ok: true,
        segment,
        properties,
        broadcastDrafts,
        nextEnv: {
          EMAIL_SEQUENCE_MODE: "broadcast",
          RESEND_MARKETING_SEGMENT_ID: segment.id
        }
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exitCode = 1;
});
