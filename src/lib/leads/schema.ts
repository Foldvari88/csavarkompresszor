import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  status: text("status").notNull().default("new"),
  customerRating: integer("customer_rating"),
  emailOpenedAt: timestamp("email_opened_at", { withTimezone: true }),
  emailOpenCount: integer("email_open_count").notNull().default(0),
  emailClickedAt: timestamp("email_clicked_at", { withTimezone: true }),
  emailClickCount: integer("email_click_count").notNull().default(0),
  reportDownloadedAt: timestamp("report_downloaded_at", { withTimezone: true }),
  reportDownloadCount: integer("report_download_count").notNull().default(0),
  lastEmailEventAt: timestamp("last_email_event_at", { withTimezone: true }),
  lastEmailEventType: text("last_email_event_type"),
  email: text("email").notNull(),
  companyName: text("company_name").notNull(),
  input: jsonb("input").notNull(),
  result: jsonb("result").notNull()
});

export const leadEvents = pgTable("lead_events", {
  id: text("id").primaryKey(),
  leadId: text("lead_id").notNull(),
  type: text("type").notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
  metadata: jsonb("metadata").notNull().default({})
});
