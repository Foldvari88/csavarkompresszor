import type { EmailDeliveryReport, EmailOutcome } from "@/lib/email-delivery";

type ProviderEmail = { id: string; last_event: string };
type EmailRecord = { emailDelivery?: EmailDeliveryReport | null };

const deliveryStates: Record<string, NonNullable<EmailOutcome["delivery"]>["status"]> = {
  delivered: "delivered",
  opened: "delivered",
  clicked: "delivered",
  delivery_delayed: "delayed",
  bounced: "bounced",
  failed: "failed",
  suppressed: "suppressed",
  complained: "complained"
};

/** A single bounded read for an admin page. Unlisted emails remain unverified. */
export async function refreshEmailDeliveryReports<T extends EmailRecord>(
  records: T[],
  readRecentEmails: () => Promise<ProviderEmail[]> = loadRecentEmails
): Promise<T[]> {
  if (!records.some(record => record.emailDelivery?.customer?.id || record.emailDelivery?.notification?.id)) return records;
  try {
    const byId = new Map((await readRecentEmails()).map(email => [email.id, email.last_event]));
    const observedAt = new Date().toISOString();
    const update = (outcome: EmailOutcome | undefined): EmailOutcome | undefined => {
      if (!outcome?.id) return outcome;
      const event = byId.get(outcome.id);
      const status = event ? deliveryStates[event] : undefined;
      return status ? { ...outcome, delivery: { status, observedAt } } : outcome;
    };
    return records.map(record => record.emailDelivery ? {
      ...record,
      emailDelivery: {
        ...record.emailDelivery,
        customer: update(record.emailDelivery.customer),
        notification: update(record.emailDelivery.notification)
      }
    } : record);
  } catch {
    // Mail-provider availability must not hide a stored lead or invent delivery.
    return records;
  }
}

async function loadRecentEmails(): Promise<ProviderEmail[]> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return [];
  const response = await fetch("https://api.resend.com/emails?limit=100", {
    headers: { Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(2500),
    cache: "no-store"
  });
  if (!response.ok) throw new Error("Email delivery status unavailable");
  const payload = await response.json() as { data?: ProviderEmail[] };
  return payload.data ?? [];
}
