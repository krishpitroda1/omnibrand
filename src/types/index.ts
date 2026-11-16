export type Plan = "STARTER" | "PRO" | "ENTERPRISE";

export type Platform =
  | "INSTAGRAM"
  | "FACEBOOK"
  | "LINKEDIN"
  | "X"
  | "YOUTUBE"
  | "TIKTOK"
  | "PINTEREST"
  | "THREADS"
  | "GOOGLE_BUSINESS";

export type AccountCapability = "PUBLISH" | "READ" | "WEBHOOK" | "RESTRICTED";

export type MemberRole =
  | "OWNER"
  | "ADMIN"
  | "MANAGER"
  | "CREATOR"
  | "ANALYST"
  | "VIEWER";

export type ContentStatus =
  | "DRAFT"
  | "GENERATING"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "SCHEDULED"
  | "PUBLISHING"
  | "PUBLISHED"
  | "FAILED"
  | "PARTIAL";

export type AspectRatio =
  | "SQUARE_1_1"
  | "LANDSCAPE_16_9"
  | "PORTRAIT_4_5"
  | "VERTICAL_9_16";

export type AiModel = "FLUX_1_PRO" | "DALLE_3" | "SDXL_TURBO";

export type AgentMode = "AUTO" | "AI_PLUS_HUMAN" | "HUMAN_ONLY";

export type CampaignObjective =
  | "AWARENESS"
  | "LEADS"
  | "SALES"
  | "ENGAGEMENT"
  | "RETENTION"
  | "APP_DOWNLOAD"
  | "FEEDBACK";

export type OmniChannel =
  | "WHATSAPP"
  | "RCS"
  | "SMS"
  | "VOICE"
  | "EMAIL"
  | "WEB_PUSH";

export type TemplateCategory = "MARKETING" | "UTILITY" | "AUTHENTICATION";

export type TemplateStatus = "APPROVED" | "PENDING" | "REJECTED";

export type ConsentStatus = "OPTED_IN" | "OPTED_OUT" | "UNKNOWN";

export type SendStatus =
  | "QUEUED"
  | "SENT"
  | "DELIVERED"
  | "READ"
  | "CLICKED"
  | "FAILED"
  | "OPTED_OUT";

export type MetricType = "MOCK" | "ESTIMATED" | "ACTUAL";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: Plan;
  customDomain?: string;
  whiteLabel: boolean;
  billingEmail: string;
  aiCreditsLimit: number;
  aiCreditsUsed: number;
  msgCreditsLimit: number;
  msgCreditsUsed: number;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  role?: MemberRole;
  isActive: boolean;
  createdAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  workspaceId?: string;
  role: MemberRole;
  user?: User;
  createdAt: string;
}

export interface BrandKit {
  id: string;
  brandId: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  logoLightUrl?: string;
  logoDarkUrl?: string;
  iconUrl?: string;
  toneKeywords: string[];
  toneDirectives: string;
  targetAudience: string;
  doNotSay: string[];
  mustInclude: string[];
}

export interface BrandKnowledgeItem {
  id: string;
  brandId: string;
  title: string;
  category: "GENERAL" | "PRODUCT" | "FAQ" | "POLICY" | "VOICE";
  content: string;
  fileUrl?: string;
  fileType?: string;
  tokenCount: number;
  isIndexed: boolean;
  createdAt: string;
}

export interface SocialAccount {
  id: string;
  brandId: string;
  workspaceId: string;
  platform: Platform;
  handle: string;
  displayName: string;
  avatarUrl?: string;
  profileUrl?: string;
  capabilities: AccountCapability[];
  followerCount: number;
  isConnected: boolean;
  health: {
    status: "HEALTHY" | "DEGRADED" | "EXPIRED" | "RATE_LIMITED";
    lastSyncAt: string;
    errorCount: number;
    lastErrorMessage?: string;
    rateLimitRemaining: number;
    latencyMs: number;
  };
}

export interface Brand {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  industry: string;
  website: string;
  isActive: boolean;
  brandKit: BrandKit;
  knowledgeBase: BrandKnowledgeItem[];
  socialAccounts: SocialAccount[];
  createdAt: string;
}

export interface ApiCredential {
  id: string;
  workspaceId: string;
  provider: string;
  keyName: string;
  maskedValue: string;
  encryptedValue?: string;
  keyVersion: number;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  rotatedAt: string;
  lastUsedAt?: string;
}

export interface AuditLogItem {
  id: string;
  organizationId: string;
  workspaceId: string;
  actorId?: string;
  actorName: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

export interface IntegrationCard {
  id: string;
  name: string;
  category: "Social" | "Messaging" | "Email" | "SEO" | "Analytics" | "Ads" | "AI";
  description: string;
  icon: string;
  status: "CONNECTED" | "NOT_CONNECTED" | "ERROR";
  connectedAt?: string;
  accountName?: string;
  badges: string[];
}

// ============================================================================
// MODULE 03: CONTENT STUDIO
// ============================================================================

export type ContentAssetType = "IMAGE" | "VIDEO" | "COPY" | "TEMPLATE";

export interface MediaAssetItem {
  id: string;
  workspaceId: string;
  brandId: string;
  brandName?: string;
  url: string;
  thumbnailUrl?: string;
  aspectRatio: AspectRatio;
  width?: number;
  height?: number;
  dimensions?: string; // e.g. "1080×1080"
  format: string; // "PNG" | "JPG" | "WEBP" | "MP4"
  mimeType: string;
  fileSize: number; // in bytes
  folderId?: string; // e.g. "brand-lumina/campaign-2026/nov"
  tags: string[];
  rightsExpiry?: string;
  promptUsed?: string;
  modelUsed?: AiModel;
  seed?: string;
  isFavorite: boolean;
  usageCount: number;
  campaignsUsed?: string[];
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ContentFolderItem {
  id: string;
  name: string;
  path: string;
  brandId: string;
  itemCount: number;
}

export interface ContentTemplateItem {
  id: string;
  workspaceId: string;
  brandId: string;
  brandName?: string;
  name: string;
  description: string;
  category: "PROMO" | "PRODUCT_LAUNCH" | "EVENT" | "THOUGHT_LEADERSHIP" | "QUOTE";
  thumbnailUrl?: string;
  platforms: Platform[];
  aspectRatio: AspectRatio;
  promptTemplate?: string;
  copyTemplate?: string;
  hashtags: string[];
  stylePreset?: string;
  isBrandDefault: boolean;
  createdAt: string;
}

export interface VersionHistoryItem {
  id: string;
  workspaceId: string;
  assetId: string;
  versionNumber: number;
  changeSummary: string;
  modifiedByName: string;
  createdAt: string;
  previewUrl?: string;
  dimensions?: string;
}

export interface AssetUsageItem {
  id: string;
  workspaceId: string;
  assetId: string;
  campaignId: string;
  campaignName: string;
  channel: Platform;
  usedAt: string;
}

// ============================================================================
// MODULE 06: AI AGENT CENTRE
// ============================================================================

export type AgentStatus = "ACTIVE" | "PAUSED" | "DISABLED";

export type AgentType =
  | "CONTENT_AGENT"
  | "BRAND_GUARDIAN"
  | "PUBLISHING_AGENT"
  | "ENGAGEMENT_AGENT"
  | "WHATSAPP_AGENT"
  | "LEAD_AGENT"
  | "SEO_AGENT"
  | "ANALYTICS_AGENT"
  | "CAMPAIGN_AGENT";

export type RunOutcome = "SUCCESS" | "ESCALATED" | "FAILED" | "BLOCKED";

export type EscalationStatus = "PENDING" | "APPROVED" | "REJECTED" | "EDITED_APPROVED";

export interface AgentItem {
  id: string;
  workspaceId: string;
  type: AgentType;
  name: string;
  role: string;
  description: string;
  mode: AgentMode;
  status: AgentStatus;
  spendCapDaily: number; // credits/day
  spendToday: number;
  runsToday: number;
  successRate: number; // e.g. 98.6%
  lastRunAt?: string;
  allowedChannels: string[];
  escalationRules: {
    rule: string;
    condition: string;
    action: string;
  }[];
  guardrails: {
    name: string;
    enforced: boolean;
    description: string;
  }[];
  brandScope: string[];
  iconName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentRunItem {
  id: string;
  workspaceId: string;
  agentId: string;
  agentName: string;
  agentType: AgentType;
  input: string;
  outputSummary: string;
  tokensUsed: number;
  creditsCost: number;
  durationMs: number;
  outcome: RunOutcome;
  humanApprovalRequired: boolean;
  decisionExplanation: string;
  whySuggested: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface AgentEscalationItem {
  id: string;
  workspaceId: string;
  agentId: string;
  agentName: string;
  agentType: AgentType;
  runId?: string;
  title: string;
  context: string;
  proposedAction: string;
  reason: string;
  status: EscalationStatus;
  slaDeadline: string; // ISO date string
  slaMinutesRemaining: number;
  resolvedByUserId?: string;
  resolvedByName?: string;
  resolvedAt?: string;
  rejectionReason?: string;
  editedAction?: string;
  createdAt: string;
}

// ============================================================================
// MODULE 07: CUSTOMER CRM
// ============================================================================

export type LifecycleStage =
  | "SUBSCRIBER"
  | "LEAD"
  | "MQL"
  | "SQL"
  | "CUSTOMER"
  | "CHURNED";

export interface ContactIdentityItem {
  id: string;
  type: "EMAIL" | "PHONE" | "INSTAGRAM_HANDLE" | "LINKEDIN_HANDLE" | "DEVICE_ID";
  value: string;
  confidenceScore: number; // e.g. 0.98
  verifiedAt: string;
  isPrimary: boolean;
}

export interface CrmInteractionEvent {
  id: string;
  channel: OmniChannel | Platform | "WEBSITE" | "QR_CODE";
  eventType: "COMMENT" | "INBOUND_MSG" | "EMAIL_CLICK" | "FORM_SUBMISSION" | "QR_SCAN" | "WEBSITE_ENQUIRY";
  contentSnippet: string;
  campaignLink?: string;
  campaignName?: string;
  timestamp: string;
}

export interface CrmContactItem {
  id: string;
  workspaceId: string;
  name: string;
  primaryIdentifier: string; // email or phone
  email: string;
  phone: string;
  company: string;
  role: string;
  avatarUrl?: string;
  channels: (OmniChannel | Platform)[];
  source: string; // "Instagram Ad", "Website Lead Form", "WhatsApp Inbound", "LinkedIn Campaign"
  lifecycleStage: LifecycleStage;
  consentStatus: ConsentStatus;
  leadScore: number; // 0 - 100
  lastInteractionAt: string;
  attributedRevenue: number;
  ltvEstimate: number;
  firstTouchCampaign?: string;
  firstTouchCreative?: string;
  lastTouchCampaign?: string;
  lastTouchCreative?: string;
  journeyMembership?: string[];
  tags: string[];
  owner: string;
  identities: ContactIdentityItem[];
  interactions: CrmInteractionEvent[];
  aiInsights: {
    summary: string;
    predictedChurnRisk: "LOW" | "MEDIUM" | "HIGH";
    recommendedNextAction: string;
    actionType: "WHATSAPP_NUDGE" | "RETAINER_PROPOSAL" | "SCHEDULE_CALL" | "VIP_INVITE";
  };
  createdAt: string;
  updatedAt: string;
}

export interface SegmentRule {
  id: string;
  field: string; // "leadScore", "lifecycleStage", "channels", "attributedRevenue", "tags"
  operator: "equals" | "greater_than" | "less_than" | "contains" | "in";
  value: string;
  combinator: "AND" | "OR";
}

export interface SavedSegment {
  id: string;
  name: string;
  description: string;
  rules: SegmentRule[];
  audienceCount: number;
  createdAt: string;
}

// ============================================================================
// MODULE 10: AUTOMATION CENTRE
// ============================================================================

export type JourneyStatus = "DRAFT" | "PUBLISHED" | "PAUSED" | "ARCHIVED";

export type JourneyStepType =
  | "TRIGGER"
  | "CONDITION"
  | "DELAY"
  | "CHANNEL_ACTION"
  | "AI_AGENT_ACTION"
  | "HUMAN_APPROVAL"
  | "GOAL_CONVERSION"
  | "END";

export interface JourneyItem {
  id: string;
  workspaceId: string;
  brandId: string;
  brandName?: string;
  name: string;
  description: string;
  status: JourneyStatus;
  version: number;
  triggerType: string;
  canvasData?: Record<string, unknown>; // ReactFlow nodes & edges snapshot
  enrolledCount: number;
  completedCount: number;
  conversionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface TriggerCardItem {
  id: string;
  triggerType: string;
  name: string;
  channel: string;
  iconName: string;
  description: string;
  category: "Social" | "Messaging" | "Web & Forms";
}

export interface AutomationRuleItem {
  id: string;
  workspaceId: string;
  brandId: string;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | "TEST_MODE";
  triggerType: string;
  triggerLabel: string;
  actionType: string;
  actionLabel: string;
  conditionText: string;
  executionCount: number;
  lastExecutedAt?: string;
  createdAt: string;
}

export interface EventLogItem {
  id: string;
  workspaceId: string;
  eventName: string;
  source: string;
  status: "PENDING" | "PROCESSED" | "FAILED" | "RETRIED" | "DLQ";
  payload: Record<string, unknown>;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
  processedAt?: string;
  createdAt: string;
}

export interface IntegrationRegistryItem {
  id: string;
  name: string;
  category: string;
  provider: string;
  webhookUrl: string;
  rateLimit: string;
  currentUsage: string;
  healthStatus: "HEALTHY" | "DEGRADED" | "DOWN";
  lastHeartbeat: string;
}




export * from "./analytics";
export * from "./seo";
