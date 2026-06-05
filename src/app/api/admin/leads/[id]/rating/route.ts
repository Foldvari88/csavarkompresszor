import { NextResponse } from "next/server";
import { z } from "zod";
import { updateLeadRating } from "@/lib/leads/store";

export const runtime = "nodejs";

const ratingSchema = z.object({
  customerRating: z.number().int().min(1).max(5).nullable()
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = ratingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Érvénytelen ügyfélminősítés." }, { status: 400 });
  }

  await updateLeadRating(id, parsed.data.customerRating);
  return NextResponse.json({ ok: true });
}
