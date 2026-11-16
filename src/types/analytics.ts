export type DataQualityTag = "MOCK" | "ESTIMATED" | "ACTUAL";

export type AttributionModel =
  | "FIRST_TOUCH"
  | "LAST_TOUCH"
  | "LINEAR"
  | "POSITION_BASED";

export type MatrixQuadrant =
  | "CONTINUE_INVESTING"    // High effort / High ROI
  | "OPTIMISE_OR_AUTOMATE"  // High effort / Low ROI
  | "SCALE_IMMEDIATELY"     // Low effort / High ROI
  | "RECONSIDER";           // Low effort / Low ROI

export type MentionSentiment = "POSITIVE" | "NEUTRAL" | "NEGATIVE";

export interface KpiOverviewItem {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  change: string;
  isPositive: boolean;
  trend: number[]; // 10 points sparkline
  dataQuality: DataQualityTag;
  subtext: string;
  comparisonPeriod: string;
}

export interface ChannelPerformanceItem {
  id: string;
  channel: string;
  iconName: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  conversions: number;
  revenue: number;
  cpl: number;
  cpa: number;
  roas: number; // Attributed revenue / ad spend
  roi: number;  // (Attributed revenue - total marketing cost) / total marketing cost * 100%
  color: string;
}

export interface FunnelStage {
  name: string;
  key: "impressions" | "clicks" | "leads" | "qualified" | "conversions" | "revenue";
  count: number;
  label: string;
  dropOffRate?: number; // % drop from previous stage
  conversionRate?: number; // % of total initial
}

export interface CampaignFunnelItem {
  campaignId: string;
  campaignName: string;
  brandName: string;
  objective: string;
  stages: FunnelStage[];
  summary: {
    totalSpend: number;
    totalRevenue: number;
    blendedRoas: number;
    leadToCustomerRate: number;
  };
}

export interface AttributionCreditItem {
  channel: string;
  firstTouchCredit: number; // percentage (0-100)
  lastTouchCredit: number;
  linearCredit: number;
  positionBasedCredit: number;
  firstTouchRevenue: number;
  lastTouchRevenue: number;
  linearRevenue: number;
  positionBasedRevenue: number;
  color: string;
}

export interface ConvertingPathItem {
  id: string;
  path: string[];
  conversionsCount: number;
  conversionRate: number;
  attributedRevenue: number;
  avgDaysToConvert: number;
}

export interface EffortLogActivity {
  id: string;
  activityName: string;
  channel: string;
  // Specific effort inputs
  contentCreationHours: number;
  designHours: number;
  videoProductionHours: number;
  publishingActions: number;
  communityResponses: number;
  campaignManagementHours: number;
  seoWorkHours: number;
  paidSpend: number;
  // Totals
  totalEffortHours: number;
  attributedRoi: number; // percentage
  quadrant: MatrixQuadrant;
  aiRecommendation: string;
  reasoning: string;
  suggestedAgent: string;
}

export interface SocialMentionItem {
  id: string;
  brandId: string;
  platform: "X" | "INSTAGRAM" | "LINKEDIN" | "REDDIT" | "YOUTUBE" | "WEB_NEWS" | "GOOGLE_REVIEWS";
  authorHandle: string;
  authorName: string;
  authorFollowers: number;
  snippet: string;
  sentiment: MentionSentiment;
  sentimentScore: number; // -1.0 to 1.0
  reachEstimate: number;
  keywordMentioned?: string;
  competitorMentioned?: string;
  sourceUrl?: string;
  hasResponseTask: boolean;
  responseTaskId?: string;
  createdAt: string;
}

export interface SocialAlertRule {
  id: string;
  name: string;
  condition: string;
  negativeThreshold: number;
  timeWindowHours: number;
  notifyChannels: string[];
  isEnabled: boolean;
}

export interface AnalyticsReportConfig {
  reportName: string;
  selectedKpis: string[];
  selectedChannels: string[];
  dateRange: "7d" | "30d" | "90d" | "12m";
  isWhiteLabel: boolean;
  companyTitle: string;
  schedule: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";
}
