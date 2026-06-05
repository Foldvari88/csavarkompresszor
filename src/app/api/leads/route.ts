import { NextResponse } from "next/server";
import { calculateSavings } from "@/lib/calculator/calculate";
import { leadInputSchema } from "@/lib/calculator/schema";
import { sendLeadEmails } from "@/lib/leads/email";
import { createLead, LeadStorageNotConfiguredError } from "@/lib/leads/store";

export const runtime = "nodejs";

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

  const email = await sendLeadEmails(lead);

  return NextResponse.json({
    leadId: lead.id,
    result,
    email
  });
}
