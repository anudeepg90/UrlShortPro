import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertUrlSchema } from "@shared/schema";
import { z } from "zod";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default-jwt-secret-for-dev";

// JWT middleware for authentication
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

function generateShortId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
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
    try {
      const { longUrl, customAlias } = req.body;
      
      if (!longUrl) {
        return res.status(400).json({ message: "URL is required" });
      }

      // Validate URL format
      try {
        new URL(longUrl);
      } catch {
        return res.status(400).json({ message: "Invalid URL format" });
      }

      // Check if custom alias is provided and available
      if (customAlias) {
        // Check if custom alias is already taken by another URL's custom alias
        const existingByCustomAlias = await storage.getUrlByCustomAlias(customAlias);
        if (existingByCustomAlias) {
          return res.status(400).json({ message: "Custom alias already taken" });
        }
        // Check if custom alias is already being used as a shortId by another URL
        const existingByShortId = await storage.getUrlByShortId(customAlias);
        if (existingByShortId) {
          return res.status(400).json({ message: "Custom alias conflicts with existing short link" });
        }
      }

      // Generate unique short ID
      let shortId: string;
      let attempts = 0;
      do {
        shortId = customAlias || generateShortId();
        attempts++;
      } while (!customAlias && await storage.getUrlByShortId(shortId) && attempts < 10);

      if (attempts >= 10) {
        return res.status(500).json({ message: "Failed to generate unique short ID" });
      }

      const urlData = {
        longUrl,
        shortId,
        customAlias: customAlias || undefined,
        title: extractTitle(longUrl),
        tags: [],
        userId: 0, // Anonymous URL (user ID 0 represents anonymous)
      };

      const url = await storage.createUrl(urlData);

      res.status(201).json(url);
    } catch (error) {
      console.error("Error in public shorten endpoint:", error);
      res.status(500).json({ message: "Failed to shorten URL" });
    }
  });

  // Shorten URL endpoint (authenticated users)
  app.post("/api/shorten", authenticateToken, async (req, res) => {
    try {
      const data = frontendUrlSchema.parse(req.body);
      const user = req.user!;

      // All authenticated users are treated as premium
      // Custom aliases are available to all signed-in users
      if (data.customAlias) {
        // Check if custom alias is already taken by another URL's custom alias
        const existingByCustomAlias = await storage.getUrlByCustomAlias(data.customAlias);
        if (existingByCustomAlias) {
          return res.status(400).json({ message: "Custom alias already taken" });
        }
        // Check if custom alias is already being used as a shortId by another URL
        const existingByShortId = await storage.getUrlByShortId(data.customAlias);
        if (existingByShortId) {
          return res.status(400).json({ message: "Custom alias conflicts with existing short link" });
        }
      }

      // Generate unique short ID
      let shortId: string;
      let attempts = 0;
      do {
        shortId = generateShortId();
        attempts++;
      } while (await storage.getUrlByShortId(shortId) && attempts < 10);

      if (attempts >= 10) {
        return res.status(500).json({ message: "Failed to generate unique short ID" });
      }

      const urlData = {
        ...data,
        userId: user.id,
        shortId,
        title: data.title || extractTitle(data.longUrl),
        tags: data.tags || [],
      };

      const url = await storage.createUrl(urlData);

      res.status(201).json(url);
    } catch (error) {
      console.error("Error in shorten endpoint:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data" });
      }
      res.status(500).json({ message: "Failed to shorten URL" });
    }
  });

  // Bulk shorten URLs (available to all authenticated users)
  app.post("/api/shorten/bulk", authenticateToken, async (req, res) => {
    // All authenticated users can use bulk shortening
    const user = req.user!;

    try {
      const { urls: urlList } = req.body;
      if (!Array.isArray(urlList) || urlList.length === 0) {
        return res.status(400).json({ message: "URLs array is required and must not be empty" });
      }

      if (urlList.length > 100) {
        return res.status(400).json({ message: "Maximum 100 URLs allowed per request" });
      }

      const results = [];
      const errors = [];
      const csvData = [];

      for (const urlData of urlList) {
        try {
          const validatedData = frontendUrlSchema.parse(urlData);
          
          // Check custom alias availability
          if (validatedData.customAlias) {
            const existingByCustomAlias = await storage.getUrlByCustomAlias(validatedData.customAlias);
            if (existingByCustomAlias) {
              errors.push({ url: validatedData.longUrl, error: "Custom alias already taken" });
              continue;
            }
            const existingByShortId = await storage.getUrlByShortId(validatedData.customAlias);
            if (existingByShortId) {
              errors.push({ url: validatedData.longUrl, error: "Custom alias conflicts with existing short link" });
              continue;
            }
          }

          // Generate unique short ID
          let shortId: string;
          let attempts = 0;
          do {
            shortId = validatedData.customAlias || generateShortId();
            attempts++;
          } while (!validatedData.customAlias && await storage.getUrlByShortId(shortId) && attempts < 10);

          if (attempts >= 10) {
            errors.push({ url: validatedData.longUrl, error: "Failed to generate unique short ID" });
            continue;
          }

          const url = await storage.createUrl({
            ...validatedData,
            userId: user.id,
            shortId,
            title: validatedData.title || extractTitle(validatedData.longUrl),
            tags: validatedData.tags || [],
          });

          results.push(url);
          
          // Add to CSV data
          csvData.push({
            url: validatedData.longUrl,
            alias: url.customAlias || url.shortId,
            tags: (validatedData.tags || []).join(', '),
            shortLink: `https://${process.env.FRONTEND_DOMAIN || 'tinyyourl.com'}/${url.customAlias || url.shortId}`
          });
        } catch (error) {
          if (error instanceof z.ZodError) {
            errors.push({ url: urlData.longUrl || 'Invalid URL', error: "Invalid URL format" });
          } else {
            errors.push({ url: urlData.longUrl || 'Unknown URL', error: "Failed to process URL" });
          }
        }
      }

      res.status(200).json({
        successCount: results.length,
        errorCount: errors.length,
        results,
        errors,
        csvData
      });
    } catch (error) {
      console.error("Error in bulk shorten endpoint:", error);
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
  app.get("/api/urls", authenticateToken, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const urls = await storage.getUserUrls(req.user!.id, limit, offset);
      res.json(urls);
    } catch (error) {
      console.error("Error fetching URLs:", error);
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

  // Track click for short URL (public endpoint)
  app.post("/api/url/:shortId/click", async (req, res) => {
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

      // Increment click count
      await storage.incrementClickCount(url.id);
      
      // Track detailed click info
      await storage.createUrlClick({
        urlId: url.id,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        referrer: req.get('Referer'),
      });

      res.json({ message: "Click tracked successfully" });
    } catch (error) {
      console.error("Error tracking click:", error);
      res.status(500).json({ message: "Failed to track click" });
    }
  });

  // Get user stats
  app.get("/api/stats", authenticateToken, async (req, res) => {
    try {
      const stats = await storage.getUserStats(req.user!.id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Get URL analytics (authenticated users)
  app.get("/api/url/:id/analytics", authenticateToken, async (req, res) => {
    try {
      const urlId = parseInt(req.params.id);
      const analytics = await storage.getUrlAnalytics(urlId, req.user!.id);
      
      if (!analytics) {
        return res.status(404).json({ message: "URL not found or access denied" });
      }
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching URL analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Update URL (available to all authenticated users)
  app.put("/api/url/:id", authenticateToken, async (req, res) => {
    // All authenticated users can edit URLs
    const user = req.user!;

    try {
      const urlId = parseInt(req.params.id);
      const { customAlias, tags } = req.body;
      // Check if custom alias is already taken by another URL
      if (customAlias) {
        // Check if custom alias is already taken by another URL's custom alias
        const existingByCustomAlias = await storage.getUrlByCustomAlias(customAlias);
        if (existingByCustomAlias && existingByCustomAlias.id !== urlId) {
          return res.status(400).json({ message: "Custom alias already taken" });
        }
        // Check if custom alias is already being used as a shortId by another URL
        const existingByShortId = await storage.getUrlByShortId(customAlias);
        if (existingByShortId && existingByShortId.id !== urlId) {
          return res.status(400).json({ message: "Custom alias conflicts with existing short link" });
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
  app.delete("/api/url/:id", authenticateToken, async (req, res) => {
    try {
      const urlId = parseInt(req.params.id);
      const deleted = await storage.deleteUrl(urlId, req.user!.id);

      if (!deleted) {
        return res.status(404).json({ message: "URL not found or access denied" });
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

      // Redirect immediately for fastest response
      res.redirect(url.longUrl);
      
      // Track the click asynchronously (don't wait for it)
      Promise.all([
        storage.incrementClickCount(url.id),
        storage.createUrlClick({
          urlId: url.id,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          referrer: req.get('Referer'),
        })
      ]).catch(error => {
        // Log error but don't fail the redirect
        console.error('Error tracking click:', error);
      });
    } catch (error) {
      next(); // Let frontend handle errors
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
