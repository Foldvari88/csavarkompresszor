import { formatHuf, formatKw, formatNumber } from "@/lib/format";
import type { LeadRecord } from "@/lib/calculator/types";

export function generateLeadPdf(lead: LeadRecord) {
  return createSimplePdf(getLeadReportLines(lead));
}

export function getLeadReportLines(lead: LeadRecord) {
  const { input, result } = lead;

  return [
    "Csavarkompresszor energiahatekonysagi riport",
    `Azonosito: ${lead.id.slice(0, 8)}`,
    `Datum: ${new Date(lead.createdAt).toLocaleString("hu-HU")}`,
    "",
    "Bemeneti adatok",
    `Ceg: ${input.companyName}`,
    `Kapcsolattarto: ${input.name}`,
    `Email: ${input.email}`,
    `Telefon: ${input.phone}`,
    `Jelenlegi gep: ${input.brand}, ${formatKw(input.nominalKw)}, ${input.ageBand} ev`,
    `Uzemora: ${formatNumber(input.annualHours)} ora/ev`,
    `Villamos energia dija: ${formatHuf(input.energyPriceHufKwh)} / kWh`,
    `Terhelesi profil: ${input.loadProfile ?? "ingadozo"}`,
    `Gepek szama: ${result.totalMachineCount}`,
    "",
    "Eredmeny",
    `Eves megtakaritas: ${formatHuf(result.annualHufSaved)}`,
    `Havi megtakaritas: ${formatHuf(result.monthlyHufSaved)}`,
    `5 eves potencial: ${formatHuf(result.fiveYearHufSaved)}`,
    `Eves kWh megtakaritas: ${formatNumber(result.annualKwhSaved)} kWh`,
    `Becsult megterules: ${
      result.estimatedPaybackYears === null
        ? "gepar megadasa utan szamolhato"
        : `${formatNumber(result.estimatedPaybackYears, 1)} ev`
    }`,
    "",
    "Ajanlott modell",
    `${result.recommendedModel.model} (${formatKw(result.recommendedModel.nominalKw)})`,
    `Felvett teljesitmeny: ${formatNumber(result.recommendedModel.inputKw, 2)} kW`,
    "",
    "Minosites",
    `${result.priority.label}`,
    `${result.priority.description}`,
    `${result.benchmark.label}: ${result.benchmark.description}`,
    "",
    "Kovetkezo lepes",
    "A reszletes donteshez erdemes a tenyleges levegoigenyt, uzemi nyomast, szivargast es termelesi profilt muszaki felmeressel pontositani."
  ];
}

function createSimplePdf(lines: string[]) {
  const escapedLines = wrapLines(lines.map(toPdfSafeText), 86);
  const content = [
    "BT",
    "/F1 18 Tf",
    "50 790 Td",
    `(${escapePdfText(escapedLines[0] ?? "Riport")}) Tj`,
    "/F1 10 Tf",
    "0 -24 Td",
    ...escapedLines.slice(1).flatMap((line) => [`(${escapePdfText(line)}) Tj`, "0 -14 Td"]),
    "ET"
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}\nendstream`
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, "latin1");
}

function wrapLines(lines: string[], maxLength: number) {
  return lines.flatMap((line) => {
    if (!line) return [""];
    const words = line.split(" ");
    const wrapped: string[] = [];
    let current = "";
    words.forEach((word) => {
      if (`${current} ${word}`.trim().length > maxLength) {
        wrapped.push(current);
        current = word;
      } else {
        current = `${current} ${word}`.trim();
      }
    });
    if (current) wrapped.push(current);
    return wrapped;
  });
}

function toPdfSafeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "");
}

function escapePdfText(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}
