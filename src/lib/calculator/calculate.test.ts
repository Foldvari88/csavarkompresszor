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
    expect(result.categorySavingsVarianceMultiplier).toBeCloseTo(0.9979);
    expect(result.annualKwhSaved).toBeCloseTo((45.15 - 27.594) * 5500 * 0.9979);
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
    expect(result.categorySavingsVarianceMultiplier).toBeCloseTo(1.0037);
    expect(result.selectedLegacy.category).toBe("Közép");
  });

  it("keeps category variance inside a 1 percent annual savings band", () => {
    const premium = calculateSavings(baseInput);
    const middle = calculateSavings({
      ...baseInput,
      brand: "Boge",
      category: "KĂ¶zĂ©p"
    });

    expect(premium.categorySavingsVarianceMultiplier).toBeGreaterThanOrEqual(0.99);
    expect(premium.categorySavingsVarianceMultiplier).toBeLessThanOrEqual(0.999);
    expect(middle.categorySavingsVarianceMultiplier).toBeGreaterThanOrEqual(1.001);
    expect(middle.categorySavingsVarianceMultiplier).toBeLessThanOrEqual(1.01);
    expect(middle.categorySavingsVarianceMultiplier - premium.categorySavingsVarianceMultiplier).toBeLessThanOrEqual(
      0.01
    );
  });

  it("adds deterministic brand-level variance inside the same premium category", () => {
    const atlas = calculateSavings(baseInput);
    const kaeser = calculateSavings({
      ...baseInput,
      brand: "Kaeser"
    });

    expect(atlas.selectedLegacy.category).toBe("Prémium");
    expect(kaeser.selectedLegacy.category).toBe("Prémium");
    expect(atlas.categorySavingsVarianceMultiplier).toBe(0.9979);
    expect(kaeser.categorySavingsVarianceMultiplier).toBe(0.9909);
    expect(atlas.annualHufSaved).not.toBe(kaeser.annualHufSaved);
  });

  it("adds deterministic type-level variance for the same brand", () => {
    const atlas37 = calculateSavings(baseInput);
    const atlas45 = calculateSavings({
      ...baseInput,
      nominalKw: 45
    });

    expect(atlas37.recommendedModel.model).toBe("L37RS");
    expect(atlas45.recommendedModel.model).toBe("L45RS");
    expect(atlas37.categorySavingsVarianceMultiplier).toBe(0.9979);
    expect(atlas45.categorySavingsVarianceMultiplier).toBe(0.9918);
  });

  it("prequalifies engineering PDF only with business email, website and activity", () => {
    const result = calculateSavings({
      ...baseInput,
      companyWebsite: "mintaipar.hu",
      companyActivity: "CNC / fémmegmunkálás",
      email: "mernok@mintaipar.hu"
    });

    expect(result.companyProfile.label).toBe("Mérnöki előminősített");
    expect(result.companyProfile.expectedAccuracy).toBe("+/- 15-20%");
    expect(result.companyProfile.engineeringPdfEligible).toBe(true);
    expect(result.companyProfile.detectedSegments).toContain("CNC / fémmegmunkáló üzem");
  });

  it("keeps free email leads profiled but without engineering PDF eligibility", () => {
    const result = calculateSavings({
      ...baseInput,
      companyWebsite: "mintaipar.hu",
      companyActivity: "CNC / fémmegmunkálás",
      email: "teszt@gmail.com"
    });

    expect(result.companyProfile.label).toBe("Cégprofilozott");
    expect(result.companyProfile.isBusinessEmail).toBe(false);
    expect(result.companyProfile.engineeringPdfEligible).toBe(false);
  });

  it("scores leads from measurable savings, company profile, size and utilization data", () => {
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
      companyActivity: "Gyártóüzem / termelés",
      email: "mernok@mintaipar.hu"
    });

    expect(qualified.leadScore.score).toBeGreaterThan(basic.leadScore.score);
    expect(qualified.leadScore.reasons.join(" ")).toContain("Éves megtakarítási potenciál");
    expect(qualified.leadScore.reasons.join(" ")).toContain("Cégprofil teljessége");
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

    expect(liveAtlas.annualHufSaved).toBe(4336158);
    expect(liveKaeser.annualHufSaved).toBe(4305741);
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
