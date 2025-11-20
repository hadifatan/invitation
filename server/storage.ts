import {
  invitations,
  adminUsers,
  settings,
  type Invitation,
  type InsertInvitation,
  type AdminUser,
  type InsertAdminUser,
  type Setting,
  type InsertSetting,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getInvitations(): Promise<Invitation[]>;
  getInvitation(id: string): Promise<Invitation | undefined>;
  createInvitation(invitation: InsertInvitation): Promise<Invitation>;
  updateInvitation(id: string, invitation: Partial<InsertInvitation>): Promise<Invitation | undefined>;
  deleteInvitation(id: string): Promise<void>;
  
  getAdminUser(id: string): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  
  getSettings(): Promise<Setting[]>;
  getSetting(key: string): Promise<Setting | undefined>;
  upsertSetting(setting: InsertSetting): Promise<Setting>;
}

export class DatabaseStorage implements IStorage {
  async getInvitations(): Promise<Invitation[]> {
    return await db.select().from(invitations).orderBy(invitations.createdAt);
  }

  async getInvitation(id: string): Promise<Invitation | undefined> {
    const [invitation] = await db.select().from(invitations).where(eq(invitations.id, id));
    return invitation || undefined;
  }

  async createInvitation(invitation: InsertInvitation): Promise<Invitation> {
    const [created] = await db
      .insert(invitations)
      .values(invitation)
      .returning();
    return created;
  }

  async updateInvitation(id: string, invitation: Partial<InsertInvitation>): Promise<Invitation | undefined> {
    const [updated] = await db
      .update(invitations)
      .set(invitation)
      .where(eq(invitations.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteInvitation(id: string): Promise<void> {
    await db.delete(invitations).where(eq(invitations.id, id));
  }

  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user || undefined;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user || undefined;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [created] = await db
      .insert(adminUsers)
      .values(user)
      .returning();
    return created;
  }

  async getSettings(): Promise<Setting[]> {
    return await db.select().from(settings);
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting || undefined;
  }

  async upsertSetting(setting: InsertSetting): Promise<Setting> {
    const existing = await this.getSetting(setting.key);
    
    if (existing) {
      const [updated] = await db
        .update(settings)
        .set({ value: setting.value, updatedAt: new Date() })
        .where(eq(settings.key, setting.key))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(settings)
        .values(setting)
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
