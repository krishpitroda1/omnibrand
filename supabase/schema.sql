-- ==============================================================================
-- OmniBrand OS - Complete Supabase PostgreSQL Schema & Authentication Setup
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Organizations
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    plan TEXT NOT NULL DEFAULT 'ENTERPRISE',
    ai_credits_limit INT NOT NULL DEFAULT 100000,
    ai_credits_used INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. User Profiles (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'OWNER',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Workspaces (Tenancy layer under Organization)
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Memberships
CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'OWNER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, organization_id, workspace_id)
);

-- 6. Brands
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    industry TEXT NOT NULL DEFAULT 'Technology',
    website TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Brand Design Tokens & Directives
CREATE TABLE IF NOT EXISTS public.brand_kits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL UNIQUE REFERENCES public.brands(id) ON DELETE CASCADE,
    primary_color TEXT NOT NULL DEFAULT '#3B82F6',
    secondary_color TEXT NOT NULL DEFAULT '#0F172A',
    accent_color TEXT NOT NULL DEFAULT '#F43F5E',
    font_heading TEXT NOT NULL DEFAULT 'Plus Jakarta Sans',
    font_body TEXT NOT NULL DEFAULT 'Plus Jakarta Sans',
    tone_keywords TEXT[] NOT NULL DEFAULT ARRAY['Modern', 'Professional', 'Visionary'],
    tone_directives TEXT NOT NULL DEFAULT 'Speak with bold clarity and strategic precision.',
    target_audience TEXT NOT NULL DEFAULT 'Modern digital enterprises and consumers.',
    do_not_say TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    must_include TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Campaigns
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    objective TEXT NOT NULL DEFAULT 'AWARENESS',
    status TEXT NOT NULL DEFAULT 'DRAFT',
    budget NUMERIC(12, 2) NOT NULL DEFAULT 5000.00,
    spend NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    start_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    end_date TIMESTAMPTZ,
    channels TEXT[] NOT NULL DEFAULT ARRAY['INSTAGRAM', 'LINKEDIN'],
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Contacts / CRM
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    lifecycle_stage TEXT NOT NULL DEFAULT 'LEAD',
    consent_status TEXT NOT NULL DEFAULT 'OPTED_IN',
    lead_score INT NOT NULL DEFAULT 50,
    attributed_revenue NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    source TEXT NOT NULL DEFAULT 'Website Enquiry',
    last_interaction_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Automation Journeys
CREATE TABLE IF NOT EXISTS public.journeys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    trigger_type TEXT NOT NULL DEFAULT 'FORM_SUBMISSION',
    canvas_nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
    canvas_edges JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Media Assets & Studio Library
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    name TEXT NOT NULL DEFAULT 'Generated Visual Asset',
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    aspect_ratio TEXT NOT NULL DEFAULT 'SQUARE_1_1',
    width INT NOT NULL DEFAULT 1080,
    height INT NOT NULL DEFAULT 1080,
    format TEXT NOT NULL DEFAULT 'PNG',
    mime_type TEXT NOT NULL DEFAULT 'image/png',
    file_size BIGINT NOT NULL DEFAULT 2048000,
    folder_id TEXT,
    tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    prompt_used TEXT,
    model_used TEXT DEFAULT 'FLUX_1_PRO',
    status TEXT NOT NULL DEFAULT 'APPROVED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Organizations: Members can view their organization
CREATE POLICY "Members can view organization"
    ON public.organizations FOR SELECT
    USING (
        id IN (
            SELECT organization_id FROM public.memberships WHERE user_id = auth.uid()
        )
    );

-- Workspaces: Members can view and manage their workspaces
CREATE POLICY "Members can view workspaces"
    ON public.workspaces FOR ALL
    USING (
        organization_id IN (
            SELECT organization_id FROM public.memberships WHERE user_id = auth.uid()
        )
    );

-- Brands & Kits: Members can manage brands in their organization
CREATE POLICY "Members can manage brands"
    ON public.brands FOR ALL
    USING (
        workspace_id IN (
            SELECT w.id FROM public.workspaces w
            JOIN public.memberships m ON m.organization_id = w.organization_id
            WHERE m.user_id = auth.uid()
        )
    );

CREATE POLICY "Members can manage brand kits"
    ON public.brand_kits FOR ALL
    USING (
        brand_id IN (
            SELECT b.id FROM public.brands b
            JOIN public.workspaces w ON b.workspace_id = w.id
            JOIN public.memberships m ON m.organization_id = w.organization_id
            WHERE m.user_id = auth.uid()
        )
    );

-- Campaigns: Scoped to workspace members
CREATE POLICY "Members can manage campaigns"
    ON public.campaigns FOR ALL
    USING (
        workspace_id IN (
            SELECT w.id FROM public.workspaces w
            JOIN public.memberships m ON m.organization_id = w.organization_id
            WHERE m.user_id = auth.uid()
        )
    );

-- Contacts: Scoped to workspace members
CREATE POLICY "Members can manage contacts"
    ON public.contacts FOR ALL
    USING (
        workspace_id IN (
            SELECT w.id FROM public.workspaces w
            JOIN public.memberships m ON m.organization_id = w.organization_id
            WHERE m.user_id = auth.uid()
        )
    );

-- Journeys: Scoped to workspace members
CREATE POLICY "Members can manage journeys"
    ON public.journeys FOR ALL
    USING (
        workspace_id IN (
            SELECT w.id FROM public.workspaces w
            JOIN public.memberships m ON m.organization_id = w.organization_id
            WHERE m.user_id = auth.uid()
        )
    );

-- Media Assets: Scoped to workspace members
CREATE POLICY "Members can manage media assets"
    ON public.media_assets FOR ALL
    USING (
        workspace_id IN (
            SELECT w.id FROM public.workspaces w
            JOIN public.memberships m ON m.organization_id = w.organization_id
            WHERE m.user_id = auth.uid()
        )
    );

-- ==============================================================================
-- AUTOMATIC SIGNUP TRIGGER (On auth.users insert -> Auto-provision public.profiles)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_org_id UUID;
    new_ws_id UUID;
    org_name_val TEXT;
    full_name_val TEXT;
BEGIN
    full_name_val := COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));
    org_name_val := COALESCE(new.raw_user_meta_data->>'companyName', full_name_val || ' Holdings');

    -- 1. Create Organization
    INSERT INTO public.organizations (name, slug, plan)
    VALUES (
        org_name_val,
        lower(regexp_replace(org_name_val, '[^a-zA-Z0-9]', '-', 'g')) || '-' || substring(new.id::text, 1, 6),
        'ENTERPRISE'
    )
    RETURNING id INTO new_org_id;

    -- 2. Create Default Workspace
    INSERT INTO public.workspaces (organization_id, name, slug)
    VALUES (
        new_org_id,
        'Main Marketing HQ',
        'main-marketing-hq'
    )
    RETURNING id INTO new_ws_id;

    -- 3. Create Profile
    INSERT INTO public.profiles (id, organization_id, name, email, avatar_url, role)
    VALUES (
        new.id,
        new_org_id,
        full_name_val,
        new.email,
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        'OWNER'
    );

    -- 4. Create Membership
    INSERT INTO public.memberships (user_id, organization_id, workspace_id, role)
    VALUES (new.id, new_org_id, new_ws_id, 'OWNER');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop if exists and recreate trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
