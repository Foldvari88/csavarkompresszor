import { NextRequest, NextResponse } from "next/server";
import {
  getAppointmentUrl,
  sendConsultationRequestNotification
} from "@/lib/leads/email";
import { getLead } from "@/lib/leads/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLead(id);
  const appointmentUrl = getAppointmentUrl();

  if (lead) {
    const occurredAt = new Date();
    const source = request.nextUrl.searchParams.get("source") ?? "appointment-cta";

    try {
      await sendConsultationRequestNotification({
        lead,
        occurredAt,
        source
      });
    } catch (error) {
      console.error("Consultation request notification failed.", { leadId: lead.id, error });
    }
  }

  return NextResponse.redirect(appointmentUrl, { status: 302 });
}
