import {
  ASSUMPTION_VERSION,
  COMPAIR_MODELS,
  LEGACY_PERFORMANCE_ROWS
} from "./generated-data";
import { getBrandCategory } from "./brand-category";
import type {
  AgeBand,
  BenchmarkLevel,
  CalculationResult,
  CalculatorInput,
  CompressorModel,
  CompressorUnitInput,
  HeatRecoveryInput,
  LegacyPerformanceRow
} from "./types";

const ageMultipliers: Record<AgeBand, number> = {
  "5-10": 1,
  "10-15": 1 + ASSUMPTION_VERSION.ageDegradationStep,
  "15+": (1 + ASSUMPTION_VERSION.ageDegradationStep) ** 2
};

const categorySavingsVarianceMultipliers: Record<string, number> = {
  Prémium: 0.995,
  Közép: 1.005
};

const heatRecoveryDefaults = {
  sourceVersionId: "heat-recovery-excel-v1-2026-06-08",
  gasPriceHufPerM3: 304,
  heatingMonths: 7,
  hotWaterMonths: 5,
  hotWaterLoadFactor: 0.5,
  recoverablePowerRatio: 0.9,
  utilizationEfficiency: 0.9,
  gasKwhPerM3: 9.44,
  boilerEfficiency: 0.9
} as const;

export function calculateSavings(input: CalculatorInput): CalculationResult {
  const normalizedInput = applyExcelBrandCategories(input);
  const unitInputs = normalizeUnitInputs(normalizedInput);
  const units = unitInputs.map((unit) => calculateUnitSavings(unit));
  const primary = units[0];
  const oldAnnualKwh = round(sum(units.map((unit) => unit.oldAnnualKwh)), 2);
  const recommendedAnnualKwh = round(sum(units.map((unit) => unit.recommendedAnnualKwh)), 2);
  const excelAnnualKwhSaved = round(sum(units.map((unit) => unit.excelAnnualKwhSaved)), 2);
  const annualKwhSaved = round(sum(units.map((unit) => unit.annualKwhSaved)), 2);
  const annualHufSaved = sum(units.map((unit) => unit.annualHufSaved));
  const excelAnnualHufSaved = sum(
    units.map((unit) => Math.round(unit.excelAnnualKwhSaved * unit.input.energyPriceHufKwh))
  );
  const categorySavingsVarianceMultiplier =
    excelAnnualHufSaved > 0 ? round(annualHufSaved / excelAnnualHufSaved, 4) : 1;
  const monthlyHufSaved = Math.round(annualHufSaved / 12);
  const fiveYearHufSaved = annualHufSaved * 5;
  const heatRecovery = calculateHeatRecovery(normalizedInput, primary.recommendedModel);
  const priority = buildPriority(annualHufSaved, primary.benchmark.level);
  const leadScore = buildLeadScore(normalizedInput, annualHufSaved, units.length, primary.benchmark.level);

  return {
    assumptionVersionId: ASSUMPTION_VERSION.id,
    selectedLegacy: primary.selectedLegacy,
    recommendedModel: primary.recommendedModel,
    nearestNominalKw: primary.recommendedModel.nominalKw,
    oldAnnualKwh,
    recommendedAnnualKwh,
    excelAnnualKwhSaved,
    categorySavingsVarianceMultiplier,
    annualKwhSaved,
    annualHufSaved,
    monthlyHufSaved,
    fiveYearHufSaved,
    heatRecovery,
    loadProfile: normalizedInput.loadProfile ?? "continuous",
    totalMachineCount: units.length,
    units,
    benchmark: primary.benchmark,
    priority,
    leadScore,
    whyBreakdown: {
      annualHours: normalizedInput.annualHours,
      energyPriceHufKwh: normalizedInput.energyPriceHufKwh,
      oldInputKw: primary.selectedLegacy.degradedInputKw,
      recommendedInputKw: primary.recommendedModel.inputKw,
      annualKwhSaved
    },
    assumptions: buildAssumptions(normalizedInput, primary.recommendedModel, primary.selectedLegacy, units)
  };
}

function calculateUnitSavings(input: CompressorUnitInput) {
  const selectedLegacyRow = resolveLegacyRow(input);
  const recommendedModel = recommendEfficiencyModel(
    input.nominalKw,
    input.preferVariableSpeed ?? true
  );
  const degradationMultiplier = ageMultipliers[input.ageBand];
  const degradedInputKw = round(selectedLegacyRow.inputKwBase * degradationMultiplier, 4);
  const selectedLegacy = {
    brand: selectedLegacyRow.brand,
    category: selectedLegacyRow.category,
    nominalKw: selectedLegacyRow.nominalKw,
    inputKwBase: selectedLegacyRow.inputKwBase,
    degradationMultiplier,
    degradedInputKw
  };
  const profileMultiplier = getLoadProfileSavingsMultiplier(input, recommendedModel);
  const adjustedRecommendedInputKw = round(recommendedModel.inputKw * profileMultiplier, 4);
  const oldAnnualKwh = round(degradedInputKw * input.annualHours, 2);
  const excelRecommendedAnnualKwh = round(adjustedRecommendedInputKw * input.annualHours, 2);
  const excelAnnualKwhSaved = Math.max(0, round(oldAnnualKwh - excelRecommendedAnnualKwh, 2));
  const categorySavingsVarianceMultiplier = getCategorySavingsVarianceMultiplier(
    selectedLegacy.category
  );
  const annualKwhSaved = round(excelAnnualKwhSaved * categorySavingsVarianceMultiplier, 2);
  const recommendedAnnualKwh = Math.max(0, round(oldAnnualKwh - annualKwhSaved, 2));
  const annualHufSaved = Math.round(annualKwhSaved * input.energyPriceHufKwh);

  return {
    input,
    selectedLegacy,
    recommendedModel: {
      ...recommendedModel,
      inputKw: adjustedRecommendedInputKw
    },
    oldAnnualKwh,
    recommendedAnnualKwh,
    excelAnnualKwhSaved,
    categorySavingsVarianceMultiplier,
    annualKwhSaved,
    annualHufSaved,
    benchmark: buildBenchmark(degradedInputKw, input.nominalKw)
  };
}

export function recommendEfficiencyModel(
  nominalKw: number,
  preferVariableSpeed = true
): CompressorModel {
  const sorted = [...COMPAIR_MODELS].sort((a, b) => a.nominalKw - b.nominalKw);
  const exactKind = preferVariableSpeed ? "rs" : "fixed";
  const exactPreferred = sorted.find(
    (model) => model.kind === exactKind && sameKw(model.nominalKw, nominalKw)
  );

  if (exactPreferred) return exactPreferred;

  const exactFallback = sorted.find((model) => sameKw(model.nominalKw, nominalKw));
  if (exactFallback) return exactFallback;

  const nextPreferred = sorted.find(
    (model) => model.kind === exactKind && model.nominalKw >= nominalKw
  );
  if (nextPreferred) return nextPreferred;

  const nextAny = sorted.find((model) => model.nominalKw >= nominalKw);
  return nextAny ?? sorted[sorted.length - 1];
}

export function resolveLegacyRow(input: CalculatorInput): LegacyPerformanceRow {
  const category = getBrandCategory(input.brand);
  const exact = LEGACY_PERFORMANCE_ROWS.find(
    (row) =>
      row.brand === input.brand &&
      row.category === category &&
      sameKw(row.nominalKw, input.nominalKw)
  );
  if (exact) return exact;

  const categoryMatch = LEGACY_PERFORMANCE_ROWS.find(
    (row) => row.category === category && sameKw(row.nominalKw, input.nominalKw)
  );
  if (categoryMatch) return categoryMatch;

  const brandRows = LEGACY_PERFORMANCE_ROWS.filter((row) => row.brand === input.brand);
  const nearestBrandRow = nearestByKw(brandRows, input.nominalKw);
  if (nearestBrandRow) return nearestBrandRow;

  const anyNearest = nearestByKw(LEGACY_PERFORMANCE_ROWS, input.nominalKw);
  if (!anyNearest) {
    throw new Error("No legacy compressor performance data is available.");
  }
  return anyNearest;
}

function getCategorySavingsVarianceMultiplier(category: string) {
  return categorySavingsVarianceMultipliers[category] ?? 1;
}

function buildAssumptions(
  input: CalculatorInput,
  model: CompressorModel,
  row: CalculationResult["selectedLegacy"],
  units: CalculationResult["units"]
) {
  const excelAnnualKwhSaved = sum(units.map((unit) => unit.excelAnnualKwhSaved));
  const annualKwhSaved = sum(units.map((unit) => unit.annualKwhSaved));
  const effectiveVariance = excelAnnualKwhSaved > 0 ? round(annualKwhSaved / excelAnnualKwhSaved, 4) : 1;

  return [
    `A számítás forrása: ${ASSUMPTION_VERSION.source}, verzió: ${ASSUMPTION_VERSION.id}.`,
    `A régi gép alap felvett teljesítménye ${row.inputKwBase} kW, a kor szerinti szorzó ${ageMultipliers[input.ageBand].toFixed(4)}.`,
    `Az ajánlott korszerű modell: ${model.model}, felvett teljesítmény: ${model.inputKw} kW.`,
    `A változó fordulatszámú RS modelleknél a táblázat szerinti ${ASSUMPTION_VERSION.rsInputPowerFactor} teljesítményfaktort használjuk.`,
    `Az éves megtakarításnál az Excel kategória alapján legfeljebb 1% szélességű korrekciós sávot használunk; prémium gyártóknál kedvezőbb, középkategóriánál magasabb energiaoldali becsléssel. Alkalmazott szorzó: ${effectiveVariance.toFixed(4)}.`,
    `Terhelési profil: ${loadProfileLabels[input.loadProfile ?? "continuous"]}.`,
    input.heatRecovery?.enabled
      ? `A hővisszanyerési modul az ajánlott ${model.brand} ${model.model} modell névleges ${model.nominalKw} kW teljesítményével számol. Forrás: HSS 22kW kompresszor hővisszanyerési megtérülés nagyságrendi.xlsx.`
      : null,
    `Gépek száma az összesítésben: ${units.length}.`
  ].filter(Boolean) as string[];
}

const loadProfileLabels = {
  continuous: "folyamatos",
  shift: "műszakos",
  fluctuating: "ingadozó",
  peak: "csúcsterheléses"
} satisfies Record<NonNullable<CalculatorInput["loadProfile"]>, string>;

function normalizeUnitInputs(input: CalculatorInput): CompressorUnitInput[] {
  if (input.units?.length) {
    return input.units.map((unit, index) => ({
      ...unit,
      id: unit.id ?? `unit-${index + 1}`,
      label: unit.label ?? `${index + 1}. gép`,
      category: getBrandCategory(unit.brand),
      energyPriceHufKwh: unit.energyPriceHufKwh || input.energyPriceHufKwh,
      loadProfile: unit.loadProfile ?? input.loadProfile ?? "continuous",
      preferVariableSpeed: unit.preferVariableSpeed ?? input.preferVariableSpeed ?? true
    }));
  }

  return [
    {
      id: "unit-1",
      label: "1. gép",
      brand: input.brand,
      category: getBrandCategory(input.brand),
      ageBand: input.ageBand,
      nominalKw: input.nominalKw,
      annualHours: input.annualHours,
      energyPriceHufKwh: input.energyPriceHufKwh,
      preferVariableSpeed: input.preferVariableSpeed ?? true,
      loadProfile: input.loadProfile ?? "continuous"
    }
  ];
}

function applyExcelBrandCategories(input: CalculatorInput): CalculatorInput {
  return {
    ...input,
    category: getBrandCategory(input.brand),
    units: input.units?.map((unit) => ({
      ...unit,
      category: getBrandCategory(unit.brand)
    }))
  };
}

function calculateHeatRecovery(input: CalculatorInput, recommendedModel: CompressorModel) {
  if (!input.heatRecovery?.enabled) return null;

  const config = normalizeHeatRecoveryInput(input.heatRecovery);
  const compressorNominalKw = recommendedModel.nominalKw;
  const recoverableHeatKw = round(compressorNominalKw * config.recoverablePowerRatio, 3);
  const usefulHeatKw = round(recoverableHeatKw * config.utilizationEfficiency, 3);
  const annualUsefulHeatKwh = round(usefulHeatKw * input.annualHours, 2);
  const annualUsefulHeatMj = round(annualUsefulHeatKwh * 3.6, 2);
  const theoreticalGasSavedM3 = round(
    annualUsefulHeatKwh / config.gasKwhPerM3 / config.boilerEfficiency,
    2
  );
  const theoreticalSavingsHuf = Math.round(theoreticalGasSavedM3 * config.gasPriceHufPerM3);
  const seasonalFactor =
    (config.heatingMonths + config.hotWaterMonths * config.hotWaterLoadFactor) / 12;
  const seasonalGasSavedM3 = round(theoreticalGasSavedM3 * seasonalFactor, 2);
  const seasonalSavingsHuf = Math.round(seasonalGasSavedM3 * config.gasPriceHufPerM3);

  return {
    enabled: true as const,
    sourceVersionId: heatRecoveryDefaults.sourceVersionId,
    compressorModelName: `${recommendedModel.brand} ${recommendedModel.model}`,
    compressorNominalKw,
    annualHours: input.annualHours,
    recoverablePowerRatio: config.recoverablePowerRatio,
    utilizationEfficiency: config.utilizationEfficiency,
    effectiveRecoveryRatio: round(config.recoverablePowerRatio * config.utilizationEfficiency, 4),
    recoverableHeatKw,
    usefulHeatKw,
    annualUsefulHeatKwh,
    annualUsefulHeatMj,
    gasKwhPerM3: config.gasKwhPerM3,
    gasHeatingValueMjPerM3: round(config.gasKwhPerM3 * 3.6, 2),
    boilerEfficiency: config.boilerEfficiency,
    gasPriceHufPerM3: config.gasPriceHufPerM3,
    theoreticalGasSavedM3,
    theoreticalSavingsHuf,
    heatingMonths: config.heatingMonths,
    hotWaterMonths: config.hotWaterMonths,
    hotWaterLoadFactor: config.hotWaterLoadFactor,
    seasonalGasSavedM3,
    seasonalSavingsHuf
  };
}

function normalizeHeatRecoveryInput(input: HeatRecoveryInput) {
  return {
    gasPriceHufPerM3: input.gasPriceHufPerM3 ?? heatRecoveryDefaults.gasPriceHufPerM3,
    heatingMonths: input.heatingMonths ?? heatRecoveryDefaults.heatingMonths,
    hotWaterMonths: input.hotWaterMonths ?? heatRecoveryDefaults.hotWaterMonths,
    hotWaterLoadFactor: input.hotWaterLoadFactor ?? heatRecoveryDefaults.hotWaterLoadFactor,
    recoverablePowerRatio: input.recoverablePowerRatio ?? heatRecoveryDefaults.recoverablePowerRatio,
    utilizationEfficiency: input.utilizationEfficiency ?? heatRecoveryDefaults.utilizationEfficiency,
    gasKwhPerM3: input.gasKwhPerM3 ?? heatRecoveryDefaults.gasKwhPerM3,
    boilerEfficiency: input.boilerEfficiency ?? heatRecoveryDefaults.boilerEfficiency
  };
}

function getLoadProfileSavingsMultiplier(input: CompressorUnitInput, model: CompressorModel) {
  if (model.kind !== "rs") return 1;
  const profile = input.loadProfile ?? "continuous";
  const multipliers = {
    continuous: 1,
    shift: 0.96,
    fluctuating: 0.9,
    peak: 0.93
  } satisfies Record<NonNullable<CalculatorInput["loadProfile"]>, number>;
  return multipliers[profile];
}

function buildBenchmark(degradedInputKw: number, nominalKw: number) {
  const ratio = round(degradedInputKw / nominalKw, 2);
  let level: BenchmarkLevel = "average";
  if (ratio >= 1.55) level = "critical";
  else if (ratio >= 1.35) level = "high";

  const labels = {
    average: "Átlagos energiaigény",
    high: "Magas energiaigény",
    critical: "Kritikus energiaigény"
  } satisfies Record<BenchmarkLevel, string>;

  const descriptions = {
    average: "A jelenlegi gép fogyasztása nem kiugró, de a csere így is megtakarítást adhat.",
    high: "A felvett teljesítmény a névleges kW-hoz képest magas, érdemes részletesen ellenőrizni.",
    critical: "A becsült energiaigény kritikus sávban van, a műszaki felmérés erősen indokolt."
  } satisfies Record<BenchmarkLevel, string>;

  return {
    level,
    label: labels[level],
    description: descriptions[level],
    inputKwPerNominalKw: ratio
  };
}

function buildPriority(annualHufSaved: number, benchmarkLevel: BenchmarkLevel) {
  if (benchmarkLevel === "critical") {
    return {
      level: "survey_recommended" as const,
      label: "Érdemes műszaki felmérést kérni",
      description: "A jelenlegi energiaigény kritikus sávban van, a pontosító mérés sokat segíthet."
    };
  }

  if (annualHufSaved >= 1_500_000) {
    return {
      level: "high" as const,
      label: "Magas megtakarítási potenciál",
      description: "A becsült éves megtakarítás alapján a csere gazdaságilag is figyelemre méltó."
    };
  }

  return {
    level: "standard" as const,
    label: "Közepes megtakarítási potenciál",
    description: "A kalkuláció alapján van megtakarítás, de a pontosításhoz érdemes további adatokat megadni."
  };
}

function buildLeadScore(
  input: CalculatorInput,
  annualHufSaved: number,
  machineCount: number,
  benchmarkLevel: BenchmarkLevel
) {
  const reasons: string[] = [];
  let score = 0;

  if (annualHufSaved >= 3_000_000) {
    score += 35;
    reasons.push("3M Ft feletti éves megtakarítás");
  } else if (annualHufSaved >= 1_500_000) {
    score += 25;
    reasons.push("1.5M Ft feletti éves megtakarítás");
  } else if (annualHufSaved > 0) {
    score += 12;
    reasons.push("pozitív megtakarítási előnézet");
  }

  if (input.nominalKw >= 37) {
    score += 20;
    reasons.push("nagyobb, ipari teljesítmény");
  }

  if (input.annualHours >= 5500) {
    score += 18;
    reasons.push("magas éves üzemóra");
  }

  if (machineCount > 1) {
    score += 12;
    reasons.push("több gépes üzem");
  }

  if (benchmarkLevel === "critical") {
    score += 15;
    reasons.push("kritikus energiaigény benchmark");
  } else if (benchmarkLevel === "high") {
    score += 8;
    reasons.push("magas energiaigény benchmark");
  }

  const label = score >= 70 ? "Forró" : score >= 45 ? "Erős" : score >= 25 ? "Közepes" : "Alap";
  return { score: Math.min(100, score), label, reasons };
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}
function nearestByKw(rows: LegacyPerformanceRow[], nominalKw: number) {
  return rows
    .slice()
    .sort((a, b) => Math.abs(a.nominalKw - nominalKw) - Math.abs(b.nominalKw - nominalKw))[0];
}

function sameKw(a: number, b: number) {
  return Math.abs(a - b) < 0.001;
}

function round(value: number, digits: number) {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}

