export type AdapterCapability =
  | "PUBLISH"
  | "READ"
  | "WEBHOOK"
  | "ANALYTICS"
  | "MESSAGING"
  | "ADS"
  | "AI_GENERATION";

export interface PublishPayload {
  content: string;
  mediaUrls?: string[];
  platforms?: string[];
  scheduledAt?: string;
  metadata?: Record<string, unknown>;
}

export interface PublishResult {
  success: boolean;
  postId?: string;
  externalUrl?: string;
  publishedAt?: string;
  errorCode?: string;
  errorMessage?: string;
  rawResponse?: unknown;
}

export interface AnalyticsParams {
  startDate: string;
  endDate: string;
  metrics?: string[];
  dimensions?: string[];
}

export interface AnalyticsResult {
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  revenue: number;
  timeSeries?: Array<{ date: string; value: number }>;
}

export interface WebhookResult {
  handled: boolean;
  event: string;
  data: Record<string, unknown>;
}

export interface IntegrationAdapter {
  id: string;
  name: string;
  provider: string;
  capabilities: AdapterCapability[];
  connect(credentials: Record<string, string>): Promise<{ success: boolean; accountId?: string; error?: string }>;
  disconnect(accountId: string): Promise<boolean>;
  publish(payload: PublishPayload): Promise<PublishResult>;
  fetchAnalytics(params: AnalyticsParams): Promise<AnalyticsResult>;
  handleWebhook(rawBody: string, headers: Record<string, string>): Promise<WebhookResult>;
}
