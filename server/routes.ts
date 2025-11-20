import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import session from "express-session";
import { insertInvitationSchema, insertAdminUserSchema, insertSettingSchema } from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    adminId?: string;
  }
}

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.adminId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const sampleImageMap: Record<string, string> = {
  wedding: "elegant_wedding_invitation_design.png",
  birthday: "modern_birthday_party_invitation.png",
  corporate: "luxurious_corporate_event_invitation.png",
  rustic: "rustic_outdoor_wedding_invitation.png",
  "baby-shower": "baby_shower_invitation_design.png",
  gala: "black_tie_gala_invitation.png",
};

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "invitation-gallery-secret-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "lax",
      },
    })
  );

  app.use("/uploads", async (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=31536000");
    next();
  });
  app.use("/uploads", (await import("express")).static(uploadsDir));

  app.get("/api/sample-images/:type", async (req: Request, res: Response) => {
    try {
      const imageFile = sampleImageMap[req.params.type];
      if (!imageFile) {
        return res.status(404).json({ error: "Sample image not found" });
      }
      
      const imagePath = path.join(process.cwd(), "attached_assets", "generated_images", imageFile);
      
      if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
      } else {
        res.status(404).json({ error: "Image file not found" });
      }
    } catch (error) {
      console.error("Error serving sample image:", error);
      res.status(500).json({ error: "Failed to serve sample image" });
    }
  });

  app.get("/api/invitations", async (req: Request, res: Response) => {
    try {
      const invitations = await storage.getInvitations();
      res.json(invitations);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      res.status(500).json({ error: "Failed to fetch invitations" });
    }
  });

  app.get("/api/invitations/:id", async (req: Request, res: Response) => {
    try {
      const invitation = await storage.getInvitation(req.params.id);
      if (!invitation) {
        return res.status(404).json({ error: "Invitation not found" });
      }
      res.json(invitation);
    } catch (error) {
      console.error("Error fetching invitation:", error);
      res.status(500).json({ error: "Failed to fetch invitation" });
    }
  });

  app.post("/api/invitations", requireAuth, upload.single("image"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Image is required" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      
      const invitationData = {
        title: req.body.title,
        description: req.body.description,
        price: parseInt(req.body.price),
        imageUrl,
      };

      const validatedData = insertInvitationSchema.parse(invitationData);
      const invitation = await storage.createInvitation(validatedData);
      
      res.status(201).json(invitation);
    } catch (error) {
      console.error("Error creating invitation:", error);
      res.status(500).json({ error: "Failed to create invitation" });
    }
  });

  app.patch("/api/invitations/:id", requireAuth, upload.single("image"), async (req: Request, res: Response) => {
    try {
      const updateData: any = {
        title: req.body.title,
        description: req.body.description,
        price: parseInt(req.body.price),
      };

      if (req.file) {
        const existing = await storage.getInvitation(req.params.id);
        if (existing && existing.imageUrl.startsWith("/uploads/")) {
          const oldImagePath = path.join(process.cwd(), existing.imageUrl);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        updateData.imageUrl = `/uploads/${req.file.filename}`;
      }

      const invitation = await storage.updateInvitation(req.params.id, updateData);
      
      if (!invitation) {
        return res.status(404).json({ error: "Invitation not found" });
      }
      
      res.json(invitation);
    } catch (error) {
      console.error("Error updating invitation:", error);
      res.status(500).json({ error: "Failed to update invitation" });
    }
  });

  app.delete("/api/invitations/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const existing = await storage.getInvitation(req.params.id);
      
      if (!existing) {
        return res.status(404).json({ error: "Invitation not found" });
      }

      if (existing.imageUrl.startsWith("/uploads/")) {
        const imagePath = path.join(process.cwd(), existing.imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await storage.deleteInvitation(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting invitation:", error);
      res.status(500).json({ error: "Failed to delete invitation" });
    }
  });

  app.post("/api/admin/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getAdminUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.adminId = user.id;
      res.json({ success: true });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/admin/session", (req: Request, res: Response) => {
    if (req.session.adminId) {
      res.json({ authenticated: true });
    } else {
      res.json({ authenticated: false });
    }
  });

  app.post("/api/admin/register", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      const existing = await storage.getAdminUserByUsername(username);
      if (existing) {
        return res.status(409).json({ error: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await storage.createAdminUser({
        username,
        password: hashedPassword,
      });

      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.get("/api/settings", async (req: Request, res: Response) => {
    try {
      const allSettings = await storage.getSettings();
      res.json(allSettings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", requireAuth, async (req: Request, res: Response) => {
    try {
      const validatedData = insertSettingSchema.parse(req.body);
      const setting = await storage.upsertSetting(validatedData);
      res.json(setting);
    } catch (error) {
      console.error("Error updating setting:", error);
      res.status(500).json({ error: "Failed to update setting" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
