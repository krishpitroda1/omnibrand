import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MOCK_BRANDS } from "@/lib/mock-data/tenancy";
import { Brand } from "@/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId") || request.headers.get("x-workspace-id");

    let query = supabaseAdmin
      .from("brands")
      .select("*, brand_kits(*)")
      .order("created_at", { ascending: false });

    if (workspaceId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(workspaceId)) {
      query = query.eq("workspace_id", workspaceId);
    }

    const { data: dbBrands, error } = await query;

    if (!error && dbBrands && dbBrands.length > 0) {
      const formattedBrands: Brand[] = dbBrands.map((b: any) => {
        const bk = Array.isArray(b.brand_kits) ? b.brand_kits[0] : b.brand_kits;
        return {
          id: b.id,
          workspaceId: b.workspace_id,
          name: b.name,
          slug: b.slug,
          tagline: b.tagline || "",
          description: b.description || "",
          industry: b.industry || "General",
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
            targetAudience: bk?.target_audience || "Global digital audience",
            doNotSay: bk?.do_not_say || [],
            mustInclude: bk?.must_include || [],
          },
          knowledgeBase: [],
          socialAccounts: [],
        };
      });

      return NextResponse.json({ brands: formattedBrands });
    }

    // Fallback to MOCK_BRANDS if Supabase has no brands yet
    let brands = MOCK_BRANDS;
    if (workspaceId) {
      brands = brands.filter((b) => b.workspaceId === workspaceId);
    }
    return NextResponse.json({ brands });
  } catch (err: any) {
    return NextResponse.json({ brands: MOCK_BRANDS });
  }
}

export async function POST(request: Request) {
  try {
    const supabaseAdmin = createAdminClient();
    const body = await request.json();

    let targetWorkspaceId = body.workspaceId;
    const isWsUuid = targetWorkspaceId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetWorkspaceId);
    if (!isWsUuid) {
      const { data: wsList } = await supabaseAdmin.from("workspaces").select("id").limit(1);
      targetWorkspaceId = wsList?.[0]?.id;
    }

    if (!targetWorkspaceId) {
      return NextResponse.json({ error: "No active workspace found in database" }, { status: 400 });
    }

    const brandName = body.name || body.brandName || "My Brand";
    const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]/g, "-");

    // Insert brand into Supabase
    const { data: newBrand, error: brandErr } = await supabaseAdmin
      .from("brands")
      .insert({
        workspace_id: targetWorkspaceId,
        name: brandName,
        slug: brandSlug,
        tagline: body.tagline || "",
        description: body.description || `${brandName} brand`,
        industry: body.industry || "General",
        website: body.website || "https://",
      })
      .select();

    if (brandErr) {
      return NextResponse.json({ error: brandErr.message }, { status: 500 });
    }

    const createdBrand = newBrand?.[0];

    // Insert brand kit into Supabase
    const primaryColor = body.primaryColor || body.brandKit?.primaryColor || "#3B82F6";
    const secondaryColor = body.secondaryColor || body.brandKit?.secondaryColor || "#0F172A";
    const accentColor = body.accentColor || body.brandKit?.accentColor || "#F43F5E";
    const toneKeywords = body.toneKeywords || body.brandKit?.toneKeywords || ["Modern", "Professional"];
    const toneDirectives = body.toneDirectives || body.brandKit?.toneDirectives || "Speak with clarity and precision.";
    const targetAudience = body.targetAudience || body.brandKit?.targetAudience || "Modern digital audience";

    let createdKit: any = null;
    if (createdBrand) {
      const { data: kitData } = await supabaseAdmin.from("brand_kits").insert({
        brand_id: createdBrand.id,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        accent_color: accentColor,
        tone_keywords: toneKeywords,
        tone_directives: toneDirectives,
        target_audience: targetAudience,
      }).select();
      createdKit = kitData?.[0];
    }

    const formattedCreatedBrand: Brand = {
      id: createdBrand.id,
      workspaceId: createdBrand.workspace_id,
      name: createdBrand.name,
      slug: createdBrand.slug,
      tagline: createdBrand.tagline || "",
      description: createdBrand.description || "",
      industry: createdBrand.industry || "General",
      website: createdBrand.website || "https://",
      isActive: createdBrand.is_active ?? true,
      createdAt: createdBrand.created_at,
      brandKit: {
        id: createdKit?.id || `bk-${createdBrand.id}`,
        brandId: createdBrand.id,
        primaryColor,
        secondaryColor,
        accentColor,
        fontHeading: "Plus Jakarta Sans",
        fontBody: "Plus Jakarta Sans",
        toneKeywords,
        toneDirectives,
        targetAudience,
        doNotSay: [],
        mustInclude: [],
      },
      knowledgeBase: [],
      socialAccounts: [],
    };

    return NextResponse.json({ success: true, brand: formattedCreatedBrand });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create brand" }, { status: 500 });
  }
}
