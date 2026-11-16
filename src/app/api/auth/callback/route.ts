import { NextRequest, NextResponse } from "next/server";
import { googleOAuth } from "@/lib/auth/oauth";
import { setSessionCookie } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit/audit-logger";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code") || "mock_oauth_code";
    const state = searchParams.get("state");

    // Profile retrieval via OAuth provider
    const profile = await googleOAuth.exchangeCodeForProfile(code);

    const sessionUser = {
      userId: `usr-${profile.providerId.slice(-6)}`,
      email: profile.email,
      name: profile.name,
      organizationId: "org-apex-holding",
      workspaceId: "ws-prod-01",
      role: "OWNER" as const,
    };

    await setSessionCookie(sessionUser);

    await writeAuditLog({
      workspaceId: sessionUser.workspaceId,
      actorId: sessionUser.userId,
      action: "OAUTH_LOGIN_SUCCESS",
      entityType: "User",
      entityId: sessionUser.userId,
      metadata: { email: profile.email, provider: "google" },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.redirect(new URL("/brand-workspace", req.url));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
