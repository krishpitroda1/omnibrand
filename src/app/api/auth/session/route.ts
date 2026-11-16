import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, isSupabaseConfiguredServer } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const isConfigured = isSupabaseConfiguredServer();

    if (isConfigured) {
      const supabase = createServerSupabaseClient();
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session?.user && !error) {
        return NextResponse.json({
          authenticated: true,
          supabaseConnected: true,
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split("@")[0],
            companyName: session.user.user_metadata?.companyName,
            role: "OWNER",
          },
        });
      }
    }

    // Check local session cookie
    const localUser = await getSession();
    if (localUser) {
      return NextResponse.json({
        authenticated: true,
        supabaseConnected: isConfigured,
        user: {
          id: localUser.userId,
          email: localUser.email,
          name: localUser.name,
          organizationId: localUser.organizationId,
          workspaceId: localUser.workspaceId,
          role: localUser.role,
        },
      });
    }

    return NextResponse.json({
      authenticated: false,
      supabaseConnected: isConfigured,
      user: null,
    });
  } catch (error: any) {
    return NextResponse.json({
      authenticated: false,
      error: error.message,
    });
  }
}
