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

const premiumSavingsVarianceRange = {
  min: 0.99,
  max: 0.999
} as const;

const middleSavingsVarianceRange = {
  min: 1.001,
  max: 1.01
} as const;

const heatRecoveryDefaults = {
  sourceVersionId: "heat-recovery-excel-v1-2026-06-08",
  gasPriceHufPerM3: 304,
  heatingMonths: 7,
  canUseRecoveredHeatOutsideHeatingSeason: false,
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
  const leadScore = calculateLeadScore(normalizedInput, {
    annualHufSaved,
    benchmark: primary.benchmark,
    heatRecovery,
    totalMachineCount: units.length
  });

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
  const oldAnnualKwh = round(degradedInputKw * input.annualHours, 2);
  const modelOutcome = applyVariableSpeedSavingsCaps(
    input,
    selectedLegacy,
    oldAnnualKwh,
    recommendedModel,
    calculateModelOutcome(input, selectedLegacy, oldAnnualKwh, recommendedModel)
  );

  return {
    input,
    selectedLegacy,
    recommendedModel: {
      ...recommendedModel,
      inputKw: modelOutcome.adjustedRecommendedInputKw
    },
    oldAnnualKwh,
    recommendedAnnualKwh: modelOutcome.recommendedAnnualKwh,
    excelAnnualKwhSaved: modelOutcome.excelAnnualKwhSaved,
    categorySavingsVarianceMultiplier: modelOutcome.categorySavingsVarianceMultiplier,
    annualKwhSaved: modelOutcome.annualKwhSaved,
    annualHufSaved: modelOutcome.annualHufSaved,
    benchmark: buildBenchmark(degradedInputKw, input.nominalKw)
  };
}

function calculateModelOutcome(
  input: CompressorUnitInput,
  selectedLegacy: CalculationResult["selectedLegacy"],
  oldAnnualKwh: number,
  model: CompressorModel
) {
  const profileMultiplier = getLoadProfileSavingsMultiplier(input, model);
  const adjustedRecommendedInputKw = round(model.inputKw * profileMultiplier, 4);
  const excelRecommendedAnnualKwh = round(adjustedRecommendedInputKw * input.annualHours, 2);
  const excelAnnualKwhSaved = Math.max(0, round(oldAnnualKwh - excelRecommendedAnnualKwh, 2));
  const categorySavingsVarianceMultiplier = getCategorySavingsVarianceMultiplier(
    selectedLegacy.brand,
    selectedLegacy.category,
    selectedLegacy.nominalKw,
    model
  );
  const annualKwhSaved = round(excelAnnualKwhSaved * categorySavingsVarianceMultiplier, 2);
  const recommendedAnnualKwh = Math.max(0, round(oldAnnualKwh - annualKwhSaved, 2));
  const annualHufSaved = Math.round(annualKwhSaved * input.energyPriceHufKwh);

  return {
    adjustedRecommendedInputKw,
    recommendedAnnualKwh,
    excelAnnualKwhSaved,
    categorySavingsVarianceMultiplier,
    annualKwhSaved,
    annualHufSaved
  };
}

function applyVariableSpeedSavingsCaps(
  input: CompressorUnitInput,
  selectedLegacy: CalculationResult["selectedLegacy"],
  oldAnnualKwh: number,
  recommendedModel: CompressorModel,
  outcome: ReturnType<typeof calculateModelOutcome>
) {
  const profile = input.loadProfile ?? "continuous";
  const isVariableSpeed = input.preferVariableSpeed === true && recommendedModel.kind === "rs";
  if (!isVariableSpeed) return outcome;

  const continuousOutcome = applyContinuousVariableSpeedCap(
    { ...input, loadProfile: "continuous" },
    selectedLegacy,
    oldAnnualKwh,
    calculateModelOutcome({ ...input, loadProfile: "continuous" }, selectedLegacy, oldAnnualKwh, recommendedModel)
  );

  if (profile === "fluctuating") {
    return capModelOutcomeSavings({
      input,
      oldAnnualKwh,
      outcome,
      cappedAnnualKwhSaved: round(continuousOutcome.annualKwhSaved * 1.01, 2),
      cappedExcelAnnualKwhSaved: round(continuousOutcome.excelAnnualKwhSaved * 1.01, 2)
    });
  }

  return applyContinuousVariableSpeedCap(input, selectedLegacy, oldAnnualKwh, outcome);
}

function applyContinuousVariableSpeedCap(
  input: CompressorUnitInput,
  selectedLegacy: CalculationResult["selectedLegacy"],
  oldAnnualKwh: number,
  outcome: ReturnType<typeof calculateModelOutcome>
) {
  const profile = input.loadProfile ?? "continuous";
  const isContinuousVariableSpeed = profile === "continuous" && input.preferVariableSpeed === true;
  if (!isContinuousVariableSpeed) return outcome;

  const fixedAlternative = recommendEfficiencyModel(input.nominalKw, false);
  if (fixedAlternative.kind !== "fixed") return outcome;

  const fixedOutcome = calculateModelOutcome(input, selectedLegacy, oldAnnualKwh, fixedAlternative);
  const cappedAnnualKwhSaved = round(fixedOutcome.annualKwhSaved * 1.05, 2);
  if (outcome.annualKwhSaved <= cappedAnnualKwhSaved) return outcome;

  const cappedExcelAnnualKwhSaved = round(fixedOutcome.excelAnnualKwhSaved * 1.05, 2);
  return capModelOutcomeSavings({
    input,
    oldAnnualKwh,
    outcome,
    cappedAnnualKwhSaved,
    cappedExcelAnnualKwhSaved
  });
}

function capModelOutcomeSavings({
  input,
  oldAnnualKwh,
  outcome,
  cappedAnnualKwhSaved,
  cappedExcelAnnualKwhSaved
}: {
  input: CompressorUnitInput;
  oldAnnualKwh: number;
  outcome: ReturnType<typeof calculateModelOutcome>;
  cappedAnnualKwhSaved: number;
  cappedExcelAnnualKwhSaved: number;
}) {
  if (outcome.annualKwhSaved <= cappedAnnualKwhSaved) return outcome;

  const excelAnnualKwhSaved =
    cappedExcelAnnualKwhSaved > 0
      ? Math.min(outcome.excelAnnualKwhSaved, cappedExcelAnnualKwhSaved)
      : 0;
  const annualKwhSaved = cappedAnnualKwhSaved;
  const recommendedAnnualKwh = Math.max(0, round(oldAnnualKwh - annualKwhSaved, 2));
  const annualHufSaved = Math.round(annualKwhSaved * input.energyPriceHufKwh);
  const adjustedRecommendedInputKw =
    input.annualHours > 0
      ? round((oldAnnualKwh - excelAnnualKwhSaved) / input.annualHours, 4)
      : outcome.adjustedRecommendedInputKw;

  return {
    ...outcome,
    adjustedRecommendedInputKw,
    recommendedAnnualKwh,
    excelAnnualKwhSaved,
    categorySavingsVarianceMultiplier:
      excelAnnualKwhSaved > 0 ? round(annualKwhSaved / excelAnnualKwhSaved, 4) : 1,
    annualKwhSaved,
    annualHufSaved
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

function getCategorySavingsVarianceMultiplier(
  brand: string,
  category: string,
  nominalKw: number,
  recommendedModel: CompressorModel
) {
  const range =
    category === "Prémium"
      ? premiumSavingsVarianceRange
      : category === "Közép"
        ? middleSavingsVarianceRange
        : { min: 1, max: 1 };
  const normalizedBrandPosition = getStableBrandTypePosition(
    `${brand}|${category}|${nominalKw}|${recommendedModel.kind}|${recommendedModel.model}`
  );

  return round(range.min + (range.max - range.min) * normalizedBrandPosition, 4);
}

function getStableBrandTypePosition(key: string) {
  let hash = 0;
  for (const character of key.normalize("NFKD").toLowerCase()) {
    hash = (hash * 31 + character.charCodeAt(0)) % 1000;
  }
  return hash / 999;
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
  const hasContinuousVariableSpeedCap = units.some(
    (unit) =>
      unit.input.loadProfile === "continuous" &&
      unit.input.preferVariableSpeed === true &&
      unit.recommendedModel.kind === "rs"
  );
  const hasFluctuatingVariableSpeedCap = units.some(
    (unit) =>
      unit.input.loadProfile === "fluctuating" &&
      unit.input.preferVariableSpeed === true &&
      unit.recommendedModel.kind === "rs"
  );

  return [
    `A számítás forrása: ${ASSUMPTION_VERSION.source}, verzió: ${ASSUMPTION_VERSION.id}.`,
    `A régi gép alap felvett teljesítménye ${row.inputKwBase} kW, a kor szerinti szorzó ${ageMultipliers[input.ageBand].toFixed(4)}.`,
    `Az ajánlott korszerű modell: ${model.model}, felvett teljesítmény: ${model.inputKw} kW.`,
    `A változó fordulatszámú RS modelleknél a táblázat szerinti ${ASSUMPTION_VERSION.rsInputPowerFactor} teljesítményfaktort használjuk.`,
    hasContinuousVariableSpeedCap
      ? `Folyamatos felhasználásnál a fordulatszám-szabályzós technológia számított megtakarítási előnyét a fix fordulatszámú alternatívához képest legfeljebb 5%-ra korlátozzuk.`
      : null,
    hasFluctuatingVariableSpeedCap
      ? `Bekapcsolt fordulatszám-szabályzásnál az ingadozó és a folyamatos terhelési profil közötti megtakarítási különbség legfeljebb 1%, az ingadozó profil javára.`
      : null,
    `Az éves megtakarításnál az Excel márka- és kategóriaadatok alapján legfeljebb 1% szélességű korrekciós sávot használunk; prémium gyártóknál kedvezőbb, középkategóriánál magasabb energiaoldali becsléssel. Alkalmazott szorzó: ${effectiveVariance.toFixed(4)}.`,
    `Terhelési profil: ${loadProfileLabels[input.loadProfile ?? "continuous"]}.`,
    input.heatRecovery?.enabled
      ? `A hővisszanyerési modul az ajánlott ${model.brand} ${model.model} modell névleges ${model.nominalKw} kW teljesítményével számol. Forrás: HSS 22kW kompresszor hővisszanyerési megtérülés nagyságrendi.xlsx.`
      : null,
    `Gépek száma az összesítésben: ${units.length}.`
  ].filter(Boolean) as string[];
}

const loadProfileLabels = {
  continuous: "folyamatos",
  fluctuating: "ingadozó"
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
      preferVariableSpeed: resolveVariableSpeedPreference(
        unit.loadProfile ?? input.loadProfile ?? "continuous",
        unit.preferVariableSpeed ?? input.preferVariableSpeed ?? true
      )
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
      preferVariableSpeed: resolveVariableSpeedPreference(
        input.loadProfile ?? "continuous",
        input.preferVariableSpeed ?? true
      ),
      loadProfile: input.loadProfile ?? "continuous"
    }
  ];
}

function applyExcelBrandCategories(input: CalculatorInput): CalculatorInput {
  return {
    ...input,
    category: getBrandCategory(input.brand),
    preferVariableSpeed: resolveVariableSpeedPreference(
      input.loadProfile ?? "continuous",
      input.preferVariableSpeed ?? true
    ),
    units: input.units?.map((unit) => ({
      ...unit,
      category: getBrandCategory(unit.brand),
      preferVariableSpeed: resolveVariableSpeedPreference(
        unit.loadProfile ?? input.loadProfile ?? "continuous",
        unit.preferVariableSpeed ?? input.preferVariableSpeed ?? true
      )
    }))
  };
}

function resolveVariableSpeedPreference(loadProfile: CalculatorInput["loadProfile"], preferVariableSpeed: boolean) {
  return loadProfile === "fluctuating" ? true : preferVariableSpeed;
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
    canUseRecoveredHeatOutsideHeatingSeason: config.canUseRecoveredHeatOutsideHeatingSeason,
    hotWaterMonths: config.hotWaterMonths,
    hotWaterLoadFactor: config.hotWaterLoadFactor,
    seasonalGasSavedM3,
    seasonalSavingsHuf
  };
}

function normalizeHeatRecoveryInput(input: HeatRecoveryInput) {
  const heatingMonths = clampMonthCount(input.heatingMonths ?? heatRecoveryDefaults.heatingMonths);
  const canUseRecoveredHeatOutsideHeatingSeason =
    input.canUseRecoveredHeatOutsideHeatingSeason ??
    heatRecoveryDefaults.canUseRecoveredHeatOutsideHeatingSeason;

  return {
    gasPriceHufPerM3: input.gasPriceHufPerM3 ?? heatRecoveryDefaults.gasPriceHufPerM3,
    heatingMonths,
    canUseRecoveredHeatOutsideHeatingSeason,
    hotWaterMonths: canUseRecoveredHeatOutsideHeatingSeason ? 12 - heatingMonths : 0,
    hotWaterLoadFactor: input.hotWaterLoadFactor ?? heatRecoveryDefaults.hotWaterLoadFactor,
    recoverablePowerRatio: input.recoverablePowerRatio ?? heatRecoveryDefaults.recoverablePowerRatio,
    utilizationEfficiency: input.utilizationEfficiency ?? heatRecoveryDefaults.utilizationEfficiency,
    gasKwhPerM3: input.gasKwhPerM3 ?? heatRecoveryDefaults.gasKwhPerM3,
    boilerEfficiency: input.boilerEfficiency ?? heatRecoveryDefaults.boilerEfficiency
  };
}

function clampMonthCount(months: number) {
  return Math.min(12, Math.max(1, months));
}

function getLoadProfileSavingsMultiplier(input: CompressorUnitInput, model: CompressorModel) {
  if (model.kind !== "rs") return 1;
  const profile = input.loadProfile ?? "continuous";
  const multipliers = {
    continuous: 1,
    fluctuating: 0.9
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

export function calculateLeadScore(
  input: CalculatorInput,
  result: Pick<CalculationResult, "annualHufSaved" | "benchmark" | "heatRecovery" | "totalMachineCount">
) {
  const reasons: string[] = [];
  const totalNominalKw = input.units?.length ? sum(input.units.map((unit) => unit.nominalKw)) : input.nominalKw;
  const maxAnnualHours = input.units?.length
    ? Math.max(...input.units.map((unit) => unit.annualHours))
    : input.annualHours;
  const machineCount = result.totalMachineCount ?? input.units?.length ?? 1;

  const savingsScore = scaledScore(result.annualHufSaved, 5_000_000, 40);
  const sizeScore = scaledScore(totalNominalKw, 160, 20);
  const hoursScore = scaledScore(Math.max(0, maxAnnualHours - 1000), 7000, 20);
  const benchmarkScore =
    result.benchmark.level === "critical" ? 15 : result.benchmark.level === "high" ? 10 : 4;
  const fleetScore = clampScore(Math.max(0, (machineCount - 1) * 2), 3);
  const heatRecoveryScore = result.heatRecovery
    ? scaledScore(result.heatRecovery.seasonalSavingsHuf, 1_000_000, 2)
    : 0;

  reasons.push(
    `Éves megtakarítási potenciál: ${formatScoreHuf(result.annualHufSaved)} / év (${savingsScore}/40 pont)`,
    `Kompresszor méret: ${formatScoreNumber(totalNominalKw)} kW összesített névleges teljesítmény (${sizeScore}/20 pont)`,
    `Üzemóra intenzitás: ${formatScoreNumber(maxAnnualHours)} óra/év (${hoursScore}/20 pont)`,
    `Benchmark sáv: ${result.benchmark.label} (${benchmarkScore}/15 pont)`
  );

  if (fleetScore > 0) {
    reasons.push(`Több gépes üzem: ${machineCount} gép (${fleetScore}/3 pont)`);
  }

  if (heatRecoveryScore > 0 && result.heatRecovery) {
    reasons.push(
      `Hővisszanyerési potenciál: ${formatScoreHuf(result.heatRecovery.seasonalSavingsHuf)} / év (${heatRecoveryScore}/2 pont)`
    );
  }

  const score = Math.min(
    100,
    savingsScore + sizeScore + hoursScore + benchmarkScore + fleetScore + heatRecoveryScore
  );
  const label = score >= 75 ? "Forró" : score >= 55 ? "Erős" : score >= 35 ? "Közepes" : "Alap";
  return { score, label, reasons };
}

function scaledScore(value: number, cap: number, maxPoints: number) {
  return clampScore(Math.round((Math.max(0, value) / cap) * maxPoints), maxPoints);
}

function clampScore(value: number, maxPoints: number) {
  return Math.max(0, Math.min(maxPoints, value));
}

function formatScoreHuf(value: number) {
  return `${Math.round(value).toLocaleString("hu-HU")} Ft`;
}

function formatScoreNumber(value: number) {
  return value.toLocaleString("hu-HU", { maximumFractionDigits: 1 });
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

