import { z } from "zod";
import { getBrandCategory } from "./brand-category";

export const ageBandSchema = z.enum(["5-10", "10-15", "15+"]);
export const loadProfileSchema = z.enum(["continuous", "shift", "fluctuating", "peak"]);

const campaignTrackingSchema = z.object({
  utmSource: z.string().max(160).optional(),
  utmMedium: z.string().max(160).optional(),
  utmCampaign: z.string().max(200).optional(),
  utmContent: z.string().max(200).optional(),
  utmTerm: z.string().max(200).optional(),
  gclid: z.string().max(300).optional(),
  gbraid: z.string().max(300).optional(),
  wbraid: z.string().max(300).optional(),
  referrer: z.string().max(500).optional()
});

const calculatorInputBaseSchema = z.object({
  brand: z.string().min(1),
  category: z.string().min(1).optional(),
  ageBand: ageBandSchema,
  nominalKw: z.coerce.number().positive(),
  annualHours: z.coerce.number().min(100).max(8760),
  energyPriceHufKwh: z.coerce.number().min(1).max(500),
  preferVariableSpeed: z.coerce.boolean().optional().default(true),
  loadProfile: loadProfileSchema.optional().default("continuous"),
  estimatedMachinePriceHuf: z.coerce.number().positive().optional().nullable(),
  tracking: campaignTrackingSchema.optional()
});

export const calculatorInputSchema = calculatorInputBaseSchema.transform(withExcelCategory);

const compressorUnitInputSchema = calculatorInputBaseSchema
  .omit({ tracking: true })
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
  companyName: z.string().min(2).max(120),
  name: z.string().min(2).max(120),
  phone: z.string().regex(/^\+36\d{9}$/),
  consentMarketing: z.coerce.boolean().default(false),
  consentPrivacy: z.literal(true)
}).transform(withExcelCategory);

function withExcelCategory<T extends { brand: string; category?: string }>(input: T) {
  return {
    ...input,
    category: getBrandCategory(input.brand)
  };
}
