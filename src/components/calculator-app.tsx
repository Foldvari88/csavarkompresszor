"use client";

import {
  ArrowRight,
  BarChart3,
  Clock3,
  FileText,
  Gauge,
  Sparkles,
  Target,
  Zap
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { calculateSavings } from "@/lib/calculator/calculate";
import {
  ASSUMPTION_VERSION,
  LEGACY_BRANDS,
  NOMINAL_KW_VALUES
} from "@/lib/calculator/generated-data";
import { getBrandCategory } from "@/lib/calculator/brand-category";
import type {
  AgeBand,
  CalculatorInput,
  CampaignTracking,
  HeatRecoveryResult,
  LeadFormInput
} from "@/lib/calculator/types";
import { formatHuf, formatKw, formatNumber } from "@/lib/format";
import { homeFaq, homeSeoLinks } from "@/lib/home-seo";

const CompressorChat = dynamic(
  () => import("@/components/compressor-chat").then((module) => module.CompressorChat),
  { ssr: false }
);

type LeadFields = Pick<
  LeadFormInput,
  | "companyName"
  | "companyActivity"
  | "name"
  | "email"
  | "phone"
  | "consentMarketing"
  | "consentPrivacy"
>;

type LeadFieldErrors = Partial<Record<keyof LeadFields, string>>;

const initialCalculator: CalculatorInput = {
  brand: "Atlas Copco",
  category: getBrandCategory("Atlas Copco"),
  ageBand: "10-15",
  nominalKw: 75,
  annualHours: ASSUMPTION_VERSION.defaultAnnualHours,
  energyPriceHufKwh: ASSUMPTION_VERSION.defaultEnergyPriceHufKwh,
  preferVariableSpeed: true,
  loadProfile: "fluctuating",
  heatRecovery: {
    enabled: false,
    gasPriceHufPerM3: 304,
    heatingMonths: 7,
    canUseRecoveredHeatOutsideHeatingSeason: false,
    hotWaterMonths: 5,
    hotWaterLoadFactor: 0.5,
    recoverablePowerRatio: 0.9,
    utilizationEfficiency: 0.9,
    gasKwhPerM3: 9.44,
    boilerEfficiency: 0.9
  }
};

const loadProfileOptions = [
  { value: "continuous", label: "Folyamatos", helper: "stabil levegőigény" },
  { value: "fluctuating", label: "Ingadozó", helper: "változó fogyasztás" }
] satisfies Array<{ value: NonNullable<CalculatorInput["loadProfile"]>; label: string; helper: string }>;

const publicLegacyBrands = [
  ...LEGACY_BRANDS.filter((brand) => brand !== "CompAir" && brand !== "Egyéb"),
  "Egyéb"
];

const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1);

const companyActivityOptions = [
  "Élelmiszeripar",
  "Fém és fém megmunkálás",
  "Autó és járműipar",
  "Gépgyártás",
  "Elektronikai ipar",
  "Vegyipar",
  "Gyógyszeripar",
  "Műanyagipar és gumiipar",
  "Papír és nyomdaipar",
  "Faipar",
  "Textil és ruhaipar",
  "Építőanyagipar",
  "Üveg és kerámiaipar",
  "Energiaipar",
  "Egyéb"
];

const initialLead: LeadFields = {
  companyName: "",
  companyActivity: "",
  name: "",
  email: "",
  phone: "",
  consentMarketing: false,
  consentPrivacy: false
};

export function CalculatorApp() {
  const router = useRouter();
  const [calculator, setCalculator] = useState<CalculatorInput>(initialCalculator);
  const [lead, setLead] = useState<LeadFields>(initialLead);
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recalculationTimeout = useRef<number | null>(null);

  const result = useMemo(
    () =>
      calculateSavings({
        ...calculator,
        companyWebsite: "",
        companyActivity: lead.companyActivity,
        email: lead.email
      }),
    [calculator, lead.companyActivity, lead.email]
  );
  const oldInputKw = result.selectedLegacy.degradedInputKw;
  const recommendedInputKw = result.recommendedModel.inputKw;
  const recommendedBarWidth = Math.max(8, Math.min(100, (recommendedInputKw / oldInputKw) * 100));
  const leadFieldErrors = useMemo(() => getLeadFieldErrors(lead), [lead]);
  const visibleLeadFieldErrors = hasTriedSubmit ? leadFieldErrors : {};
  const isLeadFormValid = Object.keys(leadFieldErrors).length === 0;
  const canSubmit = !isSubmitting;
  const isCalculatorSectionReady =
    Boolean(calculator.brand) &&
    Boolean(calculator.ageBand) &&
    calculator.nominalKw > 0 &&
    calculator.annualHours > 0 &&
    calculator.energyPriceHufKwh > 0 &&
    Boolean(calculator.loadProfile);
  const completionItems = [
    Boolean(calculator.brand),
    Boolean(calculator.category),
    Boolean(calculator.ageBand),
    calculator.nominalKw > 0,
    calculator.annualHours > 0,
    calculator.energyPriceHufKwh > 0,
    Boolean(calculator.loadProfile),
    lead.companyActivity.trim().length > 1,
    lead.name.trim().length > 1,
    isValidEmail(lead.email),
    isValidHungarianPhone(lead.phone),
    lead.consentPrivacy
  ];
  const completionPercent = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100
  );

  function triggerRecalculation() {
    if (recalculationTimeout.current) {
      window.clearTimeout(recalculationTimeout.current);
    }
    setIsRecalculating(true);
    recalculationTimeout.current = window.setTimeout(() => setIsRecalculating(false), 560);
  }

  function updateCalculator(updater: (current: CalculatorInput) => CalculatorInput) {
    triggerRecalculation();
    setCalculator((current) => syncPrimaryUnit(updater(current)));
  }

  function updateHeatRecovery(
    updater: (current: NonNullable<CalculatorInput["heatRecovery"]>) => NonNullable<CalculatorInput["heatRecovery"]>
  ) {
    updateCalculator((current) => ({
      ...current,
      heatRecovery: updater(current.heatRecovery ?? initialCalculator.heatRecovery!)
    }));
  }

  async function submitLead() {
    setHasTriedSubmit(true);
    setError(null);

    if (!isLeadFormValid) {
      setError(
        "Minden kötelező mezőt ki kell tölteni. Add meg a tevékenységet is. Az email legyen érvényes, a telefonszám formátuma például: +36701234567."
      );
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...calculator,
                  tracking: getCampaignTracking(),
                  ...lead,
                  companyWebsite: ""
                })
      });
      const payload = (await response.json().catch(() => null)) as
        | { leadId?: string; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "A beküldés nem sikerült. Ellenőrizze az adatokat.");
      }

      if (!payload?.leadId) {
        throw new Error("A beküldés sikerült, de az azonosító nem érkezett meg.");
      }

      router.push("/koszonjuk");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Váratlan hiba történt.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="site-shell">
      <header className="page-band">
        <div className="container topbar">
          <div className="brand-mark">
            <span className="brand-blade">
              <MiniScrewCompressorLogo />
            </span>
            <span>iparikalkulator.hu</span>
          </div>
          <a className="top-cta" href="#kalkulator">
            Megtakarítás számítása
            <ArrowRight size={15} />
          </a>
        </div>
      </header>

      <section className="container hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Zap size={16} />
            Csavarkompresszor csere előkalkuláció
          </span>
          <h1>
            Energiamegtakarítás kalkulátor{" "}
            <span className="industrial-word-mark">csavarkompresszorok</span> esetén,
            sűrített levegő rendszereknél
          </h1>
          <p>
            Számolja ki, mennyit csökkenthet az éves villamosenergia-költségen egy
            korszerű csavarkompresszorral. A részletes eredményt emailben küldjük ki,
            az alkalmazott feltételekkel és gépajánlással együtt.
          </p>
          <div className="hero-actions">
            <a className="hero-cta" href="#kalkulator">
              Indítom a kalkulációt
              <ArrowRight size={18} />
            </a>
            <span className="hero-proof">
              <Clock3 size={17} />
              kb. 2 perc
            </span>
            <span className="hero-proof">
              <FileText size={17} />
              emailes riport
            </span>
          </div>
        </div>

        <div className="hero-roi-card" aria-label="Megtakarítási példa">
          <div className="roi-card-top">
            <span>Élő példa</span>
            <BarChart3 size={18} />
          </div>
          <strong>{formatHuf(result.annualHufSaved)}</strong>
          <p>becsült éves megtakarítás a jelenlegi alapbeállításokkal</p>
          <BlueprintCompressorIllustration />
          <div className="roi-card-grid">
            <span>
              Régi
              <b>{formatNumber(oldInputKw, 1)} kW</b>
            </span>
            <span>
              Korszerű
              <b>{formatNumber(recommendedInputKw, 1)} kW</b>
            </span>
          </div>
        </div>
      </section>

      <section className="container calculator-grid" id="kalkulator">
        <div className="tool-panel">
          <div className="panel-kicker">
            <span>01</span>
            Kompresszor adatok
          </div>
          <div className="completion-card" aria-label="Kitöltési állapot">
            <div className="completion-head">
              <span>Kitöltési állapot</span>
              <strong>{completionPercent}%</strong>
            </div>
            <div className="completion-track">
              <span style={{ width: `${completionPercent}%` }} />
            </div>
          </div>
          <div className="section-title">
            <h2>Kalkulációs adatok</h2>
            <span className="step-badge">
              <Gauge size={15} />
              Élő előnézet
            </span>
          </div>

          <div className="form-grid two">
            <Field label="Jelenlegi gép márkája">
              <select
                required
                value={calculator.brand}
                onChange={(event) =>
                  updateCalculator((current) => ({
                    ...current,
                    brand: event.target.value,
                    category: getBrandCategory(event.target.value)
                  }))
                }
              >
                {publicLegacyBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Márka szerinti kategória">
              <div className="readonly-field">
                <strong>{calculator.category}</strong>
                <span>Márka alapján automatikus</span>
              </div>
            </Field>

            <Field label="Névleges teljesítmény">
              <select
                required
                value={calculator.nominalKw}
                onChange={(event) =>
                  updateCalculator((current) => ({
                    ...current,
                    nominalKw: Number(event.target.value)
                  }))
                }
              >
                {NOMINAL_KW_VALUES.map((kw) => (
                  <option key={kw} value={kw}>
                    {formatKw(kw)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Éves üzemóra">
              <input
                inputMode="numeric"
                min={100}
                max={8760}
                required
                type="number"
                value={calculator.annualHours}
                onChange={(event) =>
                  updateCalculator((current) => ({
                    ...current,
                    annualHours: Number(event.target.value)
                  }))
                }
              />
            </Field>

            <Field label="Villamos energia díja Ft/kWh">
              <input
                inputMode="decimal"
                min={1}
                max={500}
                required
                type="number"
                value={calculator.energyPriceHufKwh}
                onChange={(event) =>
                  updateCalculator((current) => ({
                    ...current,
                    energyPriceHufKwh: Number(event.target.value)
                  }))
                }
              />
            </Field>

            <Field label="Terhelési profil">
              <select
                required
                value={calculator.loadProfile ?? "fluctuating"}
                onChange={(event) =>
                  updateCalculator((current) => ({
                    ...current,
                    loadProfile: event.target.value as NonNullable<CalculatorInput["loadProfile"]>,
                    preferVariableSpeed:
                      event.target.value === "fluctuating" ? true : current.preferVariableSpeed
                  }))
                }
              >
                {loadProfileOptions.map((profile) => (
                  <option key={profile.value} value={profile.value}>
                    {profile.label} - {profile.helper}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Technológiai preferencia">
              <label className={`toggle-row ${calculator.loadProfile === "fluctuating" ? "is-disabled" : ""}`}>
                <input
                  type="checkbox"
                  checked={calculator.loadProfile === "fluctuating" || Boolean(calculator.preferVariableSpeed)}
                  disabled={calculator.loadProfile === "fluctuating"}
                  onChange={(event) =>
                    updateCalculator((current) => ({
                      ...current,
                      preferVariableSpeed: event.target.checked
                    }))
                  }
                />
                <span>Fordulatszám szabályzós technológia előnyben</span>
              </label>
            </Field>
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label>Gép kora</label>
            <div className="segmented">
              {(["5-10", "10-15", "15+"] satisfies AgeBand[]).map((ageBand) => (
                <button
                  className={`segment ${calculator.ageBand === ageBand ? "active" : ""}`}
                  key={ageBand}
                  type="button"
                  onClick={() => updateCalculator((current) => ({ ...current, ageBand }))}
                >
                  {ageBand} év
                </button>
              ))}
            </div>
          </div>

          <div className="heat-recovery-panel">
            <label className="checkbox-line heat-recovery-toggle">
              <input
                type="checkbox"
                checked={Boolean(calculator.heatRecovery?.enabled)}
                onChange={(event) =>
                  updateHeatRecovery((current) => ({
                    ...current,
                    enabled: event.target.checked
                  }))
                }
              />
              <span>Szeretné a kompresszor hulladékhőjét hasznosítani fűtési célokra?</span>
            </label>

            {calculator.heatRecovery?.enabled ? (
              <>
                <div className="heat-recovery-note">
                  Számítási alap: korszerű iparági csavarkompresszor névleges teljesítménye alapján
                  90% visszanyerhető hőteljesítmény x 90% hasznosítási tényező. HMV = használati
                  melegvíz, azaz mosdóhoz, technológiához vagy üzemi melegvízhez használt víz.
                  Az alap földgázár 304 Ft/m3 ipari piaci becslés, szabadon módosítható.
                </div>
                <div className="form-grid two">
                  <OptionalField label="Földgáz ára Ft/m3">
                    <input
                      inputMode="numeric"
                      min={1}
                      type="number"
                      value={calculator.heatRecovery.gasPriceHufPerM3 ?? 304}
                      onChange={(event) =>
                        updateHeatRecovery((current) => ({
                          ...current,
                          gasPriceHufPerM3: Number(event.target.value)
                        }))
                      }
                    />
                  </OptionalField>

                  <OptionalField label="Fűtési időszak hónap/év">
                    <select
                      value={calculator.heatRecovery.heatingMonths ?? 7}
                      onChange={(event) =>
                        updateHeatRecovery((current) => ({
                          ...current,
                          heatingMonths: Number(event.target.value),
                          hotWaterMonths: current.canUseRecoveredHeatOutsideHeatingSeason
                            ? Math.max(0, 12 - Number(event.target.value))
                            : current.hotWaterMonths
                        }))
                      }
                    >
                      {monthOptions.map((month) => (
                        <option key={month} value={month}>
                          {month} hónap
                        </option>
                      ))}
                    </select>
                  </OptionalField>

                  <OptionalField label="Fűtési időszakon kívül fel tudja használni a visszanyert hőt?">
                    <select
                      value={
                        calculator.heatRecovery.canUseRecoveredHeatOutsideHeatingSeason
                          ? "yes"
                          : "no"
                      }
                      onChange={(event) =>
                        updateHeatRecovery((current) => {
                          const canUseOutsideHeating = event.target.value === "yes";
                          return {
                            ...current,
                            canUseRecoveredHeatOutsideHeatingSeason: canUseOutsideHeating,
                            hotWaterMonths: canUseOutsideHeating
                              ? Math.max(0, 12 - (current.heatingMonths ?? 7))
                              : current.hotWaterMonths
                          };
                        })
                      }
                    >
                      <option value="no">Nem</option>
                      <option value="yes">Igen, HMV célra</option>
                    </select>
                  </OptionalField>

                  {calculator.heatRecovery.canUseRecoveredHeatOutsideHeatingSeason ? (
                    <OptionalField label="Csak HMV időszak hónap/év">
                      <input
                        aria-readonly="true"
                        readOnly
                        type="text"
                        value={`${Math.max(0, 12 - (calculator.heatRecovery.heatingMonths ?? 7))} hónap`}
                      />
                    </OptionalField>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>

          <div className={`lead-gate-section ${isCalculatorSectionReady ? "is-ready" : ""}`}>
            <div className="lead-gate-status">
              <span />
              Következő lépés: mérnöki riport adatok
            </div>

            <div className="section-title">
              <div>
                <div className="panel-kicker">
                  <span>02</span>
                  Riport küldése
                </div>
                <h3>Kapcsolati adatok</h3>
              </div>
              <span className="step-badge">
                <FileText size={15} />
                Emailes riport
              </span>
            </div>

          <div className="form-grid two">
            <Field label="Kapcsolattartó név">
              <input
                id="name"
                aria-describedby={visibleLeadFieldErrors.name ? "name-error" : undefined}
                aria-invalid={Boolean(visibleLeadFieldErrors.name)}
                required
                minLength={2}
                value={lead.name}
                onChange={(event) =>
                  setLead((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Név"
              />
              <FieldError id="name-error" message={visibleLeadFieldErrors.name} />
            </Field>

            <Field label="Email cím">
              <input
                id="email"
                aria-describedby={visibleLeadFieldErrors.email ? "email-error" : undefined}
                aria-invalid={Boolean(visibleLeadFieldErrors.email)}
                required
                value={lead.email}
                onChange={(event) =>
                  setLead((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="email@ceg.hu"
                type="email"
              />
              <FieldError id="email-error" message={visibleLeadFieldErrors.email} />
              {lead.email && isValidEmail(lead.email) && !isBusinessEmail(lead.email) ? (
                <p className="field-hint is-warning">
                  Céges email előnyös, de nem kötelező. A részletes riportot erre az email címre küldjük.
                </p>
              ) : null}
            </Field>

            <Field label="Telefonszám">
              <input
                id="phone"
                aria-describedby={visibleLeadFieldErrors.phone ? "phone-error" : undefined}
                aria-invalid={Boolean(visibleLeadFieldErrors.phone)}
                inputMode="tel"
                pattern="[+]36[0-9]{9}"
                required
                title="Formátum: +36701234567"
                value={lead.phone}
                onChange={(event) =>
                  setLead((current) => ({ ...current, phone: event.target.value }))
                }
                placeholder="+36701234567"
                type="tel"
              />
              <FieldError id="phone-error" message={visibleLeadFieldErrors.phone} />
            </Field>

            <Field label="Iparág / tevékenység">
              <select
                id="companyActivity"
                aria-describedby={
                  visibleLeadFieldErrors.companyActivity ? "companyActivity-error" : undefined
                }
                aria-invalid={Boolean(visibleLeadFieldErrors.companyActivity)}
                required
                value={lead.companyActivity}
                onChange={(event) =>
                  setLead((current) => ({ ...current, companyActivity: event.target.value }))
                }
              >
                <option value="">Válassz tevékenységet</option>
                {companyActivityOptions.map((activity) => (
                  <option key={activity} value={activity}>
                    {activity}
                  </option>
                ))}
              </select>
              <FieldError
                id="companyActivity-error"
                message={visibleLeadFieldErrors.companyActivity}
              />
            </Field>

            <OptionalField label="Cégnév">
              <input
                id="companyName"
                aria-describedby={visibleLeadFieldErrors.companyName ? "companyName-error" : undefined}
                aria-invalid={Boolean(visibleLeadFieldErrors.companyName)}
                value={lead.companyName}
                onChange={(event) =>
                  setLead((current) => ({ ...current, companyName: event.target.value }))
                }
                placeholder="Példa Kft."
              />
              <p className="field-hint">Opcionálisan töltendő.</p>
              <FieldError id="companyName-error" message={visibleLeadFieldErrors.companyName} />
            </OptionalField>
          </div>

          <div className="form-grid" style={{ marginTop: 16 }}>
            <label
              className={`checkbox-line ${visibleLeadFieldErrors.consentPrivacy ? "is-invalid" : ""}`}
            >
              <input
                aria-describedby={
                  visibleLeadFieldErrors.consentPrivacy ? "consentPrivacy-error" : undefined
                }
                aria-invalid={Boolean(visibleLeadFieldErrors.consentPrivacy)}
                type="checkbox"
                required
                checked={lead.consentPrivacy}
                onChange={(event) =>
                  setLead((current) => ({ ...current, consentPrivacy: event.target.checked }))
                }
              />
              <span>
                Elfogadom, hogy a megadott adatok alapján elkészüljön és emailben
                megérkezzen a kalkuláció. <b className="required-mark">*</b>
              </span>
            </label>
            <FieldError
              id="consentPrivacy-error"
              message={visibleLeadFieldErrors.consentPrivacy}
            />
            <label className="checkbox-line">
              <input
                type="checkbox"
                checked={lead.consentMarketing}
                onChange={(event) =>
                  setLead((current) => ({ ...current, consentMarketing: event.target.checked }))
                }
              />
              <span>
                Kérem a kalkulációhoz kapcsolódó szakmai utánkövetést és ajánlat-előkészítő
                emaileket.
              </span>
            </label>
            <button
              className="submit-button"
              disabled={!canSubmit}
              type="button"
              onClick={submitLead}
            >
              {isSubmitting ? "Riport készítése..." : "Részletes riport küldése"}
              <ArrowRight size={18} />
            </button>
            {error ? <div className="error-note">{error}</div> : null}
          </div>
          </div>
        </div>

        <aside className={`result-panel ${isRecalculating ? "is-updating" : ""}`}>
          <div className="result-rail">
            <span>
              <Gauge size={18} />
              ROI számítás
            </span>
            <span className="live-status">
              <i />
              {isRecalculating ? "Újraszámolás" : "Élő kalkuláció"}
            </span>
          </div>
          <div className="section-title">
            <h2>Megtakarítási előnézet</h2>
            <span className="green-chip">
              <Sparkles size={14} />
              Ajánlott eredmény
            </span>
          </div>

          <div className="metric-stack">
            <div className="priority-card">
              <span>
                <Target size={17} />
                Ajánlatkérési prioritás
              </span>
              <strong>{result.priority.label}</strong>
              <p>{result.priority.description}</p>
            </div>

            <div className="primary-metric">
              <div className="metric-label">Becsült éves megtakarítás</div>
              <div className={`metric-value ${isRecalculating ? "metric-tick" : ""}`}>
                {formatHuf(result.annualHufSaved)}
              </div>
              <div className="metric-sub">
                {formatNumber(result.annualKwhSaved)} kWh/év energiamegtakarítás előnézetben
              </div>
            </div>

            <div className={`benchmark-card ${result.benchmark.level}`}>
              <div>
                <span className="metric-label">Benchmark sáv</span>
                <strong>{result.benchmark.label}</strong>
                <p>{result.benchmark.description}</p>
              </div>
              <b>{formatNumber(result.benchmark.inputKwPerNominalKw, 2)}x</b>
            </div>

            <div className="efficiency-compare">
              <div className="compare-head">
                <span>Felvett teljesítmény összevetés</span>
                <b>{formatNumber(result.annualKwhSaved)} kWh/év</b>
              </div>
              <div className="bar-row">
                <span>Régi gép</span>
                <div className="bar-track old">
                  <span style={{ width: "100%" }} />
                </div>
                <strong>{formatNumber(oldInputKw, 2)} kW</strong>
              </div>
              <div className="bar-row">
                <span>Korszerű gép</span>
                <div className="bar-track recommended">
                  <span style={{ width: `${recommendedBarWidth}%` }} />
                </div>
                <strong>{formatNumber(recommendedInputKw, 2)} kW</strong>
              </div>
            </div>

            <div className="mini-metrics">
              <MetricTile label="Havi hatás" value={formatHuf(result.monthlyHufSaved)} />
              <MetricTile label="5 éves potenciál" value={formatHuf(result.fiveYearHufSaved)} />
              <MetricTile label="Gépek száma" value={`${result.totalMachineCount} db`} />
              <MetricTile
                label="Régi gép"
                value={`${formatNumber(result.selectedLegacy.degradedInputKw, 2)} kW`}
              />
            </div>

            {result.heatRecovery ? (
              <div className="heat-recovery-result">
                <div className="heat-recovery-result-head">
                  <span className="metric-label">ROI bővítmény</span>
                  <strong>Hővisszanyerési potenciál aktiválva</strong>
                  <p>
                    Korszerű iparági csavarkompresszorral számolva. A villamosenergia-megtakarítás
                    mellé becsült gázkiváltási hatás is bekerül a riportba.
                  </p>
                </div>
                <div className="heat-recovery-total">
                  <span>Összesített éves potenciál</span>
                  <strong>{formatHuf(result.annualHufSaved + result.heatRecovery.seasonalSavingsHuf)}</strong>
                  <small>áram + hővisszanyerési gázkiváltás előnézetben</small>
                </div>
                <div className="heat-recovery-result-grid">
                  <span className="heat-tile electric">
                    Villamosenergia-hatás
                    <b>{formatHuf(result.annualHufSaved)}</b>
                  </span>
                  <span className="heat-tile thermal">
                    Hővisszanyerési hatás
                    <b>{formatHuf(result.heatRecovery.seasonalSavingsHuf)}</b>
                  </span>
                </div>
                <div className="heat-flow" aria-label="Hővisszanyerési számítási folyamat">
                  <span>Hulladékhő</span>
                  <i />
                  <span>Fűtés/HMV</span>
                  <i />
                  <span>Gázkiváltás</span>
                </div>
                <p className="heat-recovery-summary">
                  HMV = használati melegvíz.{" "}
                  {formatNumber(result.heatRecovery.annualUsefulHeatKwh)} kWh/év hasznosítható hő,
                  nagyságrendileg{" "}
                  {formatNumber(result.heatRecovery.seasonalGasSavedM3)} m3 földgáz kiváltás
                  {result.heatRecovery.canUseRecoveredHeatOutsideHeatingSeason
                    ? " a fűtés/HMV modellben."
                    : " a fűtési időszakban."}
                </p>
                <div className="heat-recovery-result-grid secondary">
                  <span>
                    Elméleti éves hőhatás
                    <b>{formatHuf(result.heatRecovery.theoreticalSavingsHuf)}</b>
                  </span>
                  <span>
                    {result.heatRecovery.canUseRecoveredHeatOutsideHeatingSeason
                      ? "Fűtés/HMV időszak"
                      : "Fűtési időszak"}
                    <b>{getHeatRecoverySeasonLabel(result.heatRecovery)}</b>
                  </span>
                </div>
                <div className="heat-recovery-breakdown">
                  <HeatRecoveryRow
                    label="Kompresszor teljesítménye"
                    value={`${formatKw(result.heatRecovery.compressorNominalKw)}`}
                  />
                  <HeatRecoveryRow
                    label="Kompresszor üzemóra / év"
                    value={`${formatNumber(result.heatRecovery.annualHours)} óra`}
                  />
                  <HeatRecoveryRow
                    label="Visszanyerhető hőteljesítmény"
                    value={`${formatNumber(result.heatRecovery.recoverableHeatKw, 2)} kW`}
                  />
                  <HeatRecoveryRow
                    label="Visszanyerhető hőteljesítmény veszteséggel"
                    value={`${formatNumber(result.heatRecovery.usefulHeatKw, 2)} kW`}
                  />
                  <HeatRecoveryRow
                    label="Földgáz ára"
                    value={`${formatHuf(result.heatRecovery.gasPriceHufPerM3)} / m3`}
                  />
                  <HeatRecoveryRow
                    label="Visszanyerhető összes hőmennyiség"
                    value={`${formatNumber(result.heatRecovery.annualUsefulHeatKwh)} kWh/év`}
                  />
                  <HeatRecoveryRow
                    label="Megtakarított földgáz folyamatos HMV/ipari felhasználásnál"
                    value={`${formatNumber(result.heatRecovery.theoreticalGasSavedM3)} m3`}
                  />
                  <HeatRecoveryRow
                    label="Folyamatos HMV/ipari felhasználás megtakarítása"
                    value={formatHuf(result.heatRecovery.theoreticalSavingsHuf)}
                  />
                  <HeatRecoveryRow
                    label={getHeatRecoverySeasonLabel(result.heatRecovery)}
                    value={formatHuf(result.heatRecovery.seasonalSavingsHuf)}
                  />
                  <HeatRecoveryRow
                    label={
                      result.heatRecovery.canUseRecoveredHeatOutsideHeatingSeason
                        ? "Fűtés/HMV kombinációval kiváltható gázköltség"
                        : "Fűtési időszakban kiváltható gázköltség"
                    }
                    value={formatHuf(result.heatRecovery.seasonalSavingsHuf)}
                  />
                </div>
              </div>
            ) : null}

            <ul className="assumption-list">
              {getPublicAssumptions(result.assumptions).map((assumption) => (
                <li key={assumption}>{assumption}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="seo-support-band" aria-labelledby="szakmai-valaszok">
        <div className="container seo-support-grid">
          <div className="seo-support-copy">
            <span className="panel-kicker">
              <span>SEO</span>
              Szakmai válaszok
            </span>
            <h2 id="szakmai-valaszok">Csavarkompresszor fogyasztás és megtakarítás röviden</h2>
            <p>
              Egy ipari csavarkompresszor éves energiaköltsége a felvett teljesítmény,
              az éves üzemóra és a villamosenergia ár szorzataként becsülhető. A
              kalkulátor ezt fordítja át kWh/év és Ft/év megtakarítási előnézetté.
            </p>
            <div className="formula-box compact">
              <strong>Éves költség képlete</strong>
              <span>felvett teljesítmény kW x éves üzemóra x Ft/kWh</span>
            </div>
          </div>

          <div className="legal-card faq-card">
            <h2>Gyakori kérdések</h2>
            <div className="faq-list">
              {homeFaq.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="legal-card">
            <h2>Kapcsolódó szakmai oldalak</h2>
            <div className="seo-link-grid">
              {homeSeoLinks.map((link) => (
                <a href={link.href} key={link.href}>
                  {link.label}
                  <ArrowRight size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LegalFooterClean />
      <CompressorChat
        calculator={calculator}
        completionPercent={completionPercent}
        result={result}
      />

      <a className="mobile-sticky-cta" href="#kalkulator">
        Kalkuláció indítása
        <ArrowRight size={18} />
      </a>
    </main>
  );
}

function MiniScrewCompressorLogo() {
  return (
    <svg
      aria-hidden="true"
      className="mini-compressor-logo"
      focusable="false"
      viewBox="0 0 32 32"
    >
      <path d="M5.5 21.5h21" />
      <path d="M7.5 12.5h12.4a4.6 4.6 0 0 1 4.6 4.6v4.4h-17z" />
      <path d="M9.5 12.5V9h5.2" />
      <path d="M17 9h4.2" />
      <path d="M24.5 14h2.3v5.2" />
      <circle cx="12.4" cy="17" r="2.45" />
      <circle cx="19.1" cy="17" r="2.45" />
      <path d="M10.35 17h4.1" />
      <path d="M17.05 17h4.1" />
      <path d="M10 21.5v2.7" />
      <path d="M23 21.5v2.7" />
      <path d="M9 24.2h3.4" />
      <path d="M22 24.2h3.4" />
    </svg>
  );
}

function BlueprintCompressorIllustration() {
  return (
    <svg
      aria-hidden="true"
      className="blueprint-compressor"
      focusable="false"
      viewBox="0 0 360 190"
    >
      <g className="blueprint-grid-lines">
        <path d="M16 26h326M16 74h326M16 122h326M16 170h326" />
        <path d="M48 12v166M102 12v166M156 12v166M210 12v166M264 12v166M318 12v166" />
      </g>
      <g className="blueprint-dimensions">
        <path d="M52 18h206M52 18v12M258 18v12" />
        <path d="M286 42v96M274 42h12M274 138h12" />
        <path d="M82 158h164M82 146v12M246 146v12" />
      </g>
      <g className="blueprint-machine">
        <path d="M86 62h118l30 26v60H86z" />
        <path d="M204 62v86M204 62l30 26H204" />
        <path d="M104 78h76M104 96h76M104 114h76" />
        <path d="M102 148v17M218 148v17M94 165h28M210 165h30" />
        <circle cx="275" cy="101" r="44" />
        <circle cx="275" cy="101" r="25" />
        <path d="M234 83h-20M234 119h-20M275 57v-22M275 145v23" />
        <path d="M250 101h50M275 76v50" />
        <path d="M132 50h42M153 38v24" />
      </g>
      <g className="blueprint-callouts">
        <path d="M76 56 42 36M226 76l62-34M241 138l64 28" />
        <circle cx="42" cy="36" r="3" />
        <circle cx="288" cy="42" r="3" />
        <circle cx="305" cy="166" r="3" />
      </g>
    </svg>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label>
        {label}
        <span aria-hidden="true" className="required-mark">
          *
        </span>
      </label>
      {children}
    </div>
  );
}

function OptionalField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="field-error" id={id}>
      {message}
    </p>
  );
}

function getLeadFieldErrors(lead: LeadFields): LeadFieldErrors {
  const errors: LeadFieldErrors = {};

  if (lead.companyName.trim().length > 0 && lead.companyName.trim().length < 2) {
    errors.companyName = "Ha megadod a cégnevet, legalább 2 karakter legyen.";
  }

  if (lead.companyActivity.trim().length < 2) {
    errors.companyActivity = "Válaszd ki vagy add meg a cég tevékenységét.";
  }

  if (lead.email.trim().length === 0) {
    errors.email = "Add meg az email címet.";
  } else if (!isValidEmail(lead.email)) {
    errors.email = "Az email formátuma nem jó. Példa: nev@ceg.hu";
  }

  if (lead.name.trim().length < 2) {
    errors.name = "Add meg a kapcsolattartó nevét, legalább 2 karakterrel.";
  }

  if (lead.phone.trim().length === 0) {
    errors.phone = "Add meg a telefonszámot.";
  } else if (!isValidHungarianPhone(lead.phone)) {
    errors.phone = "A telefonszám formátuma nem jó. Példa: +36701234567";
  }

  if (!lead.consentPrivacy) {
    errors.consentPrivacy = "A riport elkészítéséhez ezt az elfogadást be kell jelölni.";
  }

  return errors;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function isBusinessEmail(email: string) {
  const freeDomains = new Set([
    "gmail.com",
    "googlemail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "live.com",
    "icloud.com",
    "freemail.hu",
    "citromail.hu",
    "indamail.hu"
  ]);
  const domain = email.trim().toLowerCase().split("@")[1];
  return Boolean(domain && !freeDomains.has(domain));
}

function isValidHungarianPhone(phone: string) {
  return /^\+36\d{9}$/.test(phone.trim());
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="mini-metric">
      <span className="metric-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function HeatRecoveryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="heat-recovery-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function syncPrimaryUnit(input: CalculatorInput): CalculatorInput {
  if (!input.units?.length) return input;
  return {
    ...input,
    units: [
      {
        ...input.units[0],
        id: "unit-1",
        label: "1. gép",
        brand: input.brand,
        category: getBrandCategory(input.brand),
        ageBand: input.ageBand,
        nominalKw: input.nominalKw,
        annualHours: input.annualHours,
        energyPriceHufKwh: input.energyPriceHufKwh,
        preferVariableSpeed: input.preferVariableSpeed,
        loadProfile: input.loadProfile
      },
      ...input.units.slice(1)
    ]
  };
}

function getCampaignTracking(): CampaignTracking {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    utmContent: params.get("utm_content") ?? undefined,
    utmTerm: params.get("utm_term") ?? undefined,
    gclid: params.get("gclid") ?? undefined,
    gbraid: params.get("gbraid") ?? undefined,
    wbraid: params.get("wbraid") ?? undefined,
    liFatId: params.get("li_fat_id") ?? params.get("liFatId") ?? undefined,
    referrer: document.referrer || undefined
  };
}

function getHeatRecoverySeasonLabel(heatRecovery: HeatRecoveryResult) {
  if (heatRecovery.canUseRecoveredHeatOutsideHeatingSeason) {
    return `${heatRecovery.heatingMonths} hónap fűtés + ${heatRecovery.hotWaterMonths} hónap csak HMV`;
  }

  return `${heatRecovery.heatingMonths} hónap fűtési célú hőhasznosítás`;
}

function LegalFooterClean() {
  return (
    <footer className="legal-footer">
      <div className="container legal-footer-inner">
        <div>
          <strong>iparikalkulator.hu</strong>
          <p>
            Független ipari energiahatékonysági előkalkuláció. Az eredmény
            tájékoztató jellegű.
          </p>
        </div>
        <nav aria-label="Jogi információk">
          <a href="/adatkezeles">Adatkezelés</a>
          <a href="/aszf">ÁSZF</a>
          <a href="/impresszum">Impresszum</a>
          <a href="/sutik">Süti tájékoztató</a>
        </nav>
      </div>
    </footer>
  );
}

function getPublicAssumptions(assumptions: string[]) {
  return assumptions.filter((assumption) => {
    const normalized = assumption.toLowerCase();
    return (
      !normalized.includes("ajánlott") &&
      !normalized.includes("excel") &&
      !normalized.includes("számítás forrása")
    );
  });
}


