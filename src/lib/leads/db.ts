import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  if (!db) {
    db = drizzle(neon(databaseUrl));
  }

  return db;
}
