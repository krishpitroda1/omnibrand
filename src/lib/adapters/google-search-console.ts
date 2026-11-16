import {
  IntegrationAdapter,
  AdapterCapability,
  PublishPayload,
  PublishResult,
  AnalyticsParams,
  AnalyticsResult,
  WebhookResult,
} from "./base-adapter";

export class GoogleSearchConsoleAdapter implements IntegrationAdapter {
  id = "adapter-gsc";
  name = "Google Search Console API";
  provider = "GOOGLE_SEARCH_CONSOLE";
  capabilities: AdapterCapability[] = ["READ", "ANALYTICS"];

  async connect(credentials: Record<string, string>) {
    return { success: true, accountId: "gsc_property_omnibrand_io" };
  }

  async disconnect(accountId: string) {
    return true;
  }

  async publish(payload: PublishPayload): Promise<PublishResult> {
    return {
      success: true,
      postId: "sitemap_ping_ok",
      publishedAt: new Date().toISOString(),
    };
  }

  async fetchAnalytics(params: AnalyticsParams): Promise<AnalyticsResult> {
    return {
      impressions: 1310000,
      clicks: 64800,
      spend: 0,
      conversions: 0,
      revenue: 0,
    };
  }

  async handleWebhook(rawBody: string, headers: Record<string, string>): Promise<WebhookResult> {
    return { handled: true, event: "gsc.crawl_complete", data: {} };
  }
}

export class GA4Adapter implements IntegrationAdapter {
  id = "adapter-ga4";
  name = "Google Analytics 4 Data API";
  provider = "GA4";
  capabilities: AdapterCapability[] = ["READ", "ANALYTICS"];

  async connect(credentials: Record<string, string>) {
    return { success: true, accountId: "ga4_prop_394810294" };
  }

  async disconnect(accountId: string) {
    return true;
  }

  async publish(payload: PublishPayload): Promise<PublishResult> {
    throw new Error("GA4 does not support outbound publishing");
  }

  async fetchAnalytics(params: AnalyticsParams): Promise<AnalyticsResult> {
    return {
      impressions: 890000,
      clicks: 177000,
      spend: 0,
      conversions: 8050,
      revenue: 368420,
    };
  }

  async handleWebhook(rawBody: string, headers: Record<string, string>): Promise<WebhookResult> {
    return { handled: true, event: "ga4.measurement_protocol", data: {} };
  }
}

export class GoogleBusinessProfileAdapter implements IntegrationAdapter {
  id = "adapter-gbp";
  name = "Google Business Profile Location API";
  provider = "GOOGLE_BUSINESS";
  capabilities: AdapterCapability[] = ["PUBLISH", "READ", "WEBHOOK", "ANALYTICS"];

  async connect(credentials: Record<string, string>) {
    return { success: true, accountId: "gbp_loc_apex_hq" };
  }

  async disconnect(accountId: string) {
    return true;
  }

  async publish(payload: PublishPayload): Promise<PublishResult> {
    // Publishes review response or local business post
    return {
      success: true,
      postId: `gbp_post_${Date.now()}`,
      publishedAt: new Date().toISOString(),
    };
  }

  async fetchAnalytics(params: AnalyticsParams): Promise<AnalyticsResult> {
    return {
      impressions: 37800,
      clicks: 3780,
      spend: 0,
      conversions: 240,
      revenue: 14200,
    };
  }

  async handleWebhook(rawBody: string, headers: Record<string, string>): Promise<WebhookResult> {
    return { handled: true, event: "gbp.review_created", data: JSON.parse(rawBody || "{}") };
  }
}

export const gscAdapter = new GoogleSearchConsoleAdapter();
export const ga4Adapter = new GA4Adapter();
export const gbpAdapter = new GoogleBusinessProfileAdapter();
