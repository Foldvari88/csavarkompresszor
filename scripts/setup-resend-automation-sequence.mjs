import { readFileSync } from "node:fs";
import path from "node:path";
import { Resend } from "resend";

const automationName = "IPK CompAir cserepromocio vasarlasi sequence";
const triggerEventName = "lead.compair_campaign.marketing_opt_in";
const supersededEventName = "lead.calculator.superseded";

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
    key: "fast_quote_path",
    delay: "2 hours",
    name: "IPK CompAir email 01 - Riport utan ajanlati lepes",
    subject: "A kalkuláció alapján érdemes CompAir csereajánlatot kérni?",
    preview: "A friss megtakarítási számokból így lesz gyors CompAir ajánlati irány.",
    heading: "A friss riportból legyen CompAir csereelőszűrés, amíg magas a vásárlási szándék.",
    intro:
      "A kalkuláció most adta meg a legfontosabb üzleti irányt: mekkora éves megtakarítási potenciál látszik, és melyik CompAir modell lehet jó kiindulópont. Ha {{{companyName}}} gépe 5 évnél idősebb, a következő lépés egy rövid jogosultsági és méretezési ellenőrzés.",
    caseStudyTitle: "Mini eset: miért nem érdemes hetekig várni?",
    caseStudy:
      "Egy régi, fix fordulatú csavarkompresszornál a döntést gyakran nem a katalógusadat, hanem az üzemi profil dönti el. Ha a friss riport után gyorsan tisztázzuk a nyomást, üzemórát, terhelést és a kampányjogosultságot, hamarabb derül ki, hogy a CompAir csere valódi ajánlati projekt-e.",
    bullets: [
      "A szeptember 30-ig futó CompAir cserepromóció miatt érdemes a jogosultságot korán ellenőrizni.",
      "A beszélgetés nem kötelez vásárlásra: az első cél annak kimondása, van-e üzletileg értelmes csereprojekt.",
      "Ha a riportban látható megtakarítás reális, a beszerzés már konkrét gép- és ROI-iránnyal indulhat."
    ],
    closing:
      "Kérjen 15 perces egyeztetést, és nézzük meg, hogy a kalkulált megtakarításból lehet-e gyors CompAir ajánlati irány.",
    ctaLabel: "Kérem a CompAir csereelőszűrést"
  },
  {
    key: "air_audit_case",
    delay: "1 day",
    name: "IPK CompAir email 02 - Air audit esettanulmany",
    subject: "CompAir audit példa: hol szökik el a megtakarítás?",
    preview: "Szivárgás, túl magas nyomás, rossz vezérlés: ezek döntik el a valós ROI-t.",
    heading: "Mini esettanulmány: a jó CompAir csereprojekt a levegőrendszer veszteségeinél kezdődik.",
    intro:
      "A CompAir Air Audit szemlélete egyszerű: előbb mérjük meg, hol fogy el az energia, és csak utána véglegesítjük a gépcserét. Így nem találgatásból lesz ajánlat, hanem valós levegőigényből, nyomásszintből és fogyasztási profilból.",
    caseStudyTitle: "Tipikus audit-helyzet",
    caseStudy:
      "Egy 75 kW körüli, régebbi kompresszornál az audit gyakran három területet tár fel: szivárgási veszteséget, túl magas nyomásszintet és olyan terhelési ingadozást, ahol a szabályozott fordulatú gép üzletileg erősebb választás lehet. Ezért a CompAir ajánlatot érdemes audit- vagy adattábla-alapon pontosítani.",
    bullets: [
      "A szivárgások és rendszeroldali hiányosságok akár jelentős sűrített levegő veszteséget okozhatnak.",
      "A túl magas üzemi nyomás minden üzemórában felesleges áramköltséget vihet el.",
      "Az audit segít eldönteni, hogy fix vagy RS/VSD CompAir modell ad jobb megtérülési irányt."
    ],
    closing:
      "Ha küld adattáblaadatot vagy kér egy rövid audit-egyeztetést, a mostani becslésből pontosabb CompAir cserejavaslat készíthető.",
    ctaLabel: "Audit egyeztetést kérek"
  },
  {
    key: "capex_roi",
    delay: "3 days",
    name: "IPK CompAir email 03 - Vezetoi ROI erv",
    subject: "A CompAir döntéshez ezt a 3 számot vigye be a vezetőség elé",
    preview: "Éves megtakarítás, 5 éves potenciál és termelési kockázat egy döntési anyagban.",
    heading: "A beszerzési döntés akkor gyorsul, ha a gép ára mellé ott van a megtérülési logika.",
    intro:
      "A CompAir csere nem csak gépvásárlás, hanem energia- és üzembiztonsági döntés. A riportban szereplő éves megtakarítás, 5 éves potenciál és ajánlott modell már jó alap ahhoz, hogy a projekt vezetői nyelven is védhető legyen.",
    caseStudyTitle: "Vezetői döntési keret",
    caseStudy:
      "Egy ipari csereprojekt akkor jut gyorsabban ajánlatkérésig, ha a beszerzés nem csak azt látja, mennyibe kerül az új gép, hanem azt is, hogy mennyi áramköltséget, állásidő-kockázatot és rossz méretezési kockázatot csökkenthet a CompAir irány.",
    bullets: [
      "Az éves becsült megtakarítás: {{{annualSavingsHuf}}} Ft, ami már konkrét üzleti érv.",
      "Az 5 éves potenciál: {{{fiveYearSavingsHuf}}} Ft, ez a CAPEX döntésnél erős összehasonlítási pont.",
      "A javasolt CompAir irány: {{{recommendedModel}}}; ezt érdemes valós nyomás- és levegőigény-adattal véglegesíteni."
    ],
    closing:
      "Kérje az ajánlati egyeztetést, és segítünk a kalkulációt döntéselőkészítő, beszerzésnek is érthető formába rendezni.",
    ctaLabel: "Kérem a CompAir ajánlati egyeztetést"
  },
  {
    key: "compair_fit",
    delay: "6 days",
    name: "IPK CompAir email 04 - Modellilleszkedes",
    subject: "RS/VSD vagy fix CompAir? Ezt a terhelési profil dönti el",
    preview: "A rossz gépválasztás elviheti a megtakarítás egy részét.",
    heading: "A CompAir választás akkor erős, ha a gép a valós levegőigényre illeszkedik.",
    intro:
      "A kalkulátor jó előszűrő, de a vásárlási döntéshez két kérdés dönt: mennyire ingadozik a levegőigény, és milyen üzemi nyomáson kell stabilan dolgoznia a rendszernek. Ezek alapján derül ki, hogy fix vagy szabályozott fordulatú CompAir irány a jobb.",
    caseStudyTitle: "CompAir előny, ami vásárlásnál számít",
    caseStudy:
      "A CompAir L-széria RS/VSD modelljei a termelés levegőigényéhez igazítják a leadott teljesítményt, az újabb kétlépcsős L-széria gépek pedig nagy hatékonyságot kínálnak kompakt gépházban. A jó döntés nem az, hogy a legnagyobb gépet választjuk, hanem az, hogy a terhelési profilhoz illesztjük.",
    bullets: [
      "Ingadozó fogyasztásnál az RS/VSD technológia erős energiahatékonysági érv lehet.",
      "Folyamatos, stabil terhelésnél a fix fordulatú modell is lehet jó gazdasági döntés.",
      "A túlméretezés és az alulméretezés is ronthatja a megtérülést, ezért kell a rövid műszaki pontosítás."
    ],
    closing:
      "Ha a javasolt modell még csak irány, egy 15 perces egyeztetés elég lehet ahhoz, hogy a CompAir választás vásárlásra alkalmas műszaki alapot kapjon.",
    ctaLabel: "Pontosítsuk a CompAir modellt"
  },
  {
    key: "deadline_close",
    delay: "10 days",
    name: "IPK CompAir email 05 - Promocio zaras",
    subject: "Tartsuk fenn a CompAir cserekedvezmény lehetőségét?",
    preview: "Utolsó döntési email: audit vagy adattábla alapján gyorsan kiderül, érdemes-e ajánlatot kérni.",
    heading: "Ha a CompAir csere még napirenden van, most érdemes döntési pályára tenni.",
    intro:
      "A kampányban nem az a cél, hogy minden érdeklődő azonnal gépet vegyen. Az a cél, hogy gyorsan kiderüljön: a becsült megtakarítás, a gépkor és az üzemi profil alapján érdemes-e CompAir csereajánlatot készíteni a szeptember 30-i promóciós időszakra.",
    caseStudyTitle: "Záró döntési helyzet",
    caseStudy:
      "A legjobb projektek általában nem a határidő utolsó napján indulnak. Ha most tisztázzuk az adattáblát, az üzemórát, a nyomást és a terhelési profilt, marad idő auditot, jogosultságot és ajánlatot is rendesen előkészíteni.",
    bullets: [
      "Ha nincs elég megtakarítási potenciál, ezt gyorsan kimondjuk, és nem húzzuk a projektet.",
      "Ha van potenciál, a következő lépés a CompAir ajánlat audit- vagy adattábla-alapon.",
      "A friss kalkulációs számok alapján most még könnyű visszacsatolni a döntéshozóknak."
    ],
    closing:
      "Ha a csere aktuális lehet, kérjen most visszahívást. Így még időben eldőlhet, érdemes-e a CompAir cserepromócióval számolni.",
    ctaLabel: "Kérem a visszahívást"
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
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${step.preview}</div>
      <p style="color:#d92d20;font-weight:700;letter-spacing:.06em;text-transform:uppercase;">iparikalkulator.hu | CompAir cserepromóció</p>
      <h1 style="font-size:24px;line-height:1.25;">${step.heading}</h1>
      <p>Tisztelt {{{firstName}}}!</p>
      <p>${step.intro}</p>
      <div style="border:1px solid #e2e8f0;border-radius:10px;padding:16px;background:#f8fafc;">
        <strong>{{{companyName}}} CompAir csereelőszűrési összefoglaló</strong>
        <ul>
          <li>Éves becsült megtakarítás: {{{annualSavingsHuf}}} Ft</li>
          <li>5 éves potenciál: {{{fiveYearSavingsHuf}}} Ft</li>
          <li>Éves energiahatás: {{{annualKwhSaved}}} kWh</li>
          <li>Ajánlott modell: {{{recommendedModel}}}</li>
          <li>Lead prioritás: {{{leadPriority}}}</li>
        </ul>
      </div>
      ${
        step.caseStudy
          ? `<div style="border-left:4px solid #d92d20;margin:20px 0;padding:14px 16px;background:#fff7ed;">
        <strong>${step.caseStudyTitle}</strong>
        <p style="margin:8px 0 0;">${step.caseStudy}</p>
      </div>`
          : ""
      }
      <ul>
        ${step.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
      </ul>
      <p>${step.closing}</p>
      <p style="margin-top:22px;">
        <a href="{{{callbackUrl}}}" style="background:#d92d20;color:#fff;text-decoration:none;padding:12px 16px;border-radius:8px;font-weight:700;">${step.ctaLabel}</a>
      </p>
      <p>
        <a href="{{{reportUrl}}}">PDF riport újbóli megnyitása</a>
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
    "Tisztelt {{{firstName}}}!",
    "",
    step.intro,
    "",
    "{{{companyName}}} CompAir csereelőszűrési összefoglaló:",
    "- Éves becsült megtakarítás: {{{annualSavingsHuf}}} Ft",
    "- 5 éves potenciál: {{{fiveYearSavingsHuf}}} Ft",
    "- Éves energiahatás: {{{annualKwhSaved}}} kWh",
    "- Ajánlott modell: {{{recommendedModel}}}",
    "- Lead prioritás: {{{leadPriority}}}",
    "",
    ...(step.caseStudy ? [step.caseStudyTitle, step.caseStudy, ""] : []),
    ...step.bullets.map((bullet) => `- ${bullet}`),
    "",
    step.closing,
    "",
    `${step.ctaLabel}: {{{callbackUrl}}}`,
    "PDF riport: {{{reportUrl}}}"
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
    const waitKey = `wait_${step.key}`;
    const emailKey = `email_${step.key}`;
    steps.push({
      key: waitKey,
      type: "wait_for_event",
      config: {
        eventName: supersededEventName,
        timeout: step.delay
      }
    });
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
    connections.push({ from: previous, to: waitKey, type: "default" });
    connections.push({ from: waitKey, to: emailKey, type: "timeout" });
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

async function ensureEventSchema(resend, eventName, schema) {
  const list = await resend.events.list({ limit: 100 });
  assertNoError(list, "list events");
  const existing = list.data?.data?.find((event) => event.name === eventName);

  if (existing) {
    const update = await resend.events.update(existing.id, { schema });
    assertNoError(update, `update event schema ${eventName}`);
    return { id: existing.id, updated: true };
  }

  const create = await resend.events.create({ name: eventName, schema });
  assertNoError(create, `create event schema ${eventName}`);
  return { id: create.data.id, created: true };
}

function triggerEventSchema() {
  return {
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
}

function supersededEventSchema() {
  return {
    leadId: "string"
  };
}

async function ensureEventSchemas(resend) {
  return {
    trigger: await ensureEventSchema(resend, triggerEventName, triggerEventSchema()),
    superseded: await ensureEventSchema(resend, supersededEventName, supersededEventSchema())
  };
}

async function main() {
  const env = getEnv();
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const events = await ensureEventSchemas(resend);
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
        supersededEventName,
        events,
        templates,
        automation,
        nextEnv: {
          EMAIL_SEQUENCE_MODE: "automation",
          RESEND_COMPAIR_AUTOMATION_EVENT_NAME: triggerEventName,
          RESEND_AUTOMATION_SUPERSEDED_EVENT_NAME: supersededEventName
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
