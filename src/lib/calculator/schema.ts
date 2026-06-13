import { z } from "zod";
import { getBrandCategory } from "./brand-category";

export const ageBandSchema = z.enum(["5-10", "10-15", "15+"]);
export const loadProfileSchema = z.enum(["continuous", "fluctuating"]);

const campaignTrackingSchema = z.object({
  utmSource: z.string().max(160).optional(),
  utmMedium: z.string().max(160).optional(),
  utmCampaign: z.string().max(200).optional(),
  utmContent: z.string().max(200).optional(),
  utmTerm: z.string().max(200).optional(),
  gclid: z.string().max(300).optional(),
  gbraid: z.string().max(300).optional(),
  wbraid: z.string().max(300).optional(),
  liFatId: z.string().max(300).optional(),
  referrer: z.string().max(500).optional()
});

const heatRecoverySchema = z.object({
  enabled: z.coerce.boolean().default(false),
  gasPriceHufPerM3: z.coerce.number().min(1).max(5000).optional(),
  heatingMonths: z.coerce.number().min(1).max(12).optional(),
  canUseRecoveredHeatOutsideHeatingSeason: z.coerce.boolean().optional().default(false),
  hotWaterMonths: z.coerce.number().min(0).max(12).optional(),
  hotWaterLoadFactor: z.coerce.number().min(0).max(1).optional(),
  recoverablePowerRatio: z.coerce.number().min(0.1).max(1).optional(),
  utilizationEfficiency: z.coerce.number().min(0.1).max(1).optional(),
  gasKwhPerM3: z.coerce.number().min(1).max(20).optional(),
  boilerEfficiency: z.coerce.number().min(0.1).max(1).optional()
});

const calculatorInputBaseSchema = z.object({
  brand: z.string().min(1),
  category: z.string().min(1).optional(),
  ageBand: ageBandSchema,
  nominalKw: z.coerce.number().positive(),
  annualHours: z.coerce.number().min(100).max(8760),
  energyPriceHufKwh: z.coerce.number().min(1).max(500),
  companyWebsite: z.string().trim().max(220).optional(),
  companyActivity: z.string().trim().max(180).optional(),
  email: z.string().email().optional(),
  preferVariableSpeed: z.coerce.boolean().optional().default(true),
  loadProfile: loadProfileSchema.optional().default("continuous"),
  heatRecovery: heatRecoverySchema.optional(),
  tracking: campaignTrackingSchema.optional()
});

export const calculatorInputSchema = calculatorInputBaseSchema.transform(withExcelCategory);

const compressorUnitInputSchema = calculatorInputBaseSchema
  .omit({ tracking: true, heatRecovery: true })
  .extend({
    id: z.string().max(80).optional(),
    label: z.string().max(80).optional()
  })
  .transform(withExcelCategory);

const extendedCalculatorInputBaseSchema = calculatorInputBaseSchema.extend({
  units: z.array(compressorUnitInputSchema).min(1).max(8).optional()
});

export const extendedCalculatorInputSchema = extendedCalculatorInputBaseSchema.transform(withExcelCategory);

export const leadInputSchema = extendedCalculatorInputBaseSchema.extend({
  email: z.string().email(),
  companyName: z.string().trim().max(120).optional().default(""),
  companyWebsite: z.string().trim().max(220).optional().default("").refine((value) => !value || isLikelyWebsite(value), {
    message: "Adj meg valós céges weboldalt. Példa: ceg.hu"
  }),
  companyActivity: z.string().trim().min(2).max(180),
  name: z.string().min(2).max(120),
  phone: z.string().regex(/^\+36\d{9}$/),
  consentMarketing: z.coerce.boolean().default(false),
  consentPrivacy: z.literal(true)
}).transform(withExcelCategory);

function withExcelCategory<
  T extends {
    brand: string;
    category?: string;
    loadProfile?: string;
    preferVariableSpeed?: boolean;
    units?: Array<{ loadProfile?: string; preferVariableSpeed?: boolean }>;
  }
>(input: T) {
  return {
    ...input,
    category: getBrandCategory(input.brand),
    preferVariableSpeed: input.loadProfile === "fluctuating" ? true : input.preferVariableSpeed,
    units: input.units?.map((unit) => ({
      ...unit,
      preferVariableSpeed: unit.loadProfile === "fluctuating" ? true : unit.preferVariableSpeed
    }))
  };
}

function isLikelyWebsite(value: string) {
  const normalized = value.trim().replace(/^https?:\/\//, "").replace(/^www\./, "");
  return /^[a-z0-9][a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(normalized);
}
