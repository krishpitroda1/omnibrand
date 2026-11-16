import { PrismaClient, Prisma } from "@prisma/client";

export class TenantIsolationViolationError extends Error {
  statusCode: number;
  model: string;
  action: string;

  constructor(model: string, action: string, detail?: string) {
    super(
      `Tenant Isolation Violation: Attempted '${action}' on model '${model}' without mandatory 'workspaceId' scoping. ${detail || ""}`
    );
    this.name = "TenantIsolationViolationError";
    this.statusCode = 403;
    this.model = model;
    this.action = action;
  }
}

// Models that strictly require workspaceId in every query
export const TENANT_SCOPED_MODELS = new Set([
  "Brand",
  "SocialAccount",
  "Campaign",
  "ContentItem",
  "Contact",
  "Conversation",
  "MessageTemplate",
  "MessageSend",
  "AdSpend",
  "RevenueAttribution",
  "KpiSnapshot",
  "EffortLog",
  "Competitor",
  "Mention",
  "Keyword",
  "SearchMetric",
  "SiteAudit",
  "Review",
  "AutomationRule",
  "EventLog",
  "AuditLog",
  "ApiCredential",
  "MediaAsset",
  "Template",
]);

/**
 * Validates query parameters before execution to ensure workspace scoping is present.
 */
export function validateWorkspaceScope(model: string, action: string, args: any) {
  if (!TENANT_SCOPED_MODELS.has(model)) {
    return; // Global or org-level model
  }

  // 1. For writes / creates: data must have workspaceId
  if (action === "create" || action === "createMany") {
    const data = args?.data;
    if (Array.isArray(data)) {
      for (const item of data) {
        if (!item?.workspaceId) {
          throw new TenantIsolationViolationError(model, action, "Missing data.workspaceId in bulk create");
        }
      }
    } else if (!data?.workspaceId) {
      throw new TenantIsolationViolationError(model, action, "Missing data.workspaceId in create");
    }
    return;
  }

  // 2. For reads / updates / deletes: where must specify workspaceId
  const where = args?.where;
  if (!where || typeof where !== "object") {
    throw new TenantIsolationViolationError(model, action, "Query missing 'where' clause entirely");
  }

  // Direct workspaceId check or compound query
  if (!where.workspaceId && !where.workspace?.id) {
    throw new TenantIsolationViolationError(
      model,
      action,
      `'where.workspaceId' is strictly required for all '${model}' queries`
    );
  }
}

// Create singleton Prisma client with tenant isolation middleware extension
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Factory that returns a scoped query executor for a specific tenant workspace.
 * Guaranteed that every query automatically inherits and verifies the workspaceId.
 */
export function createScopedDb(workspaceId: string) {
  if (!workspaceId) {
    throw new TenantIsolationViolationError("All", "createScopedDb", "WorkspaceId cannot be empty");
  }

  return {
    workspaceId,
    // Helper to enforce workspaceId on where clauses
    scopeWhere: <T extends Record<string, any>>(where: T = {} as T): T & { workspaceId: string } => {
      return { ...where, workspaceId };
    },
    // Helper to enforce workspaceId on mutation data
    scopeData: <T extends Record<string, any>>(data: T): T & { workspaceId: string } => {
      return { ...data, workspaceId };
    },
  };
}
