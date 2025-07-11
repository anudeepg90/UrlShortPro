import { users, urls, urlClicks, type User, type InsertUser, type Url, type InsertUrl, type InsertUrlClick } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getUserUrls(userId: number, limit?: number, offset?: number): Promise<Url[]>;
  createUrl(url: InsertUrl & { userId: number | null }): Promise<Url>;
  getUrlByShortId(shortId: string): Promise<Url | undefined>;
  getUrlByCustomAlias(alias: string): Promise<Url | undefined>;
  updateUrl(id: number, updates: Partial<Url>): Promise<Url | undefined>;
  deleteUrl(id: number, userId: number): Promise<boolean>;
  incrementClickCount(urlId: number): Promise<void>;
  
  createUrlClick(click: InsertUrlClick): Promise<void>;
  getUserStats(userId: number): Promise<{
    totalLinks: number;
    totalClicks: number;
    monthlyClicks: number;
  }>;
  
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getUserUrls(userId: number, limit = 10, offset = 0): Promise<Url[]> {
    return await db
      .select()
      .from(urls)
      .where(eq(urls.userId, userId))
      .orderBy(desc(urls.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async createUrl(url: InsertUrl & { userId: number }): Promise<Url> {
    const [newUrl] = await db
      .insert(urls)
      .values(url)
      .returning();
    return newUrl;
  }

  async getUrlByShortId(shortId: string): Promise<Url | undefined> {
    const [url] = await db.select().from(urls).where(eq(urls.shortId, shortId));
    return url || undefined;
  }

  async getUrlByCustomAlias(alias: string): Promise<Url | undefined> {
    const [url] = await db.select().from(urls).where(eq(urls.customAlias, alias));
    return url || undefined;
  }

  async updateUrl(id: number, updates: Partial<Url>): Promise<Url | undefined> {
    const [url] = await db
      .update(urls)
      .set(updates)
      .where(eq(urls.id, id))
      .returning();
    return url || undefined;
  }

  async deleteUrl(id: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(urls)
      .where(and(eq(urls.id, id), eq(urls.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async incrementClickCount(urlId: number): Promise<void> {
    await db
      .update(urls)
      .set({ 
        clickCount: sql`${urls.clickCount} + 1`,
        lastAccessedAt: new Date()
      })
      .where(eq(urls.id, urlId));
  }

  async createUrlClick(click: InsertUrlClick): Promise<void> {
    await db.insert(urlClicks).values(click);
  }

  async getUserStats(userId: number): Promise<{
    totalLinks: number;
    totalClicks: number;
    monthlyClicks: number;
  }> {
    const userUrls = await db
      .select({
        totalLinks: sql<number>`count(*)::int`,
        totalClicks: sql<number>`coalesce(sum(${urls.clickCount}), 0)::int`,
        monthlyClicks: sql<number>`coalesce(sum(case when ${urls.lastAccessedAt} >= current_date - interval '30 days' then ${urls.clickCount} else 0 end), 0)::int`,
      })
      .from(urls)
      .where(eq(urls.userId, userId));

    return userUrls[0] || { totalLinks: 0, totalClicks: 0, monthlyClicks: 0 };
  }
}

export const storage = new DatabaseStorage();
