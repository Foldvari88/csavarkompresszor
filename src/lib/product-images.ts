import { readFileSync } from "node:fs";
import path from "node:path";
import type { CompressorModel } from "@/lib/calculator/types";

export type CompressorProductImage = {
  alt: string;
  publicPath: string;
  localPath: string;
  sourcePageUrl: string;
  sourceImageUrl: string;
};

const productImageBasePath = "/images/compair-products";

const imageByKey = {
  l05: {
    fileName: "l05.jpg",
    alt: "CompAir L02-L06 csavarkompresszor termékfotó",
    sourcePageUrl: "https://www.compair.com/en/rotary-screw-air-compressors/2-5kw/",
    sourceImageUrl:
      "https://azure-na-images.contentstack.com/v3/assets/blta76611689adb5848/blt1d94972ed1ee765b/67ef8c792b1def6703689950/L03-benefitsff13.png"
  },
  l07L22: {
    fileName: "l07-l22.jpg",
    alt: "CompAir L07-L22 RS csavarkompresszor termékfotó",
    sourcePageUrl: "https://www.compair.com/en/rotary-screw-air-compressors/7-22kw/",
    sourceImageUrl:
      "https://azure-na-images.contentstack.com/v3/assets/blta76611689adb5848/blt7baf04bfd8a24e5c/67ef8cbb2b1def597e689962/L22RS_right.png"
  },
  l23L29: {
    fileName: "l23-l29.jpg",
    alt: "CompAir L23-L29 RS csavarkompresszor termékfotó",
    sourcePageUrl: "https://www.compair.com/en/rotary-screw-air-compressors/23-29kw/",
    sourceImageUrl:
      "https://azure-na-images.contentstack.com/v3/assets/blta76611689adb5848/bltbcd5927e282cab35/67ef8c7f226f4cc6fc07fd5f/L23_RSv2_Delcos_Pro_SE.png"
  },
  l30L37: {
    fileName: "l30-l37.jpg",
    alt: "CompAir L30-L37 csavarkompresszor termékfotó",
    sourcePageUrl: "https://www.compair.com/en/rotary-screw-air-compressors/30-45kw/",
    sourceImageUrl:
      "https://azure-na-images.contentstack.com/v3/assets/blta76611689adb5848/blt848b81792e0fb5df/67ef8c8fedd8a936ca31b54b/CompAir_frame3_air-compressor-30-45kW-r2.png"
  },
  l45: {
    fileName: "l45.jpg",
    alt: "CompAir L45 csavarkompresszor termékfotó",
    sourcePageUrl: "https://www.compair.com/en/rotary-screw-air-compressors/new-generation-l45-l55kw/",
    sourceImageUrl:
      "https://azure-na-images.contentstack.com/v3/assets/blta76611689adb5848/blt9490746ca854f305/68e7a86051c8c8b37ee44a6f/24677-CompAir-META-Compressor-L45FC-front.jpg"
  },
  l55: {
    fileName: "l55.jpg",
    alt: "CompAir L55 csavarkompresszor termékfotó",
    sourcePageUrl: "https://www.compair.com/en/rotary-screw-air-compressors/new-generation-l45-l55kw/",
    sourceImageUrl:
      "https://azure-na-images.contentstack.com/v3/assets/blta76611689adb5848/blt648eaf6b26a5a01c/68e7a861d8631e7033866736/24677-CompAir-META-Compressor-L55FC-front.jpg"
  },
  l75: {
    fileName: "l75.jpg",
    alt: "CompAir L75 RS csavarkompresszor termékfotó",
    sourcePageUrl: "https://www.compair.com/en/rotary-screw-air-compressors/55-75kw/",
    sourceImageUrl:
      "https://azure-na-images.contentstack.com/v3/assets/blta76611689adb5848/bltd5aeded2cff9cb88/67ef89c1d3155a07dfe7608f/23431-CompAir-Frame-4-L75-RS-front-left-new.jpg"
  },
  l90: {
    fileName: "l90.jpg",
    alt: "CompAir L90 RS csavarkompresszor termékfotó",
    sourcePageUrl: "https://www.compair.com/en/rotary-screw-air-compressors/90-132kw/",
    sourceImageUrl:
      "https://azure-na-images.contentstack.com/v3/assets/blta76611689adb5848/blt5aada452c9920859/67ef89e8e79e2491358a8cab/l90rs_m.jpg"
  },
  l110: {
    fileName: "l110.jpg",
    alt: "CompAir L110 csavarkompresszor termékfotó",
    sourcePageUrl: "https://www.compair.com/en/rotary-screw-air-compressors/90-132kw/",
    sourceImageUrl:
      "https://azure-na-images.contentstack.com/v3/assets/blta76611689adb5848/blt682ec3e0bf65f6ad/67ef89b2d3155a94fbe76083/CompAir-Frame-6-L110FC-left.jpg"
  },
  l132: {
    fileName: "l132.jpg",
    alt: "CompAir L132FC-RS csavarkompresszor termékfotó",
    sourcePageUrl: "https://www.compair.com/en/rotary-screw-air-compressors/90-132kw/",
    sourceImageUrl:
      "https://azure-na-images.contentstack.com/v3/assets/blta76611689adb5848/blt308fe5177e4a5b25/67ef89e2a83ed3430c78a77c/CompAir-Frame-6-L132FC-RS-right_(1).jpg"
  },
  l160: {
    fileName: "l160.jpg",
    alt: "CompAir L160FC csavarkompresszor termékfotó",
    sourcePageUrl: "https://www.compair.com/en-ee/rotary-screw-air-compressors/160-250kw",
    sourceImageUrl:
      "https://azure-na-images.contentstack.com/v3/assets/blta76611689adb5848/blt5986d0dd3d1100c2/67ef897c34843da55c677412/CompAir-Frame-6-160FC-right.jpg"
  },
  l250: {
    fileName: "l250.jpg",
    alt: "CompAir L250FC RS csavarkompresszor termékfotó",
    sourcePageUrl: "https://www.compair.com/en-ee/rotary-screw-air-compressors/160-250kw",
    sourceImageUrl:
      "https://azure-na-images.contentstack.com/v3/assets/blta76611689adb5848/blt53ef86867d75ebe8/67ef897d916a5b4f216a39c2/CompAir-Frame-6-L250FC-RS-left.jpg"
  }
} as const;

export function getCompressorProductImage(model: CompressorModel): CompressorProductImage {
  const definition = getImageDefinition(model);
  const publicPath = `${productImageBasePath}/${definition.fileName}`;

  return {
    alt: definition.alt,
    publicPath,
    localPath: path.join(process.cwd(), "public", publicPath.slice(1)),
    sourcePageUrl: definition.sourcePageUrl,
    sourceImageUrl: definition.sourceImageUrl
  };
}

export function getCompressorProductImageUrl(model: CompressorModel) {
  return `${getSiteUrl()}${getCompressorProductImage(model).publicPath}`;
}

export function getCompressorProductImageDataUri(model: CompressorModel) {
  const image = getCompressorProductImage(model);
  return `data:image/jpeg;base64,${readFileSync(image.localPath).toString("base64")}`;
}

function getImageDefinition(model: CompressorModel) {
  const kw = model.nominalKw;

  if (kw <= 5.5) return imageByKey.l05;
  if (kw <= 22) return imageByKey.l07L22;
  if (kw < 30) return imageByKey.l23L29;
  if (kw <= 37) return imageByKey.l30L37;
  if (kw === 45) return imageByKey.l45;
  if (kw === 55) return imageByKey.l55;
  if (kw === 75) return imageByKey.l75;
  if (kw === 90) return imageByKey.l90;
  if (kw === 110) return imageByKey.l110;
  if (kw === 132) return imageByKey.l132;
  if (kw <= 200) return imageByKey.l160;
  return imageByKey.l250;
}

function getSiteUrl() {
  if (process.env.NODE_ENV !== "production") {
    return process.env.NEXT_PUBLIC_SITE_URL ?? process.env.APP_URL ?? "http://127.0.0.1:3002";
  }

  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.APP_URL ??
    "https://csavarkompresszorkalkulator.hu";

  return rawUrl.replace(/\/$/, "");
}
