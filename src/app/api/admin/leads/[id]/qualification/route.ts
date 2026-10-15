import { getLead, updateLeadAdQualification } from "@/lib/leads/store";
import { qualificationInputSchema, validQualificationDate } from "@/lib/ads/google-offline-qualification";

export const runtime = "nodejs";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const parsed = qualificationInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Érvénytelen minősítési adatok." }, { status: 400 });
  const { id } = await context.params;
  const lead = await getLead(id);
  if (!lead) return Response.json({ error: "Az érdeklődés nem található." }, { status: 404 });
  const now = new Date();
  if (parsed.data.qualified && (!parsed.data.qualifiedAt || !validQualificationDate(parsed.data.qualifiedAt, lead.createdAt, now.getTime()))) {
    return Response.json({ error: "A minősítés időpontja a beküldés és a jelen idő közé essen." }, { status: 400 });
  }
  const saved = await updateLeadAdQualification(id, parsed.data.qualified ? {
    qualifiedAt: parsed.data.qualifiedAt!,
    recordedAt: now.toISOString(),
    ...(parsed.data.valueHuf !== undefined ? { valueHuf: parsed.data.valueHuf } : {})
  } : null);
  if (!saved) return Response.json({ error: "Az érdeklődés nem található." }, { status: 404 });
  return Response.json({ ok: true });
}
