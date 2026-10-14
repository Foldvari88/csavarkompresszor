import { campaignInquiryInputSchema } from "@/lib/campaign-inquiries/schema";
import { sendCampaignInquiryEmails } from "@/lib/campaign-inquiries/email";
import { createCampaignInquiry, recordCampaignEmailDelivery } from "@/lib/campaign-inquiries/store";
import type { EmailDeliveryReport } from "@/lib/email-delivery";
import { LeadStorageNotConfiguredError } from "@/lib/leads/store";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = campaignInquiryInputSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Kérjük, ellenőrizze a megadott adatokat.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Silent success for bots filling the honeypot; no data is stored or sent.
  if (parsed.data.website) {
    return Response.json({ inquiryId: "accepted", accepted: false }, { status: 201 });
  }

  const { website, ...input } = parsed.data;
  void website;

  try {
    const inquiry = await createCampaignInquiry(input);
    let email: EmailDeliveryReport;
    try {
      email = await sendCampaignInquiryEmails(inquiry);
    } catch {
      email = { mode: "failed", customer: { status: "failed", errorCode: "email_processing_failed" } };
      console.error("Campaign inquiry email processing failed", { inquiryId: inquiry.id });
    }
    try {
      await recordCampaignEmailDelivery(inquiry.id, email);
    } catch {
      console.error("Campaign email status persistence failed", { inquiryId: inquiry.id });
    }
    return Response.json({ inquiryId: inquiry.id, accepted: true, email }, { status: 201 });
  } catch (error) {
    if (error instanceof LeadStorageNotConfiguredError) {
      return Response.json({ error: error.message }, { status: 503 });
    }
    throw error;
  }
}
