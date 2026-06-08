import { LEGACY_PERFORMANCE_ROWS } from "./generated-data";

const fallbackBrand = "Egyéb";
const fallbackCategory = "Közép";

export const BRAND_CATEGORY_MAP = Object.fromEntries(
  LEGACY_PERFORMANCE_ROWS.map((row) => [row.brand, row.category])
) as Record<string, string>;

export function getBrandCategory(brand: string) {
  return BRAND_CATEGORY_MAP[brand] ?? BRAND_CATEGORY_MAP[fallbackBrand] ?? fallbackCategory;
}
