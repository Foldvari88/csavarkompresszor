import { z } from "zod";

export const ageBandSchema = z.enum(["5-10", "10-15", "15+"]);
export const loadProfileSchema = z.enum(["continuous", "shift", "fluctuating", "peak"]);

const campaignTrackingSchema = z.object({
  utmSource: z.string().max(160).optional(),
  utmMedium: z.string().max(160).optional(),
  utmCampaign: z.string().max(200).optional(),
  utmContent: z.string().max(200).optional(),
  utmTerm: z.string().max(200).optional(),
  referrer: z.string().max(500).optional()
});

export const calculatorInputSchema = z.object({
  brand: z.string().min(1),
  category: z.string().min(1),
  ageBand: ageBandSchema,
  nominalKw: z.coerce.number().positive(),
  annualHours: z.coerce.number().min(100).max(8760),
  energyPriceHufKwh: z.coerce.number().min(1).max(500),
  preferVariableSpeed: z.coerce.boolean().optional().default(true),
  loadProfile: loadProfileSchema.optional().default("continuous"),
  estimatedMachinePriceHuf: z.coerce.number().positive().optional().nullable(),
  tracking: campaignTrackingSchema.optional()
});

const compressorUnitInputSchema = calculatorInputSchema
  .omit({ tracking: true })
  .extend({
    id: z.string().max(80).optional(),
    label: z.string().max(80).optional()
  });

export const extendedCalculatorInputSchema = calculatorInputSchema.extend({
  units: z.array(compressorUnitInputSchema).min(1).max(8).optional()
});

export const leadInputSchema = extendedCalculatorInputSchema.extend({
  email: z.string().email(),
  companyName: z.string().min(2).max(120),
  name: z.string().max(120).optional().or(z.literal("")),
  phone: z.string().max(60).optional().or(z.literal("")),
  consentMarketing: z.coerce.boolean().default(false),
  consentPrivacy: z.literal(true)
});
