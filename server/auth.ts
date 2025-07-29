import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);
const JWT_SECRET = process.env.JWT_SECRET || "default-jwt-secret-for-dev";

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

// JWT middleware for authentication
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "default-session-secret-for-dev",
    resave: true,
    saveUninitialized: true,
    store: new session.MemoryStore(),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
    name: 'linkvault.sid',
    rolling: true,
  };

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
      
      // Generate JWT token
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      
      console.log("🎉 [REGISTER] User logged in after registration");
      res.status(201).json({ user, token });
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
        // console.log("❌ [LOGIN] Authentication failed for username:", req.body.username);
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Generate JWT token
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      
      console.log("✅ [LOGIN] User logged in successfully:", user.username);
      res.status(200).json({ user, token });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    // For JWT, we don't need to do anything server-side
    // The client should remove the token
    res.sendStatus(200);
  });

  app.get("/api/user", authenticateToken, (req, res) => {
    console.log("👤 [USER] User data request for user ID:", req.user?.id);
    
    if (!req.user || !req.user.id) {
      console.log("❌ [USER] No user in request");
      return res.sendStatus(401);
    }
    
    // Get fresh user data from database
    storage.getUser(req.user.id).then(user => {
      if (!user) {
        console.log("❌ [USER] User not found in database");
        return res.sendStatus(401);
      }
      
      console.log("✅ [USER] Returning user data for:", user.username);
      res.json(user);
    }).catch(error => {
      console.error("❌ [USER] Error fetching user data:", error);
      res.sendStatus(500);
    });
  });
}
