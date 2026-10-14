import type { CampaignTracking } from "@/lib/calculator/types";

export type CampaignInquiryKind =
  | "service"
  | "compressor-replacement"
  | "nitrogen"
  | "general";

export type CampaignInquiryStatus = "new" | "contacted" | "quoted" | "closed" | "lost";

export type CampaignInquiryInput = {
  kind: CampaignInquiryKind;
  pageSource: string;
  companyName: string;
  name: string;
  email?: string;
  phone?: string;
  equipmentBrand?: string;
  equipmentModel?: string;
  primaryDetail?: string;
  secondaryDetail?: string;
  message?: string;
  consentPrivacy: true;
  consentMarketing: boolean;
  consentAdsPersonalization: boolean;
  tracking?: CampaignTracking;
};

export type CampaignInquiryRecord = {
  id: string;
  createdAt: string;
  status: CampaignInquiryStatus;
  input: CampaignInquiryInput;
  emailDelivery?: import("@/lib/email-delivery").EmailDeliveryReport | null;
};
