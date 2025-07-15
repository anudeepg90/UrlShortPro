import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertUrlSchema } from "@shared/schema";
import { z } from "zod";

function generateShortId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function extractTitle(url: string): string {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch {
    return 'Shortened Link';
  }
}

// Create a schema for frontend input (excludes server-generated fields)
const frontendUrlSchema = z.object({
  longUrl: z.string().url("Please enter a valid URL"),
  customAlias: z.string().optional(),
  title: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Forgot password endpoint (placeholder - would normally send email)
  app.post("/api/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // In a real application, you would:
      // 1. Check if user exists
      // 2. Generate a secure reset token
      // 3. Store token in database with expiration
      // 4. Send email with reset link
      
      // For demo purposes, we'll just return success
      res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      res.status(500).json({ message: "Failed to process password reset" });
    }
  });

  // Public URL shortening (no auth required)
  app.post("/api/shorten/public", async (req, res) => {
    console.log("🔗 [PUBLIC] Shorten request received:", req.body);
    
    try {
      const { longUrl, customAlias } = req.body;
      
      if (!longUrl) {
        console.log("❌ [PUBLIC] No URL provided");
        return res.status(400).json({ message: "URL is required" });
      }

      // Validate URL format
      try {
        new URL(longUrl);
      } catch {
        console.log("❌ [PUBLIC] Invalid URL format:", longUrl);
        return res.status(400).json({ message: "Invalid URL format" });
      }

      // Check if custom alias is provided and available
      if (customAlias) {
        console.log("🔍 [PUBLIC] Checking custom alias:", customAlias);
        const existing = await storage.getUrlByCustomAlias(customAlias);
        if (existing) {
          console.log("❌ [PUBLIC] Custom alias already taken");
          return res.status(400).json({ message: "Custom alias already taken" });
        }
      }

      // Generate unique short ID
      let shortId: string;
      let attempts = 0;
      do {
        shortId = customAlias || generateShortId();
        attempts++;
        console.log(`🔄 [PUBLIC] Generated shortId attempt ${attempts}:`, shortId);
      } while (!customAlias && await storage.getUrlByShortId(shortId) && attempts < 10);

      if (attempts >= 10) {
        console.log("❌ [PUBLIC] Failed to generate unique shortId after 10 attempts");
        return res.status(500).json({ message: "Failed to generate unique short ID" });
      }

      console.log("✅ [PUBLIC] Final shortId:", shortId);

      const urlData = {
        longUrl,
        shortId,
        customAlias: customAlias || undefined,
        title: extractTitle(longUrl),
        tags: [],
        userId: 0, // Anonymous URL (user ID 0 represents anonymous)
      };

      console.log("📝 [PUBLIC] Creating URL with data:", urlData);

      const url = await storage.createUrl(urlData);
      console.log("✅ [PUBLIC] URL created successfully:", { id: url.id, shortId: url.shortId, customAlias: url.customAlias });

      res.status(201).json(url);
    } catch (error) {
      console.error("❌ [PUBLIC] Error in shorten endpoint:", error);
      res.status(500).json({ message: "Failed to shorten URL" });
    }
  });

  // Shorten URL endpoint (authenticated users)
  app.post("/api/shorten", async (req, res) => {
    console.log("🔗 [AUTH] ===== SHORTEN ENDPOINT HIT =====");
    console.log("🔗 [AUTH] Request headers:", req.headers);
    console.log("🔗 [AUTH] Session:", req.session);
    console.log("🔗 [AUTH] Is authenticated:", req.isAuthenticated());
    console.log("🔗 [AUTH] User:", req.user);
    console.log("🔗 [AUTH] Shorten request received:", { body: req.body, user: req.user });
    
    if (!req.isAuthenticated()) {
      console.log("❌ [AUTH] User not authenticated");
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const data = frontendUrlSchema.parse(req.body);
      const user = req.user!;
      console.log("✅ [AUTH] Data validated, user:", { userId: user.id, username: user.username });

      // Check if custom alias is provided and user is premium
      if (data.customAlias && !user.isPremium) {
        console.log("❌ [AUTH] Custom alias requested but user not premium");
        return res.status(403).json({ message: "Custom aliases require premium subscription" });
      }

      // Check if custom alias is already taken
      if (data.customAlias) {
        console.log("🔍 [AUTH] Checking custom alias:", data.customAlias);
        const existing = await storage.getUrlByCustomAlias(data.customAlias);
        if (existing) {
          console.log("❌ [AUTH] Custom alias already taken");
          return res.status(400).json({ message: "Custom alias already taken" });
        }
      }

      // Generate unique short ID
      let shortId: string;
      let attempts = 0;
      do {
        shortId = generateShortId();
        attempts++;
        console.log(`🔄 [AUTH] Generated shortId attempt ${attempts}:`, shortId);
      } while (await storage.getUrlByShortId(shortId) && attempts < 10);

      if (attempts >= 10) {
        console.log("❌ [AUTH] Failed to generate unique shortId after 10 attempts");
        return res.status(500).json({ message: "Failed to generate unique short ID" });
      }

      console.log("✅ [AUTH] Final shortId:", shortId);

      const urlData = {
        ...data,
        userId: user.id,
        shortId,
        title: data.title || extractTitle(data.longUrl),
        tags: data.tags || [],
      };

      console.log("📝 [AUTH] Creating URL with data:", urlData);

      const url = await storage.createUrl(urlData);
      console.log("✅ [AUTH] URL created successfully:", { id: url.id, shortId: url.shortId, customAlias: url.customAlias });

      res.status(201).json(url);
    } catch (error) {
      console.error("❌ [AUTH] Error in shorten endpoint:", error);
      if (error instanceof z.ZodError) {
        console.log("❌ [AUTH] Validation error:", error.errors);
        return res.status(400).json({ message: "Invalid input data" });
      }
      res.status(500).json({ message: "Failed to shorten URL" });
    }
  });

  // Bulk shorten URLs (premium only)
  app.post("/api/shorten/bulk", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = req.user!;
    if (!user.isPremium) {
      return res.status(403).json({ message: "Bulk shortening requires premium subscription" });
    }

    try {
      const { urls: urlList } = req.body;
      if (!Array.isArray(urlList) || urlList.length === 0) {
        return res.status(400).json({ message: "Invalid URL list" });
      }

      if (urlList.length > 100) {
        return res.status(400).json({ message: "Maximum 100 URLs per batch" });
      }

      const results = [];
      for (const urlData of urlList) {
        try {
          const data = frontendUrlSchema.parse(urlData);
          
          // Generate unique short ID
          let shortId: string;
          do {
            shortId = generateShortId();
          } while (await storage.getUrlByShortId(shortId));

          const url = await storage.createUrl({
            ...data,
            userId: user.id,
            shortId,
            title: data.title || extractTitle(data.longUrl),
            tags: data.tags || [],
          });

          results.push(url);
        } catch (error) {
          results.push({ error: "Invalid URL data", originalUrl: urlData.longUrl });
        }
      }

      res.json({ results });
    } catch (error) {
      res.status(500).json({ message: "Failed to process bulk URLs" });
    }
  });

  // Bulk shorten URLs (anonymous users)
  app.post("/api/shorten/bulk/public", async (req, res) => {
    try {
      const { urls: urlList } = req.body;
      if (!Array.isArray(urlList) || urlList.length === 0) {
        return res.status(400).json({ message: "Invalid URL list" });
      }

      if (urlList.length > 50) {
        return res.status(400).json({ message: "Maximum 50 URLs per batch for anonymous users" });
      }

      const results = [];
      for (const urlData of urlList) {
        try {
          const { longUrl, customAlias } = urlData;
          
          if (!longUrl) {
            results.push({ error: "URL is required", originalUrl: urlData.longUrl });
            continue;
          }

          // Validate URL format
          try {
            new URL(longUrl);
          } catch {
            results.push({ error: "Invalid URL format", originalUrl: longUrl });
            continue;
          }

          // Check if custom alias is provided and available
          if (customAlias) {
            const existing = await storage.getUrlByCustomAlias(customAlias);
            if (existing) {
              results.push({ error: "Custom alias already taken", originalUrl: longUrl });
              continue;
            }
          }

          // Generate unique short ID
          let shortId: string;
          do {
            shortId = customAlias || generateShortId();
          } while (!customAlias && await storage.getUrlByShortId(shortId));

          const url = await storage.createUrl({
            longUrl,
            shortId,
            customAlias: customAlias || undefined,
            title: extractTitle(longUrl),
            tags: [],
            userId: 0, // Anonymous URL
          });

          results.push(url);
        } catch (error) {
          results.push({ error: "Invalid URL data", originalUrl: urlData.longUrl });
        }
      }

      res.json({ results });
    } catch (error) {
      res.status(500).json({ message: "Failed to process bulk URLs" });
    }
  });

  // Get user's URLs (authenticated users)
  app.get("/api/urls", async (req, res) => {
    console.log("📋 [URLS] Fetching URLs for user:", req.user?.id);
    console.log("📋 [URLS] Query params:", req.query);
    
    if (!req.isAuthenticated()) {
      console.log("❌ [URLS] User not authenticated");
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      console.log("📋 [URLS] Fetching with params:", { page, limit, offset, userId: req.user!.id });
      const urls = await storage.getUserUrls(req.user!.id, limit, offset);
      console.log("✅ [URLS] Found URLs:", urls.length);
      res.json(urls);
    } catch (error) {
      console.error("❌ [URLS] Error fetching URLs:", error);
      res.status(500).json({ message: "Failed to fetch URLs" });
    }
  });

  // Get URL by short ID (public endpoint)
  app.get("/api/url/:shortId", async (req, res) => {
    try {
      const { shortId } = req.params;
      
      // Try to find by short ID first
      let url = await storage.getUrlByShortId(shortId);
      
      // If not found, try custom alias
      if (!url) {
        url = await storage.getUrlByCustomAlias(shortId);
      }

      if (!url) {
        return res.status(404).json({ message: "URL not found" });
      }

      // Return URL info (without sensitive data)
      res.json({
        id: url.id,
        shortId: url.shortId,
        customAlias: url.customAlias,
        title: url.title,
        longUrl: url.longUrl,
        clickCount: url.clickCount,
        createdAt: url.createdAt,
        lastAccessedAt: url.lastAccessedAt,
        isAnonymous: url.userId === 0 || url.userId === null
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch URL" });
    }
  });

  // Get user stats
  app.get("/api/stats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const stats = await storage.getUserStats(req.user!.id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Update URL (premium feature for custom alias)
  app.put("/api/url/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = req.user!;
    if (!user.isPremium) {
      return res.status(403).json({ message: "Editing URLs requires premium subscription" });
    }

    try {
      const urlId = parseInt(req.params.id);
      const { customAlias, tags } = req.body;

      // Check if custom alias is already taken by another URL
      if (customAlias) {
        const existing = await storage.getUrlByCustomAlias(customAlias);
        if (existing && existing.id !== urlId) {
          return res.status(400).json({ message: "Custom alias already taken" });
        }
      }

      const updatedUrl = await storage.updateUrl(urlId, {
        customAlias,
        tags: tags || [],
      });

      if (!updatedUrl) {
        return res.status(404).json({ message: "URL not found" });
      }

      res.json(updatedUrl);
    } catch (error) {
      res.status(500).json({ message: "Failed to update URL" });
    }
  });

  // Delete URL
  app.delete("/api/url/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const urlId = parseInt(req.params.id);
      const deleted = await storage.deleteUrl(urlId, req.user!.id);

      if (!deleted) {
        return res.status(404).json({ message: "URL not found" });
      }

      res.json({ message: "URL deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete URL" });
    }
  });

  // Redirect short URL (exclude frontend routes)
  app.get("/:shortId", async (req, res, next) => {
    try {
      const { shortId } = req.params;
      
      // Skip frontend routes
      if (shortId === 'auth' || shortId === 'dashboard' || shortId === 'src' || shortId.includes('.') || shortId.startsWith('@')) {
        return next();
      }
      
      // Try to find by short ID first
      let url = await storage.getUrlByShortId(shortId);
      
      // If not found, try custom alias
      if (!url) {
        url = await storage.getUrlByCustomAlias(shortId);
      }

      if (!url) {
        return next(); // Let frontend handle 404s for non-existent short URLs
      }

      // Track the click
      await storage.incrementClickCount(url.id);
      
      // Track detailed click info
      await storage.createUrlClick({
        urlId: url.id,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        referrer: req.get('Referer'),
      });

      res.redirect(url.longUrl);
    } catch (error) {
      next(); // Let frontend handle errors
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
