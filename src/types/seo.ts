export type SearchIntent =
  | "INFORMATIONAL"
  | "COMMERCIAL"
  | "TRANSACTIONAL"
  | "NAVIGATIONAL";

export type AuditSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface DailySearchMetric {
  date: string;
  // Search Console
  gscImpressions: number;
  gscClicks: number;
  gscCtr: number;
  gscAveragePosition: number;
  // GA4
  ga4Sessions: number;
  ga4Conversions: number;
  ga4BounceRate: number;
  // Google Business Profile
  gbpViews: number;
  gbpSearches: number;
  gbpCalls: number;
  gbpDirections: number;
}

export interface GscQueryItem {
  id: string;
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  previousPosition: number;
  movement: number;
}

export interface GscPageItem {
  id: string;
  url: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  indexStatus: "INDEXED" | "EXCLUDED" | "CRAWLED_NOT_INDEXED";
}

export interface Ga4ChannelItem {
  id: string;
  channelGroup: string;
  sessions: number;
  engagementRate: number;
  conversions: number;
  revenue: number;
  bounceRate: number;
}

export interface Ga4LandingPageItem {
  id: string;
  path: string;
  title: string;
  sessions: number;
  avgEngagementTime: string;
  bounceRate: number;
  conversions: number;
}

export interface GbpReviewItem {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  reviewDate: string;
  replyText?: string;
  repliedAt?: string;
  replyStatus: "PENDING" | "REPLIED";
}

export interface TrackedKeywordItem {
  id: string;
  keyword: string;
  currentPosition: number;
  previousPosition: number;
  movement: number; // positive = improved (up in rank), negative = dropped
  searchVolume: number;
  difficulty: number; // 0-100
  intent: SearchIntent;
  targetUrl: string;
  rankHistory: number[]; // 10 points
  brandId: string;
}

export interface SiteAuditIssueItem {
  id: string;
  title: string;
  category: "CRAWL" | "META" | "LINKS" | "SITEMAP" | "INDEXATION" | "PERFORMANCE";
  severity: AuditSeverity;
  affectedUrlCount: number;
  impactScore: number;
  description: string;
  recommendation: string;
  hasTask: boolean;
}

export interface ContentOptimizationItem {
  id: string;
  url: string;
  titleTag: {
    current: string;
    recommended: string;
    score: number;
  };
  metaDescription: {
    current: string;
    recommended: string;
    score: number;
  };
  headingsAnalysis: {
    h1Count: number;
    h2Count: number;
    status: "OPTIMAL" | "ISSUE";
    suggestion: string;
  };
  internalLinks: {
    count: number;
    recommendedAnchors: string[];
  };
  searchIntentAlignmentScore: number; // 0-100
  recommendedActions: string[];
}

export interface GeoAeoEvaluation {
  readinessScore: number; // 0-100
  engineBreakdown: {
    engine: "Perplexity" | "ChatGPT Search" | "Google AI Overviews" | "Claude Search";
    score: number;
    status: "EXCELLENT" | "GOOD" | "NEEDS_WORK";
  }[];
  entityConsistency: {
    entity: string;
    status: "VERIFIED" | "PARTIAL" | "MISSING";
    notes: string;
  }[];
  authoritativeCitationsCount: number;
  faqSchemaSuggestions: {
    question: string;
    answer: string;
    targetUrl: string;
  }[];
  structuredDataScore: number;
}

export interface CompetitorBenchmarkItem {
  id: string;
  name: string;
  domain: string;
  shareOfVoice: number; // percentage
  postFrequencyMonthly: number;
  topFormats: string[];
  overlapKeywordsCount: number;
  avgEngagementRate: number;
  strengths: string;
  weaknesses: string;
}
