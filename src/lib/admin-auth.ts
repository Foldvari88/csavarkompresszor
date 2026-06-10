export const ADMIN_SESSION_COOKIE = "csavarkompresszor_admin_session";

const sessionMaxAgeSeconds = 60 * 60 * 8;

export function getAdminSessionMaxAgeSeconds() {
  return sessionMaxAgeSeconds;
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "admin"
  };
}

export function isValidAdminCredentials(username: string, password: string) {
  const credentials = getAdminCredentials();
  return username === credentials.username && password === credentials.password;
}

export async function createAdminSessionToken() {
  const credentials = getAdminCredentials();
  const secret = process.env.ADMIN_SESSION_SECRET ?? credentials.password;
  return sha256Hex(`${credentials.username}:${credentials.password}:${secret}`);
}

export async function verifyAdminSessionToken(token?: string) {
  if (!token) return false;
  return token === (await createAdminSessionToken());
}

async function sha256Hex(value: string) {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
