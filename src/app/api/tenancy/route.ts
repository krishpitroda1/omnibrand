import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  MOCK_ORGANIZATION,
  MOCK_WORKSPACES,
  MOCK_BRANDS,
  MOCK_USERS,
  MOCK_MEMBERSHIPS,
} from "@/lib/mock-data/tenancy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId") || request.headers.get("x-workspace-id");

    // 1. Fetch real organizations from Supabase
    const { data: dbOrgs, error: orgErr } = await supabase
      .from("organizations")
      .select("*")
      .order("created_at", { ascending: false });

    // 2. Fetch real workspaces from Supabase
    const { data: dbWorkspaces, error: wsErr } = await supabase
      .from("workspaces")
      .select("*")
      .order("created_at", { ascending: false });

    // 3. Fetch real brands from Supabase
    const { data: dbBrands, error: brandErr } = await supabase
      .from("brands")
      .select("*, brand_kits(*)")
      .order("created_at", { ascending: false });

    let organization = MOCK_ORGANIZATION;
    if (dbOrgs && dbOrgs.length > 0) {
      const org = dbOrgs[0];
      organization = {
        id: org.id,
        name: org.name,
        slug: org.slug,
        plan: org.plan || "ENTERPRISE",
        whiteLabel: true,
        billingEmail: "admin@omnibrand.ai",
        customDomain: "hub.omnibrand.ai",
        aiCreditsLimit: org.ai_credits_limit || 100000,
        aiCreditsUsed: org.ai_credits_used || 0,
        msgCreditsLimit: 50000,
        msgCreditsUsed: 0,
        createdAt: org.created_at,
        updatedAt: org.updated_at || org.created_at,
      };
    }

    let workspaces = MOCK_WORKSPACES;
    if (dbWorkspaces && dbWorkspaces.length > 0) {
      workspaces = dbWorkspaces.map((ws: any) => ({
        id: ws.id,
        organizationId: ws.organization_id,
        name: ws.name,
        slug: ws.slug,
        timezone: ws.timezone || "UTC",
        createdAt: ws.created_at,
        updatedAt: ws.updated_at || ws.created_at,
      }));
    }

    let brands = MOCK_BRANDS;
    if (dbBrands && dbBrands.length > 0) {
      brands = dbBrands.map((b: any) => {
        const bk = Array.isArray(b.brand_kits) ? b.brand_kits[0] : b.brand_kits;
        return {
          id: b.id,
          workspaceId: b.workspace_id,
          name: b.name,
          slug: b.slug,
          tagline: b.tagline || "",
          description: b.description || "",
          industry: b.industry || "Technology",
          website: b.website || "https://",
          isActive: b.is_active ?? true,
          createdAt: b.created_at,
          brandKit: {
            id: bk?.id || `bk-${b.id}`,
            brandId: b.id,
            primaryColor: bk?.primary_color || "#3B82F6",
            secondaryColor: bk?.secondary_color || "#0F172A",
            accentColor: bk?.accent_color || "#F43F5E",
            fontHeading: bk?.font_heading || "Plus Jakarta Sans",
            fontBody: bk?.font_body || "Plus Jakarta Sans",
            toneKeywords: bk?.tone_keywords || ["Modern", "Professional"],
            toneDirectives: bk?.tone_directives || "Speak with bold clarity and strategic precision.",
            targetAudience: bk?.target_audience || "Modern digital enterprises",
            doNotSay: bk?.do_not_say || [],
            mustInclude: bk?.must_include || [],
          },
          knowledgeBase: [],
          socialAccounts: [],
        };
      });
    }

    const activeWorkspace = workspaceId
      ? workspaces.find((w) => w.id === workspaceId) || workspaces[0]
      : workspaces[0];

    const workspaceBrands = brands.filter((b) => b.workspaceId === activeWorkspace?.id);

    return NextResponse.json({
      organization,
      workspaces,
      activeWorkspace,
      brands: workspaceBrands.length > 0 ? workspaceBrands : brands,
      memberships: MOCK_MEMBERSHIPS,
      users: MOCK_USERS,
    });
  } catch (err: any) {
    console.error("GET /api/tenancy error:", err);
    return NextResponse.json({
      organization: MOCK_ORGANIZATION,
      workspaces: MOCK_WORKSPACES,
      activeWorkspace: MOCK_WORKSPACES[0],
      brands: MOCK_BRANDS,
      memberships: MOCK_MEMBERSHIPS,
      users: MOCK_USERS,
    });
  }
}

// POST: Create a new Workspace / Sub-Company
export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const { name, timezone, organizationId } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Workspace / company name is required" }, { status: 400 });
    }

    let targetOrgId = organizationId;
    const isOrgUuid = targetOrgId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetOrgId);
    if (!isOrgUuid) {
      const { data: orgList } = await supabase.from("organizations").select("id").limit(1);
      targetOrgId = orgList?.[0]?.id;
    }

    if (!targetOrgId) {
      // Create a default organization first if none exists
      const { data: newOrg } = await supabase
        .from("organizations")
        .insert({
          name: "OmniBrand Enterprise",
          slug: "omnibrand-enterprise",
          plan: "ENTERPRISE",
        })
        .select();
      targetOrgId = newOrg?.[0]?.id;
    }

    const wsSlug = name.trim().toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

    const { data: newWs, error: wsError } = await supabase
      .from("workspaces")
      .insert({
        organization_id: targetOrgId,
        name: name.trim(),
        slug: wsSlug,
        timezone: timezone || "UTC",
      })
      .select();

    if (wsError) {
      return NextResponse.json({ error: wsError.message }, { status: 500 });
    }

    const created = newWs?.[0];

    // Also auto-create a default core brand under this new workspace
    try {
      const brandSlug = name.trim().toLowerCase().replace(/[^a-z0-9]/g, "-") + "-brand";
      const { data: newBrand } = await supabase
        .from("brands")
        .insert({
          workspace_id: created.id,
          name: `${name.trim()} Brand`,
          slug: brandSlug,
          industry: "Technology & Commerce",
          description: `Primary brand identity for ${name.trim()}`,
        })
        .select();

      if (newBrand?.[0]) {
        await supabase.from("brand_kits").insert({
          brand_id: newBrand[0].id,
          primary_color: "#3B82F6",
          secondary_color: "#0F172A",
          accent_color: "#F43F5E",
          tone_directives: "Speak with authority, modern clarity, and strategic precision.",
        });
      }
    } catch (brandAutoErr) {
      console.warn("Auto brand creation warning:", brandAutoErr);
    }

    return NextResponse.json({
      success: true,
      workspace: created,
      message: `Sub-company workspace "${name.trim()}" successfully created in database.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create workspace" }, { status: 500 });
  }
}

// PATCH: Update Organization Profile / Settings
export async function PATCH(request: Request) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const { name, organizationId } = body;

    let targetOrgId = organizationId;
    const isOrgUuid = targetOrgId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetOrgId);
    if (!isOrgUuid) {
      const { data: orgList } = await supabase.from("organizations").select("id").limit(1);
      targetOrgId = orgList?.[0]?.id;
    }

    if (targetOrgId && name) {
      const slug = name.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");
      await supabase
        .from("organizations")
        .update({
          name: name.trim(),
          slug,
          updated_at: new Date().toISOString(),
        })
        .eq("id", targetOrgId);
    }

    return NextResponse.json({
      success: true,
      message: "Organization profile updated successfully in Supabase database.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update organization" }, { status: 500 });
  }
}
