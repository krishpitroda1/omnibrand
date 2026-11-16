import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, getSession } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit/audit-logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (session) {
    await writeAuditLog({
      workspaceId: session.workspaceId,
      actorId: session.userId,
      action: "USER_LOGOUT",
      entityType: "User",
      entityId: session.userId,
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });
  }

  await clearSessionCookie();
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
