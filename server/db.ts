import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, controls, InsertControl, frameworks, InsertFramework, assessments, InsertAssessment, complianceMetrics, InsertComplianceMetric, notifications, InsertNotification } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Governance Controls
export async function createControl(control: InsertControl) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(controls).values(control);
}

export async function getControlsByOwner(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(controls).where(eq(controls.ownerId, ownerId));
}

export async function updateControl(id: number, updates: Partial<InsertControl>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(controls).set(updates).where(eq(controls.id, id));
}

export async function deleteControl(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(controls).where(eq(controls.id, id));
}

// Frameworks
export async function createFramework(framework: InsertFramework) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(frameworks).values(framework);
}

export async function getAllFrameworks() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(frameworks).where(eq(frameworks.status, 'active'));
}

export async function getFrameworkById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(frameworks).where(eq(frameworks.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// Assessments
export async function createAssessment(assessment: InsertAssessment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(assessments).values(assessment);
}

export async function getAssessmentsByControl(controlId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(assessments).where(eq(assessments.controlId, controlId)).orderBy(desc(assessments.assessmentDate));
}

export async function getLatestAssessment(controlId: number, frameworkId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(assessments)
    .where(eq(assessments.controlId, controlId))
    .orderBy(desc(assessments.assessmentDate))
    .limit(1);
  
  return result.length > 0 && result[0].frameworkId === frameworkId ? result[0] : null;
}

// Compliance Metrics
export async function createComplianceMetric(metric: InsertComplianceMetric) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(complianceMetrics).values(metric);
}

export async function getComplianceMetricsByFramework(frameworkId: number, limit: number = 30) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(complianceMetrics)
    .where(eq(complianceMetrics.frameworkId, frameworkId))
    .orderBy(desc(complianceMetrics.metricDate))
    .limit(limit);
}

export async function getLatestComplianceMetric(frameworkId?: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(complianceMetrics)
    .orderBy(desc(complianceMetrics.metricDate))
    .limit(1);
  
  if (result.length === 0) return null;
  if (frameworkId && result[0].frameworkId !== frameworkId) return null;
  
  return result[0];
}

// Notifications
export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(notifications).values(notification);
}

export async function getNotificationsByUser(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function getUnreadCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select().from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
  
  return result.filter(n => !n.isRead).length;
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(eq(notifications.id, notificationId));
}

export async function markAllAsRead(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(eq(notifications.userId, userId));
}

export async function deleteNotification(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(notifications).where(eq(notifications.id, notificationId));
}
