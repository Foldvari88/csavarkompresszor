import { describe, expect, it } from "vitest";
import { calculateSavings, recommendEfficiencyModel } from "./calculate";
import type { CalculatorInput } from "./types";

const baseInput: CalculatorInput = {
  brand: "Atlas Copco",
  category: "Prémium",
  ageBand: "5-10",
  nominalKw: 37,
  annualHours: 5500,
  energyPriceHufKwh: 35,
  preferVariableSpeed: true
};

describe("calculateSavings", () => {
  it("matches the Excel-style annual saving formula for a 5-10 year compressor", () => {
    const result = calculateSavings(baseInput);

    expect(result.recommendedModel.model).toBe("L37RS");
    expect(result.selectedLegacy.inputKwBase).toBeCloseTo(45.15);
    expect(result.recommendedModel.inputKw).toBeCloseTo(27.594);
    expect(result.excelAnnualKwhSaved).toBeCloseTo((45.15 - 27.594) * 5500);
    expect(result.categorySavingsVarianceMultiplier).toBeCloseTo(0.995);
    expect(result.annualKwhSaved).toBeCloseTo((45.15 - 27.594) * 5500 * 0.995);
    expect(result.annualHufSaved).toBe(Math.round(result.annualKwhSaved * 35));
  });

  it("applies the 5 percent degradation step for 10-15 years", () => {
    const result = calculateSavings({ ...baseInput, ageBand: "10-15" });

    expect(result.selectedLegacy.degradationMultiplier).toBeCloseTo(1.05);
    expect(result.selectedLegacy.degradedInputKw).toBeCloseTo(45.15 * 1.05);
  });

  it("applies two 5 percent degradation steps for 15+ years", () => {
    const result = calculateSavings({ ...baseInput, ageBand: "15+" });

    expect(result.selectedLegacy.degradationMultiplier).toBeCloseTo(1.1025);
    expect(result.selectedLegacy.degradedInputKw).toBeCloseTo(45.15 * 1.1025);
  });

  it("uses the next larger recommended model when there is no exact nominal match", () => {
    const model = recommendEfficiencyModel(40, true);

    expect(model.model).toBe("L45RS");
  });

  it("ignores manually supplied category and uses the Excel category for the selected brand", () => {
    const result = calculateSavings({
      ...baseInput,
      brand: "Boge",
      category: "Prémium",
      nominalKw: 37
    });

    expect(result.selectedLegacy.brand).toBe("Boge");
    expect(result.categorySavingsVarianceMultiplier).toBeCloseTo(1.005);
    expect(result.selectedLegacy.category).toBe("Közép");
  });

  it("keeps category variance inside a 1 percent annual savings band", () => {
    const premium = calculateSavings(baseInput);
    const middle = calculateSavings({
      ...baseInput,
      brand: "Boge",
      category: "KĂ¶zĂ©p"
    });

    expect(premium.categorySavingsVarianceMultiplier).toBe(0.995);
    expect(middle.categorySavingsVarianceMultiplier).toBe(1.005);
    expect(middle.categorySavingsVarianceMultiplier - premium.categorySavingsVarianceMultiplier).toBeCloseTo(
      0.01
    );
  });

  it("calculates optional heat recovery gas savings with the attached Excel logic", () => {
    const result = calculateSavings({
      ...baseInput,
      nominalKw: 37,
      annualHours: 4000,
      heatRecovery: {
        enabled: true,
        gasPriceHufPerM3: 300,
        heatingMonths: 7,
        hotWaterMonths: 5
      }
    });

    expect(result.heatRecovery).not.toBeNull();
    expect(result.heatRecovery?.recoverableHeatKw).toBeCloseTo(37 * 0.9);
    expect(result.heatRecovery?.usefulHeatKw).toBeCloseTo(37 * 0.9 * 0.9);
    expect(result.heatRecovery?.annualUsefulHeatKwh).toBeCloseTo(37 * 0.9 * 0.9 * 4000);
    expect(result.heatRecovery?.annualUsefulHeatMj).toBeCloseTo(37 * 0.9 * 0.9 * 4000 * 3.6);
    expect(result.heatRecovery?.theoreticalGasSavedM3).toBeCloseTo(
      (37 * 0.9 * 0.9 * 4000) / 9.44 / 0.9,
      1
    );
    expect(result.heatRecovery?.seasonalSavingsHuf).toBe(
      Math.round(((37 * 0.9 * 0.9 * 4000) / 9.44 / 0.9) * ((7 + 5 * 0.5) / 12) * 300)
    );
  });

  it("uses the recommended compressor model for heat recovery calculations", () => {
    const result = calculateSavings({
      ...baseInput,
      nominalKw: 40,
      annualHours: 4000,
      heatRecovery: {
        enabled: true,
        gasPriceHufPerM3: 300,
        heatingMonths: 7,
        hotWaterMonths: 5
      }
    });

    expect(result.recommendedModel.model).toBe("L45RS");
    expect(result.heatRecovery?.compressorModelName).toBe("CompAir L45RS");
    expect(result.heatRecovery?.compressorNominalKw).toBe(45);
    expect(result.heatRecovery?.annualUsefulHeatKwh).toBeCloseTo(45 * 0.9 * 0.9 * 4000);
  });
});
