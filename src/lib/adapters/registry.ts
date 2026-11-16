import { IntegrationAdapter } from "./base-adapter";
import { ayrshareAdapter } from "./ayrshare";
import {
  instagramAdapter,
  linkedinAdapter,
  xAdapter,
  facebookAdapter,
  pinterestAdapter,
} from "./direct-social";
import { smsCloudHubAdapter } from "./smscloud-hub";
import { emailAdapter } from "./email";
import { gscAdapter, ga4Adapter, gbpAdapter } from "./google-search-console";
import { metaAdsAdapter, googleAdsAdapter } from "./meta-ads";
import { aiGatewayAdapter } from "./ai-gateway";

export const ADAPTER_REGISTRY: Record<string, IntegrationAdapter> = {
  AYRSHARE: ayrshareAdapter,
  INSTAGRAM: instagramAdapter,
  LINKEDIN: linkedinAdapter,
  X: xAdapter,
  FACEBOOK: facebookAdapter,
  PINTEREST: pinterestAdapter,
  SMSCLOUD_HUB: smsCloudHubAdapter,
  EMAIL: emailAdapter,
  GOOGLE_SEARCH_CONSOLE: gscAdapter,
  GA4: ga4Adapter,
  GOOGLE_BUSINESS: gbpAdapter,
  META_ADS: metaAdsAdapter,
  GOOGLE_ADS: googleAdsAdapter,
  AI_GATEWAY: aiGatewayAdapter,
};

export function getAdapter(provider: string): IntegrationAdapter | undefined {
  return ADAPTER_REGISTRY[provider.toUpperCase()];
}

export function getAllAdapters(): IntegrationAdapter[] {
  return Object.values(ADAPTER_REGISTRY);
}
