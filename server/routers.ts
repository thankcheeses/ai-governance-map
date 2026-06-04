import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Governance Controls
  controls: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getControlsByOwner(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        category: z.string().optional(),
        tier: z.enum(["critical", "high", "medium", "low"]),
        status: z.enum(["compliant", "in_progress", "planning", "not_started"]).optional(),
        maturityLevel: z.number().optional(),
        targetMaturityLevel: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createControl({
          ...input,
          ownerId: ctx.user.id,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        tier: z.enum(["critical", "high", "medium", "low"]).optional(),
        status: z.enum(["compliant", "in_progress", "planning", "not_started"]).optional(),
        maturityLevel: z.number().optional(),
        targetMaturityLevel: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        return db.updateControl(id, updates);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteControl(input.id);
      }),
  }),

  // Frameworks
  frameworks: router({
    list: publicProcedure.query(async () => {
      return db.getAllFrameworks();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getFrameworkById(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        region: z.string().optional(),
        year: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createFramework({
          ...input,
          status: "active",
        });
      }),
  }),

  // Assessments
  assessments: router({
    listByControl: publicProcedure
      .input(z.object({ controlId: z.number() }))
      .query(async ({ input }) => {
        return db.getAssessmentsByControl(input.controlId);
      }),

    getLatest: publicProcedure
      .input(z.object({ controlId: z.number(), frameworkId: z.number() }))
      .query(async ({ input }) => {
        return db.getLatestAssessment(input.controlId, input.frameworkId);
      }),

    create: protectedProcedure
      .input(z.object({
        controlId: z.number(),
        frameworkId: z.number(),
        score: z.string().optional(),
        status: z.enum(["compliant", "non_compliant", "partial", "not_applicable"]),
        findings: z.string().optional(),
        recommendations: z.string().optional(),
        evidenceUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createAssessment({
          ...input,
          assessedBy: ctx.user.id,
        });
      }),
  }),

  // Compliance Metrics
  metrics: router({
    getByFramework: publicProcedure
      .input(z.object({ frameworkId: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return db.getComplianceMetricsByFramework(input.frameworkId, input.limit);
      }),

    getLatest: publicProcedure
      .input(z.object({ frameworkId: z.number().optional() }))
      .query(async ({ input }) => {
        return db.getLatestComplianceMetric(input.frameworkId);
      }),

    create: protectedProcedure
      .input(z.object({
        frameworkId: z.number().optional(),
        overallCompliance: z.string().optional(),
        controlsCompliant: z.number().optional(),
        controlsInProgress: z.number().optional(),
        controlsPlanning: z.number().optional(),
        controlsNotStarted: z.number().optional(),
        averageMaturity: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createComplianceMetric(input);
      }),
  }),

  // Notifications
  notifications: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return db.getNotificationsByUser(ctx.user.id, input.limit);
      }),

    unread: protectedProcedure.query(async ({ ctx }) => {
      return db.getUnreadNotifications(ctx.user.id);
    }),

    unreadCount: protectedProcedure.query(async ({ ctx }) => {
      return db.getUnreadCount(ctx.user.id);
    }),

    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.markNotificationAsRead(input.id);
      }),

    markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
      return db.markAllAsRead(ctx.user.id);
    }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteNotification(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        type: z.enum(["control_update", "assessment_complete", "compliance_alert", "framework_change", "general"]),
        title: z.string(),
        message: z.string().optional(),
        relatedControlId: z.number().optional(),
        relatedFrameworkId: z.number().optional(),
        actionUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createNotification({
          ...input,
          userId: ctx.user.id,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
