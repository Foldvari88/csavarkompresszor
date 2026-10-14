export type EmailOutcome = {
  status: "accepted" | "failed" | "skipped";
  id?: string;
  errorCode?: string;
};

export type EmailDeliveryReport = {
  mode: "accepted" | "partial" | "failed" | "skipped";
  customer?: EmailOutcome;
  notification?: EmailOutcome;
};

/** Provider acceptance is not proof of delivery to a mailbox. */
export async function attemptEmailSend(send: () => Promise<{
  data?: { id: string } | null;
  error?: { name?: string } | null;
}>): Promise<EmailOutcome> {
  try {
    const response = await send();
    if (response.error || !response.data?.id) {
      return { status: "failed", errorCode: response.error?.name ?? "missing_provider_id" };
    }
    return { status: "accepted", id: response.data.id };
  } catch {
    return { status: "failed", errorCode: "send_exception" };
  }
}

export function getDeliveryMode(outcomes: EmailOutcome[]): EmailDeliveryReport["mode"] {
  const required = outcomes.filter(item => item.status !== "skipped");
  if (!required.length) return "skipped";
  if (required.every(item => item.status === "accepted")) return "accepted";
  return required.some(item => item.status === "accepted") ? "partial" : "failed";
}
