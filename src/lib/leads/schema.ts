import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  status: text("status").notNull().default("new"),
  customerRating: integer("customer_rating"),
  email: text("email").notNull(),
  companyName: text("company_name").notNull(),
  input: jsonb("input").notNull(),
  result: jsonb("result").notNull()
});
