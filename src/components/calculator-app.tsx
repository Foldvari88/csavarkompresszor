"use client";

import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Factory,
  FileText,
  Gauge,
  Mail,
  MessageCircle,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  Trash2,
  X,
  Zap
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { calculateSavings } from "@/lib/calculator/calculate";
import {
  ASSUMPTION_VERSION,
  LEGACY_BRANDS,
  LEGACY_CATEGORIES,
  NOMINAL_KW_VALUES
} from "@/lib/calculator/generated-data";
import type {
  AgeBand,
  CalculationResult,
  CalculatorInput,
  CampaignTracking,
  CompressorUnitInput,
  LeadFormInput
} from "@/lib/calculator/types";
import { formatHuf, formatKw, formatNumber } from "@/lib/format";

type LeadFields = Pick<
  LeadFormInput,
  "companyName" | "name" | "email" | "phone" | "consentMarketing" | "consentPrivacy"
>;

const initialCalculator: CalculatorInput = {
  brand: "Atlas Copco",
  category: "Prémium",
  ageBand: "10-15",
  nominalKw: 37,
  annualHours: ASSUMPTION_VERSION.defaultAnnualHours,
  energyPriceHufKwh: ASSUMPTION_VERSION.defaultEnergyPriceHufKwh,
  preferVariableSpeed: true,
  loadProfile: "fluctuating",
  estimatedMachinePriceHuf: null
};

const appointmentUrl =
  "https://calendly.com/csavarkompresszor-kalkulator/15-perces-muszakiegyeztetes";

const loadProfileOptions = [
  { value: "continuous", label: "Folyamatos", helper: "stabil levegőigény" },
  { value: "shift", label: "Műszakos", helper: "napi termelési ciklus" },
  { value: "fluctuating", label: "Ingadozó", helper: "változó fogyasztás" },
  { value: "peak", label: "Csúcsterheléses", helper: "időszakos kiugrások" }
] satisfies Array<{ value: NonNullable<CalculatorInput["loadProfile"]>; label: string; helper: string }>;

const initialLead: LeadFields = {
  companyName: "",
  name: "",
  email: "",
  phone: "",
  consentMarketing: false,
  consentPrivacy: false
};

export function CalculatorApp() {
  const [calculator, setCalculator] = useState<CalculatorInput>(initialCalculator);
  const [lead, setLead] = useState<LeadFields>(initialLead);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recalculationTimeout = useRef<number | null>(null);

  const result = useMemo(() => calculateSavings(calculator), [calculator]);
  const oldInputKw = result.selectedLegacy.degradedInputKw;
  const recommendedInputKw = result.recommendedModel.inputKw;
  const recommendedBarWidth = Math.max(8, Math.min(100, (recommendedInputKw / oldInputKw) * 100));
  const calculatorUnits = getCalculatorUnits(calculator);
  const extraUnits = calculatorUnits.slice(1);
  const paybackLabel =
    result.estimatedPaybackYears === null
      ? "Adjon meg becsült gépárat"
      : `${formatNumber(result.estimatedPaybackYears, 1)} év`;
  const canSubmit =
    lead.companyName.trim().length > 1 &&
    lead.email.includes("@") &&
    lead.consentPrivacy &&
    !isSubmitting;
  const completionItems = [
    Boolean(calculator.brand),
    Boolean(calculator.category),
    Boolean(calculator.ageBand),
    calculator.nominalKw > 0,
    calculator.annualHours > 0,
    calculator.energyPriceHufKwh > 0,
    Boolean(calculator.loadProfile),
    lead.companyName.trim().length > 1,
    lead.email.includes("@"),
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

  function updateUnit(index: number, patch: Partial<CompressorUnitInput>) {
    triggerRecalculation();
    setCalculator((current) => {
      const units = getCalculatorUnits(current);
      const nextUnits = units.map((unit, unitIndex) =>
        unitIndex === index ? { ...unit, ...patch } : unit
      );
      return syncCalculatorFromUnits({ ...current, units: nextUnits });
    });
  }

  function addUnit() {
    triggerRecalculation();
    setCalculator((current) => {
      const units = getCalculatorUnits(current);
      const nextIndex = units.length + 1;
      return {
        ...current,
        units: [
          ...units,
          {
            ...units[0],
            id: `unit-${Date.now()}`,
            label: `${nextIndex}. gép`
          }
        ]
      };
    });
  }

  function removeUnit(index: number) {
    triggerRecalculation();
    setCalculator((current) => {
      const units = getCalculatorUnits(current).filter((_, unitIndex) => unitIndex !== index);
      return syncCalculatorFromUnits({ ...current, units });
    });
  }

  async function submitLead() {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...calculator, tracking: getCampaignTracking(), ...lead })
      });

      if (!response.ok) {
        throw new Error("A beküldés nem sikerült. Ellenőrizze az adatokat.");
      }

      const payload = (await response.json()) as { leadId: string };
      setSuccess(`A részletes riport elkészült. Azonosító: ${payload.leadId.slice(0, 8)}.`);
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
              <Factory size={20} />
            </span>
            <span>Ipari csavarkompresszor kalkulátor</span>
          </div>
          <a className="nav-pill" href="/admin">
            <ShieldCheck size={16} />
            Admin
          </a>
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
          <h1>Csavarkompresszor megtakarítás ipari levegőrendszerekhez</h1>
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
          <div className="trust-row">
            <div className="trust-item">
              <BadgeCheck size={17} /> Excel metodika alapján
            </div>
            <div className="trust-item">
              <CheckCircle2 size={17} /> RS/VSD modellajánló
            </div>
            <div className="trust-item">
              <TrendingDown size={17} /> Energiafogyasztási összevetés
            </div>
          </div>
        </div>

        <div className="hero-roi-card" aria-label="Megtakarítási példa">
          <div className="roi-card-top">
            <span>Élő példa</span>
            <BarChart3 size={18} />
          </div>
          <strong>{formatHuf(result.annualHufSaved)}</strong>
          <p>becsült éves megtakarítás a jelenlegi alapbeállításokkal</p>
          <div className="roi-card-grid">
            <span>
              Régi
              <b>{formatNumber(oldInputKw, 1)} kW</b>
            </span>
            <span>
              Ajánlott
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
                value={calculator.brand}
                onChange={(event) =>
                  updateCalculator((current) => ({ ...current, brand: event.target.value }))
                }
              >
                {LEGACY_BRANDS.map((brand) => (
                  <option key={brand} value={brand}>
                    {displayBrandName(brand)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Kategória">
              <select
                value={calculator.category}
                onChange={(event) =>
                  updateCalculator((current) => ({ ...current, category: event.target.value }))
                }
              >
                {LEGACY_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Névleges teljesítmény">
              <select
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

            <Field label="Villamos energia díja">
              <input
                inputMode="decimal"
                min={1}
                max={500}
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
                value={calculator.loadProfile ?? "fluctuating"}
                onChange={(event) =>
                  updateCalculator((current) => ({
                    ...current,
                    loadProfile: event.target.value as NonNullable<CalculatorInput["loadProfile"]>
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

            <Field label="Becsült gépár / keret">
              <input
                inputMode="numeric"
                min={0}
                type="number"
                value={calculator.estimatedMachinePriceHuf ?? ""}
                onChange={(event) =>
                  updateCalculator((current) => ({
                    ...current,
                    estimatedMachinePriceHuf: event.target.value
                      ? Number(event.target.value)
                      : null
                  }))
                }
                placeholder="pl. 14500000"
              />
            </Field>

            <Field label="Ajánlott géptípus">
              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={calculator.preferVariableSpeed}
                  onChange={(event) =>
                    updateCalculator((current) => ({
                      ...current,
                      preferVariableSpeed: event.target.checked
                    }))
                  }
                />
                <span>Fordulatszám szabályzós RS modell előnyben</span>
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

          <div className="fleet-panel">
            <div className="fleet-head">
              <div>
                <span className="metric-label">Több gépes üzem</span>
                <h3>{calculatorUnits.length} gép az összesítésben</h3>
              </div>
              <button className="secondary-button" type="button" onClick={addUnit}>
                <Plus size={16} />
                Új gép
              </button>
            </div>

            {extraUnits.length ? (
              <div className="fleet-list">
                {extraUnits.map((unit, index) => {
                  const unitIndex = index + 1;
                  return (
                    <div className="fleet-card" key={unit.id ?? unitIndex}>
                      <div className="fleet-card-head">
                        <strong>{unit.label ?? `${unitIndex + 1}. gép`}</strong>
                        <button
                          aria-label="Gép törlése"
                          className="ai-icon-button"
                          type="button"
                          onClick={() => removeUnit(unitIndex)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="form-grid two">
                        <Field label="Névleges kW">
                          <select
                            value={unit.nominalKw}
                            onChange={(event) =>
                              updateUnit(unitIndex, { nominalKw: Number(event.target.value) })
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
                            max={8760}
                            min={100}
                            type="number"
                            value={unit.annualHours}
                            onChange={(event) =>
                              updateUnit(unitIndex, { annualHours: Number(event.target.value) })
                            }
                          />
                        </Field>
                        <Field label="Gép kora">
                          <select
                            value={unit.ageBand}
                            onChange={(event) =>
                              updateUnit(unitIndex, { ageBand: event.target.value as AgeBand })
                            }
                          >
                            {(["5-10", "10-15", "15+"] satisfies AgeBand[]).map((ageBand) => (
                              <option key={ageBand} value={ageBand}>
                                {ageBand} év
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Profil">
                          <select
                            value={unit.loadProfile ?? calculator.loadProfile ?? "fluctuating"}
                            onChange={(event) =>
                              updateUnit(unitIndex, {
                                loadProfile: event.target
                                  .value as NonNullable<CalculatorInput["loadProfile"]>
                              })
                            }
                          >
                            {loadProfileOptions.map((profile) => (
                              <option key={profile.value} value={profile.value}>
                                {profile.label}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="fleet-empty">
                Ha több kompresszor dolgozik az üzemben, adja hozzá őket az összesített
                megtakarításhoz.
              </p>
            )}
          </div>

          <div className="section-title" style={{ marginTop: 28 }}>
            <div>
              <div className="panel-kicker">
                <span>02</span>
                Riport küldése
              </div>
            <h3>Részletes riport emailben</h3>
            </div>
            <span className="step-badge">
              <Mail size={15} />
              Email riport
            </span>
          </div>

          <div className="form-grid two">
            <Field label="Cégnév">
              <input
                value={lead.companyName}
                onChange={(event) =>
                  setLead((current) => ({ ...current, companyName: event.target.value }))
                }
                placeholder="Példa Kft."
              />
            </Field>

            <Field label="Email cím">
              <input
                value={lead.email}
                onChange={(event) =>
                  setLead((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="email@ceg.hu"
                type="email"
              />
            </Field>

            <Field label="Kapcsolattartó">
              <input
                value={lead.name}
                onChange={(event) =>
                  setLead((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Név"
              />
            </Field>

            <Field label="Telefon">
              <input
                value={lead.phone}
                onChange={(event) =>
                  setLead((current) => ({ ...current, phone: event.target.value }))
                }
                placeholder="+36..."
              />
            </Field>
          </div>

          <div className="form-grid" style={{ marginTop: 16 }}>
            <label className="checkbox-line">
              <input
                type="checkbox"
                checked={lead.consentPrivacy}
                onChange={(event) =>
                  setLead((current) => ({ ...current, consentPrivacy: event.target.checked }))
                }
              />
              <span>Elfogadom, hogy a megadott adatok alapján elkészüljön és emailben megérkezzen a kalkuláció.</span>
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
            {success ? <div className="status-note">{success}</div> : null}
            {success ? (
              <a className="schedule-cta" href={appointmentUrl} rel="noreferrer" target="_blank">
                Kérek 15 perces műszaki egyeztetést
                <ArrowRight size={17} />
              </a>
            ) : null}
            {error ? <div className="error-note">{error}</div> : null}
          </div>
        </div>

        <aside className={`result-panel ${isRecalculating ? "is-updating" : ""}`}>
          <div className="result-rail">
            <span>
              <Gauge size={18} />
              ROI cockpit
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
                <span>Ajánlott</span>
                <div className="bar-track recommended">
                  <span style={{ width: `${recommendedBarWidth}%` }} />
                </div>
                <strong>{formatNumber(recommendedInputKw, 2)} kW</strong>
              </div>
            </div>

            <div className="mini-metrics">
              <MetricTile label="Havi hatás" value={formatHuf(result.monthlyHufSaved)} />
              <MetricTile label="5 éves potenciál" value={formatHuf(result.fiveYearHufSaved)} />
              <MetricTile label="Megtérülési idő" value={paybackLabel} />
              <MetricTile label="Gépek száma" value={`${result.totalMachineCount} db`} />
              <MetricTile
                label="Régi gép"
                value={`${formatNumber(result.selectedLegacy.degradedInputKw, 2)} kW`}
              />
              <MetricTile
                label="Ajánlott gép"
                value={`${formatNumber(result.recommendedModel.inputKw, 2)} kW`}
              />
            </div>

            <div className="model-strip">
              <div className="model-heading">
                <div>
                  <div className="metric-label">Ajánlott modell</div>
                  <div className="model-name">{result.recommendedModel.model}</div>
                </div>
                <span className="red-chip">{result.recommendedModel.kind === "rs" ? "RS" : "Fix"}</span>
              </div>
              <p className="metric-sub">
                {formatKw(result.recommendedModel.nominalKw)} névleges teljesítmény,
                azonos vagy következő nagyobb korszerű gép alapján.
              </p>
            </div>

            <details className="why-panel">
              <summary>
                <span>Miért ennyi?</span>
                <ChevronDown size={17} />
              </summary>
              <div className="why-grid">
                <MetricTile
                  label="Üzemóra"
                  value={`${formatNumber(result.whyBreakdown.annualHours)} óra/év`}
                />
                <MetricTile
                  label="Áramár"
                  value={`${formatHuf(result.whyBreakdown.energyPriceHufKwh)} / kWh`}
                />
                <MetricTile
                  label="Régi becsült kW"
                  value={`${formatNumber(result.whyBreakdown.oldInputKw, 2)} kW`}
                />
                <MetricTile
                  label="Ajánlott kW"
                  value={`${formatNumber(result.whyBreakdown.recommendedInputKw, 2)} kW`}
                />
              </div>
            </details>

            <a className="result-cta" href="#kalkulator">
              Kérem a részletes riportot
              <ArrowRight size={17} />
            </a>

            <ul className="assumption-list">
              {result.assumptions.map((assumption) => (
                <li key={assumption}>{assumption}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="content-band">
        <div className="container source-grid">
          <SourceCard
            title="Átlátható feltételek"
            text="A régi gép becsült energiaigényét korcsoport, kategória, névleges teljesítmény és éves üzemóra alapján vesszük figyelembe."
          />
          <SourceCard
            title="Emailes részletes riport"
            text="Az oldalon előnézet látható, emailben pedig részletes bemeneti adatokkal és feltételezésekkel érkezik az eredmény."
          />
          <SourceCard
            title="Visszakereshető beküldések"
            text="A beküldött kalkulációk admin felületen áttekinthetők, exportálhatók és státusz szerint rendezhetők."
          />
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="mini-metric">
      <span className="metric-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

function CompressorChat({
  calculator,
  completionPercent,
  result
}: {
  calculator: CalculatorInput;
  completionPercent: number;
  result: CalculationResult;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text:
        "Szia, én a kompresszoros AI asszisztens vagyok. Kérdezz a megtakarításról, RS/VSD gépekről, üzemóráról vagy arról, mit érdemes átállítani a kalkulátorban."
    }
  ]);

  const quickPrompts = [
    "Miért ennyi a megtakarítás?",
    "RS/VSD mikor jó?",
    "Mit állítsak át először?"
  ];

  function sendMessage(text: string) {
    const cleanText = text.trim();
    if (!cleanText) return;

    setMessages((current) => [
      ...current,
      { role: "user", text: cleanText },
      {
        role: "assistant",
        text: buildCompressorReply(cleanText, calculator, result, completionPercent)
      }
    ]);
    setDraft("");
  }

  return (
    <section className={`ai-chat ${isOpen ? "open" : ""}`} aria-label="Kompresszoros AI chat">
      {isOpen ? (
        <div className="ai-chat-panel">
          <div className="ai-chat-head">
            <span className="ai-avatar">
              <Bot size={19} />
            </span>
            <div>
              <strong>Kompresszor AI</strong>
              <p>Élő magyarázat a kalkulációhoz</p>
            </div>
            <button
              aria-label="Chat bezárása"
              className="ai-icon-button"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="ai-context-strip">
            <span>{formatKw(calculator.nominalKw)}</span>
            <span>{formatNumber(calculator.annualHours)} óra/év</span>
            <span>{formatHuf(result.annualHufSaved)} / év</span>
          </div>

          <div className="ai-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div className={`ai-message ${message.role}`} key={`${message.role}-${index}`}>
                {message.text}
              </div>
            ))}
          </div>

          <div className="ai-quick-prompts">
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => sendMessage(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="ai-chat-form"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(draft);
            }}
          >
            <input
              aria-label="Kérdés a kompresszoros AI asszisztensnek"
              placeholder="Kérdezz a kompresszor cseréről..."
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <button aria-label="Küldés" type="submit">
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : null}

      <button
        className="ai-chat-launcher"
        aria-label="Kompresszor AI megnyitása"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>
          <MessageCircle size={20} />
        </span>
      </button>
    </section>
  );
}

function buildCompressorReply(
  question: string,
  calculator: CalculatorInput,
  result: CalculationResult,
  completionPercent: number
) {
  const normalized = question.toLowerCase();
  const currentSummary = `${formatKw(calculator.nominalKw)} gépnél, ${formatNumber(
    calculator.annualHours
  )} óra/év üzemmel most kb. ${formatHuf(result.annualHufSaved)} éves megtakarítás látszik.`;

  if (normalized.includes("rs") || normalized.includes("vsd") || normalized.includes("fordulat")) {
    return `${currentSummary} Az RS/VSD akkor különösen erős, ha a levegőigény nem állandó: a gép nem teljes terhelésen fut végig, hanem követi a fogyasztást. Ha több műszak, változó termelés vagy gyakori részterhelés van, érdemes bekapcsolva hagyni az RS opciót.`;
  }

  if (
    normalized.includes("megtakar") ||
    normalized.includes("forint") ||
    normalized.includes("kwh") ||
    normalized.includes("energia")
  ) {
    return `${currentSummary} A számítás lényege a régi becsült felvett teljesítmény és az ajánlott korszerű gép felvett teljesítményének különbsége. Ennél a beállításnál ez ${formatNumber(
      result.annualKwhSaved
    )} kWh/év különbséget ad.`;
  }

  if (normalized.includes("üzem") || normalized.includes("óra") || normalized.includes("áram")) {
    return `${currentSummary} A két legerősebb mező általában az éves üzemóra és az áramár. Ha a kompresszor sokat fut, már kis kW különbség is nagy éves forintértéket ad. Próbáld ki a valós termelési órát és a legutóbbi villanyszámla szerinti Ft/kWh értéket.`;
  }

  if (normalized.includes("kor") || normalized.includes("régi") || normalized.includes("elhasznál")) {
    return `${currentSummary} Idősebb gépnél a kalkulátor nagyobb veszteségi kockázattal számol. A gyakorlatban ezt szivárgás, kopás, nem optimális szabályzás és rosszabb részterhelési viselkedés is erősítheti.`;
  }

  if (normalized.includes("modell") || normalized.includes("ajánlott") || normalized.includes("gép")) {
    return `${currentSummary} A jelenlegi ajánlott gép: ${result.recommendedModel.model}. A logika először az azonos névleges kW-t keresi, ha nincs pontos találat, akkor a következő nagyobb korszerű modellt veszi figyelembe.`;
  }

  if (normalized.includes("riport") || normalized.includes("email") || normalized.includes("küld")) {
    return `A képernyőn csak előnézetet látsz. A részletes email riportban benne lesznek a megadott adatok, a feltételezések, az éves kWh/Ft megtakarítás és az ajánlott gép. A kitöltési állapot most ${completionPercent}%.`;
  }

  return `${currentSummary} Jó következő lépés: ellenőrizd a névleges kW-t, az éves üzemórát és az áramárat. Ezek mozgatják legjobban a kalkulációt. Ha konkrét termelési profilt írsz, segítek értelmezni, melyik mezőn érdemes finomítani.`;
}

function getCalculatorUnits(input: CalculatorInput): CompressorUnitInput[] {
  if (input.units?.length) return input.units;
  return [primaryUnitFromCalculator(input)];
}

function primaryUnitFromCalculator(input: CalculatorInput): CompressorUnitInput {
  return {
    id: "unit-1",
    label: "1. gép",
    brand: input.brand,
    category: input.category,
    ageBand: input.ageBand,
    nominalKw: input.nominalKw,
    annualHours: input.annualHours,
    energyPriceHufKwh: input.energyPriceHufKwh,
    preferVariableSpeed: input.preferVariableSpeed,
    loadProfile: input.loadProfile,
    estimatedMachinePriceHuf: input.estimatedMachinePriceHuf ?? null
  };
}

function syncPrimaryUnit(input: CalculatorInput): CalculatorInput {
  if (!input.units?.length) return input;
  return {
    ...input,
    units: [
      {
        ...input.units[0],
        ...primaryUnitFromCalculator(input)
      },
      ...input.units.slice(1)
    ]
  };
}

function syncCalculatorFromUnits(input: CalculatorInput): CalculatorInput {
  const first = input.units?.[0];
  if (!first) return { ...input, units: undefined };
  return {
    ...input,
    brand: first.brand,
    category: first.category,
    ageBand: first.ageBand,
    nominalKw: first.nominalKw,
    annualHours: first.annualHours,
    energyPriceHufKwh: first.energyPriceHufKwh,
    preferVariableSpeed: first.preferVariableSpeed,
    loadProfile: first.loadProfile,
    estimatedMachinePriceHuf: first.estimatedMachinePriceHuf ?? input.estimatedMachinePriceHuf
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
    referrer: document.referrer || undefined
  };
}

function LegalFooterClean() {
  return (
    <footer className="legal-footer">
      <div className="container legal-footer-inner">
        <div>
          <strong>CsavarkompresszorKalkulator.hu</strong>
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

function SourceCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="source-card">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function displayBrandName(brand: string) {
  return brand === "CompAir" ? "Prémium gyártó" : brand;
}

