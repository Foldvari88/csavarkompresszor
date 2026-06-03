import { NextResponse } from "next/server";
import { calculateSavings } from "@/lib/calculator/calculate";
import { extendedCalculatorInputSchema } from "@/lib/calculator/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = extendedCalculatorInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Érvénytelen kalkulációs adatok.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const result = calculateSavings(parsed.data);
  return NextResponse.json({ result });
}
