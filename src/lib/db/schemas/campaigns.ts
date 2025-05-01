import { pgTable, text, timestamp, uuid, numeric } from "drizzle-orm/pg-core";

export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaign_title: text("campaign_title").notNull(),
  brand_name: text("brand_name").notNull(),
  start_date: timestamp("start_date").notNull(),
  end_date: timestamp("end_date").notNull(),
  budget: numeric("budget").notNull(),
  image_id: uuid("image_id"),
  campaign_description: text("campaign_description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
