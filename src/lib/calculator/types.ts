export type CompressorKind = "fixed" | "rs";

export type AgeBand = "5-10" | "10-15" | "15+";

export type LeadStatus = "new" | "contacted" | "quoted" | "closed" | "lost";

export type LoadProfile = "continuous" | "shift" | "fluctuating" | "peak";

export type BenchmarkLevel = "average" | "high" | "critical";

export type PriorityLevel = "standard" | "high" | "fast_payback" | "survey_recommended";

export type CampaignTracking = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  referrer?: string;
};

export type HeatRecoveryInput = {
  enabled: boolean;
  gasPriceHufPerM3?: number;
  investmentCostHuf?: number | null;
  heatingMonths?: number;
  hotWaterMonths?: number;
  hotWaterLoadFactor?: number;
  recoverablePowerRatio?: number;
  utilizationEfficiency?: number;
  gasKwhPerM3?: number;
  boilerEfficiency?: number;
};

export type CompressorModel = {
  brand: "CompAir";
  kind: CompressorKind;
  series: string;
  model: string;
  nominalKw: number;
  inputKw: number;
  priceEur: number | null;
};

export type LegacyPerformanceRow = {
  category: string;
  brand: string;
  nominalKw: number;
  inputKwBase: number;
};

export type CalculatorInput = {
  brand: string;
  category: string;
  ageBand: AgeBand;
  nominalKw: number;
  annualHours: number;
  energyPriceHufKwh: number;
  preferVariableSpeed?: boolean;
  loadProfile?: LoadProfile;
  estimatedMachinePriceHuf?: number | null;
  heatRecovery?: HeatRecoveryInput;
  units?: CompressorUnitInput[];
  tracking?: CampaignTracking;
};

export type CompressorUnitInput = Omit<CalculatorInput, "units" | "tracking" | "heatRecovery"> & {
  id?: string;
  label?: string;
};

export type SelectedLegacyResult = {
  brand: string;
  category: string;
  nominalKw: number;
  inputKwBase: number;
  degradationMultiplier: number;
  degradedInputKw: number;
};

export type UnitCalculationResult = {
  input: CompressorUnitInput;
  selectedLegacy: SelectedLegacyResult;
  recommendedModel: CompressorModel;
  oldAnnualKwh: number;
  recommendedAnnualKwh: number;
  annualKwhSaved: number;
  annualHufSaved: number;
  benchmark: {
    level: BenchmarkLevel;
    label: string;
    description: string;
    inputKwPerNominalKw: number;
  };
};

export type CalculationResult = {
  assumptionVersionId: string;
  selectedLegacy: SelectedLegacyResult;
  recommendedModel: CompressorModel;
  nearestNominalKw: number;
  oldAnnualKwh: number;
  recommendedAnnualKwh: number;
  annualKwhSaved: number;
  annualHufSaved: number;
  monthlyHufSaved: number;
  fiveYearHufSaved: number;
  estimatedPaybackYears: number | null;
  heatRecovery: HeatRecoveryResult | null;
  loadProfile: LoadProfile;
  totalMachineCount: number;
  units: UnitCalculationResult[];
  benchmark: UnitCalculationResult["benchmark"];
  priority: {
    level: PriorityLevel;
    label: string;
    description: string;
  };
  leadScore: {
    score: number;
    label: string;
    reasons: string[];
  };
  whyBreakdown: {
    annualHours: number;
    energyPriceHufKwh: number;
    oldInputKw: number;
    recommendedInputKw: number;
    annualKwhSaved: number;
  };
  assumptions: string[];
};

export type HeatRecoveryResult = {
  enabled: true;
  sourceVersionId: string;
  compressorModelName: string;
  compressorNominalKw: number;
  annualHours: number;
  recoverablePowerRatio: number;
  utilizationEfficiency: number;
  effectiveRecoveryRatio: number;
  recoverableHeatKw: number;
  usefulHeatKw: number;
  annualUsefulHeatKwh: number;
  annualUsefulHeatMj: number;
  gasKwhPerM3: number;
  gasHeatingValueMjPerM3: number;
  boilerEfficiency: number;
  gasPriceHufPerM3: number;
  theoreticalGasSavedM3: number;
  theoreticalSavingsHuf: number;
  heatingMonths: number;
  hotWaterMonths: number;
  hotWaterLoadFactor: number;
  seasonalGasSavedM3: number;
  seasonalSavingsHuf: number;
  investmentCostHuf: number | null;
  theoreticalPaybackYears: number | null;
  seasonalPaybackYears: number | null;
};

export type LeadFormInput = CalculatorInput & {
  email: string;
  companyName: string;
  name: string;
  phone: string;
  consentMarketing: boolean;
  consentPrivacy: boolean;
};

export type LeadRecord = {
  id: string;
  createdAt: string;
  status: LeadStatus;
  customerRating: number | null;
  input: LeadFormInput;
  result: CalculationResult;
};
