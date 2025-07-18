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
    resave: true, // ensure session is always saved
    saveUninitialized: true, // save new sessions
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      // domain removed for Cloud Run compatibility
    },
    name: 'linkvault.sid', // custom session cookie name
    rolling: true, // extend session on each request
  };

  // Trust proxy for production (Cloud Run)
  if (process.env.NODE_ENV === 'production') {
    app.set("trust proxy", 1);
  }
  
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());
  


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
    done(null, user.id);
  });
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      console.log("📝 [REGISTER] Registration attempt:", { username: req.body.username, email: req.body.email });
      
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        console.log("❌ [REGISTER] Missing required fields");
        return res.status(400).json({ message: "Username, email and password are required" });
      }

      console.log("🔍 [REGISTER] Checking for existing user...");
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        console.log("❌ [REGISTER] Username already exists:", username);
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        console.log("❌ [REGISTER] Email already exists:", email);
        return res.status(400).json({ message: "Email already exists" });
      }

      console.log("🔐 [REGISTER] Hashing password...");
      const hashedPassword = await hashPassword(password);
      
      console.log("👤 [REGISTER] Creating user...");
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
      });

      console.log("✅ [REGISTER] User created successfully:", user.id);
      
      req.login(user, (err) => {
        if (err) {
          console.error("❌ [REGISTER] Login after registration failed:", err);
          return next(err);
        }
        console.log("🎉 [REGISTER] User logged in after registration");
        res.status(201).json(user);
      });
    } catch (error) {
      console.error("❌ [REGISTER] Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log("🔐 [LOGIN] Login attempt for username:", req.body.username);
    
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        console.error("❌ [LOGIN] Authentication error:", err);
        return next(err);
      }
      
      if (!user) {
        console.log("❌ [LOGIN] Authentication failed for username:", req.body.username);
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      req.logIn(user, (err) => {
        if (err) {
          console.error("❌ [LOGIN] Session creation failed:", err);
          return next(err);
        }
        
        console.log("✅ [LOGIN] User logged in successfully:", user.username);
        res.status(200).json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    console.log("👤 [USER] User data request");
    console.log("🔍 [USER] Session ID:", req.sessionID);
    console.log("🔍 [USER] Is authenticated:", req.isAuthenticated());
    console.log("🔍 [USER] User object:", req.user);
    
    if (!req.isAuthenticated()) {
      console.log("❌ [USER] User not authenticated");
      return res.sendStatus(401);
    }
    
    console.log("✅ [USER] Returning user data for:", req.user?.username);
    res.json(req.user);
  });
}
