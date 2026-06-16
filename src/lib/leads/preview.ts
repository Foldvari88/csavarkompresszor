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
    heatRecovery: {
      enabled: true,
      gasPriceHufPerM3: 304,
      heatingMonths: 7,
      canUseRecoveredHeatOutsideHeatingSeason: true,
      hotWaterMonths: 5
    },
    email: "minta@ceg.hu",
    companyName: "Minta Ipari Kft.",
    companyWebsite: "mintaipar.hu",
    companyActivity: "Fém és fém megmunkálás",
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
    customerRating: 4,
    engagement: {
      emailOpenedAt: new Date("2026-06-04T10:12:00+02:00").toISOString(),
      emailOpenCount: 2,
      emailClickedAt: new Date("2026-06-04T10:14:00+02:00").toISOString(),
      emailClickCount: 1,
      reportDownloadedAt: new Date("2026-06-04T10:15:00+02:00").toISOString(),
      reportDownloadCount: 1,
      consultationRequestedAt: new Date("2026-06-04T10:18:00+02:00").toISOString(),
      consultationRequestCount: 1,
      lastEmailEventAt: new Date("2026-06-04T10:15:00+02:00").toISOString(),
      lastEmailEventType: "report.downloaded"
    },
    input,
    result: calculateSavings(input)
  };
}
