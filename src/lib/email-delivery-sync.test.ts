import { describe, it, expect, vi } from "vitest";
import { refreshEmailDeliveryReports } from "./email-delivery-sync";
import type { EmailDeliveryReport } from "./email-delivery";

const record = () => ({ id: "lead-1", emailDelivery: {
  mode: "accepted", customer: { status: "accepted", id: "customer-1" },
  notification: { status: "accepted", id: "notification-1" }
} satisfies EmailDeliveryReport });

describe("provider delivery reconciliation", () => {
  it("distinguishes a delivered customer report from a bounced internal notification", async () => {
    const original = record();
    const read = vi.fn(async () => [
      { id: "customer-1", last_event: "delivered" },
      { id: "notification-1", last_event: "bounced" },
      { id: "unrelated", last_event: "failed" }
    ]);
    const [result] = await refreshEmailDeliveryReports([original], read);
    expect(result.emailDelivery.customer).toMatchObject({ status: "accepted", delivery: { status: "delivered" } });
    expect(result.emailDelivery.notification).toMatchObject({ status: "accepted", delivery: { status: "bounced" } });
    expect(original.emailDelivery.notification).not.toHaveProperty("delivery");
    expect(read).toHaveBeenCalledTimes(1);
  });
  it("leaves unknown, older and merely sent mail unverified", async () => {
    const [result] = await refreshEmailDeliveryReports([record()], async () => [{ id: "customer-1", last_event: "sent" }]);
    expect(result.emailDelivery.customer).not.toHaveProperty("delivery");
    expect(result.emailDelivery.notification).not.toHaveProperty("delivery");
  });
  it("keeps stored leads visible when the provider read fails", async () => {
    const records = [record()];
    expect(await refreshEmailDeliveryReports(records, async () => { throw new Error("timeout"); })).toBe(records);
  });
  it("does not call the provider for legacy records without email IDs", async () => {
    const read = vi.fn(async () => []);
    const records = [{ id: "old", emailDelivery: null }];
    expect(await refreshEmailDeliveryReports(records, read)).toBe(records);
    expect(read).not.toHaveBeenCalled();
  });
});
