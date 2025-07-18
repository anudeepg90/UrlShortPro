import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://epcqeqcqqzzpolymqflm.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwY3FlcWNxcXp6cG9seW1xZmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTkxODksImV4cCI6MjA2NzgzNTE4OX0.1eEibQkblIem4TkAIkh9afrHiqm1EOURw3hvUDMjbLw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for Supabase operations
export const supabaseHelpers = {
  // Get user by ID
  async getUserById(id: number) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    // Transform snake_case to camelCase for frontend compatibility
    const transformedUser = {
      id: data.id,
      username: data.username,
      password: data.password,
      email: data.email,
      isPremium: data.is_premium,
      membershipStartDate: data.membership_start_date,
      membershipEndDate: data.membership_end_date,
      stripeCustomerId: data.stripe_customer_id,
      stripeSubscriptionId: data.stripe_subscription_id,
      createdAt: data.created_at,
    };
    
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
      membershipStartDate: data.membership_start_date,
      membershipEndDate: data.membership_end_date,
      stripeCustomerId: data.stripe_customer_id,
      stripeSubscriptionId: data.stripe_subscription_id,
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
      membershipStartDate: data.membership_start_date,
      membershipEndDate: data.membership_end_date,
      stripeCustomerId: data.stripe_customer_id,
      stripeSubscriptionId: data.stripe_subscription_id,
      createdAt: data.created_at,
    };
  },

  // Create user
  async createUser(userData: { username: string; password: string; email: string }) {
    try {
      console.log("🔧 [SUPABASE] Creating user with data:", { username: userData.username, email: userData.email });
      
      // All users are created as premium by default
      const userDataWithPremium = {
        ...userData,
        is_premium: true,
        membership_start_date: new Date().toISOString(),
        // membership_end_date is NULL by default (no expiration)
      };
      
      console.log("🔧 [SUPABASE] User data with premium:", userDataWithPremium);
      
      const { data, error } = await supabase
        .from('users')
        .insert(userDataWithPremium)
        .select()
        .single();
      
      if (error) {
        console.error("❌ [SUPABASE] Error creating user:", error);
        throw error;
      }
      
      console.log("✅ [SUPABASE] User created successfully:", data);
      
      // Transform snake_case to camelCase for frontend compatibility
      return {
        id: data.id,
        username: data.username,
        password: data.password,
        email: data.email,
        isPremium: data.is_premium,
        membershipStartDate: data.membership_start_date,
        membershipEndDate: data.membership_end_date,
        stripeCustomerId: data.stripe_customer_id,
        stripeSubscriptionId: data.stripe_subscription_id,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error("❌ [SUPABASE] createUser error:", error);
      throw error;
    }
  },

  // Get URLs by user ID
  async getUserUrls(userId: number, limit = 10, offset = 0) {
    const { data, error } = await supabase
      .from('urls')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      throw error;
    }
    
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
    const { data, error } = await supabase
      .from('urls')
      .insert(urlData)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
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
    try {
      // Get total links
      const { count: totalLinks } = await supabase
        .from('urls')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get total clicks
      const { data: urls } = await supabase
        .from('urls')
        .select('click_count')
        .eq('user_id', userId);

      const totalClicks = urls?.reduce((sum, url) => sum + (url.click_count || 0), 0) || 0;

      // Get monthly clicks (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: monthlyClicksData } = await supabase
        .from('url_clicks')
        .select('*')
        .eq('url_id', userId)
        .gte('created_at', thirtyDaysAgo.toISOString());

      const monthlyClicks = monthlyClicksData?.length || 0;

      return {
        totalLinks: totalLinks || 0,
        totalClicks,
        monthlyClicks,
      };
    } catch (error) {
      console.error("Error getting user stats:", error);
      return {
        totalLinks: 0,
        totalClicks: 0,
        monthlyClicks: 0,
      };
    }
  },

  async getUrlAnalytics(urlId: number, userId: number) {
    try {
      // First, verify the URL belongs to the user
      const { data: urlData, error: urlError } = await supabase
        .from('urls')
        .select('*')
        .eq('id', urlId)
        .eq('user_id', userId)
        .single();

      if (urlError || !urlData) {
        return null;
      }

      // Transform URL data
      const url = {
        id: urlData.id,
        userId: urlData.user_id,
        longUrl: urlData.long_url,
        shortId: urlData.short_id,
        customAlias: urlData.custom_alias,
        title: urlData.title,
        tags: urlData.tags,
        clickCount: urlData.click_count,
        createdAt: urlData.created_at,
        lastAccessedAt: urlData.last_accessed_at,
      };

      // Get recent clicks
      const { data: recentClicksData } = await supabase
        .from('url_clicks')
        .select('*')
        .eq('url_id', urlId)
        .order('created_at', { ascending: false })
        .limit(10);

      const recentClicks = (recentClicksData || []).map(click => ({
        id: click.id,
        ip: click.ip || 'Unknown',
        userAgent: click.user_agent || 'Unknown',
        referrer: click.referrer || 'Direct',
        createdAt: click.created_at,
      }));

      // Get clicks by day (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: clicksByDayData } = await supabase
        .from('url_clicks')
        .select('created_at')
        .eq('url_id', urlId)
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Group clicks by day
      const clicksByDayMap = new Map<string, number>();
      (clicksByDayData || []).forEach(click => {
        const date = new Date(click.created_at).toISOString().split('T')[0];
        clicksByDayMap.set(date, (clicksByDayMap.get(date) || 0) + 1);
      });

      const clicksByDay = Array.from(clicksByDayMap.entries()).map(([date, clicks]) => ({
        date,
        clicks,
      })).sort((a, b) => a.date.localeCompare(b.date));

      // Get top referrers
      const { data: referrersData } = await supabase
        .from('url_clicks')
        .select('referrer')
        .eq('url_id', urlId)
        .not('referrer', 'is', null);

      const referrerCounts = new Map<string, number>();
      (referrersData || []).forEach(click => {
        const referrer = click.referrer || 'Direct';
        referrerCounts.set(referrer, (referrerCounts.get(referrer) || 0) + 1);
      });

      const topReferrers = Array.from(referrerCounts.entries())
        .map(([referrer, clicks]) => ({ referrer, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5);

      // Get device breakdown
      const { data: devicesData } = await supabase
        .from('url_clicks')
        .select('user_agent')
        .eq('url_id', urlId)
        .not('user_agent', 'is', null);

      const deviceCounts = new Map<string, number>();
      (devicesData || []).forEach(click => {
        const userAgent = click.user_agent || 'Unknown';
        let device = 'Unknown';
        
        if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
          device = 'Mobile';
        } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
          device = 'Tablet';
        } else if (userAgent.includes('Windows') || userAgent.includes('Mac') || userAgent.includes('Linux')) {
          device = 'Desktop';
        }
        
        deviceCounts.set(device, (deviceCounts.get(device) || 0) + 1);
      });

      const deviceBreakdown = Array.from(deviceCounts.entries())
        .map(([device, clicks]) => ({ device, clicks }))
        .sort((a, b) => b.clicks - a.clicks);

      // Calculate metrics
      const totalClicks = urlData.click_count || 0;
      const uniqueVisitors = recentClicksData?.length || 0;
      const clickThroughRate = totalClicks > 0 ? Math.round((uniqueVisitors / totalClicks) * 100) : 0;

      return {
        url,
        totalClicks,
        uniqueVisitors,
        clickThroughRate,
        recentClicks,
        clicksByDay,
        topReferrers,
        deviceBreakdown,
      };
    } catch (error) {
      console.error("Error getting URL analytics:", error);
      return null;
    }
  },
}; 