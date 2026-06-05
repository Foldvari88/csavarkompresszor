import type { CompressorModel } from "@/lib/calculator/types";

export function formatHuf(value: number) {
  return new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number, digits = 0) {
  return new Intl.NumberFormat("hu-HU", {
    maximumFractionDigits: digits
  }).format(value);
}

export function formatKw(value: number) {
  return `${formatNumber(value, value % 1 === 0 ? 0 : 1)} kW`;
}

export function formatCompressorModel(model: CompressorModel) {
  return `${model.brand} ${model.model}`;
}
