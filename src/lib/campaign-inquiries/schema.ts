import { z } from "zod";
import { isValidHungarianPhone, normalizeHungarianPhone } from "@/lib/phone";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || undefined);

const trackingSchema = z.object({
  utmSource: optionalText(160),
  utmMedium: optionalText(160),
  utmCampaign: optionalText(200),
  utmContent: optionalText(200),
  utmTerm: optionalText(200),
  gclid: optionalText(300),
  gbraid: optionalText(300),
  wbraid: optionalText(300),
  liFatId: optionalText(300),
  referrer: optionalText(500)
});

export const campaignInquiryInputSchema = z
  .object({
    kind: z.enum(["service", "compressor-replacement", "nitrogen", "general"]),
    pageSource: z.string().trim().min(2).max(120),
    companyName: z.string().trim().min(2).max(120),
    name: z.string().trim().min(2).max(120),
    email: z
      .string()
      .trim()
      .max(200)
      .optional()
      .transform((value) => value || undefined)
      .refine((value) => !value || z.email().safeParse(value).success, {
        message: "Érvényes e-mail-cím szükséges."
      }),
    phone: z
      .string()
      .trim()
      .max(30)
      .optional()
      .transform((value) => value ? normalizeHungarianPhone(value) : undefined)
      .refine((value) => !value || isValidHungarianPhone(value), {
        message: "A telefonszám +36 formátumban szükséges."
      }),
    equipmentBrand: optionalText(120),
    equipmentModel: optionalText(160),
    primaryDetail: optionalText(180),
    secondaryDetail: optionalText(180),
    message: optionalText(1200),
    consentPrivacy: z.literal(true),
    consentMarketing: z.coerce.boolean().default(false),
    consentAdsPersonalization: z.coerce.boolean().default(false),
    tracking: trackingSchema.optional(),
    website: optionalText(200)
  })
  .superRefine((value, context) => {
    if (!value.email && !value.phone) {
      context.addIssue({
        code: "custom",
        message: "Legalább e-mail-címet vagy telefonszámot adjon meg.",
        path: ["email"]
      });
      context.addIssue({
        code: "custom",
        message: "Legalább e-mail-címet vagy telefonszámot adjon meg.",
        path: ["phone"]
      });
    }
  });
