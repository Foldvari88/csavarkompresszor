import { describe, it, expect } from "vitest";
import { attemptEmailSend, getDeliveryMode } from "./email-delivery";

describe("email acceptance and error reporting", () => {
  it("does not mark a provider error as sent", async () => {
    expect(await attemptEmailSend(async () => ({ data: null, error: { name: "validation_error" } })))
      .toEqual({ status: "failed", errorCode: "validation_error" });
  });
  it("handles network exceptions without losing a stored lead", async () => {
    expect(await attemptEmailSend(async () => { throw new Error("network"); }))
      .toEqual({ status: "failed", errorCode: "send_exception" });
  });
  it("requires a provider ID and distinguishes partial success", async () => {
    expect(await attemptEmailSend(async () => ({ data: null }))).toMatchObject({ status: "failed" });
    expect(await attemptEmailSend(async () => ({ data: { id: "email-1" } }))).toEqual({ status: "accepted", id: "email-1" });
    expect(getDeliveryMode([{ status: "accepted" }, { status: "failed" }])).toBe("partial");
  });
});
