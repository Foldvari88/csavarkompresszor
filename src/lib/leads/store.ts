import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { desc, eq, sql } from "drizzle-orm";
import { calculateLeadScore } from "@/lib/calculator/calculate";
import { getDb } from "./db";
import { leadEvents, leads } from "./schema";
import type {
  CalculationResult,
  LeadEmailEngagement,
  LeadFormInput,
  LeadRecord,
  LeadStatus
} from "@/lib/calculator/types";

const localStorePath = path.join(process.cwd(), "leads.local.json");

export class LeadStorageNotConfiguredError extends Error {
  constructor() {
    super(
      "A lead mentéshez production környezetben Neon adatbázis szükséges. Állítsd be a DATABASE_URL környezeti változót a Neon connection stringgel, majd deployold újra az appot."
    );
    this.name = "LeadStorageNotConfiguredError";
  }
}

export function getLeadStorageInfo() {
  if (process.env.DATABASE_URL) {
    return {
      mode: "database" as const,
      isPersistent: true,
      label: "Tartós Neon adatbázis aktív"
    };
  }

  return {
    mode: "local" as const,
    isPersistent: false,
    label: "Helyi teszt tárolás",
    message:
      "Productionben a leadek csak akkor jelennek meg tartósan az adminban, ha be van kötve a Neon DATABASE_URL. A helyi fájlos tárolás csak fejlesztéshez való."
  };
}

export async function createLead(input: LeadFormInput, result: CalculationResult) {
  const lead: LeadRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
    customerRating: null,
    engagement: createEmptyEngagement(),
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
      customerRating: lead.customerRating,
      emailOpenCount: lead.engagement.emailOpenCount,
      emailClickCount: lead.engagement.emailClickCount,
      reportDownloadCount: lead.engagement.reportDownloadCount,
      email: input.email,
      companyName: input.companyName,
      input,
      result
    });
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
    return rows.map((row) =>
      normalizeLeadRecord({
        id: row.id,
        createdAt: row.createdAt.toISOString(),
        status: row.status as LeadStatus,
        customerRating: row.customerRating ?? null,
        engagement: engagementFromRow(row),
        input: row.input as LeadFormInput,
        result: row.result as CalculationResult
      })
    );
  }

  return readLocalLeads();
}

export async function getLead(id: string): Promise<LeadRecord | null> {
  const db = getDb();
  if (db) {
    await ensureLeadTable();
    const [row] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
    if (!row) return null;
    return normalizeLeadRecord({
      id: row.id,
      createdAt: row.createdAt.toISOString(),
      status: row.status as LeadStatus,
      customerRating: row.customerRating ?? null,
      engagement: engagementFromRow(row),
      input: row.input as LeadFormInput,
      result: row.result as CalculationResult
    });
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

export async function updateLeadRating(id: string, customerRating: number | null) {
  const db = getDb();
  if (db) {
    await ensureLeadTable();
    await db.update(leads).set({ customerRating }).where(eq(leads.id, id));
    return;
  }

  const records = await readLocalLeads();
  await writeLocalLeads(
    records.map((lead) => (lead.id === id ? { ...lead, customerRating } : lead))
  );
}

export async function deleteLead(id: string) {
  const db = getDb();
  if (db) {
    await ensureLeadTable();
    await db.delete(leadEvents).where(eq(leadEvents.leadId, id));
    const deletedRows = await db.delete(leads).where(eq(leads.id, id)).returning({ id: leads.id });
    return deletedRows.length > 0;
  }

  const records = await readLocalLeads();
  const nextRecords = records.filter((lead) => lead.id !== id);
  await writeLocalLeads(nextRecords);
  return nextRecords.length !== records.length;
}

export async function recordLeadEngagementEvent({
  id,
  leadId,
  type,
  occurredAt = new Date(),
  metadata = {}
}: {
  id?: string;
  leadId: string;
  type: "email.opened" | "email.clicked" | "report.downloaded";
  occurredAt?: Date;
  metadata?: Record<string, unknown>;
}): Promise<{ recorded: boolean; lead: LeadRecord | null }> {
  const eventId = id ?? `${type}:${leadId}:${occurredAt.toISOString()}:${randomUUID()}`;
  const db = getDb();

  if (db) {
    await ensureLeadTable();
    const inserted = await db
      .insert(leadEvents)
      .values({
        id: eventId,
        leadId,
        type,
        occurredAt,
        metadata
      })
      .onConflictDoNothing()
      .returning({ id: leadEvents.id });

    if (inserted.length === 0) {
      return { recorded: false, lead: await getLead(leadId) };
    }

    await updateLeadEngagementSummary(leadId, type, occurredAt);
    return { recorded: true, lead: await getLead(leadId) };
  }

  const records = await readLocalLeads();
  let updatedLead: LeadRecord | null = null;
  const nextRecords = records.map((lead) => {
    if (lead.id !== leadId) return lead;
    updatedLead = applyEngagementEvent(lead, type, occurredAt);
    return updatedLead;
  });

  if (!updatedLead) {
    return { recorded: false, lead: null };
  }

  await writeLocalLeads(nextRecords);
  return { recorded: true, lead: updatedLead };
}

async function ensureLeadTable() {
  const db = getDb();
  if (!db) return;

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS leads (
      id text PRIMARY KEY,
      created_at timestamptz NOT NULL DEFAULT now(),
      status text NOT NULL DEFAULT 'new',
      customer_rating integer,
      email text NOT NULL,
      company_name text NOT NULL,
      input jsonb NOT NULL,
      result jsonb NOT NULL
    )
  `);

  await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS customer_rating integer`);
  await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS email_opened_at timestamptz`);
  await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS email_open_count integer NOT NULL DEFAULT 0`);
  await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS email_clicked_at timestamptz`);
  await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS email_click_count integer NOT NULL DEFAULT 0`);
  await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS report_downloaded_at timestamptz`);
  await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS report_download_count integer NOT NULL DEFAULT 0`);
  await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_email_event_at timestamptz`);
  await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_email_event_type text`);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS lead_events (
      id text PRIMARY KEY,
      lead_id text NOT NULL,
      type text NOT NULL,
      occurred_at timestamptz NOT NULL,
      metadata jsonb NOT NULL DEFAULT '{}'::jsonb
    )
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS lead_events_lead_id_occurred_at_idx
    ON lead_events (lead_id, occurred_at DESC)
  `);
}

async function readLocalLeads(): Promise<LeadRecord[]> {
  try {
    const raw = await fs.readFile(localStorePath, "utf8");
    const records = JSON.parse(raw.replace(/^\uFEFF/, "")) as Array<
      LeadRecord & { customerRating?: number | null; engagement?: Partial<LeadEmailEngagement> }
    >;
    return records.map((lead) =>
      normalizeLeadRecord({
        ...lead,
        customerRating: lead.customerRating ?? null,
        engagement: normalizeEngagement(lead.engagement)
      })
    );
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

function normalizeLeadRecord(lead: LeadRecord): LeadRecord {
  return {
    ...lead,
    engagement: normalizeEngagement(lead.engagement),
    result: {
      ...lead.result,
      leadScore: calculateLeadScore(lead.input, lead.result)
    }
  };
}

async function updateLeadEngagementSummary(
  leadId: string,
  type: "email.opened" | "email.clicked" | "report.downloaded",
  occurredAt: Date
) {
  const db = getDb();
  if (!db) return;

  const lastEventAt = sql`GREATEST(COALESCE(${leads.lastEmailEventAt}, ${occurredAt}), ${occurredAt})`;
  const baseSet = {
    lastEmailEventAt: lastEventAt,
    lastEmailEventType: type
  };

  if (type === "email.opened") {
    await db
      .update(leads)
      .set({
        ...baseSet,
        emailOpenedAt: sql`COALESCE(${leads.emailOpenedAt}, ${occurredAt})`,
        emailOpenCount: sql`${leads.emailOpenCount} + 1`
      })
      .where(eq(leads.id, leadId));
    return;
  }

  if (type === "email.clicked") {
    await db
      .update(leads)
      .set({
        ...baseSet,
        emailClickedAt: sql`COALESCE(${leads.emailClickedAt}, ${occurredAt})`,
        emailClickCount: sql`${leads.emailClickCount} + 1`
      })
      .where(eq(leads.id, leadId));
    return;
  }

  await db
    .update(leads)
    .set({
      ...baseSet,
      reportDownloadedAt: sql`COALESCE(${leads.reportDownloadedAt}, ${occurredAt})`,
      reportDownloadCount: sql`${leads.reportDownloadCount} + 1`
    })
    .where(eq(leads.id, leadId));
}

function applyEngagementEvent(
  lead: LeadRecord,
  type: "email.opened" | "email.clicked" | "report.downloaded",
  occurredAt: Date
): LeadRecord {
  const occurredAtIso = occurredAt.toISOString();
  const engagement = normalizeEngagement(lead.engagement);
  const next: LeadEmailEngagement = {
    ...engagement,
    lastEmailEventAt: latestIso(engagement.lastEmailEventAt, occurredAtIso),
    lastEmailEventType: type
  };

  if (type === "email.opened") {
    next.emailOpenedAt = engagement.emailOpenedAt ?? occurredAtIso;
    next.emailOpenCount = engagement.emailOpenCount + 1;
  } else if (type === "email.clicked") {
    next.emailClickedAt = engagement.emailClickedAt ?? occurredAtIso;
    next.emailClickCount = engagement.emailClickCount + 1;
  } else {
    next.reportDownloadedAt = engagement.reportDownloadedAt ?? occurredAtIso;
    next.reportDownloadCount = engagement.reportDownloadCount + 1;
  }

  return normalizeLeadRecord({ ...lead, engagement: next });
}

function engagementFromRow(row: typeof leads.$inferSelect): LeadEmailEngagement {
  return normalizeEngagement({
    emailOpenedAt: row.emailOpenedAt?.toISOString() ?? null,
    emailOpenCount: row.emailOpenCount,
    emailClickedAt: row.emailClickedAt?.toISOString() ?? null,
    emailClickCount: row.emailClickCount,
    reportDownloadedAt: row.reportDownloadedAt?.toISOString() ?? null,
    reportDownloadCount: row.reportDownloadCount,
    lastEmailEventAt: row.lastEmailEventAt?.toISOString() ?? null,
    lastEmailEventType: row.lastEmailEventType ?? null
  });
}

function normalizeEngagement(engagement?: Partial<LeadEmailEngagement>): LeadEmailEngagement {
  return {
    emailOpenedAt: engagement?.emailOpenedAt ?? null,
    emailOpenCount: engagement?.emailOpenCount ?? 0,
    emailClickedAt: engagement?.emailClickedAt ?? null,
    emailClickCount: engagement?.emailClickCount ?? 0,
    reportDownloadedAt: engagement?.reportDownloadedAt ?? null,
    reportDownloadCount: engagement?.reportDownloadCount ?? 0,
    lastEmailEventAt: engagement?.lastEmailEventAt ?? null,
    lastEmailEventType: engagement?.lastEmailEventType ?? null
  };
}

function createEmptyEngagement(): LeadEmailEngagement {
  return normalizeEngagement();
}

function latestIso(current: string | null, next: string) {
  if (!current) return next;
  return new Date(current).getTime() >= new Date(next).getTime() ? current : next;
}
