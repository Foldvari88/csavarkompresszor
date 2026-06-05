import { calculateSavings } from "@/lib/calculator/calculate";
import type { LeadFormInput, LeadRecord } from "@/lib/calculator/types";

export function createPreviewLead(): LeadRecord {
  const input: LeadFormInput = {
    brand: "Atlas Copco",
    category: "Prémium",
    ageBand: "10-15",
    nominalKw: 37,
    annualHours: 5500,
    energyPriceHufKwh: 35,
    preferVariableSpeed: true,
    loadProfile: "fluctuating",
    estimatedMachinePriceHuf: null,
    email: "minta@ceg.hu",
    companyName: "Minta Ipari Kft.",
    name: "Teszt Kapcsolattartó",
    phone: "+36701234567",
    consentMarketing: false,
    consentPrivacy: true,
    tracking: {
      utmSource: "email-preview",
      utmMedium: "admin",
      utmCampaign: "minta-riport"
    }
  };

  return {
    id: "preview-lead-20260604",
    createdAt: new Date("2026-06-04T10:00:00+02:00").toISOString(),
    status: "new",
    input,
    result: calculateSavings(input)
  };
}
