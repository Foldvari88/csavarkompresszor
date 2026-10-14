import { NextResponse } from "next/server";
import { calculateSavings } from "@/lib/calculator/calculate";
import { leadInputSchema } from "@/lib/calculator/schema";
import { sendLeadEmails } from "@/lib/leads/email";
import { createLead, LeadStorageNotConfiguredError, recordLeadEmailDelivery } from "@/lib/leads/store";
import type { EmailDeliveryReport } from "@/lib/email-delivery";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = leadInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Érvénytelen beküldési adatok.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const result = calculateSavings(parsed.data);
  let lead: Awaited<ReturnType<typeof createLead>>;

  try {
    lead = await createLead(parsed.data, result);
  } catch (error) {
    if (error instanceof LeadStorageNotConfiguredError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    throw error;
  }

  let email: EmailDeliveryReport;
  try {
    email = await sendLeadEmails(lead);
  } catch {
    email = { mode: "failed", customer: { status: "failed", errorCode: "email_processing_failed" } };
    console.error("Lead email processing failed", { leadId: lead.id });
  }
  try {
    await recordLeadEmailDelivery(lead.id, email);
  } catch {
    console.error("Lead email status persistence failed", { leadId: lead.id });
  }

  return NextResponse.json({
    leadId: lead.id,
    result,
    email
  }, { status: 201 });
}
