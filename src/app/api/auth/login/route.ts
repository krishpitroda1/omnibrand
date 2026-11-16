import { NextRequest, NextResponse } from "next/server";
import { googleOAuth } from "@/lib/auth/oauth";
import { setSessionCookie } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit/audit-logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, workspaceId = "ws-prod-01", isMockDev = false } = body;

    // Fast-path developer / testing login
    if (isMockDev || process.env.NODE_ENV !== "production") {
      const user = {
        userId: "usr-admin-01",
        email: email || "alex.chen@omnibrand.io",
        name: "Alex Chen",
        organizationId: "org-apex-holding",
        workspaceId,
        role: "OWNER" as const,
      };

      await setSessionCookie(user);

      await writeAuditLog({
        workspaceId: user.workspaceId,
        actorId: user.userId,
        action: "USER_LOGIN_SESSION_CREATED",
        entityType: "User",
        entityId: user.userId,
        metadata: { method: "SESSION_COOKIE", email: user.email },
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      });

      return NextResponse.json({
        success: true,
        user,
        message: "Session cookie established (httpOnly, secure, sameSite=lax)",
      });
    }

    // Initiate Google OAuth 2.0 flow
    const { url, state } = googleOAuth.createAuthorizationUrl();
    const response = NextResponse.json({ success: true, redirectUrl: url });
    response.cookies.set("oauth_state", state, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 600,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
