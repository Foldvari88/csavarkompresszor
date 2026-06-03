import { NextResponse } from "next/server";
import { calculateSavings } from "@/lib/calculator/calculate";
import { leadInputSchema } from "@/lib/calculator/schema";
import { sendLeadEmails } from "@/lib/leads/email";
import { createLead } from "@/lib/leads/store";

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
  const lead = await createLead(parsed.data, result);
  const email = await sendLeadEmails(lead);

  return NextResponse.json({
    leadId: lead.id,
    result,
    email
  });
}
