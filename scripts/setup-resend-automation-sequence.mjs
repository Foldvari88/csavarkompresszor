import { readFileSync } from "node:fs";
import path from "node:path";
import { Resend } from "resend";

const automationName = "IPK high intent csavarkompresszor sequence";
const triggerEventName = "lead.calculator.marketing_opt_in";

const variables = [
  { key: "firstName", type: "string", fallbackValue: "érdeklődő" },
  { key: "companyName", type: "string", fallbackValue: "az Ön cége" },
  { key: "leadId", type: "string", fallbackValue: "" },
  { key: "phone", type: "string", fallbackValue: "" },
  { key: "annualSavingsHuf", type: "number", fallbackValue: 0 },
  { key: "annualKwhSaved", type: "number", fallbackValue: 0 },
  { key: "fiveYearSavingsHuf", type: "number", fallbackValue: 0 },
  { key: "recommendedModel", type: "string", fallbackValue: "javasolt kompresszor" },
  { key: "leadPriority", type: "string", fallbackValue: "érdeklődő" },
  { key: "callbackUrl", type: "string", fallbackValue: "https://iparikalkulator.hu" },
  { key: "reportUrl", type: "string", fallbackValue: "https://iparikalkulator.hu" }
];

const sequence = [
  {
    key: "audit_context",
    delay: "1 day",
    name: "IPK automation email 01 - Műszaki pontosítás",
    subject: "Mi torzíthatja a csavarkompresszor megtakarítási számítást?",
    preview: "A 4 adat, ami a riport után a leggyakrabban pontosításra szorul.",
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
    key: "business_case",
    delay: "3 days",
    name: "IPK automation email 02 - Vezetői döntési anyag",
    subject: "Így lesz a kompresszor cseréből vezetői döntési anyag",
    preview: "A megtakarítás számai beszerzési és vezetői nyelvre fordítva.",
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
    key: "system_losses",
    delay: "6 days",
    name: "IPK automation email 03 - Rendszeroldali veszteségek",
    subject: "Nem mindig a kompresszor a legdrágább hiba",
    preview: "Szivárgás, nyomás és terhelési profil: ahol sok ipari rendszer pénzt veszít.",
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
    key: "model_fit",
    delay: "10 days",
    name: "IPK automation email 04 - Modellilleszkedés",
    subject: "Biztosan a kalkulátor által ajánlott modell a legjobb illeszkedés?",
    preview: "Mikor elég a kalkulátor ajánlása, és mikor kell pontosabb gépméretezés?",
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
    key: "callback_intent",
    delay: "18 days",
    name: "IPK automation email 05 - Visszahívási szándék",
    subject: "Lezárjuk a kompresszor megtakarítási becslést?",
    preview: "Ha a projekt még aktuális, érdemes most pontos ajánlati irányba vinni.",
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

function assertNoError(result, label) {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message ?? JSON.stringify(result.error)}`);
  }
}

function renderTemplateHtml(step) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.65;color:#17202a;max-width:680px;margin:0 auto;padding:24px;">
      <p style="color:#d92d20;font-weight:700;letter-spacing:.06em;text-transform:uppercase;">iparikalkulator.hu</p>
      <h1 style="font-size:24px;line-height:1.25;">${step.heading}</h1>
      <p>Tisztelt {{{firstName|érdeklődő}}}!</p>
      <p>${step.intro}</p>
      <div style="border:1px solid #e2e8f0;border-radius:10px;padding:16px;background:#f8fafc;">
        <strong>{{{companyName|Az Ön cége}}} kalkulációs összefoglaló</strong>
        <ul>
          <li>Éves becsült megtakarítás: {{{annualSavingsHuf|0}}} Ft</li>
          <li>5 éves potenciál: {{{fiveYearSavingsHuf|0}}} Ft</li>
          <li>Éves energiahatás: {{{annualKwhSaved|0}}} kWh</li>
          <li>Ajánlott modell: {{{recommendedModel|javasolt kompresszor}}}</li>
          <li>Lead prioritás: {{{leadPriority|érdeklődő}}}</li>
        </ul>
      </div>
      <ul>
        ${step.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
      </ul>
      <p style="margin-top:22px;">
        <a href="{{{callbackUrl|https://iparikalkulator.hu}}}" style="background:#d92d20;color:#fff;text-decoration:none;padding:12px 16px;border-radius:8px;font-weight:700;">Konzultációs visszahívás kérése</a>
      </p>
      <p>
        <a href="{{{reportUrl|https://iparikalkulator.hu}}}">PDF riport újbóli megnyitása</a>
      </p>
      <p style="font-size:13px;color:#64748b;">
        Azért kapja ezt az emailt, mert kérte a kalkulációhoz kapcsolódó szakmai utánkövetést.
      </p>
    </div>
  `;
}

function renderTemplateText(step) {
  return [
    step.heading,
    "",
    "Tisztelt {{{firstName|érdeklődő}}}!",
    "",
    step.intro,
    "",
    "{{{companyName|Az Ön cége}}} kalkulációs összefoglaló:",
    "- Éves becsült megtakarítás: {{{annualSavingsHuf|0}}} Ft",
    "- 5 éves potenciál: {{{fiveYearSavingsHuf|0}}} Ft",
    "- Éves energiahatás: {{{annualKwhSaved|0}}} kWh",
    "- Ajánlott modell: {{{recommendedModel|javasolt kompresszor}}}",
    "",
    ...step.bullets.map((bullet) => `- ${bullet}`),
    "",
    "Konzultációs visszahívás: {{{callbackUrl|https://iparikalkulator.hu}}}",
    "PDF riport: {{{reportUrl|https://iparikalkulator.hu}}}"
  ].join("\n");
}

async function getExistingTemplateByName(resend, name) {
  const list = await resend.templates.list({ limit: 100 });
  assertNoError(list, "list templates");
  return list.data?.data?.find((template) => template.name === name) ?? null;
}

async function ensurePublishedTemplate(resend, env, step) {
  const existing = await getExistingTemplateByName(resend, step.name);
  const from = env.EMAIL_FROM || "iparikalkulator.hu <riport@iparikalkulator.hu>";
  const replyTo = env.EMAIL_REPLY_TO || "info@iparikalkulator.hu";
  const payload = {
    name: step.name,
    subject: step.subject,
    from,
    replyTo,
    html: renderTemplateHtml(step),
    text: renderTemplateText(step),
    variables
  };

  if (existing) {
    const update = await resend.templates.update(existing.id, payload);
    assertNoError(update, `update template ${step.name}`);
    const publish = await resend.templates.publish(existing.id);
    assertNoError(publish, `publish template ${step.name}`);
    return { id: existing.id, name: step.name, updated: true };
  }

  const create = await resend.templates.create(payload);
  const createResult = await create;
  assertNoError(createResult, `create template ${step.name}`);
  const templateId = createResult.data.id;
  const publish = await resend.templates.publish(templateId);
  assertNoError(publish, `publish template ${step.name}`);
  return { id: templateId, name: step.name, created: true };
}

function automationVariables() {
  return {
    firstName: { var: "firstName" },
    companyName: { var: "companyName" },
    leadId: { var: "leadId" },
    phone: { var: "phone" },
    annualSavingsHuf: { var: "annualSavingsHuf" },
    annualKwhSaved: { var: "annualKwhSaved" },
    fiveYearSavingsHuf: { var: "fiveYearSavingsHuf" },
    recommendedModel: { var: "recommendedModel" },
    leadPriority: { var: "leadPriority" },
    callbackUrl: { var: "callbackUrl" },
    reportUrl: { var: "reportUrl" }
  };
}

function buildAutomation(templateIds) {
  const steps = [{ key: "start", type: "trigger", config: { eventName: triggerEventName } }];
  const connections = [];
  let previous = "start";

  for (const step of sequence) {
    const delayKey = `delay_${step.key}`;
    const emailKey = `email_${step.key}`;
    steps.push({ key: delayKey, type: "delay", config: { duration: step.delay } });
    steps.push({
      key: emailKey,
      type: "send_email",
      config: {
        template: {
          id: templateIds[step.key],
          variables: automationVariables()
        },
        subject: step.subject
      }
    });
    connections.push({ from: previous, to: delayKey, type: "default" });
    connections.push({ from: delayKey, to: emailKey, type: "default" });
    previous = emailKey;
  }

  return {
    name: automationName,
    status: "disabled",
    steps,
    connections
  };
}

async function getExistingAutomationByName(resend, name) {
  const list = await resend.automations.list({ limit: 100 });
  assertNoError(list, "list automations");
  return list.data?.data?.find((automation) => automation.name === name) ?? null;
}

async function ensureAutomation(resend, templateIds) {
  const payload = buildAutomation(templateIds);
  const existing = await getExistingAutomationByName(resend, automationName);

  if (existing) {
    const update = await resend.automations.update(existing.id, payload);
    assertNoError(update, "update automation");
    return { id: existing.id, updated: true, status: "disabled" };
  }

  const create = await resend.automations.create(payload);
  assertNoError(create, "create automation");
  return { id: create.data.id, created: true, status: "disabled" };
}

async function ensureEventSchema(resend) {
  const schema = {
    firstName: "string",
    companyName: "string",
    leadId: "string",
    phone: "string",
    annualSavingsHuf: "number",
    annualKwhSaved: "number",
    fiveYearSavingsHuf: "number",
    recommendedModel: "string",
    leadPriority: "string",
    callbackUrl: "string",
    reportUrl: "string"
  };

  const list = await resend.events.list({ limit: 100 });
  assertNoError(list, "list events");
  const existing = list.data?.data?.find((event) => event.name === triggerEventName);

  if (existing) {
    const update = await resend.events.update(existing.id, { schema });
    assertNoError(update, "update event schema");
    return { id: existing.id, updated: true };
  }

  const create = await resend.events.create({ name: triggerEventName, schema });
  assertNoError(create, "create event schema");
  return { id: create.data.id, created: true };
}

async function main() {
  const env = getEnv();
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const event = await ensureEventSchema(resend);
  const templates = [];
  const templateIds = {};

  for (const step of sequence) {
    const template = await ensurePublishedTemplate(resend, env, step);
    templates.push(template);
    templateIds[step.key] = template.id;
  }

  const automation = await ensureAutomation(resend, templateIds);

  console.log(
    JSON.stringify(
      {
        ok: true,
        eventName: triggerEventName,
        event,
        templates,
        automation,
        nextEnv: {
          EMAIL_SEQUENCE_MODE: "automation",
          RESEND_AUTOMATION_EVENT_NAME: triggerEventName
        },
        note: "Automation is created disabled so you can edit it in Resend before enabling."
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
