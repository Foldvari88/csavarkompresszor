/** Normalize Hungarian mobile and landline notation without silently removing letters. */
export function normalizeHungarianPhone(value: string) {
  const phone = value.trim().replace(/[\s().-]/g, "");
  if (!phone) return "";
  if (phone.startsWith("0036")) return `+36${phone.slice(4)}`;
  if (phone.startsWith("06")) return `+36${phone.slice(2)}`;
  if (phone.startsWith("36") && /^\d{10,11}$/.test(phone)) return `+${phone}`;
  if (/^[1-9]\d{7,8}$/.test(phone)) return `+36${phone}`;
  return phone;
}

export function isValidHungarianPhone(value: string) {
  // HU landlines have 8 national digits; mobiles normally have 9.
  // This checks the format, not whether a number has been assigned or is reachable.
  return /^\+36[1-9]\d{7,8}$/.test(normalizeHungarianPhone(value));
}
