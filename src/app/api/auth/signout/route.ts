import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, isSupabaseConfiguredServer } from "@/lib/supabase/server";
import { clearSessionCookie, getSession } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit/audit-logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSession();

    if (isSupabaseConfiguredServer()) {
      const supabase = createServerSupabaseClient();
      await supabase.auth.signOut();
    }

    if (sessionUser) {
      await writeAuditLog({
        workspaceId: sessionUser.workspaceId,
        actorId: sessionUser.userId,
        action: "USER_LOGOUT",
        entityType: "User",
        entityId: sessionUser.userId,
        metadata: { email: sessionUser.email },
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      });
    }

    await clearSessionCookie();

    return NextResponse.json({
      success: true,
      message: "Signed out successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to sign out." },
      { status: 500 }
    );
  }
}
