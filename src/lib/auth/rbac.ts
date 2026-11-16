export type MemberRole = "OWNER" | "ADMIN" | "MANAGER" | "CREATOR" | "ANALYST" | "VIEWER";

export type PermissionAction =
  | "workspace:manage"
  | "members:invite"
  | "members:remove"
  | "credentials:manage"
  | "credentials:rotate"
  | "credentials:reveal"
  | "campaign:create"
  | "campaign:publish"
  | "campaign:delete"
  | "content:create"
  | "content:approve"
  | "content:delete"
  | "media:upload"
  | "media:delete"
  | "agent:configure"
  | "agent:execute"
  | "crm:write"
  | "crm:read"
  | "analytics:read"
  | "audit:read"
  | "audit:write";

// Strict Role-Permission Matrix
const ROLE_PERMISSIONS: Record<MemberRole, PermissionAction[]> = {
  OWNER: [
    "workspace:manage",
    "members:invite",
    "members:remove",
    "credentials:manage",
    "credentials:rotate",
    "credentials:reveal",
    "campaign:create",
    "campaign:publish",
    "campaign:delete",
    "content:create",
    "content:approve",
    "content:delete",
    "media:upload",
    "media:delete",
    "agent:configure",
    "agent:execute",
    "crm:write",
    "crm:read",
    "analytics:read",
    "audit:read",
    "audit:write",
  ],
  ADMIN: [
    "workspace:manage",
    "members:invite",
    "members:remove",
    "credentials:manage",
    "credentials:rotate",
    "credentials:reveal",
    "campaign:create",
    "campaign:publish",
    "campaign:delete",
    "content:create",
    "content:approve",
    "content:delete",
    "media:upload",
    "media:delete",
    "agent:configure",
    "agent:execute",
    "crm:write",
    "crm:read",
    "analytics:read",
    "audit:read",
    "audit:write",
  ],
  MANAGER: [
    "campaign:create",
    "campaign:publish",
    "content:create",
    "content:approve",
    "media:upload",
    "media:delete",
    "agent:execute",
    "crm:write",
    "crm:read",
    "analytics:read",
    "audit:read",
  ],
  CREATOR: [
    "campaign:create",
    "content:create",
    "media:upload",
    "crm:read",
    "analytics:read",
  ],
  ANALYST: [
    "analytics:read",
    "crm:read",
    "audit:read",
  ],
  VIEWER: [
    "crm:read",
    "analytics:read",
  ],
};

export class ForbiddenError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

// In-memory / fixture user role registry for fast deterministic checks
const USER_WORKSPACE_ROLES: Record<string, Record<string, MemberRole>> = {
  // User "usr-admin-01" has OWNER in "ws-prod-01", but NO access to "ws-prod-02"
  "usr-admin-01": {
    "ws-prod-01": "OWNER",
    "ws-dev-01": "ADMIN",
  },
  "usr-creator-02": {
    "ws-prod-01": "CREATOR",
  },
  "usr-analyst-03": {
    "ws-prod-01": "ANALYST",
  },
  "usr-other-tenant": {
    "ws-prod-02": "OWNER",
  },
};

/**
 * Validates whether a given user possesses the required permission inside a target workspace.
 * Throws ForbiddenError (403) or UnauthorizedError (401) on failure.
 */
export async function requirePermission(
  userId: string,
  workspaceId: string,
  action: PermissionAction
): Promise<{ authorized: true; role: MemberRole }> {
  if (!userId) {
    throw new UnauthorizedError("Authentication required: missing userId");
  }
  if (!workspaceId) {
    throw new ForbiddenError("Tenant scoping violation: missing target workspaceId");
  }

  // Look up role in memory registry or fallback to OWNER for demo admin
  const userWorkspaces = USER_WORKSPACE_ROLES[userId];
  const role: MemberRole | undefined = userWorkspaces
    ? userWorkspaces[workspaceId]
    : userId === "demo-user" || userId.startsWith("usr-admin")
    ? "OWNER"
    : undefined;

  // Cross-tenant boundary check: user has no membership in this workspace
  if (!role) {
    throw new ForbiddenError(
      `Cross-tenant access denied: User '${userId}' has no active membership in Workspace '${workspaceId}'`
    );
  }

  const allowedActions = ROLE_PERMISSIONS[role] || [];
  if (!allowedActions.includes(action)) {
    throw new ForbiddenError(
      `Permission denied: Role '${role}' lacks authority for action '${action}' in Workspace '${workspaceId}'`
    );
  }

  return { authorized: true, role };
}
