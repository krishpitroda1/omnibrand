import { validateWorkspaceScope, TenantIsolationViolationError } from "@/lib/db/prisma-tenant";
import { requirePermission, ForbiddenError } from "@/lib/auth/rbac";

export async function runTenantIsolationTest() {
  console.log("▶ Running Integration Test: Tenant Isolation & Scoping Invariant...");

  // 1. Test Prisma Middleware: missing workspaceId in findMany on tenant-scoped model
  let prismaBlocked = false;
  try {
    validateWorkspaceScope("Campaign", "findMany", { where: { status: "ACTIVE" } });
  } catch (err: any) {
    if (err instanceof TenantIsolationViolationError) {
      prismaBlocked = true;
    }
  }
  if (!prismaBlocked) {
    throw new Error("Tenant Isolation failed: Prisma allowed query without 'where.workspaceId'");
  }

  // 2. Test Cross-Tenant Access: User in Workspace A attempting to read/access Workspace B
  const userTenantA = "usr-creator-02"; // belongs strictly to "ws-prod-01"
  const targetTenantB = "ws-prod-02"; // foreign workspace

  let rbacCrossTenantBlocked = false;
  try {
    await requirePermission(userTenantA, targetTenantB, "campaign:create");
  } catch (err: any) {
    if (err instanceof ForbiddenError && err.message.includes("Cross-tenant access denied")) {
      rbacCrossTenantBlocked = true;
    }
  }
  if (!rbacCrossTenantBlocked) {
    throw new Error("Tenant Isolation failed: User from Workspace A was granted access to Workspace B!");
  }

  // 3. Test Authorized in Workspace A: succeeds
  const authorized = await requirePermission(userTenantA, "ws-prod-01", "campaign:create");
  if (!authorized.authorized) {
    throw new Error("Tenant Isolation failed: Legitimate user rejected in own workspace");
  }

  console.log("  ✔ Cross-tenant access strictly returns 403 Forbidden; Prisma rejection verified.");
  return true;
}
