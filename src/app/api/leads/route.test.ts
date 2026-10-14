import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({ create: vi.fn(), send: vi.fn(), record: vi.fn() }));
vi.mock("@/lib/leads/store", () => ({ createLead: mocks.create, recordLeadEmailDelivery: mocks.record, LeadStorageNotConfiguredError: class extends Error {} }));
vi.mock("@/lib/leads/email", () => ({ sendLeadEmails: mocks.send }));
import { POST } from "./route";

const body = { brand: "Atlas Copco", ageBand: "10-15", nominalKw: 75, annualHours: 5500,
  energyPriceHufKwh: 35, companyActivity: "Gépgyártás", name: "Teszt Elek", email: "test@example.com", consentPrivacy: true };

describe("lead receipt survives mail failure", () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.create.mockResolvedValue({ id: "lead-1" }); mocks.record.mockResolvedValue(undefined); });
  it("accepts an email-only report request and returns its saved ID even if mail processing throws", async () => {
    mocks.send.mockRejectedValue(new Error("provider unavailable"));
    const response = await POST(new Request("https://example.com/api/leads", { method: "POST", body: JSON.stringify(body) }));
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ leadId: "lead-1", email: { mode: "failed" } });
    expect(mocks.create.mock.calls[0][0].phone).toBe("");
    expect(mocks.record).toHaveBeenCalledWith("lead-1", expect.objectContaining({ mode: "failed" }));
  });
  it("normalizes a valid landline before persistence", async () => {
    mocks.send.mockResolvedValue({ mode: "accepted" });
    const response = await POST(new Request("https://example.com/api/leads", { method: "POST", body: JSON.stringify({ ...body, phone: "06 56 514 720" }) }));
    expect(response.status).toBe(201);
    expect(mocks.create.mock.calls[0][0].phone).toBe("+3656514720");
  });
  it("rejects invalid phone input before storing a lead or sending mail", async () => {
    const response = await POST(new Request("https://example.com/api/leads", { method: "POST", body: JSON.stringify({ ...body, phone: "123" }) }));
    expect(response.status).toBe(400);
    expect(mocks.create).not.toHaveBeenCalled(); expect(mocks.send).not.toHaveBeenCalled();
  });
});
