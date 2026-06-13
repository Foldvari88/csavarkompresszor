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
    const result = calculateSavings({
      ...baseInput,
      preferVariableSpeed: false,
      loadProfile: "continuous"
    });

    expect(result.recommendedModel.model).toBe("L37");
    expect(result.selectedLegacy.inputKwBase).toBeCloseTo(43);
    expect(result.recommendedModel.inputKw).toBeCloseTo(39.42);
    expect(result.excelAnnualKwhSaved).toBeCloseTo((43 - 39.42) * 5500);
    expect(result.categorySavingsVarianceMultiplier).toBeGreaterThanOrEqual(0.99);
    expect(result.categorySavingsVarianceMultiplier).toBeLessThanOrEqual(0.999);
    expect(result.annualKwhSaved).toBeCloseTo(
      result.excelAnnualKwhSaved * result.categorySavingsVarianceMultiplier
    );
    expect(result.annualHufSaved).toBe(Math.round(result.annualKwhSaved * 35));
  });

  it("keeps the attached Excel workbook as the base method before the 1 percent variance", () => {
    const result = calculateSavings({
      ...baseInput,
      brand: "CompAir",
      category: "ignored",
      nominalKw: 250,
      preferVariableSpeed: false
    });

    expect(result.recommendedModel.model).toBe("L250FC");
    expect(result.selectedLegacy.inputKwBase).toBeCloseTo(260);
    expect(result.recommendedModel.inputKw).toBeCloseTo(217.57);
    expect(result.excelAnnualKwhSaved).toBeCloseTo((260 - 217.57) * 5500);
    expect(Math.round(result.excelAnnualKwhSaved * 35)).toBe(8167775);
    expect(result.categorySavingsVarianceMultiplier).toBeGreaterThanOrEqual(0.99);
    expect(result.categorySavingsVarianceMultiplier).toBeLessThanOrEqual(1.01);
  });

  it("applies the 5 percent degradation step for 10-15 years", () => {
    const result = calculateSavings({ ...baseInput, ageBand: "10-15" });

    expect(result.selectedLegacy.degradationMultiplier).toBeCloseTo(1.05);
    expect(result.selectedLegacy.degradedInputKw).toBeCloseTo(43 * 1.05);
  });

  it("applies two 5 percent degradation steps for 15+ years", () => {
    const result = calculateSavings({ ...baseInput, ageBand: "15+" });

    expect(result.selectedLegacy.degradationMultiplier).toBeCloseTo(1.1025);
    expect(result.selectedLegacy.degradedInputKw).toBeCloseTo(43 * 1.1025);
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
    expect(result.categorySavingsVarianceMultiplier).toBeCloseTo(1.0037);
    expect(result.selectedLegacy.category).toBe("Közép");
  });

  it("keeps category variance inside a 1 percent annual savings band", () => {
    const premium = calculateSavings({ ...baseInput, loadProfile: "fluctuating" });
    const middle = calculateSavings({
      ...baseInput,
      brand: "Boge",
      category: "KĂ¶zĂ©p",
      loadProfile: "fluctuating"
    });

    expect(premium.categorySavingsVarianceMultiplier).toBeGreaterThanOrEqual(0.99);
    expect(premium.categorySavingsVarianceMultiplier).toBeLessThanOrEqual(0.999);
    expect(middle.categorySavingsVarianceMultiplier).toBeGreaterThanOrEqual(1.001);
    expect(middle.categorySavingsVarianceMultiplier).toBeLessThanOrEqual(1.01);
    expect(middle.categorySavingsVarianceMultiplier - premium.categorySavingsVarianceMultiplier).toBeLessThanOrEqual(
      0.02
    );
  });

  it("adds deterministic brand-level variance inside the same premium category", () => {
    const atlas = calculateSavings({ ...baseInput, loadProfile: "fluctuating" });
    const kaeser = calculateSavings({
      ...baseInput,
      brand: "Kaeser",
      loadProfile: "fluctuating"
    });

    expect(atlas.selectedLegacy.category).toBe("Prémium");
    expect(kaeser.selectedLegacy.category).toBe("Prémium");
    expect(atlas.categorySavingsVarianceMultiplier).toBeGreaterThanOrEqual(0.99);
    expect(atlas.categorySavingsVarianceMultiplier).toBeLessThanOrEqual(0.999);
    expect(kaeser.categorySavingsVarianceMultiplier).toBeGreaterThanOrEqual(0.99);
    expect(kaeser.categorySavingsVarianceMultiplier).toBeLessThanOrEqual(0.999);
    expect(atlas.categorySavingsVarianceMultiplier).not.toBe(kaeser.categorySavingsVarianceMultiplier);
    expect(atlas.annualHufSaved).not.toBe(kaeser.annualHufSaved);
  });

  it("adds deterministic type-level variance for the same brand", () => {
    const atlas37 = calculateSavings({ ...baseInput, loadProfile: "fluctuating" });
    const atlas45 = calculateSavings({
      ...baseInput,
      nominalKw: 45,
      loadProfile: "fluctuating"
    });

    expect(atlas37.recommendedModel.model).toBe("L37RS");
    expect(atlas45.recommendedModel.model).toBe("L45RS");
    expect(atlas37.categorySavingsVarianceMultiplier).toBeGreaterThanOrEqual(0.99);
    expect(atlas37.categorySavingsVarianceMultiplier).toBeLessThanOrEqual(0.999);
    expect(atlas45.categorySavingsVarianceMultiplier).toBeGreaterThanOrEqual(0.99);
    expect(atlas45.categorySavingsVarianceMultiplier).toBeLessThanOrEqual(0.999);
    expect(atlas37.categorySavingsVarianceMultiplier).not.toBe(atlas45.categorySavingsVarianceMultiplier);
  });

  it("forces variable speed preference for fluctuating profile inputs", () => {
    const fluctuating = calculateSavings({
      ...baseInput,
      preferVariableSpeed: false,
      loadProfile: "fluctuating"
    });
    const explicitVariableSpeed = calculateSavings({
      ...baseInput,
      preferVariableSpeed: true,
      loadProfile: "fluctuating"
    });

    expect(fluctuating.units[0].input.preferVariableSpeed).toBe(true);
    expect(fluctuating.recommendedModel.model).toBe("L37RS");
    expect(fluctuating.excelAnnualKwhSaved).toBeCloseTo(explicitVariableSpeed.excelAnnualKwhSaved);
    expect(fluctuating.annualHufSaved).toBe(explicitVariableSpeed.annualHufSaved);
  });

  it("caps the continuous profile variable speed advantage at 5 percent", () => {
    const fixedSpeed = calculateSavings({
      ...baseInput,
      loadProfile: "continuous",
      preferVariableSpeed: false
    });
    const variableSpeed = calculateSavings({
      ...baseInput,
      loadProfile: "continuous",
      preferVariableSpeed: true
    });

    expect(fixedSpeed.recommendedModel.model).toBe("L37");
    expect(variableSpeed.recommendedModel.model).toBe("L37RS");
    expect(variableSpeed.annualHufSaved).toBeLessThanOrEqual(
      Math.round(fixedSpeed.annualHufSaved * 1.05)
    );
    expect(variableSpeed.annualKwhSaved).toBeCloseTo(fixedSpeed.annualKwhSaved * 1.05, 2);
  });

  it("keeps variable speed continuous and fluctuating profile savings within 1 percent", () => {
    const continuous = calculateSavings({
      ...baseInput,
      loadProfile: "continuous",
      preferVariableSpeed: true
    });
    const fluctuating = calculateSavings({
      ...baseInput,
      loadProfile: "fluctuating",
      preferVariableSpeed: true
    });

    expect(fluctuating.recommendedModel.model).toBe("L37RS");
    expect(fluctuating.annualKwhSaved).toBeGreaterThan(continuous.annualKwhSaved);
    expect(fluctuating.annualKwhSaved).toBeLessThanOrEqual(
      roundForTest(continuous.annualKwhSaved * 1.01, 2)
    );
    expect(fluctuating.annualKwhSaved).toBeCloseTo(continuous.annualKwhSaved * 1.01, 2);
  });

  it("scores leads from measurable savings, size and utilization data", () => {
    const basic = calculateSavings({
      ...baseInput,
      nominalKw: 22,
      annualHours: 3000,
      email: "teszt@gmail.com"
    });
    const qualified = calculateSavings({
      ...baseInput,
      nominalKw: 75,
      annualHours: 7000,
      companyWebsite: "mintaipar.hu",
      companyActivity: "Gépgyártás",
      email: "mernok@mintaipar.hu"
    });

    expect(qualified.leadScore.score).toBeGreaterThan(basic.leadScore.score);
    expect(qualified.leadScore.reasons.join(" ")).toContain("Éves megtakarítási potenciál");
    expect(qualified.leadScore.reasons.join(" ")).toContain("Üzemóra intenzitás");
  });

  it("keeps Atlas and Kaeser visibly different in the live fluctuating profile scenario", () => {
    const liveAtlas = calculateSavings({
      ...baseInput,
      ageBand: "10-15",
      loadProfile: "fluctuating"
    });
    const liveKaeser = calculateSavings({
      ...baseInput,
      brand: "Kaeser",
      ageBand: "10-15",
      loadProfile: "fluctuating"
    });

    expect(liveAtlas.annualHufSaved).toBeGreaterThan(1_000_000);
    expect(liveKaeser.annualHufSaved).toBeGreaterThan(1_000_000);
    expect(liveAtlas.annualHufSaved).not.toBe(liveKaeser.annualHufSaved);
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
        canUseRecoveredHeatOutsideHeatingSeason: true,
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

  it("uses only heating months when recovered heat is not usable outside the heating season", () => {
    const result = calculateSavings({
      ...baseInput,
      nominalKw: 37,
      annualHours: 4000,
      heatRecovery: {
        enabled: true,
        gasPriceHufPerM3: 300,
        heatingMonths: 7,
        canUseRecoveredHeatOutsideHeatingSeason: false,
        hotWaterMonths: 5
      }
    });

    expect(result.heatRecovery?.canUseRecoveredHeatOutsideHeatingSeason).toBe(false);
    expect(result.heatRecovery?.hotWaterMonths).toBe(0);
    expect(result.heatRecovery?.seasonalSavingsHuf).toBe(
      Math.round(Number((((37 * 0.9 * 0.9 * 4000) / 9.44 / 0.9) * (7 / 12)).toFixed(2)) * 300)
    );
  });

  it("derives HMV months from the heating season so the two always add up to 12", () => {
    const result = calculateSavings({
      ...baseInput,
      nominalKw: 37,
      annualHours: 4000,
      heatRecovery: {
        enabled: true,
        gasPriceHufPerM3: 300,
        heatingMonths: 8,
        canUseRecoveredHeatOutsideHeatingSeason: true,
        hotWaterMonths: 1
      }
    });

    expect(result.heatRecovery?.heatingMonths).toBe(8);
    expect(result.heatRecovery?.hotWaterMonths).toBe(4);
    expect((result.heatRecovery?.heatingMonths ?? 0) + (result.heatRecovery?.hotWaterMonths ?? 0)).toBe(12);
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
        canUseRecoveredHeatOutsideHeatingSeason: true,
        hotWaterMonths: 5
      }
    });

    expect(result.recommendedModel.model).toBe("L45RS");
    expect(result.heatRecovery?.compressorModelName).toBe("CompAir L45RS");
    expect(result.heatRecovery?.compressorNominalKw).toBe(45);
    expect(result.heatRecovery?.annualUsefulHeatKwh).toBeCloseTo(45 * 0.9 * 0.9 * 4000);
  });
});

function roundForTest(value: number, digits: number) {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}
