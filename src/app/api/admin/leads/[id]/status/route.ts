import { NextResponse } from "next/server";
import { z } from "zod";
import { updateLeadStatus } from "@/lib/leads/store";
import { leadStatusOptions } from "@/lib/status-label";

export const runtime = "nodejs";

const statusSchema = z.object({
  status: z.enum(leadStatusOptions)
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = statusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Érvénytelen státusz." }, { status: 400 });
  }

  await updateLeadStatus(id, parsed.data.status);
  return NextResponse.json({ ok: true });
}
