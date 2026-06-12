import { NextResponse } from "next/server";
import { deleteLead } from "@/lib/leads/store";

export const runtime = "nodejs";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const deleted = await deleteLead(id);

  if (!deleted) {
    return NextResponse.json({ error: "Lead nem található." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
