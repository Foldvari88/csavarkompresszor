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
  referrer?: string;
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
  units?: CompressorUnitInput[];
  tracking?: CampaignTracking;
};

export type CompressorUnitInput = Omit<CalculatorInput, "units" | "tracking"> & {
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
  input: LeadFormInput;
  result: CalculationResult;
};
