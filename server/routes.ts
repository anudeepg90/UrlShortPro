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

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Shorten URL endpoint
  app.post("/api/shorten", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const data = insertUrlSchema.parse(req.body);
      const user = req.user!;

      // Check if custom alias is provided and user is premium
      if (data.customAlias && !user.isPremium) {
        return res.status(403).json({ message: "Custom aliases require premium subscription" });
      }

      // Check if custom alias is already taken
      if (data.customAlias) {
        const existing = await storage.getUrlByCustomAlias(data.customAlias);
        if (existing) {
          return res.status(400).json({ message: "Custom alias already taken" });
        }
      }

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

      res.status(201).json(url);
    } catch (error) {
      if (error instanceof z.ZodError) {
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
          const data = insertUrlSchema.parse(urlData);
          
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

  // Get user's URLs
  app.get("/api/urls", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const urls = await storage.getUserUrls(req.user!.id, limit, offset);
      res.json(urls);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch URLs" });
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
