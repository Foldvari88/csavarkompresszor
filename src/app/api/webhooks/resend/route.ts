import { NextRequest, NextResponse } from "next/server";
import { Resend, type WebhookEventPayload } from "resend";
import { sendLeadEngagementNotification } from "@/lib/leads/email";
import { recordLeadEngagementEvent } from "@/lib/leads/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

  if (!resendApiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY is not configured." }, { status: 500 });
  }

  if (!webhookSecret) {
    return NextResponse.json({ error: "RESEND_WEBHOOK_SECRET is not configured." }, { status: 500 });
  }

  const payload = await request.text();
  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing Resend webhook signature headers." }, { status: 400 });
  }

  let event: WebhookEventPayload;

  try {
    const resend = new Resend(resendApiKey);
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: svixId,
        timestamp: svixTimestamp,
        signature: svixSignature
      },
      webhookSecret
    });
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  if (event.type !== "email.opened" && event.type !== "email.clicked") {
    return NextResponse.json({ received: true });
  }

  const leadId = event.data.tags?.leadId;
  if (!leadId) {
    return NextResponse.json({ received: true, skipped: "missing-lead-id" });
  }

  const occurredAt = getEventDate(event);
  const type = event.type;
  const clickLink = type === "email.clicked" ? event.data.click.link : undefined;
  const eventId = [
    "resend",
    type,
    event.data.email_id,
    event.created_at,
    type === "email.clicked" ? event.data.click.timestamp : ""
  ].join(":");

  const result = await recordLeadEngagementEvent({
    id: eventId,
    leadId,
    type,
    occurredAt,
    metadata: {
      emailId: event.data.email_id,
      subject: event.data.subject,
      link: clickLink,
      svixId
    }
  });

  if (result.recorded && result.lead && type === "email.opened") {
    try {
      await sendLeadEngagementNotification({
        lead: result.lead,
        type,
        occurredAt,
        detail: event.data.subject
      });
    } catch (error) {
      console.error("Lead engagement notification failed.", { leadId, type, error });
    }
  }

  return NextResponse.json({ received: true, recorded: result.recorded });
}

function getEventDate(event: WebhookEventPayload) {
  if (event.type === "email.clicked") {
    return new Date(event.data.click.timestamp);
  }

  return new Date(event.created_at);
}
