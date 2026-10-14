import { describe, expect, it } from "vitest";
import { isValidHungarianPhone, normalizeHungarianPhone } from "./phone";

describe("Hungarian phone input", () => {
  it.each([
    ["+3656514720", "+3656514720"],
    ["06 56 514 720", "+3656514720"],
    ["+36 (1) 234-5678", "+3612345678"],
    ["+36 70 595 0285", "+36705950285"],
    ["0036 70 595 0285", "+36705950285"],
    ["36705950285", "+36705950285"],
    ["705950285", "+36705950285"]
  ])("accepts %s and normalizes it", (input, expected) => {
    expect(normalizeHungarianPhone(input)).toBe(expected);
    expect(isValidHungarianPhone(input)).toBe(true);
  });
  it.each(["", "+36", "+3670123", "+367012345678", "+3601234567", "+3670abc1234567", "+44701234567"])("rejects %s", input => {
    expect(isValidHungarianPhone(input)).toBe(false);
  });
});
