const compairPromotionEndsAt = Date.parse("2026-09-30T21:59:59Z");

export function isCompairPromotionActive(now = Date.now()) {
  return now <= compairPromotionEndsAt;
}
