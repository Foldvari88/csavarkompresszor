import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { desc, eq, sql } from "drizzle-orm";
import type { EmailDeliveryReport } from "@/lib/email-delivery";
import { getDb } from "@/lib/leads/db";
import { campaignInquiries } from "@/lib/leads/schema";
import { LeadStorageNotConfiguredError } from "@/lib/leads/store";
import type { CampaignInquiryInput, CampaignInquiryRecord } from "./types";

const localStorePath = path.join(process.cwd(), "campaign-inquiries.local.json");

export async function createCampaignInquiry(input: CampaignInquiryInput) {
  const inquiry: CampaignInquiryRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
    input
  };

  const db = getDb();
  if (db) {
    await ensureCampaignInquiryTable();
    await db.insert(campaignInquiries).values({
      id: inquiry.id,
      createdAt: new Date(inquiry.createdAt),
      status: inquiry.status,
      kind: input.kind,
      email: input.email ?? null,
      phone: input.phone ?? null,
      companyName: input.companyName,
      input
    });
    return inquiry;
  }

  if (process.env.VERCEL === "1") {
    throw new LeadStorageNotConfiguredError();
  }

  const records = await readLocalCampaignInquiries();
  records.unshift(inquiry);
  await fs.writeFile(localStorePath, JSON.stringify(records, null, 2), "utf8");
  return inquiry;
}

export async function listCampaignInquiries(): Promise<CampaignInquiryRecord[]> {
  const db = getDb();
  if (db) {
    await ensureCampaignInquiryTable();
    const rows = await db
      .select()
      .from(campaignInquiries)
      .orderBy(desc(campaignInquiries.createdAt));

    return rows.map((row) => ({
      id: row.id,
      createdAt: row.createdAt.toISOString(),
      status: row.status as CampaignInquiryRecord["status"],
      input: row.input as CampaignInquiryInput,
      emailDelivery: row.emailDelivery as EmailDeliveryReport | null
    }));
  }

  return readLocalCampaignInquiries();
}

export async function recordCampaignEmailDelivery(id: string, emailDelivery: EmailDeliveryReport) {
  const db = getDb();
  if (db) {
    await ensureCampaignInquiryTable();
    await db.update(campaignInquiries).set({ emailDelivery }).where(eq(campaignInquiries.id, id));
    return;
  }
  const records = await readLocalCampaignInquiries();
  await fs.writeFile(localStorePath, JSON.stringify(records.map(item => item.id === id ? { ...item, emailDelivery } : item), null, 2), "utf8");
}

async function ensureCampaignInquiryTable() {
  const db = getDb();
  if (!db) return;

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS campaign_inquiries (
      id text PRIMARY KEY,
      created_at timestamptz NOT NULL DEFAULT now(),
      status text NOT NULL DEFAULT 'new',
      kind text NOT NULL,
      email text,
      phone text,
      company_name text NOT NULL,
      input jsonb NOT NULL
    )
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS campaign_inquiries_created_at_idx
    ON campaign_inquiries (created_at DESC)
  `);
  await db.execute(sql`ALTER TABLE campaign_inquiries ADD COLUMN IF NOT EXISTS email_delivery jsonb`);
}

async function readLocalCampaignInquiries(): Promise<CampaignInquiryRecord[]> {
  try {
    const raw = await fs.readFile(localStorePath, "utf8");
    return JSON.parse(raw.replace(/^\uFEFF/, "")) as CampaignInquiryRecord[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}
