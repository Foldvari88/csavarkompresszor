import { describe, expect, it } from "vitest";
import { formatHuf } from "@/lib/format";
import { renderCustomerEmail } from "./email";
import { getLeadReportLines } from "./pdf";
import { createPreviewLead } from "./preview";

describe("report heat recovery rendering", () => {
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
