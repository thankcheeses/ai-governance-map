import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Governance Frameworks table
 * Stores information about compliance frameworks (ISO 42001, EU AI Act, GDPR, etc.)
 */
export const frameworks = mysqlTable("frameworks", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  region: varchar("region", { length: 255 }),
  year: int("year"),
  status: mysqlEnum("status", ["active", "draft", "deprecated"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Framework = typeof frameworks.$inferSelect;
export type InsertFramework = typeof frameworks.$inferInsert;

/**
 * Governance Controls table
 * Stores AI governance controls that must be implemented
 */
export const controls = mysqlTable("controls", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 255 }),
  tier: mysqlEnum("tier", ["critical", "high", "medium", "low"]).notNull(),
  status: mysqlEnum("status", ["compliant", "in_progress", "planning", "not_started"]).default("not_started").notNull(),
  maturityLevel: int("maturityLevel").default(1),
  targetMaturityLevel: int("targetMaturityLevel").default(5),
  ownerId: int("ownerId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Control = typeof controls.$inferSelect;
export type InsertControl = typeof controls.$inferInsert;

/**
 * Control-Framework Mapping table
 * Maps which controls address requirements for each framework
 */
export const controlFrameworkMap = mysqlTable("control_framework_map", {
  id: int("id").autoincrement().primaryKey(),
  controlId: int("controlId").notNull(),
  frameworkId: int("frameworkId").notNull(),
  complianceLevel: mysqlEnum("complianceLevel", ["full", "partial", "none"]).default("none").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ControlFrameworkMap = typeof controlFrameworkMap.$inferSelect;
export type InsertControlFrameworkMap = typeof controlFrameworkMap.$inferInsert;

/**
 * Assessments table
 * Stores compliance assessments and evaluation results
 */
export const assessments = mysqlTable("assessments", {
  id: int("id").autoincrement().primaryKey(),
  controlId: int("controlId").notNull(),
  frameworkId: int("frameworkId").notNull(),
  assessmentDate: timestamp("assessmentDate").defaultNow().notNull(),
  score: decimal("score", { precision: 5, scale: 2 }),
  status: mysqlEnum("status", ["compliant", "non_compliant", "partial", "not_applicable"]).notNull(),
  findings: text("findings"),
  recommendations: text("recommendations"),
  evidenceUrl: varchar("evidenceUrl", { length: 512 }),
  assessedBy: int("assessedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;

/**
 * Compliance Metrics table
 * Stores aggregated compliance metrics and trends
 */
export const complianceMetrics = mysqlTable("compliance_metrics", {
  id: int("id").autoincrement().primaryKey(),
  frameworkId: int("frameworkId"),
  metricDate: timestamp("metricDate").defaultNow().notNull(),
  overallCompliance: decimal("overallCompliance", { precision: 5, scale: 2 }),
  controlsCompliant: int("controlsCompliant"),
  controlsInProgress: int("controlsInProgress"),
  controlsPlanning: int("controlsPlanning"),
  controlsNotStarted: int("controlsNotStarted"),
  averageMaturity: decimal("averageMaturity", { precision: 5, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ComplianceMetric = typeof complianceMetrics.$inferSelect;
export type InsertComplianceMetric = typeof complianceMetrics.$inferInsert;

/**
 * Notifications table
 * Stores in-app notifications for governance events
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["control_update", "assessment_complete", "compliance_alert", "framework_change", "general"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  relatedControlId: int("relatedControlId"),
  relatedFrameworkId: int("relatedFrameworkId"),
  isRead: boolean("isRead").default(false).notNull(),
  actionUrl: varchar("actionUrl", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  readAt: timestamp("readAt"),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;