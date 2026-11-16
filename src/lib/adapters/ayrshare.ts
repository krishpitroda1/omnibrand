import {
  IntegrationAdapter,
  AdapterCapability,
  PublishPayload,
  PublishResult,
  AnalyticsParams,
  AnalyticsResult,
  WebhookResult,
} from "./base-adapter";

export class AyrshareAdapter implements IntegrationAdapter {
  id = "adapter-ayrshare";
  name = "Ayrshare Social API";
  provider = "AYRSHARE";
  capabilities: AdapterCapability[] = ["PUBLISH", "READ", "WEBHOOK", "ANALYTICS"];

  async connect(credentials: Record<string, string>) {
    if (!credentials.apiKey) {
      return { success: false, error: "Missing Ayrshare API key" };
    }
    return { success: true, accountId: "ayr_profile_apex_prod" };
  }

  async disconnect(accountId: string) {
    return true;
  }

  async publish(payload: PublishPayload): Promise<PublishResult> {
    // In production: POST https://app.ayrshare.com/api/post
    // In dev / mock:
    return {
      success: true,
      postId: `ayr_post_${Date.now()}`,
      externalUrl: "https://instagram.com/p/mock_post_live",
      publishedAt: new Date().toISOString(),
    };
  }

  async fetchAnalytics(params: AnalyticsParams): Promise<AnalyticsResult> {
    return {
      impressions: 485000,
      clicks: 28400,
      spend: 14400,
      conversions: 840,
      revenue: 86400,
    };
  }

  async handleWebhook(rawBody: string, headers: Record<string, string>): Promise<WebhookResult> {
    const data = JSON.parse(rawBody || "{}");
    return {
      handled: true,
      event: data.action || "post.status",
      data,
    };
  }
}

export const ayrshareAdapter = new AyrshareAdapter();
