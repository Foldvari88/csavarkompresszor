import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "./db";
import { leads } from "./schema";
import type { CalculationResult, LeadFormInput, LeadRecord, LeadStatus } from "@/lib/calculator/types";

const localStorePath = path.join(process.cwd(), "leads.local.json");

export async function createLead(input: LeadFormInput, result: CalculationResult) {
  const lead: LeadRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
    input,
    result
  };

  const db = getDb();
  if (db) {
    await ensureLeadTable();
    await db.insert(leads).values({
      id: lead.id,
      createdAt: new Date(lead.createdAt),
      status: lead.status,
      email: input.email,
      companyName: input.companyName,
      input,
      result
    });
    return lead;
  }

  const records = await readLocalLeads();
  records.unshift(lead);
  await writeLocalLeads(records);
  return lead;
}

export async function listLeads(): Promise<LeadRecord[]> {
  const db = getDb();
  if (db) {
    await ensureLeadTable();
    const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));
    return rows.map((row) => ({
      id: row.id,
      createdAt: row.createdAt.toISOString(),
      status: row.status as LeadStatus,
      input: row.input as LeadFormInput,
      result: row.result as CalculationResult
    }));
  }

  return readLocalLeads();
}

export async function getLead(id: string): Promise<LeadRecord | null> {
  const db = getDb();
  if (db) {
    await ensureLeadTable();
    const [row] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
    if (!row) return null;
    return {
      id: row.id,
      createdAt: row.createdAt.toISOString(),
      status: row.status as LeadStatus,
      input: row.input as LeadFormInput,
      result: row.result as CalculationResult
    };
  }

  const records = await readLocalLeads();
  return records.find((lead) => lead.id === id) ?? null;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const db = getDb();
  if (db) {
    await ensureLeadTable();
    await db.update(leads).set({ status }).where(eq(leads.id, id));
    return;
  }

  const records = await readLocalLeads();
  await writeLocalLeads(records.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
}

async function ensureLeadTable() {
  const db = getDb();
  if (!db) return;

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS leads (
      id text PRIMARY KEY,
      created_at timestamptz NOT NULL DEFAULT now(),
      status text NOT NULL DEFAULT 'new',
      email text NOT NULL,
      company_name text NOT NULL,
      input jsonb NOT NULL,
      result jsonb NOT NULL
    )
  `);
}

async function readLocalLeads(): Promise<LeadRecord[]> {
  try {
    const raw = await fs.readFile(localStorePath, "utf8");
    return JSON.parse(raw.replace(/^\uFEFF/, "")) as LeadRecord[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeLocalLeads(records: LeadRecord[]) {
  await fs.writeFile(localStorePath, JSON.stringify(records, null, 2), "utf8");
}
