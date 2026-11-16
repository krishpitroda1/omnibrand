import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");
    const brandId = searchParams.get("brandId");

    let query = supabaseAdmin
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (workspaceId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(workspaceId)) {
      query = query.eq("workspace_id", workspaceId);
    }
    if (brandId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(brandId)) {
      query = query.eq("brand_id", brandId);
    }

    const { data, error } = await query;

    if (error) {
      console.warn("Supabase fetch campaigns error:", error.message);
      return NextResponse.json({ campaigns: [] });
    }

    return NextResponse.json({ campaigns: data || [] });
  } catch (err: any) {
    console.error("GET /api/campaigns unexpected error:", err);
    return NextResponse.json({ campaigns: [], error: err?.message });
  }
}

export async function POST(request: Request) {
  try {
    const supabaseAdmin = createAdminClient();
    const body = await request.json();

    let targetWorkspaceId = body.workspaceId;
    let targetBrandId = body.brandId;

    // 1. Resolve a valid Workspace UUID for PostgreSQL foreign key
    const isWsUuid = targetWorkspaceId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetWorkspaceId);
    if (!isWsUuid) {
      const { data: wsList } = await supabaseAdmin.from("workspaces").select("id").limit(1);
      if (wsList && wsList.length > 0) {
        targetWorkspaceId = wsList[0].id;
      } else {
        // Create default workspace under first organization
        const { data: orgList } = await supabaseAdmin.from("organizations").select("id").limit(1);
        const orgId = orgList?.[0]?.id;
        if (orgId) {
          const { data: newWs } = await supabaseAdmin
            .from("workspaces")
            .insert({
              organization_id: orgId,
              name: "Main Marketing HQ",
              slug: "main-marketing-hq",
            })
            .select();
          targetWorkspaceId = newWs?.[0]?.id;
        }
      }
    }

    // 2. Resolve a valid Brand UUID for PostgreSQL foreign key
    const isBrandUuid = targetBrandId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetBrandId);
    if (!isBrandUuid && targetWorkspaceId) {
      const { data: brandList } = await supabaseAdmin
        .from("brands")
        .select("id")
        .eq("workspace_id", targetWorkspaceId)
        .limit(1);

      if (brandList && brandList.length > 0) {
        targetBrandId = brandList[0].id;
      } else {
        // Create brand record in Supabase
        const brandName = body.brandName || "Lumina Creative Studio";
        const { data: newBrand } = await supabaseAdmin
          .from("brands")
          .insert({
            workspace_id: targetWorkspaceId,
            name: brandName,
            slug: brandName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
            tagline: "Autonomous Marketing Brand",
            description: "Managed brand created via Campaign Studio",
            industry: "Design & Technology",
          })
          .select();
        targetBrandId = newBrand?.[0]?.id;
      }
    }

    if (!targetWorkspaceId || !targetBrandId) {
      return NextResponse.json(
        { error: "Could not resolve workspace or brand record in database." },
        { status: 400 }
      );
    }

    // Format channels as TEXT[] array of strings (e.g. ['INSTAGRAM', 'LINKEDIN'])
    const rawChannels = body.channels || (body.selectedPlatforms ? body.selectedPlatforms : ["INSTAGRAM", "LINKEDIN"]);
    const formattedChannels: string[] = Array.isArray(rawChannels)
      ? rawChannels.map((c: any) => (typeof c === "string" ? c : c?.platform || "INSTAGRAM"))
      : ["INSTAGRAM"];

    const campaignPayload = {
      workspace_id: targetWorkspaceId,
      brand_id: targetBrandId,
      name: body.name || body.campaignName || "Omnichannel Campaign",
      objective: body.objective || "AWARENESS",
      status: body.status || "SCHEDULED",
      budget: Number(body.budget) || 5000,
      spend: Number(body.spend || body.spendToDate) || 0,
      start_date: body.startDate || body.scheduledDate || new Date().toISOString(),
      end_date: body.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      channels: formattedChannels,
    };

    const { data: inserted, error: insertErr } = await supabaseAdmin
      .from("campaigns")
      .insert(campaignPayload)
      .select();

    if (insertErr) {
      console.error("Supabase insert campaign error:", insertErr);
      return NextResponse.json(
        { error: insertErr.message || "Failed to persist campaign to database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      campaign: inserted?.[0] || campaignPayload,
      databaseRecordId: inserted?.[0]?.id,
    });
  } catch (err: any) {
    console.error("POST /api/campaigns unexpected error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
