import { users, urls, urlClicks, type User, type InsertUser, type Url, type InsertUrl, type InsertUrlClick } from "@shared/schema";
import { supabaseHelpers } from "./supabase";
import session from "express-session";
import MemoryStore from "memorystore";

const MemorySessionStore = MemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getUserUrls(userId: number, limit?: number, offset?: number): Promise<Url[]>;
  createUrl(url: InsertUrl & { userId: number }): Promise<Url>;
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
    this.sessionStore = new MemorySessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const user = await supabaseHelpers.getUserById(id);
      return user as User;
    } catch (error) {
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await supabaseHelpers.getUserByUsername(username);
    return user as User | undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await supabaseHelpers.getUserByEmail(email);
    return user as User | undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = await supabaseHelpers.createUser({
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email
    });
    return user as User;
  }

  async getUserUrls(userId: number, limit = 10, offset = 0): Promise<Url[]> {
    const urls = await supabaseHelpers.getUserUrls(userId, limit, offset);
    return urls as Url[];
  }

  async createUrl(url: InsertUrl & { userId: number }): Promise<Url> {
    const newUrl = await supabaseHelpers.createUrl({
      user_id: url.userId === 0 ? null : url.userId, // Handle anonymous URLs
      long_url: url.longUrl,
      short_id: url.shortId,
      custom_alias: url.customAlias || undefined,
      title: url.title || undefined,
      tags: url.tags || undefined
    });
    
    return newUrl as Url;
  }

  async getUrlByShortId(shortId: string): Promise<Url | undefined> {
    const url = await supabaseHelpers.getUrlByShortId(shortId);
    return url as Url | undefined;
  }

  async getUrlByCustomAlias(alias: string): Promise<Url | undefined> {
    const url = await supabaseHelpers.getUrlByCustomAlias(alias);
    return url as Url | undefined;
  }

  async updateUrl(id: number, updates: Partial<Url>): Promise<Url | undefined> {
    try {
      const url = await supabaseHelpers.updateUrl(id, updates);
      return url as Url;
    } catch (error) {
      return undefined;
    }
  }

  async deleteUrl(id: number, userId: number): Promise<boolean> {
    return await supabaseHelpers.deleteUrl(id, userId);
  }

  async incrementClickCount(urlId: number): Promise<void> {
    await supabaseHelpers.incrementClickCount(urlId);
  }

  async createUrlClick(click: InsertUrlClick): Promise<void> {
    await supabaseHelpers.createUrlClick({
      url_id: click.urlId,
      ip: click.ip || undefined,
      user_agent: click.userAgent || undefined,
      referrer: click.referrer || undefined
    });
  }

  async getUserStats(userId: number): Promise<{
    totalLinks: number;
    totalClicks: number;
    monthlyClicks: number;
  }> {
    return await supabaseHelpers.getUserStats(userId);
  }
}

export const storage = new DatabaseStorage();
