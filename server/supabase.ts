import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://epcqeqcqqzzpolymqflm.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwY3FlcWNxcXp6cG9seW1xZmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTkxODksImV4cCI6MjA2NzgzNTE4OX0.1eEibQkblIem4TkAIkh9afrHiqm1EOURw3hvUDMjbLw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for Supabase operations
export const supabaseHelpers = {
  // Get user by ID
  async getUserById(id: number) {
    console.log("🔍 [SUPABASE] Getting user by ID:", id);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.log("❌ [SUPABASE] Error getting user by ID:", error);
      throw error;
    }
    
    console.log("✅ [SUPABASE] Raw user data from database:", data);
    
    // Transform snake_case to camelCase for frontend compatibility
    const transformedUser = {
      id: data.id,
      username: data.username,
      password: data.password,
      email: data.email,
      isPremium: data.is_premium,
      createdAt: data.created_at,
    };
    
    console.log("✅ [SUPABASE] Transformed user data:", transformedUser);
    return transformedUser;
  },

  // Get user by username
  async getUserByUsername(username: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) return null;
    
    // Transform snake_case to camelCase for frontend compatibility
    return {
      id: data.id,
      username: data.username,
      password: data.password,
      email: data.email,
      isPremium: data.is_premium,
      createdAt: data.created_at,
    };
  },

  // Get user by email
  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) return null;
    
    // Transform snake_case to camelCase for frontend compatibility
    return {
      id: data.id,
      username: data.username,
      password: data.password,
      email: data.email,
      isPremium: data.is_premium,
      createdAt: data.created_at,
    };
  },

  // Create user
  async createUser(userData: { username: string; password: string; email: string }) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform snake_case to camelCase for frontend compatibility
    return {
      id: data.id,
      username: data.username,
      password: data.password,
      email: data.email,
      isPremium: data.is_premium,
      createdAt: data.created_at,
    };
  },

  // Get URLs by user ID
  async getUserUrls(userId: number, limit = 10, offset = 0) {
    console.log("📋 [SUPABASE] Getting URLs for user:", { userId, limit, offset });
    
    const { data, error } = await supabase
      .from('urls')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error("❌ [SUPABASE] Error getting URLs:", error);
      throw error;
    }
    
    console.log("✅ [SUPABASE] Raw URLs from database:", data?.length || 0);
    
    // Transform snake_case to camelCase for frontend compatibility
    const transformedUrls = (data || []).map(url => ({
      id: url.id,
      userId: url.user_id,
      longUrl: url.long_url,
      shortId: url.short_id,
      customAlias: url.custom_alias,
      title: url.title,
      tags: url.tags,
      clickCount: url.click_count,
      createdAt: url.created_at,
      lastAccessedAt: url.last_accessed_at,
    }));
    
    console.log("✅ [SUPABASE] Transformed URLs:", transformedUrls.length);
    return transformedUrls;
  },

  // Get URL by short ID
  async getUrlByShortId(shortId: string) {
    const { data, error } = await supabase
      .from('urls')
      .select('*')
      .eq('short_id', shortId)
      .single();
    
    if (error) return null;
    
    // Transform snake_case to camelCase for frontend compatibility
    return {
      id: data.id,
      userId: data.user_id,
      longUrl: data.long_url,
      shortId: data.short_id,
      customAlias: data.custom_alias,
      title: data.title,
      tags: data.tags,
      clickCount: data.click_count,
      createdAt: data.created_at,
      lastAccessedAt: data.last_accessed_at,
    };
  },

  // Get URL by custom alias
  async getUrlByCustomAlias(alias: string) {
    const { data, error } = await supabase
      .from('urls')
      .select('*')
      .eq('custom_alias', alias)
      .single();
    
    if (error) return null;
    
    // Transform snake_case to camelCase for frontend compatibility
    return {
      id: data.id,
      userId: data.user_id,
      longUrl: data.long_url,
      shortId: data.short_id,
      customAlias: data.custom_alias,
      title: data.title,
      tags: data.tags,
      clickCount: data.click_count,
      createdAt: data.created_at,
      lastAccessedAt: data.last_accessed_at,
    };
  },

  // Create URL
  async createUrl(urlData: {
    user_id: number | null;
    long_url: string;
    short_id: string;
    custom_alias?: string;
    title?: string;
    tags?: string[];
  }) {
    console.log("📝 [SUPABASE] Creating URL with data:", urlData);
    
    const { data, error } = await supabase
      .from('urls')
      .insert(urlData)
      .select()
      .single();
    
    if (error) {
      console.error("❌ [SUPABASE] Error creating URL:", error);
      throw error;
    }
    
    console.log("✅ [SUPABASE] Raw data from database:", data);
    
    // Transform snake_case to camelCase for frontend compatibility
    const transformedData = {
      id: data.id,
      userId: data.user_id,
      longUrl: data.long_url,
      shortId: data.short_id,
      customAlias: data.custom_alias,
      title: data.title,
      tags: data.tags,
      clickCount: data.click_count,
      createdAt: data.created_at,
      lastAccessedAt: data.last_accessed_at,
    };
    
    console.log("🔄 [SUPABASE] Transformed data:", transformedData);
    return transformedData;
  },

  // Update URL
  async updateUrl(id: number, updates: any) {
    // Transform camelCase to snake_case for database
    const dbUpdates: any = {};
    if (updates.customAlias !== undefined) dbUpdates.custom_alias = updates.customAlias;
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.clickCount !== undefined) dbUpdates.click_count = updates.clickCount;
    if (updates.lastAccessedAt !== undefined) dbUpdates.last_accessed_at = updates.lastAccessedAt;

    const { data, error } = await supabase
      .from('urls')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform snake_case to camelCase for frontend compatibility
    return {
      id: data.id,
      userId: data.user_id,
      longUrl: data.long_url,
      shortId: data.short_id,
      customAlias: data.custom_alias,
      title: data.title,
      tags: data.tags,
      clickCount: data.click_count,
      createdAt: data.created_at,
      lastAccessedAt: data.last_accessed_at,
    };
  },

  // Delete URL
  async deleteUrl(id: number, userId: number) {
    const { error } = await supabase
      .from('urls')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    return !error;
  },

  // Increment click count
  async incrementClickCount(urlId: number) {
    // First get the current click count
    const { data: currentUrl, error: fetchError } = await supabase
      .from('urls')
      .select('click_count')
      .eq('id', urlId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Then update with incremented value
    const { error } = await supabase
      .from('urls')
      .update({ 
        click_count: (currentUrl?.click_count || 0) + 1,
        last_accessed_at: new Date().toISOString()
      })
      .eq('id', urlId);
    
    if (error) throw error;
  },

  // Create URL click
  async createUrlClick(clickData: {
    url_id: number;
    ip?: string;
    user_agent?: string;
    referrer?: string;
  }) {
    const { error } = await supabase
      .from('url_clicks')
      .insert(clickData);
    
    if (error) throw error;
  },

  // Get user stats
  async getUserStats(userId: number) {
    const { data, error } = await supabase
      .from('urls')
      .select('click_count, last_accessed_at')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    const totalLinks = data.length;
    const totalClicks = data.reduce((sum, url) => sum + (url.click_count || 0), 0);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const monthlyClicks = data
      .filter(url => url.last_accessed_at && new Date(url.last_accessed_at) >= thirtyDaysAgo)
      .reduce((sum, url) => sum + (url.click_count || 0), 0);
    
    return { totalLinks, totalClicks, monthlyClicks };
  }
}; 