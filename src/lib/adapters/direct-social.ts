import {
  IntegrationAdapter,
  AdapterCapability,
  PublishPayload,
  PublishResult,
  AnalyticsParams,
  AnalyticsResult,
  WebhookResult,
} from "./base-adapter";

export type SocialPlatformType = "INSTAGRAM" | "LINKEDIN" | "X" | "FACEBOOK" | "PINTEREST";

export class DirectSocialAdapter implements IntegrationAdapter {
  id: string;
  name: string;
  provider: string;
  platform: SocialPlatformType;
  capabilities: AdapterCapability[];

  constructor(platform: SocialPlatformType) {
    this.platform = platform;
    this.id = `adapter-${platform.toLowerCase()}`;
    this.name = `Direct ${platform} Graph API`;
    this.provider = platform;
    this.capabilities = ["PUBLISH", "READ", "WEBHOOK", "ANALYTICS"];
  }

  async connect(credentials: Record<string, string>) {
    if (!credentials.accessToken) {
      return { success: false, error: `Missing ${this.platform} access token` };
    }
    return { success: true, accountId: `act_${this.platform.toLowerCase()}_${Date.now()}` };
  }

  async disconnect(accountId: string) {
    return true;
  }

  async publish(payload: PublishPayload): Promise<PublishResult> {
    return {
      success: true,
      postId: `${this.platform.toLowerCase()}_pub_${Date.now()}`,
      externalUrl: `https://${this.platform.toLowerCase()}.com/post/ref_${Date.now()}`,
      publishedAt: new Date().toISOString(),
    };
  }

  async fetchAnalytics(params: AnalyticsParams): Promise<AnalyticsResult> {
    return {
      impressions: 120000,
      clicks: 4500,
      spend: 3200,
      conversions: 140,
      revenue: 18500,
    };
  }

  async handleWebhook(rawBody: string, headers: Record<string, string>): Promise<WebhookResult> {
    const data = JSON.parse(rawBody || "{}");
    return {
      handled: true,
      event: `${this.platform.toLowerCase()}.webhook`,
      data,
    };
  }
}

export const instagramAdapter = new DirectSocialAdapter("INSTAGRAM");
export const linkedinAdapter = new DirectSocialAdapter("LINKEDIN");
export const xAdapter = new DirectSocialAdapter("X");
export const facebookAdapter = new DirectSocialAdapter("FACEBOOK");
export const pinterestAdapter = new DirectSocialAdapter("PINTEREST");
