import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "./db";
import { leads } from "./schema";
import type { CalculationResult, LeadFormInput, LeadRecord, LeadStatus } from "@/lib/calculator/types";

const localStorePath = path.join(process.cwd(), "leads.local.json");

type SupabaseLeadRow = {
  id: string;
  created_at: string;
  status: string;
  email: string;
  company_name: string;
  input: unknown;
  result: unknown;
};

export class LeadStorageNotConfiguredError extends Error {
  constructor() {
    super(
      "A lead mentéshez production környezetben adatbázis szükséges. Állítsd be a SUPABASE_URL és SUPABASE_SERVICE_ROLE_KEY változókat, vagy egy Neon DATABASE_URL-t, majd deployold újra az appot."
    );
    this.name = "LeadStorageNotConfiguredError";
  }
}

export function getLeadStorageInfo() {
  const databaseUrl = process.env.DATABASE_URL;
  const hasDatabase = Boolean(databaseUrl) && !databaseUrl?.includes(".supabase.co");
  const hasSupabase = hasSupabaseLeadStorage();

  if (hasDatabase) {
    return {
      mode: "database" as const,
      isPersistent: true,
      label: "Tartós Neon/Postgres adatbázis aktív"
    };
  }

  if (hasSupabase) {
    return {
      mode: "supabase" as const,
      isPersistent: true,
      label: "Tartós Supabase lead-tárolás aktív"
    };
  }

  return {
    mode: "local" as const,
    isPersistent: false,
    label: "Helyi teszt tárolás",
    message:
      "Productionben a leadek csak akkor jelennek meg tartósan az adminban, ha be van kötve egy Supabase/Postgres DATABASE_URL. A helyi fájlos tárolás csak fejlesztéshez való."
  };
}

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

  if (hasSupabaseLeadStorage()) {
    await insertSupabaseLead(lead);
    return lead;
  }

  if (isVercelWithoutDatabase()) {
    throw new LeadStorageNotConfiguredError();
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

  if (hasSupabaseLeadStorage()) {
    const rows = await requestSupabaseLeadRows("leads?select=*&order=created_at.desc");
    return rows.map(mapSupabaseLeadRow);
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

  if (hasSupabaseLeadStorage()) {
    const rows = await requestSupabaseLeadRows(`leads?select=*&id=eq.${encodeURIComponent(id)}&limit=1`);
    return rows[0] ? mapSupabaseLeadRow(rows[0]) : null;
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

  if (hasSupabaseLeadStorage()) {
    await requestSupabase(`leads?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: { Prefer: "return=minimal" }
    });
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

function isVercelWithoutDatabase() {
  return process.env.VERCEL === "1" && !getLeadStorageInfo().isPersistent;
}

function hasSupabaseLeadStorage() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function insertSupabaseLead(lead: LeadRecord) {
  await requestSupabase("leads", {
    method: "POST",
    body: JSON.stringify({
      id: lead.id,
      created_at: lead.createdAt,
      status: lead.status,
      email: lead.input.email,
      company_name: lead.input.companyName,
      input: lead.input,
      result: lead.result
    }),
    headers: { Prefer: "return=minimal" }
  });
}

async function requestSupabaseLeadRows(pathname: string) {
  return requestSupabase(pathname, { method: "GET" }) as Promise<SupabaseLeadRow[]>;
}

async function requestSupabase(pathname: string, init: RequestInit) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new LeadStorageNotConfiguredError();
  }

  const url = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/${pathname}`;
  const headers = new Headers(init.headers);
  headers.set("apikey", serviceRoleKey);
  headers.set("Authorization", `Bearer ${serviceRoleKey}`);
  headers.set("Content-Type", "application/json");

  const response = await fetch(url, {
    ...init,
    headers
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase lead tárolási hiba (${response.status}): ${detail}`);
  }

  if (response.status === 204) {
    return [];
  }

  const text = await response.text();
  return text ? JSON.parse(text) : [];
}

function mapSupabaseLeadRow(row: SupabaseLeadRow): LeadRecord {
  return {
    id: row.id,
    createdAt: new Date(row.created_at).toISOString(),
    status: row.status as LeadStatus,
    input: row.input as LeadFormInput,
    result: row.result as CalculationResult
  };
}
