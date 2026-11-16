import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";

// Public route prefixes that do not require workspace header
const PUBLIC_API_PREFIXES = [
  "/api/auth",
  "/api/health",
  "/api/webhooks",
  "/api/tests",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only apply strict API enforcement to /api routes
  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Allow public endpoints
  if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // 1. Session verification via session cookie or Authorization header
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  const tokenToVerify = sessionCookie || bearerToken;

  let session = tokenToVerify ? verifySessionToken(tokenToVerify) : null;

  // 2. Workspace scoping header verification
  const headerWorkspaceId = req.headers.get("x-workspace-id");
  const queryWorkspaceId = req.nextUrl.searchParams.get("workspaceId");
  let targetWorkspaceId = headerWorkspaceId || queryWorkspaceId || session?.workspaceId;

  // Fallback for dev environment if not signed in
  if (!session && process.env.NODE_ENV !== "production") {
    targetWorkspaceId = targetWorkspaceId || "ws-default";
    session = {
      userId: "usr-admin-01",
      email: "alex.chen@omnibrand.io",
      name: "Alex Chen",
      organizationId: "org-apex-holding",
      workspaceId: targetWorkspaceId,
      role: "OWNER",
      issuedAt: Math.floor(Date.now() / 1000),
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
    };
  }

  if (!session) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Authentication required. Please provide a valid session cookie or Bearer token.",
      },
      { status: 401 }
    );
  }

  if (!targetWorkspaceId) {
    return NextResponse.json(
      {
        error: "Missing Workspace Scope",
        message: "Every database query and API mutation must be scoped by workspaceId. Please provide 'x-workspace-id' header.",
      },
      { status: 403 }
    );
  }

  // Prevent cross-tenant impersonation: if session specifies a workspace and header claims a different one without admin authorization
  if (session.workspaceId && targetWorkspaceId !== session.workspaceId && session.role !== "OWNER") {
    return NextResponse.json(
      {
        error: "Cross-Tenant Access Forbidden",
        message: `User session belongs to '${session.workspaceId}', cannot access '${targetWorkspaceId}'.`,
      },
      { status: 403 }
    );
  }

  // Inject verified tenant identity headers for downstream Route Handlers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", session.userId);
  requestHeaders.set("x-workspace-id", targetWorkspaceId);
  requestHeaders.set("x-organization-id", session.organizationId || "org-apex-holding");
  requestHeaders.set("x-user-role", session.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/api/:path*"],
};
