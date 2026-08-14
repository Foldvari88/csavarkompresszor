"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { AgeBand, CampaignTracking, LoadProfile } from "@/lib/calculator/types";

type CampaignFormState = {
  companyName: string;
  name: string;
  email: string;
  phone: string;
  companyActivity: string;
  currentBrand: string;
  nominalKw: string;
  annualHours: string;
  energyPriceHufKwh: string;
  ageBand: AgeBand;
  loadProfile: LoadProfile;
  requestType: string;
  nameplateStatus: string;
  message: string;
  consentPrivacy: boolean;
  consentMarketing: boolean;
};

type CampaignFormErrors = Partial<Record<keyof CampaignFormState, string>>;

const brandOptions = [
  "Atlas Copco",
  "Kaeser",
  "Ingersoll Rand",
  "Boge",
  "Almig",
  "Hertz",
  "ABAC",
  "Ceccato",
  "Alup",
  "Renner",
  "Worthington",
  "Egyéb"
];

const companyActivityOptions = [
  "Élelmiszeripar",
  "Fém és fémmegmunkálás",
  "Autó- és járműipar",
  "Gépgyártás",
  "Elektronikai ipar",
  "Vegyipar",
  "Gyógyszeripar",
  "Műanyag- és gumiipar",
  "Papír- és nyomdaipar",
  "Faipar",
  "Textil- és ruhaipar",
  "Építőanyagipar",
  "Energiaipar",
  "Egyéb"
];

const nominalKwOptions = [37, 45, 55, 75, 90, 110, 132, 160, 200, 250];

const initialForm: CampaignFormState = {
  companyName: "",
  name: "",
  email: "",
  phone: "",
  companyActivity: "",
  currentBrand: "Atlas Copco",
  nominalKw: "75",
  annualHours: "5500",
  energyPriceHufKwh: "35",
  ageBand: "10-15",
  loadProfile: "fluctuating",
  requestType: "Air-Insite audit / helyszíni felmérés",
  nameplateStatus: "Megvan az adattábla fotója vagy adata",
  message: "",
  consentPrivacy: false,
  consentMarketing: false
};

export function CompairCampaignForm() {
  const router = useRouter();
  const [form, setForm] = useState<CampaignFormState>(initialForm);
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const errors = useMemo(() => getCampaignFormErrors(form), [form]);
  const visibleErrors = hasTriedSubmit ? errors : {};
  const isValid = Object.keys(errors).length === 0;

  function updateField<K extends keyof CampaignFormState>(
    field: K,
    value: CampaignFormState[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submitCampaignLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasTriedSubmit(true);
    setFormError(null);

    const normalizedPhone = normalizeHungarianPhone(form.phone);
    const nextForm = { ...form, phone: normalizedPhone };
    const nextErrors = getCampaignFormErrors(nextForm);

    if (Object.keys(nextErrors).length > 0) {
      setForm(nextForm);
      setFormError(
        "Kérlek, ellenőrizd a kötelező mezőket. A telefonszám formátuma például: +36701234567."
      );
      window.requestAnimationFrame(() => {
        document
          .querySelector<HTMLElement>(".campaign-lead-form [aria-invalid='true']")
          ?.focus();
      });
      return;
    }

    setForm(nextForm);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: nextForm.currentBrand,
          ageBand: nextForm.ageBand,
          nominalKw: Number(nextForm.nominalKw),
          annualHours: Number(nextForm.annualHours),
          energyPriceHufKwh: Number(nextForm.energyPriceHufKwh),
          preferVariableSpeed: nextForm.loadProfile === "fluctuating",
          loadProfile: nextForm.loadProfile,
          heatRecovery: { enabled: false },
          companyWebsite: "",
          companyActivity: nextForm.companyActivity,
          email: nextForm.email.trim(),
          companyName: nextForm.companyName.trim(),
          name: nextForm.name.trim(),
          phone: nextForm.phone,
          consentMarketing: nextForm.consentMarketing,
          consentPrivacy: nextForm.consentPrivacy,
          tracking: getCampaignTracking(nextForm),
          campaignLanding: {
            source: "compairkampany",
            promotionWindow: "2026-07-01/2026-09-30",
            requestType: nextForm.requestType,
            nameplateStatus: nextForm.nameplateStatus,
            productRange: `${nextForm.nominalKw} kW`,
            message: nextForm.message.trim() || undefined
          }
        })
      });
      const payload = (await response.json().catch(() => null)) as
        | { leadId?: string; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "A beküldés nem sikerült.");
      }

      router.push("/koszonjuk");
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : "Váratlan hiba történt.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="campaign-lead-form" onSubmit={submitCampaignLead}>
      <div className="campaign-form-head">
        <span>Gyors előszűrés</span>
        <h3>Indítsa el a CompAir csereelőszűrést</h3>
        <p>
          A legfontosabb üzemi és gépadatokból előkészítjük a kampány szerinti
          jogosultsági és megtakarítási ellenőrzést.
        </p>
        <div className="campaign-form-assurance" aria-label="Űrlap előnyök">
          <span>nincs kötelezettség</span>
          <span>audit vagy adattábla</span>
          <span>ipari csereprojekt</span>
        </div>
      </div>

      <div className="campaign-form-grid">
        <CampaignField error={visibleErrors.companyName} id="companyName" label="Cégnév">
          <input
            aria-describedby={visibleErrors.companyName ? "companyName-error" : undefined}
            aria-invalid={Boolean(visibleErrors.companyName)}
            id="companyName"
            required
            type="text"
            value={form.companyName}
            onChange={(event) => updateField("companyName", event.target.value)}
          />
        </CampaignField>

        <CampaignField error={visibleErrors.name} id="name" label="Kapcsolattartó neve">
          <input
            aria-describedby={visibleErrors.name ? "name-error" : undefined}
            aria-invalid={Boolean(visibleErrors.name)}
            id="name"
            required
            type="text"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </CampaignField>

        <CampaignField error={visibleErrors.email} id="email" label="Email cím">
          <input
            aria-describedby={visibleErrors.email ? "email-error" : undefined}
            aria-invalid={Boolean(visibleErrors.email)}
            id="email"
            inputMode="email"
            required
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </CampaignField>

        <CampaignField
          error={visibleErrors.phone}
          hint="Elfogadott példa: +36701234567"
          id="phone"
          label="Telefonszám"
        >
          <input
            aria-describedby={visibleErrors.phone ? "phone-error" : "phone-hint"}
            aria-invalid={Boolean(visibleErrors.phone)}
            id="phone"
            inputMode="tel"
            placeholder="+36701234567"
            required
            type="tel"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </CampaignField>

        <CampaignField
          error={visibleErrors.companyActivity}
          id="companyActivity"
          label="Iparág / tevékenység"
        >
          <select
            aria-describedby={
              visibleErrors.companyActivity ? "companyActivity-error" : undefined
            }
            aria-invalid={Boolean(visibleErrors.companyActivity)}
            id="companyActivity"
            required
            value={form.companyActivity}
            onChange={(event) => updateField("companyActivity", event.target.value)}
          >
            <option value="">Válassz tevékenységet</option>
            {companyActivityOptions.map((activity) => (
              <option key={activity} value={activity}>
                {activity}
              </option>
            ))}
          </select>
        </CampaignField>

        <CampaignField
          error={visibleErrors.currentBrand}
          id="currentBrand"
          label="Jelenlegi kompresszor márkája"
        >
          <select
            aria-describedby={visibleErrors.currentBrand ? "currentBrand-error" : undefined}
            aria-invalid={Boolean(visibleErrors.currentBrand)}
            id="currentBrand"
            required
            value={form.currentBrand}
            onChange={(event) => updateField("currentBrand", event.target.value)}
          >
            {brandOptions.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </CampaignField>

        <CampaignField id="nominalKw" label="Névleges teljesítmény">
          <select
            id="nominalKw"
            required
            value={form.nominalKw}
            onChange={(event) => updateField("nominalKw", event.target.value)}
          >
            {nominalKwOptions.map((kw) => (
              <option key={kw} value={kw}>
                {kw} kW
              </option>
            ))}
          </select>
        </CampaignField>

        <CampaignField id="ageBand" label="Kompresszor kora">
          <select
            id="ageBand"
            required
            value={form.ageBand}
            onChange={(event) => updateField("ageBand", event.target.value as AgeBand)}
          >
            <option value="5-10">5-10 év</option>
            <option value="10-15">10-15 év</option>
            <option value="15+">15+ év</option>
          </select>
        </CampaignField>

        <CampaignField
          error={visibleErrors.annualHours}
          hint="Ha nem ismert, hagyd az alap 5500 órán."
          id="annualHours"
          label="Éves üzemóra"
        >
          <input
            aria-describedby={visibleErrors.annualHours ? "annualHours-error" : "annualHours-hint"}
            aria-invalid={Boolean(visibleErrors.annualHours)}
            id="annualHours"
            inputMode="numeric"
            max={8760}
            min={100}
            required
            step={50}
            type="number"
            value={form.annualHours}
            onChange={(event) => updateField("annualHours", event.target.value)}
          />
        </CampaignField>

        <CampaignField
          error={visibleErrors.energyPriceHufKwh}
          hint="Ha nincs kéznél, az alapérték 35 Ft/kWh."
          id="energyPriceHufKwh"
          label="Villamosenergia díj"
        >
          <input
            aria-describedby={
              visibleErrors.energyPriceHufKwh
                ? "energyPriceHufKwh-error"
                : "energyPriceHufKwh-hint"
            }
            aria-invalid={Boolean(visibleErrors.energyPriceHufKwh)}
            id="energyPriceHufKwh"
            inputMode="decimal"
            max={500}
            min={1}
            required
            type="number"
            value={form.energyPriceHufKwh}
            onChange={(event) => updateField("energyPriceHufKwh", event.target.value)}
          />
        </CampaignField>

        <CampaignField id="loadProfile" label="Terhelési profil">
          <select
            id="loadProfile"
            required
            value={form.loadProfile}
            onChange={(event) => updateField("loadProfile", event.target.value as LoadProfile)}
          >
            <option value="fluctuating">Ingadozó levegőigény</option>
            <option value="continuous">Folyamatos terhelés</option>
          </select>
        </CampaignField>

        <CampaignField id="requestType" label="Mit kérsz első lépésként?">
          <select
            id="requestType"
            value={form.requestType}
            onChange={(event) => updateField("requestType", event.target.value)}
          >
            <option>Air-Insite audit / helyszíni felmérés</option>
            <option>Csereajánlat adattábla alapján</option>
            <option>Visszahívást kérek a promócióról</option>
          </select>
        </CampaignField>
      </div>

      <div className="campaign-form-grid single">
        <CampaignField id="nameplateStatus" label="Adattábla információ">
          <select
            id="nameplateStatus"
            value={form.nameplateStatus}
            onChange={(event) => updateField("nameplateStatus", event.target.value)}
          >
            <option>Megvan az adattábla fotója vagy adata</option>
            <option>Helyszínen kell azonosítani</option>
            <option>Nem biztos a típus / teljesítmény</option>
          </select>
        </CampaignField>

        <CampaignField
          error={visibleErrors.message}
          id="message"
          label="Rövid megjegyzés"
          optional
        >
          <textarea
            aria-describedby={visibleErrors.message ? "message-error" : undefined}
            aria-invalid={Boolean(visibleErrors.message)}
            id="message"
            maxLength={900}
            rows={4}
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
          />
        </CampaignField>
      </div>

      <label
        className={`campaign-checkbox ${visibleErrors.consentPrivacy ? "is-invalid" : ""}`}
      >
        <input
          aria-describedby={visibleErrors.consentPrivacy ? "consentPrivacy-error" : undefined}
          aria-invalid={Boolean(visibleErrors.consentPrivacy)}
          checked={form.consentPrivacy}
          type="checkbox"
          onChange={(event) => updateField("consentPrivacy", event.target.checked)}
        />
        <span>
          Elfogadom, hogy a megadott adatok alapján elkészüljön az előszűrés, és
          elolvastam az adatkezelési tájékoztatót.
        </span>
      </label>
      <CampaignFieldError id="consentPrivacy-error" message={visibleErrors.consentPrivacy} />

      <label className="campaign-checkbox">
        <input
          checked={form.consentMarketing}
          type="checkbox"
          onChange={(event) => updateField("consentMarketing", event.target.checked)}
        />
        <span>
          Hozzájárulok, hogy a promócióval és ipari kompresszor ajánlatokkal
          kapcsolatban marketingcélú megkeresést kapjak.
        </span>
      </label>

      <button className="campaign-submit" disabled={isSubmitting || (hasTriedSubmit && !isValid)}>
        {isSubmitting ? "Beküldés folyamatban..." : "Kérem a CompAir előszűrést"}
        <ArrowRight size={18} />
      </button>

      {formError ? <p className="campaign-error-note">{formError}</p> : null}

      <p className="campaign-form-note">
        <CheckCircle2 size={16} />
        A kampányfeltételek végleges ellenőrzése az audit vagy az adattábla-adatok alapján történik.
      </p>
    </form>
  );
}

function CampaignField({
  children,
  error,
  hint,
  id,
  label,
  optional
}: {
  children: React.ReactNode;
  error?: string;
  hint?: string;
  id: string;
  label: string;
  optional?: boolean;
}) {
  return (
    <div className="campaign-field">
      <label htmlFor={id}>
        {label}
        {optional ? <span>opcionális</span> : <b aria-hidden="true">*</b>}
      </label>
      {children}
      {hint ? (
        <p className="campaign-field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      <CampaignFieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function CampaignFieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="campaign-field-error" id={id}>
      {message}
    </p>
  );
}

function getCampaignFormErrors(form: CampaignFormState): CampaignFormErrors {
  const errors: CampaignFormErrors = {};

  if (form.companyName.trim().length < 2) {
    errors.companyName = "Add meg a cégnevet legalább 2 karakterrel.";
  }

  if (form.name.trim().length < 2) {
    errors.name = "Add meg a kapcsolattartó nevét.";
  }

  if (!isValidEmail(form.email)) {
    errors.email = "Adj meg érvényes email címet.";
  }

  if (!isValidHungarianPhone(normalizeHungarianPhone(form.phone))) {
    errors.phone = "Adj meg magyar mobilszámot +36 formátumban.";
  }

  if (form.companyActivity.trim().length < 2) {
    errors.companyActivity = "Válaszd ki a tevékenységet.";
  }

  if (form.currentBrand.trim().length < 2) {
    errors.currentBrand = "Válaszd ki a jelenlegi márkát.";
  }

  if (!isBoundedNumber(form.annualHours, 100, 8760)) {
    errors.annualHours = "Az éves üzemóra 100 és 8760 között lehet.";
  }

  if (!isBoundedNumber(form.energyPriceHufKwh, 1, 500)) {
    errors.energyPriceHufKwh = "A villamosenergia díj 1 és 500 Ft/kWh között lehet.";
  }

  if (form.message.trim().length > 900) {
    errors.message = "A megjegyzés legfeljebb 900 karakter lehet.";
  }

  if (!form.consentPrivacy) {
    errors.consentPrivacy = "Az előszűréshez ezt az elfogadást be kell jelölni.";
  }

  return errors;
}

function isBoundedNumber(value: string, min: number, max: number) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue >= min && numericValue <= max;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function isValidHungarianPhone(phone: string) {
  return /^\+36\d{9}$/.test(phone.trim());
}

function normalizeHungarianPhone(phone: string) {
  const digitsAndPlus = phone.trim().replace(/[^\d+]/g, "");
  if (digitsAndPlus.startsWith("+36")) return digitsAndPlus;
  if (digitsAndPlus.startsWith("06")) return `+36${digitsAndPlus.slice(2)}`;
  if (digitsAndPlus.startsWith("36")) return `+${digitsAndPlus}`;
  return digitsAndPlus;
}

function getCampaignTracking(form: CampaignFormState): CampaignTracking {
  if (typeof window === "undefined") {
    return {
      utmSource: "iparikalkulator",
      utmMedium: "landing",
      utmCampaign: "compair-cserepromocio-2026",
      utmContent: form.requestType
    };
  }

  const params = new URLSearchParams(window.location.search);

  return {
    utmSource: params.get("utm_source") ?? "iparikalkulator",
    utmMedium: params.get("utm_medium") ?? "landing",
    utmCampaign: params.get("utm_campaign") ?? "compair-cserepromocio-2026",
    utmContent: params.get("utm_content") ?? `${form.requestType} | ${form.nameplateStatus}`,
    utmTerm: params.get("utm_term") ?? undefined,
    gclid: params.get("gclid") ?? undefined,
    gbraid: params.get("gbraid") ?? undefined,
    wbraid: params.get("wbraid") ?? undefined,
    liFatId: params.get("li_fat_id") ?? params.get("liFatId") ?? undefined,
    referrer: document.referrer || undefined
  };
}
