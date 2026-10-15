"use client";

import { ArrowRight, CheckCircle2, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { CustomerOfferConfig } from "@/lib/customer-offers";
import { trackSuccessfulLead } from "@/lib/tracking/google";
import { getCampaignTracking } from "@/lib/tracking/campaign";
import { isValidHungarianPhone, normalizeHungarianPhone } from "@/lib/phone";
import { useLeadFormTracking } from "@/components/use-lead-form-tracking";

type FormState = {
  companyName: string;
  name: string;
  email: string;
  phone: string;
  equipmentBrand: string;
  equipmentModel: string;
  primaryDetail: string;
  secondaryDetail: string;
  message: string;
  consentPrivacy: boolean;
  consentMarketing: boolean;
  consentAdsPersonalization: boolean;
  website: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  companyName: "",
  name: "",
  email: "",
  phone: "",
  equipmentBrand: "",
  equipmentModel: "",
  primaryDetail: "",
  secondaryDetail: "",
  message: "",
  consentPrivacy: false,
  consentMarketing: false,
  consentAdsPersonalization: false,
  website: ""
};

export function CustomerOfferForm({ config }: { config: CustomerOfferConfig }) {
  const submittingRef = useRef(false);
  const { ref: leadFormRef, onFocusCapture: startLeadForm, ...formTracking } = useLeadFormTracking(config.kind);
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  async function submitInquiry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    formTracking.attempt();
    setFormError(null);

    const normalizedPhone = normalizeHungarianPhone(form.phone);
    const nextForm = { ...form, phone: normalizedPhone };
    const nextErrors = validateForm(nextForm);
    setForm(nextForm);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      formTracking.errors(Object.keys(nextErrors));
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLElement>(".reactivation-form [aria-invalid='true']")?.focus();
      });
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/campaign-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: config.kind,
          pageSource: config.pageSource,
          companyName: nextForm.companyName,
          name: nextForm.name,
          email: nextForm.email || undefined,
          phone: nextForm.phone || undefined,
          equipmentBrand: nextForm.equipmentBrand || undefined,
          equipmentModel: nextForm.equipmentModel || undefined,
          primaryDetail: nextForm.primaryDetail || undefined,
          secondaryDetail: nextForm.secondaryDetail || undefined,
          message: nextForm.message || undefined,
          consentPrivacy: nextForm.consentPrivacy,
          consentMarketing: nextForm.consentMarketing,
          consentAdsPersonalization: nextForm.consentAdsPersonalization,
          website: nextForm.website || undefined,
          tracking: getCampaignTracking()
        })
      });
      const payload = (await response.json().catch(() => null)) as
        | { inquiryId?: string; error?: string; accepted?: boolean; email?: { customer?: { status?: string } } }
        | null;

      if (!response.ok || !payload?.inquiryId) {
        throw new Error(payload?.error ?? "A beküldés nem sikerült.");
      }

      if (payload.accepted !== false && payload.inquiryId !== "accepted") trackSuccessfulLead({
        leadId: payload.inquiryId,
        email: nextForm.email || undefined,
        phone: nextForm.phone || undefined,
        formType: config.kind,
        enhancedConversionConsent: nextForm.consentAdsPersonalization
      });
      router.push(
        `/ajanlat-koszonjuk?tipus=${encodeURIComponent(config.kind)}&ref=${encodeURIComponent(payload.inquiryId.slice(0, 8))}${nextForm.email && payload.email?.customer?.status !== "accepted" ? "&email=kesik" : ""}`
      );
    } catch (caught) {
      formTracking.errors(["submission"], "server");
      setFormError(caught instanceof Error ? caught.message : "Váratlan hiba történt.");
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <form ref={leadFormRef} onFocusCapture={startLeadForm} className="reactivation-form" id="ajanlatkeres" onSubmit={submitInquiry} noValidate>
      <div className="reactivation-form-heading">
        <span>Ajánlatkérés</span>
        <h2>{config.formTitle}</h2>
        <p>{config.formLead}</p>
      </div>

      <div className="reactivation-form-grid">
        <FormField error={errors.companyName} id="companyName" label="Cégnév">
          <input
            aria-describedby={errors.companyName ? "companyName-error" : undefined}
            aria-invalid={Boolean(errors.companyName)}
            autoComplete="organization"
            id="companyName"
            value={form.companyName}
            onChange={(event) => updateField("companyName", event.target.value)}
          />
        </FormField>
        <FormField error={errors.name} id="name" label="Kapcsolattartó neve">
          <input
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={Boolean(errors.name)}
            autoComplete="name"
            id="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </FormField>
        <FormField error={errors.email} hint="Legalább e-mail vagy telefon szükséges." id="email" label="E-mail-cím" optional>
          <input
            aria-describedby={`email-hint${errors.email ? " email-error" : ""}`}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            id="email"
            inputMode="email"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </FormField>
        <FormField error={errors.phone} hint="Példa: +36701234567" id="phone" label="Telefonszám" optional>
          <input
            aria-describedby={`phone-hint${errors.phone ? " phone-error" : ""}`}
            aria-invalid={Boolean(errors.phone)}
            autoComplete="tel"
            id="phone"
            inputMode="tel"
            placeholder="+36701234567"
            type="tel"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </FormField>
        <FormField id="equipmentBrand" label={config.equipmentBrandLabel} optional>
          <input
            id="equipmentBrand"
            value={form.equipmentBrand}
            onChange={(event) => updateField("equipmentBrand", event.target.value)}
          />
        </FormField>
        <FormField id="equipmentModel" label={config.equipmentModelLabel} optional>
          <input
            id="equipmentModel"
            value={form.equipmentModel}
            onChange={(event) => updateField("equipmentModel", event.target.value)}
          />
        </FormField>
        <FormField id="primaryDetail" label={config.primaryDetail.label} optional>
          <select
            id="primaryDetail"
            value={form.primaryDetail}
            onChange={(event) => updateField("primaryDetail", event.target.value)}
          >
            <option value="">{config.primaryDetail.placeholder}</option>
            {config.primaryDetail.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </FormField>
        <FormField id="secondaryDetail" label={config.secondaryDetail.label} optional>
          <select
            id="secondaryDetail"
            value={form.secondaryDetail}
            onChange={(event) => updateField("secondaryDetail", event.target.value)}
          >
            <option value="">{config.secondaryDetail.placeholder}</option>
            {config.secondaryDetail.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField error={errors.message} id="message" label="Rövid megjegyzés" optional>
        <textarea
          aria-describedby={errors.message ? "message-error" : undefined}
          aria-invalid={Boolean(errors.message)}
          id="message"
          maxLength={1200}
          rows={4}
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
        />
      </FormField>

      <div className="reactivation-honeypot" aria-hidden="true">
        <label htmlFor="website">Weboldal</label>
        <input
          autoComplete="off"
          id="website"
          tabIndex={-1}
          value={form.website}
          onChange={(event) => updateField("website", event.target.value)}
        />
      </div>

      <label className={`reactivation-checkbox ${errors.consentPrivacy ? "is-invalid" : ""}`}>
        <input
          aria-describedby={errors.consentPrivacy ? "consentPrivacy-error" : undefined}
          aria-invalid={Boolean(errors.consentPrivacy)}
          checked={form.consentPrivacy}
          type="checkbox"
          onChange={(event) => updateField("consentPrivacy", event.target.checked)}
        />
        <span>
          Elolvastam az <Link href="/adatkezeles">adatkezelési tájékoztatót</Link>, és kérem a megkeresésem feldolgozását.
        </span>
      </label>
      {errors.consentPrivacy ? (
        <p className="reactivation-field-error" id="consentPrivacy-error">
          {errors.consentPrivacy}
        </p>
      ) : null}

      <label className="reactivation-checkbox">
        <input
          checked={form.consentMarketing}
          type="checkbox"
          onChange={(event) => updateField("consentMarketing", event.target.checked)}
        />
        <span>Hozzájárulok, hogy kapcsolódó szakmai ajánlatokkal e-mailben vagy telefonon megkeressenek.</span>
      </label>

      <label className="reactivation-checkbox">
        <input
          checked={form.consentAdsPersonalization}
          type="checkbox"
          onChange={(event) => updateField("consentAdsPersonalization", event.target.checked)}
        />
        <span>Hozzájárulok, hogy elérhetőségeimet személyre szabott IMEX-ajánlatok Google-felületeken történő megjelenítéséhez biztonságos egyeztetésre használják.</span>
      </label>

      <button className="reactivation-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Beküldés folyamatban…" : config.primaryCta}
        <ArrowRight size={19} />
      </button>

      {formError ? <p className="reactivation-submit-error" role="alert">{formError}</p> : null}

      <p className="reactivation-secure-note">
        <LockKeyhole size={16} />
        Az adatok titkosított kapcsolaton érkeznek, a hozzájárulások bármikor visszavonhatók.
      </p>
      <p className="reactivation-partner-note">
        <CheckCircle2 size={16} />
        A megkeresést az iparikalkulator.hu rögzíti, és az IMEX Szerviztechnika Kft. szakmai feldolgozására továbbítja.
      </p>
    </form>
  );
}

function FormField({
  children,
  error,
  hint,
  id,
  label,
  optional = false
}: {
  children: React.ReactNode;
  error?: string;
  hint?: string;
  id: string;
  label: string;
  optional?: boolean;
}) {
  return (
    <div className="reactivation-field">
      <label htmlFor={id}>
        {label}
        <span>{optional ? "opcionális" : "kötelező"}</span>
      </label>
      {children}
      {hint ? <small id={`${id}-hint`}>{hint}</small> : null}
      {error ? (
        <p className="reactivation-field-error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function validateForm(form: FormState): FormErrors {
  const nextErrors: FormErrors = {};
  if (form.companyName.trim().length < 2) nextErrors.companyName = "Adja meg a cégnevet.";
  if (form.name.trim().length < 2) nextErrors.name = "Adja meg a kapcsolattartó nevét.";
  if (!form.email.trim() && !form.phone.trim()) {
    nextErrors.email = "Legalább e-mail-címet vagy telefonszámot adjon meg.";
    nextErrors.phone = "Legalább e-mail-címet vagy telefonszámot adjon meg.";
  } else {
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      nextErrors.email = "Adjon meg érvényes e-mail-címet.";
    }
    if (form.phone && !isValidHungarianPhone(form.phone)) {
      nextErrors.phone = "Adjon meg magyar telefonszámot +36 formátumban.";
    }
  }
  if (form.message.length > 1200) nextErrors.message = "A megjegyzés legfeljebb 1200 karakter lehet.";
  if (!form.consentPrivacy) nextErrors.consentPrivacy = "A megkeresés feldolgozásához szükséges az adatkezelés elfogadása.";
  return nextErrors;
}
