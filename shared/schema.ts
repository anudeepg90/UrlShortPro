import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isPremium: boolean("is_premium").notNull().default(true), // All users are premium by default
  membershipStartDate: timestamp("membership_start_date").notNull().defaultNow(),
  membershipEndDate: timestamp("membership_end_date"), // NULL means no expiration
  stripeCustomerId: text("stripe_customer_id"), // For future Stripe integration
  stripeSubscriptionId: text("stripe_subscription_id"), // For future Stripe integration
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const urls = pgTable("urls", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  longUrl: text("long_url").notNull(),
  shortId: text("short_id").notNull().unique(),
  customAlias: text("custom_alias").unique(),
  title: text("title"),
  tags: text("tags").array(),
  clickCount: integer("click_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastAccessedAt: timestamp("last_accessed_at"),
});

export const urlClicks = pgTable("url_clicks", {
  id: serial("id").primaryKey(),
  urlId: integer("url_id").notNull().references(() => urls.id, { onDelete: "cascade" }),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
});

export const usersRelations = relations(users, ({ many }) => ({
  urls: many(urls),
}));

export const urlsRelations = relations(urls, ({ one, many }) => ({
  user: one(users, {
    fields: [urls.userId],
    references: [users.id],
  }),
  clicks: many(urlClicks),
}));

export const urlClicksRelations = relations(urlClicks, ({ one }) => ({
  url: one(urls, {
    fields: [urlClicks.urlId],
    references: [urls.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertUrlSchema = createInsertSchema(urls).omit({
  id: true,
  clickCount: true,
  createdAt: true,
  lastAccessedAt: true,
});

export const insertUrlClickSchema = createInsertSchema(urlClicks).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertUrl = z.infer<typeof insertUrlSchema>;
export type Url = typeof urls.$inferSelect;
export type InsertUrlClick = z.infer<typeof insertUrlClickSchema>;
export type UrlClick = typeof urlClicks.$inferSelect;
