-- ============================================================================
-- OmniBrand OS: PostgreSQL Row-Level Security (RLS) Policies
-- Commercial Hardening Architecture: Multi-Tenant Data Isolation
-- ============================================================================

-- 1. Create session-level variable accessor function
CREATE OR REPLACE FUNCTION current_workspace_id() RETURNS TEXT AS $$
BEGIN
    RETURN current_setting('app.current_workspace_id', true);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 2. ENABLE ROW LEVEL SECURITY ON ALL TENANT-SCOPED TABLES

-- Brands
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_brands ON brands
    AS RESTRICTIVE
    FOR ALL
    USING (workspace_id = current_workspace_id())
    WITH CHECK (workspace_id = current_workspace_id());

-- Campaigns
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_campaigns ON campaigns
    AS RESTRICTIVE
    FOR ALL
    USING (workspace_id = current_workspace_id())
    WITH CHECK (workspace_id = current_workspace_id());

-- Content Items
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_content_items ON content_items
    AS RESTRICTIVE
    FOR ALL
    USING (workspace_id = current_workspace_id())
    WITH CHECK (workspace_id = current_workspace_id());

-- Social Accounts
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_social_accounts ON social_accounts
    AS RESTRICTIVE
    FOR ALL
    USING (workspace_id = current_workspace_id())
    WITH CHECK (workspace_id = current_workspace_id());

-- CRM Contacts
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_contacts ON contacts
    AS RESTRICTIVE
    FOR ALL
    USING (workspace_id = current_workspace_id())
    WITH CHECK (workspace_id = current_workspace_id());

-- API Credentials
ALTER TABLE api_credentials ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_api_credentials ON api_credentials
    AS RESTRICTIVE
    FOR ALL
    USING (workspace_id = current_workspace_id())
    WITH CHECK (workspace_id = current_workspace_id());

-- Analytics Ad Spends
ALTER TABLE ad_spends ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_ad_spends ON ad_spends
    AS RESTRICTIVE
    FOR ALL
    USING (workspace_id = current_workspace_id())
    WITH CHECK (workspace_id = current_workspace_id());

-- Effort Logs (2x2 Matrix)
ALTER TABLE effort_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_effort_logs ON effort_logs
    AS RESTRICTIVE
    FOR ALL
    USING (workspace_id = current_workspace_id())
    WITH CHECK (workspace_id = current_workspace_id());

-- Social Mentions (Listening Layer)
ALTER TABLE mentions ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_mentions ON mentions
    AS RESTRICTIVE
    FOR ALL
    USING (workspace_id = current_workspace_id())
    WITH CHECK (workspace_id = current_workspace_id());

-- SEO Tracked Keywords
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_keywords ON keywords
    AS RESTRICTIVE
    FOR ALL
    USING (workspace_id = current_workspace_id())
    WITH CHECK (workspace_id = current_workspace_id());

-- Audit Logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_audit_logs ON audit_logs
    AS RESTRICTIVE
    FOR ALL
    USING (workspace_id = current_workspace_id())
    WITH CHECK (workspace_id = current_workspace_id());

-- 3. BYPASS PERMISSION FOR REPLICATION / MIGRATION ROLES ONLY
-- Note: omnibrand_app role should never have BYPASSRLS
-- Example pooler connection init:
-- SET app.current_workspace_id = 'ws-prod-01';
