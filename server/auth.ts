import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "default-session-secret-for-dev",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  console.log("🔧 [AUTH] Setting up auth with session settings:", {
    secret: sessionSettings.secret ? "***" : "undefined",
    resave: sessionSettings.resave,
    saveUninitialized: sessionSettings.saveUninitialized,
    store: sessionSettings.store ? "MemoryStore" : "undefined"
  });

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Add middleware to log session state for authenticated endpoints
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/shorten') || req.path === '/api/user') {
      console.log("🔍 [MIDDLEWARE] Request to:", req.path);
      console.log("🔍 [MIDDLEWARE] Session ID:", req.sessionID);
      console.log("🔍 [MIDDLEWARE] Session:", req.session);
      console.log("🔍 [MIDDLEWARE] Is authenticated:", req.isAuthenticated());
      console.log("🔍 [MIDDLEWARE] User:", req.user);
    }
    next();
  });

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    console.log("📝 [AUTH] Serializing user:", { id: user.id, username: user.username });
    done(null, user.id);
  });
  passport.deserializeUser(async (id: number, done) => {
    console.log("🔄 [AUTH] Deserializing user with ID:", id);
    const user = await storage.getUser(id);
    console.log("🔄 [AUTH] Deserialized user:", user);
    done(null, user);
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email and password are required" });
      }

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser({
        username,
        email,
        password: await hashPassword(password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    console.log("🔐 [AUTH] Login successful for user:", { id: req.user?.id, username: req.user?.username });
    console.log("🔐 [AUTH] Session after login:", req.session);
    console.log("🔐 [AUTH] Is authenticated:", req.isAuthenticated());
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    console.log("👤 [AUTH] /api/user endpoint hit");
    console.log("👤 [AUTH] Session:", req.session);
    console.log("👤 [AUTH] Is authenticated:", req.isAuthenticated());
    console.log("👤 [AUTH] User:", req.user);
    
    if (!req.isAuthenticated()) {
      console.log("❌ [AUTH] User not authenticated");
      return res.sendStatus(401);
    }
    
    console.log("✅ [AUTH] User authenticated, returning:", req.user);
    res.json(req.user);
  });
}
