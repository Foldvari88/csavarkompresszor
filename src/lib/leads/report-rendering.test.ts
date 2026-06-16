import { describe, expect, it } from "vitest";
import { formatHuf } from "@/lib/format";
import { renderCustomerEmail } from "./email";
import { getLeadReportLines } from "./pdf";
import { createPreviewLead } from "./preview";

describe("report heat recovery rendering", () => {
  it("uses the canonical www host for report download links", () => {
    const previousSiteUrl = process.env.SITE_URL;
    const previousNextPublicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.SITE_URL = "https://iparikalkulator.hu";
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";

    try {
      const html = renderCustomerEmail(createPreviewLead());

      expect(html).toContain(
        "https://www.iparikalkulator.hu/api/reports/preview-lead-20260604/download"
      );
      expect(html).not.toContain(
        "https://iparikalkulator.hu/api/reports/preview-lead-20260604/download"
      );
      expect(html).not.toContain(
        "https://example.com/api/reports/preview-lead-20260604/download"
      );
    } finally {
      if (previousSiteUrl === undefined) {
        delete process.env.SITE_URL;
      } else {
        process.env.SITE_URL = previousSiteUrl;
      }

      if (previousNextPublicSiteUrl === undefined) {
        delete process.env.NEXT_PUBLIC_SITE_URL;
      } else {
        process.env.NEXT_PUBLIC_SITE_URL = previousNextPublicSiteUrl;
      }
    }
  });

  it("hides HMV and heat recovery details when the checkbox was not selected", () => {
    const previewLead = createPreviewLead();
    const lead = {
      ...previewLead,
      input: {
        ...previewLead.input,
        heatRecovery: {
          ...previewLead.input.heatRecovery,
          enabled: false
        }
      }
    };

    const html = renderCustomerEmail(lead);
    const pdfText = getLeadReportLines(lead).join("\n");

    expect(html).not.toContain("HMV");
    expect(html).not.toContain("H\u0151visszanyer");
    expect(pdfText).not.toContain("HMV");
    expect(pdfText).not.toContain("H\u0151visszanyer");
  });

  it("shows HMV and heat recovery details when the checkbox was selected", () => {
    const lead = createPreviewLead();
    const html = renderCustomerEmail(lead);
    const pdfText = getLeadReportLines(lead).join("\n");

    expect(html).toContain("HMV");
    expect(html).toContain("H\u0151visszanyer");
    expect(pdfText).toContain("HMV");
    expect(pdfText).toContain("H\u0151visszanyer");
  });

  it("adds electricity and heat recovery savings in the report outputs", () => {
    const lead = createPreviewLead();
    const totalAnnualSavings =
      lead.result.annualHufSaved + (lead.result.heatRecovery?.seasonalSavingsHuf ?? 0);
    const html = renderCustomerEmail(lead);
    const pdfText = getLeadReportLines(lead).join("\n");

    expect(html).toContain(formatHuf(totalAnnualSavings));
    expect(html).toContain("Összesített éves megtakarítás");
    expect(html).toContain("Villamosenergia-megtakarítás");
    expect(html).toContain("Hővisszanyerési gázkiváltás");
    expect(pdfText).toContain(`Összesített éves megtakarítás: ${formatHuf(totalAnnualSavings)}`);
    expect(pdfText).toContain("Villamosenergia-megtakarítás");
    expect(pdfText).toContain("Hővisszanyerési gázkiváltás");
  });
});
