import { readFileSync } from "node:fs";
import path from "node:path";
import { formatCompressorModel, formatHuf, formatKw, formatNumber } from "@/lib/format";
import { getCompressorProductImage } from "@/lib/product-images";
import type { LeadRecord } from "@/lib/calculator/types";

type ParsedFont = {
  buffer: Buffer;
  unitsPerEm: number;
  bbox: [number, number, number, number];
  ascent: number;
  descent: number;
  widths: number[];
  cmap: Map<number, number>;
};

type TextStyle = {
  size: number;
  lineHeight: number;
  color: string;
};

const fontPath = path.join(process.cwd(), "public", "fonts", "NotoSans-Regular.ttf");
const productImageMarker = "__COMPRESSOR_PRODUCT_IMAGE__";
let parsedFont: ParsedFont | null = null;

export function generateLeadPdf(lead: LeadRecord) {
  return createUnicodePdf(getLeadReportLines(lead), getCompressorProductImage(lead.result.recommendedModel));
}

export function getLeadReportLines(lead: LeadRecord) {
  const { input, result } = lead;
  const reportSavings = getReportSavings(lead);

  return [
    "Csavarkompresszor energiahatékonysági riport",
    `Azonosító: ${lead.id.slice(0, 8)}`,
    `Dátum: ${new Date(lead.createdAt).toLocaleString("hu-HU")}`,
    "",
    "Bemeneti adatok",
    `Céges weboldal: ${input.companyWebsite || "-"}`,
    `Tevékenység: ${input.companyActivity || "-"}`,
    `Cég: ${input.companyName || "-"}`,
    `Kapcsolattartó: ${input.name}`,
    `Email: ${input.email}`,
    `Telefon: ${input.phone}`,
    `Jelenlegi gép: ${input.brand}, ${formatKw(input.nominalKw)}, ${input.ageBand} év`,
    `Üzemóra: ${formatNumber(input.annualHours)} óra/év`,
    `Villamos energia díja: ${formatHuf(input.energyPriceHufKwh)} / kWh`,
    `Terhelési profil: ${input.loadProfile ?? "ingadozó"}`,
    `Gépek száma: ${result.totalMachineCount}`,
    "",
    "Eredmény",
    `Összesített éves megtakarítás: ${formatHuf(reportSavings.totalAnnualHuf)}`,
    `Villamosenergia-megtakarítás: ${formatHuf(result.annualHufSaved)} / év`,
    ...(reportSavings.heatRecoveryAnnualHuf > 0
      ? [`Hővisszanyerési gázkiváltás: ${formatHuf(reportSavings.heatRecoveryAnnualHuf)} / év`]
      : []),
    `Havi összesített hatás: ${formatHuf(Math.round(reportSavings.totalAnnualHuf / 12))}`,
    `5 éves összesített potenciál: ${formatHuf(reportSavings.totalAnnualHuf * 5)}`,
    `Éves kWh megtakarítás: ${formatNumber(result.annualKwhSaved)} kWh`,
    ...getHeatRecoveryReportLines(lead),
    "",
    "Ajánlott modell",
    `${formatCompressorModel(result.recommendedModel)} (${formatKw(
      result.recommendedModel.nominalKw
    )})`,
    `Felvett teljesítmény: ${formatNumber(result.recommendedModel.inputKw, 2)} kW`,
    productImageMarker,
    "",
    "Következő lépés",
    getPersonalizedPdfNextStep(lead)
  ];
}

function getReportSavings(lead: LeadRecord) {
  const heatRecoveryAnnualHuf = getEnabledHeatRecovery(lead)?.seasonalSavingsHuf ?? 0;
  return {
    heatRecoveryAnnualHuf,
    totalAnnualHuf: lead.result.annualHufSaved + heatRecoveryAnnualHuf
  };
}

function getPersonalizedPdfNextStep(lead: LeadRecord) {
  const { input, result } = lead;
  const displayName = getLeadDisplayName(lead);
  const activity = input.companyActivity ? `${input.companyActivity} környezetben` : "az üzemi környezetben";

  if (getEnabledHeatRecovery(lead)) {
    return `${displayName} esetében a következő lépés a hővisszanyerés valós felhasználási arányának pontosítása ${activity}, külön fűtési és HMV igényekkel.`;
  }

  return `${displayName} esetében a részletes döntéshez érdemes a tényleges levegőigényt, üzemi nyomást, szivárgást és termelési profilt műszaki felméréssel pontosítani.`;
}

function getLeadDisplayName(lead: LeadRecord) {
  return lead.input.companyName?.trim() || lead.input.name?.trim() || "Az Ön üzeme";
}

function getHeatRecoveryReportLines(lead: LeadRecord) {
  const heat = getEnabledHeatRecovery(lead);
  if (!heat) return [];
  const seasonalLabel = heat.canUseRecoveredHeatOutsideHeatingSeason
    ? `Megtakarítás ${heat.heatingMonths} hónap fűtés, ${heat.hotWaterMonths} hónap csak HMV előállítás mellett`
    : `Megtakarítás ${heat.heatingMonths} hónap fűtési célú hőhasznosítás mellett`;
  const gasLabel = heat.canUseRecoveredHeatOutsideHeatingSeason
    ? "Megtakarított földgáz fűtés/HMV kombinációval"
    : "Megtakarított földgáz fűtési időszakban";
  const costLabel = heat.canUseRecoveredHeatOutsideHeatingSeason
    ? "Fűtés/HMV kombinációval kiváltható éves gázköltség"
    : "Fűtési időszakban kiváltható éves gázköltség";

  return [
    "",
    "Hővisszanyerés",
    `Hővisszanyerés alapja: ${heat.compressorModelName} (${formatKw(heat.compressorNominalKw)})`,
    `Kompresszor üzemóra / év: ${formatNumber(heat.annualHours)} óra`,
    `Visszanyerhető hőteljesítmény: ${formatNumber(heat.recoverableHeatKw, 2)} kW`,
    `Visszanyerhető hőteljesítmény veszteséggel: ${formatNumber(heat.usefulHeatKw, 2)} kW`,
    `Földgáz ára: ${formatHuf(heat.gasPriceHufPerM3)} / m3`,
    `Elméleti megtakarítás 1 év alatt, vagy ipari folyamatos HMV felhasználás: ${formatHuf(heat.theoreticalSavingsHuf)} / év`,
    `Visszanyerhető összes hőmennyiség: ${formatNumber(heat.annualUsefulHeatKwh)} kWh / év`,
    `Megtakarított földgáz folyamatos HMV/ipari felhasználásnál: ${formatNumber(heat.theoreticalGasSavedM3)} m3 / év`,
    `${seasonalLabel}: ${formatHuf(heat.seasonalSavingsHuf)} / év`,
    `${gasLabel}: ${formatNumber(heat.seasonalGasSavedM3)} m3 / év`,
    `Hasznosítható hőenergia: ${formatNumber(heat.annualUsefulHeatKwh)} kWh / év`,
    `Hőenergia MJ-ban: ${formatNumber(heat.annualUsefulHeatMj)} MJ / év`,
    `${costLabel}: ${formatHuf(heat.seasonalSavingsHuf)}`,
    `Forráslogika: 90% visszanyerhető hőteljesítmény, 90% hasznosítás, 9,44 kWh/m3 földgáz, 90% kazánhatásfok.`
  ];
}

function getEnabledHeatRecovery(lead: LeadRecord) {
  return lead.input.heatRecovery?.enabled ? lead.result.heatRecovery : null;
}

function createUnicodePdf(lines: string[], productImage?: ReturnType<typeof getCompressorProductImage>) {
  const font = getFont();
  const image = productImage ? readPdfImage(productImage.localPath) : null;
  const usedGlyphs = new Map<number, number>();
  const pageCommands: string[][] = [[]];
  const pageWidth = 595;
  const marginX = 50;
  const maxTextWidth = pageWidth - marginX * 2;
  let y = 790;

  for (const [index, line] of lines.entries()) {
    if (line === productImageMarker) {
      if (image) {
        const imageWidth = 210;
        const imageHeight = Math.min(150, (image.height / image.width) * imageWidth);

        if (y - imageHeight < 54) {
          pageCommands.push([]);
          y = 790;
        }

        pageCommands[pageCommands.length - 1].push(
          `q\n${imageWidth.toFixed(2)} 0 0 ${imageHeight.toFixed(2)} ${marginX} ${(
            y - imageHeight
          ).toFixed(2)} cm\n/Im1 Do\nQ`
        );
        y -= imageHeight + 12;
      }
      continue;
    }

    if (!line) {
      y -= 10;
      continue;
    }

    const style = getTextStyle(line, index);
    const wrappedLines = wrapByWidth(line, maxTextWidth, style.size, font);

    for (const wrappedLine of wrappedLines) {
      if (y < 54) {
        pageCommands.push([]);
        y = 790;
      }

      pageCommands[pageCommands.length - 1].push(
        `BT\n/F1 ${style.size} Tf\n${style.color} rg\n${marginX} ${y} Td\n${encodeText(
          wrappedLine,
          font,
          usedGlyphs
        )} Tj\nET`
      );
      y -= style.lineHeight;
    }

    if (isHeading(line, index)) {
      y -= 4;
    }
  }

  const pageStreams = pageCommands.map((commands) => Buffer.from(commands.join("\n"), "latin1"));
  const pageIds: number[] = [];
  const contentIds: number[] = [];
  let nextId = 3;

  pageStreams.forEach(() => {
    pageIds.push(nextId++);
    contentIds.push(nextId++);
  });

  const imageId = image ? nextId++ : null;
  const fontId = nextId++;
  const cidFontId = nextId++;
  const descriptorId = nextId++;
  const fontFileId = nextId++;
  const toUnicodeId = nextId++;
  const objects: Buffer[] = [];

  objects[0] = pdfText("<< /Type /Catalog /Pages 2 0 R >>");
  objects[1] = pdfText(
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${
      pageIds.length
    } >>`
  );

  pageStreams.forEach((stream, index) => {
    const pageId = pageIds[index];
    const contentId = contentIds[index];
    const imageResources = imageId ? ` /XObject << /Im1 ${imageId} 0 R >>` : "";
    objects[pageId - 1] = pdfText(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontId} 0 R >>${imageResources} >> /Contents ${contentId} 0 R >>`
    );
    objects[contentId - 1] = pdfStream(`<< /Length ${stream.length} >>`, stream);
  });

  if (image && imageId) {
    objects[imageId - 1] = pdfStream(
      `<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.buffer.length} >>`,
      image.buffer
    );
  }

  objects[fontId - 1] = pdfText(
    `<< /Type /Font /Subtype /Type0 /BaseFont /NotoSans-Regular /Encoding /Identity-H /DescendantFonts [${cidFontId} 0 R] /ToUnicode ${toUnicodeId} 0 R >>`
  );
  objects[cidFontId - 1] = pdfText(
    `<< /Type /Font /Subtype /CIDFontType2 /BaseFont /NotoSans-Regular /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> /FontDescriptor ${descriptorId} 0 R /CIDToGIDMap /Identity /W ${buildWidths(
      font,
      usedGlyphs
    )} >>`
  );
  objects[descriptorId - 1] = pdfText(
    `<< /Type /FontDescriptor /FontName /NotoSans-Regular /Flags 4 /FontBBox [${font.bbox.join(
      " "
    )}] /ItalicAngle 0 /Ascent ${scaleMetric(font.ascent, font)} /Descent ${scaleMetric(
      font.descent,
      font
    )} /CapHeight ${scaleMetric(font.ascent, font)} /StemV 80 /FontFile2 ${fontFileId} 0 R >>`
  );
  objects[fontFileId - 1] = pdfStream(
    `<< /Length ${font.buffer.length} /Length1 ${font.buffer.length} >>`,
    font.buffer
  );

  const toUnicode = Buffer.from(buildToUnicodeCMap(usedGlyphs), "latin1");
  objects[toUnicodeId - 1] = pdfStream(`<< /Length ${toUnicode.length} >>`, toUnicode);

  return buildPdf(objects);
}

function readPdfImage(imagePath: string) {
  try {
    const buffer = readFileSync(imagePath);
    return {
      buffer,
      ...getJpegDimensions(buffer)
    };
  } catch {
    return null;
  }
}

function getJpegDimensions(buffer: Buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    throw new Error("PDF product image must be a JPEG.");
  }

  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);

    if (isStartOfFrame) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7)
      };
    }

    offset += 2 + length;
  }

  throw new Error("Unable to read JPEG dimensions.");
}

function getTextStyle(line: string, index: number): TextStyle {
  if (index === 0) {
    return { size: 18, lineHeight: 24, color: "0.18 0.19 0.52" };
  }

  if (isHeading(line, index)) {
    return { size: 12, lineHeight: 18, color: "0.06 0.09 0.16" };
  }

  return { size: 9.6, lineHeight: 14, color: "0.20 0.25 0.33" };
}

function isHeading(line: string, index: number) {
  return (
    index === 0 ||
    [
      "Bemeneti adatok",
      "Eredmény",
      "Hővisszanyerés",
      "Ajánlott modell",
      "Következő lépés"
    ].includes(
      line
    )
  );
}

function getFont() {
  if (!parsedFont) {
    parsedFont = parseTrueTypeFont(readFileSync(fontPath));
  }
  return parsedFont;
}

function parseTrueTypeFont(buffer: Buffer): ParsedFont {
  const tables = getTables(buffer);
  const head = getRequiredTable(tables, "head");
  const hhea = getRequiredTable(tables, "hhea");
  const maxp = getRequiredTable(tables, "maxp");
  const hmtx = getRequiredTable(tables, "hmtx");
  const cmap = getRequiredTable(tables, "cmap");
  const unitsPerEm = buffer.readUInt16BE(head + 18);
  const numGlyphs = buffer.readUInt16BE(maxp + 4);
  const numberOfHMetrics = buffer.readUInt16BE(hhea + 34);
  const widths = parseWidths(buffer, hmtx, numberOfHMetrics, numGlyphs, unitsPerEm);

  return {
    buffer,
    unitsPerEm,
    bbox: [
      scaleRawMetric(buffer.readInt16BE(head + 36), unitsPerEm),
      scaleRawMetric(buffer.readInt16BE(head + 38), unitsPerEm),
      scaleRawMetric(buffer.readInt16BE(head + 40), unitsPerEm),
      scaleRawMetric(buffer.readInt16BE(head + 42), unitsPerEm)
    ],
    ascent: buffer.readInt16BE(hhea + 4),
    descent: buffer.readInt16BE(hhea + 6),
    widths,
    cmap: parseCmap(buffer, cmap)
  };
}

function getTables(buffer: Buffer) {
  const numTables = buffer.readUInt16BE(4);
  const tables = new Map<string, number>();

  for (let index = 0; index < numTables; index += 1) {
    const offset = 12 + index * 16;
    const tag = buffer.toString("latin1", offset, offset + 4);
    tables.set(tag, buffer.readUInt32BE(offset + 8));
  }

  return tables;
}

function getRequiredTable(tables: Map<string, number>, tag: string) {
  const offset = tables.get(tag);
  if (offset === undefined) {
    throw new Error(`Missing ${tag} table in PDF font.`);
  }
  return offset;
}

function parseWidths(
  buffer: Buffer,
  hmtx: number,
  numberOfHMetrics: number,
  numGlyphs: number,
  unitsPerEm: number
) {
  const widths: number[] = [];
  let lastWidth = 0;

  for (let glyph = 0; glyph < numGlyphs; glyph += 1) {
    if (glyph < numberOfHMetrics) {
      lastWidth = buffer.readUInt16BE(hmtx + glyph * 4);
    }
    widths[glyph] = scaleRawMetric(lastWidth, unitsPerEm);
  }

  return widths;
}

function parseCmap(buffer: Buffer, cmap: number) {
  const numTables = buffer.readUInt16BE(cmap + 2);
  const subtables: Array<{ platform: number; encoding: number; offset: number; format: number }> =
    [];

  for (let index = 0; index < numTables; index += 1) {
    const record = cmap + 4 + index * 8;
    const offset = cmap + buffer.readUInt32BE(record + 4);
    subtables.push({
      platform: buffer.readUInt16BE(record),
      encoding: buffer.readUInt16BE(record + 2),
      offset,
      format: buffer.readUInt16BE(offset)
    });
  }

  const preferred =
    subtables.find((table) => table.platform === 3 && table.encoding === 10 && table.format === 12) ??
    subtables.find((table) => table.platform === 3 && table.format === 4) ??
    subtables.find((table) => table.format === 4 || table.format === 12);

  if (!preferred) {
    throw new Error("No supported cmap table in PDF font.");
  }

  return preferred.format === 12
    ? parseCmapFormat12(buffer, preferred.offset)
    : parseCmapFormat4(buffer, preferred.offset);
}

function parseCmapFormat4(buffer: Buffer, offset: number) {
  const glyphMap = new Map<number, number>();
  const segCount = buffer.readUInt16BE(offset + 6) / 2;
  const endCodes = offset + 14;
  const startCodes = endCodes + segCount * 2 + 2;
  const idDeltas = startCodes + segCount * 2;
  const idRangeOffsets = idDeltas + segCount * 2;

  for (let segment = 0; segment < segCount; segment += 1) {
    const endCode = buffer.readUInt16BE(endCodes + segment * 2);
    const startCode = buffer.readUInt16BE(startCodes + segment * 2);
    const idDelta = buffer.readInt16BE(idDeltas + segment * 2);
    const idRangeOffset = buffer.readUInt16BE(idRangeOffsets + segment * 2);

    for (let code = startCode; code <= endCode && code !== 0xffff; code += 1) {
      let glyphId = 0;
      if (idRangeOffset === 0) {
        glyphId = (code + idDelta) & 0xffff;
      } else {
        const glyphIndexOffset =
          idRangeOffsets + segment * 2 + idRangeOffset + (code - startCode) * 2;
        glyphId = buffer.readUInt16BE(glyphIndexOffset);
        if (glyphId !== 0) {
          glyphId = (glyphId + idDelta) & 0xffff;
        }
      }

      if (glyphId !== 0) {
        glyphMap.set(code, glyphId);
      }
    }
  }

  return glyphMap;
}

function parseCmapFormat12(buffer: Buffer, offset: number) {
  const glyphMap = new Map<number, number>();
  const groups = buffer.readUInt32BE(offset + 12);

  for (let group = 0; group < groups; group += 1) {
    const groupOffset = offset + 16 + group * 12;
    const startChar = buffer.readUInt32BE(groupOffset);
    const endChar = buffer.readUInt32BE(groupOffset + 4);
    const startGlyph = buffer.readUInt32BE(groupOffset + 8);

    for (let code = startChar; code <= endChar; code += 1) {
      glyphMap.set(code, startGlyph + code - startChar);
    }
  }

  return glyphMap;
}

function wrapByWidth(text: string, maxWidth: number, fontSize: number, font: ParsedFont) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const candidate = `${current} ${word}`.trim();
    if (current && measureText(candidate, fontSize, font) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  });

  if (current) lines.push(current);
  return lines;
}

function measureText(text: string, fontSize: number, font: ParsedFont) {
  const width = Array.from(text).reduce((sum, char) => {
    const glyphId = font.cmap.get(char.codePointAt(0) ?? 0) ?? 0;
    return sum + (font.widths[glyphId] ?? 500);
  }, 0);
  return (width * fontSize) / 1000;
}

function encodeText(text: string, font: ParsedFont, usedGlyphs: Map<number, number>) {
  const hex = Array.from(text)
    .map((char) => {
      const codePoint = char.codePointAt(0) ?? 0;
      const glyphId = font.cmap.get(codePoint) ?? 0;
      if (glyphId !== 0 && !usedGlyphs.has(glyphId)) {
        usedGlyphs.set(glyphId, codePoint);
      }
      return glyphId.toString(16).padStart(4, "0");
    })
    .join("");

  return `<${hex}>`;
}

function buildWidths(font: ParsedFont, usedGlyphs: Map<number, number>) {
  return `[${Array.from(usedGlyphs.keys())
    .sort((a, b) => a - b)
    .map((glyphId) => `${glyphId} [${font.widths[glyphId] ?? 500}]`)
    .join(" ")}]`;
}

function buildToUnicodeCMap(usedGlyphs: Map<number, number>) {
  const entries = Array.from(usedGlyphs.entries()).sort(([a], [b]) => a - b);
  const chunks: string[] = [];

  for (let index = 0; index < entries.length; index += 100) {
    const group = entries.slice(index, index + 100);
    chunks.push(
      `${group.length} beginbfchar\n${group
        .map(([glyphId, codePoint]) => `<${toHex(glyphId)}> <${toHex(codePoint)}>`)
        .join("\n")}\nendbfchar`
    );
  }

  return `/CIDInit /ProcSet findresource begin
12 dict begin
begincmap
/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def
/CMapName /Adobe-Identity-UCS def
/CMapType 2 def
1 begincodespacerange
<0000> <FFFF>
endcodespacerange
${chunks.join("\n")}
endcmap
CMapName currentdict /CMap defineresource pop
end
end`;
}

function toHex(value: number) {
  return value.toString(16).toUpperCase().padStart(4, "0");
}

function scaleMetric(value: number, font: ParsedFont) {
  return scaleRawMetric(value, font.unitsPerEm);
}

function scaleRawMetric(value: number, unitsPerEm: number) {
  return Math.round((value * 1000) / unitsPerEm);
}

function pdfText(value: string) {
  return Buffer.from(value, "latin1");
}

function pdfStream(dictionary: string, content: Buffer) {
  return Buffer.concat([pdfText(`${dictionary}\nstream\n`), content, pdfText("\nendstream")]);
}

function buildPdf(objects: Buffer[]) {
  const chunks: Buffer[] = [pdfText("%PDF-1.7\n")];
  const offsets = [0];
  let length = chunks[0].length;

  objects.forEach((object, index) => {
    offsets.push(length);
    const header = pdfText(`${index + 1} 0 obj\n`);
    const footer = pdfText("\nendobj\n");
    chunks.push(header, object, footer);
    length += header.length + object.length + footer.length;
  });

  const xrefOffset = length;
  const xref = [
    `xref\n0 ${objects.length + 1}`,
    "0000000000 65535 f ",
    ...offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `),
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>`,
    "startxref",
    String(xrefOffset),
    "%%EOF"
  ].join("\n");

  chunks.push(pdfText(xref));
  return Buffer.concat(chunks);
}
