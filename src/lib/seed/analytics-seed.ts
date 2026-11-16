import {
  KpiOverviewItem,
  ChannelPerformanceItem,
  CampaignFunnelItem,
  AttributionCreditItem,
  ConvertingPathItem,
  EffortLogActivity,
  SocialMentionItem,
  SocialAlertRule,
} from "@/types/analytics";

// Helper to format date strings for the past 90 days
export function generatePast90DaysDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

// 90 Days of Daily Channel Metrics
export interface DailyChannelMetric {
  date: string;
  channel: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  conversions: number;
  revenue: number;
}

export function generateDaily90DaysMetrics(): DailyChannelMetric[] {
  const channels = [
    "Instagram",
    "WhatsApp",
    "Google Search",
    "Email",
    "RCS",
    "SMS",
    "LinkedIn",
    "X",
    "Voice/IVR",
  ];
  const dates = generatePast90DaysDates();
  const metrics: DailyChannelMetric[] = [];

  dates.forEach((date, dateIdx) => {
    // slight upward growth factor over 90 days
    const growth = 1 + (dateIdx / 90) * 0.25;
    channels.forEach((channel) => {
      let baseSpend = 50;
      let baseImpr = 2000;
      let baseClicks = 80;
      let baseLeads = 6;
      let baseConv = 2;
      let baseRev = 350;

      if (channel === "Google Search") {
        baseSpend = 220; baseImpr = 5500; baseClicks = 280; baseLeads = 24; baseConv = 9; baseRev = 1850;
      } else if (channel === "Instagram") {
        baseSpend = 160; baseImpr = 12000; baseClicks = 420; baseLeads = 28; baseConv = 8; baseRev = 1420;
      } else if (channel === "WhatsApp") {
        baseSpend = 75; baseImpr = 3200; baseClicks = 850; baseLeads = 42; baseConv = 18; baseRev = 2200;
      } else if (channel === "LinkedIn") {
        baseSpend = 190; baseImpr = 3800; baseClicks = 110; baseLeads = 16; baseConv = 5; baseRev = 1750;
      } else if (channel === "Email") {
        baseSpend = 30; baseImpr = 8000; baseClicks = 640; baseLeads = 35; baseConv = 14; baseRev = 1600;
      } else if (channel === "RCS") {
        baseSpend = 45; baseImpr = 2500; baseClicks = 310; baseLeads = 18; baseConv = 6; baseRev = 780;
      } else if (channel === "SMS") {
        baseSpend = 40; baseImpr = 3000; baseClicks = 220; baseLeads = 12; baseConv = 4; baseRev = 540;
      } else if (channel === "X") {
        baseSpend = 60; baseImpr = 4500; baseClicks = 140; baseLeads = 8; baseConv = 3; baseRev = 420;
      } else if (channel === "Voice/IVR") {
        baseSpend = 35; baseImpr = 600; baseClicks = 95; baseLeads = 14; baseConv = 5; baseRev = 680;
      }

      // Add day of week variation (weekends slightly higher social, lower B2B)
      const dayOfWeek = new Date(date).getDay();
      const weekendMod = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.85 : 1.05;
      const noise = 0.9 + ((dateIdx * 7 + channel.length) % 25) / 100;

      const spend = Math.round(baseSpend * growth * noise);
      const impressions = Math.round(baseImpr * growth * noise * weekendMod);
      const clicks = Math.round(baseClicks * growth * noise);
      const leads = Math.round(baseLeads * growth * noise);
      const conversions = Math.round(baseConv * growth * noise);
      const revenue = Math.round(baseRev * growth * noise);

      metrics.push({
        date,
        channel,
        spend,
        impressions,
        clicks,
        leads,
        conversions,
        revenue,
      });
    });
  });

  return metrics;
}

export const SEED_DAILY_90_METRICS = generateDaily90DaysMetrics();

// OVERVIEW KPI CARDS (with Sparklines, Period comparisons, and Data Quality Tags)
export const SEED_OVERVIEW_KPIS: KpiOverviewItem[] = [
  {
    id: "kpi-spend",
    title: "Marketing Spend",
    value: "$76,950",
    numericValue: 76950,
    change: "+12.4%",
    isPositive: false, // More spend is marked with context
    trend: [62000, 64500, 68000, 69500, 71200, 72000, 73500, 75000, 75800, 76950],
    dataQuality: "ACTUAL",
    subtext: "Stripe & Ayrshare verified ledger",
    comparisonPeriod: "vs. prior 90-day window ($68,450)",
  },
  {
    id: "kpi-revenue",
    title: "Attributed Revenue",
    value: "$368,420",
    numericValue: 368420,
    change: "+28.6%",
    isPositive: true,
    trend: [260000, 275000, 290000, 305000, 318000, 332000, 345000, 354000, 362000, 368420],
    dataQuality: "ACTUAL",
    subtext: "Multi-touch closed-won pipeline",
    comparisonPeriod: "vs. prior 90-day window ($286,400)",
  },
  {
    id: "kpi-qualified-leads",
    title: "Qualified Leads (MQL/SQL)",
    value: "2,418",
    numericValue: 2418,
    change: "+19.2%",
    isPositive: true,
    trend: [1800, 1870, 1940, 2020, 2110, 2190, 2260, 2320, 2380, 2418],
    dataQuality: "ACTUAL",
    subtext: "Lead Agent AI scoring >= 70",
    comparisonPeriod: "vs. prior 90-day window (2,028)",
  },
  {
    id: "kpi-conversions",
    title: "Closed Conversions",
    value: "846",
    numericValue: 846,
    change: "+22.5%",
    isPositive: true,
    trend: [620, 645, 675, 710, 740, 765, 790, 815, 830, 846],
    dataQuality: "ACTUAL",
    subtext: "Direct checkout & signed contracts",
    comparisonPeriod: "vs. prior 90-day window (691)",
  },
  {
    id: "kpi-roas",
    title: "Return on Ad Spend (ROAS)",
    value: "4.79x",
    numericValue: 4.79,
    change: "+0.61x",
    isPositive: true,
    trend: [4.12, 4.18, 4.25, 4.38, 4.45, 4.52, 4.61, 4.68, 4.72, 4.79],
    dataQuality: "ACTUAL",
    subtext: "Attributed Revenue ÷ Total Ad Spend",
    comparisonPeriod: "vs. prior 90-day window (4.18x)",
  },
  {
    id: "kpi-roi",
    title: "Blended Marketing ROI",
    value: "278.4%",
    numericValue: 278.4,
    change: "+34.2%",
    isPositive: true,
    trend: [220, 228, 235, 245, 252, 260, 268, 271, 275, 278.4],
    dataQuality: "ESTIMATED",
    subtext: "(Net Revenue - Total Costs) ÷ Total Costs",
    comparisonPeriod: "vs. prior 90-day window (244.2%)",
  },
  {
    id: "kpi-cac",
    title: "Customer Acquisition Cost (CAC)",
    value: "$90.95",
    numericValue: 90.95,
    change: "-11.8%",
    isPositive: true, // Lower CAC is positive
    trend: [108.4, 105.2, 102.1, 99.4, 97.2, 95.8, 93.6, 92.1, 91.5, 90.95],
    dataQuality: "ACTUAL",
    subtext: "Total marketing spend ÷ total acquisitions",
    comparisonPeriod: "vs. prior 90-day window ($103.10)",
  },
  {
    id: "kpi-ltv",
    title: "Projected Customer LTV",
    value: "$2,850",
    numericValue: 2850,
    change: "+15.3%",
    isPositive: true,
    trend: [2400, 2450, 2500, 2560, 2620, 2680, 2730, 2780, 2820, 2850],
    dataQuality: "ESTIMATED",
    subtext: "Historical retention cohort projection",
    comparisonPeriod: "vs. prior 90-day window ($2,472)",
  },
];

// 9 CHANNELS PERFORMANCE TABLE & STACKED BARS
export const SEED_CHANNEL_PERFORMANCE: ChannelPerformanceItem[] = [
  {
    id: "chan-google",
    channel: "Google Search",
    iconName: "Search",
    spend: 19800,
    impressions: 495000,
    clicks: 25200,
    leads: 2160,
    conversions: 242,
    revenue: 118400,
    cpl: 9.17,
    cpa: 81.82,
    roas: 5.98,
    roi: 362.4,
    color: "#4285F4",
  },
  {
    id: "chan-instagram",
    channel: "Instagram",
    iconName: "Instagram",
    spend: 14400,
    impressions: 1080000,
    clicks: 37800,
    leads: 2520,
    conversions: 184,
    revenue: 86400,
    cpl: 5.71,
    cpa: 78.26,
    roas: 6.00,
    roi: 384.1,
    color: "#E1306C",
  },
  {
    id: "chan-whatsapp",
    channel: "WhatsApp",
    iconName: "MessageCircle",
    spend: 6750,
    impressions: 288000,
    clicks: 76500,
    leads: 3780,
    conversions: 172,
    revenue: 62800,
    cpl: 1.79,
    cpa: 39.24,
    roas: 9.30,
    roi: 612.5,
    color: "#25D366",
  },
  {
    id: "chan-linkedin",
    channel: "LinkedIn",
    iconName: "Linkedin",
    spend: 17100,
    impressions: 342000,
    clicks: 9900,
    leads: 1440,
    conversions: 78,
    revenue: 48900,
    cpl: 11.88,
    cpa: 219.23,
    roas: 2.86,
    roi: 142.8,
    color: "#0A66C2",
  },
  {
    id: "chan-email",
    channel: "Email",
    iconName: "Mail",
    spend: 2700,
    impressions: 720000,
    clicks: 57600,
    leads: 3150,
    conversions: 94,
    revenue: 32400,
    cpl: 0.86,
    cpa: 28.72,
    roas: 12.00,
    roi: 840.0,
    color: "#EA4335",
  },
  {
    id: "chan-rcs",
    channel: "RCS",
    iconName: "MessageSquare",
    spend: 4050,
    impressions: 225000,
    clicks: 27900,
    leads: 1620,
    conversions: 36,
    revenue: 11200,
    cpl: 2.50,
    cpa: 112.50,
    roas: 2.77,
    roi: 124.0,
    color: "#34A853",
  },
  {
    id: "chan-sms",
    channel: "SMS",
    iconName: "Smartphone",
    spend: 3600,
    impressions: 270000,
    clicks: 19800,
    leads: 1080,
    conversions: 24,
    revenue: 4950,
    cpl: 3.33,
    cpa: 150.00,
    roas: 1.38,
    roi: 28.5,
    color: "#F4B400",
  },
  {
    id: "chan-x",
    channel: "X",
    iconName: "Twitter",
    spend: 5400,
    impressions: 405000,
    clicks: 12600,
    leads: 720,
    conversions: 18,
    revenue: 3370,
    cpl: 7.50,
    cpa: 300.00,
    roas: 0.62,
    roi: -42.0,
    color: "#1DA1F2",
  },
  {
    id: "chan-voice",
    channel: "Voice/IVR",
    iconName: "PhoneCall",
    spend: 3150,
    impressions: 54000,
    clicks: 8550,
    leads: 1260,
    conversions: 28,
    revenue: 4200,
    cpl: 2.50,
    cpa: 112.50,
    roas: 1.33,
    roi: 24.2,
    color: "#9C27B0",
  },
];

// CAMPAIGN FUNNEL PERFORMANCE
export const SEED_CAMPAIGN_FUNNELS: CampaignFunnelItem[] = [
  {
    campaignId: "cmp-01",
    campaignName: "Black Friday Omnichannel VIP Wave",
    brandName: "Apex Performance Studio",
    objective: "SALES",
    stages: [
      { name: "Impressions", key: "impressions", count: 480000, label: "480.0K Views", dropOffRate: 0, conversionRate: 100 },
      { name: "Clicks", key: "clicks", count: 26400, label: "26.4K Clicks", dropOffRate: 94.5, conversionRate: 5.5 },
      { name: "Leads Captured", key: "leads", count: 3120, label: "3,120 Leads", dropOffRate: 88.2, conversionRate: 0.65 },
      { name: "Marketing Qualified", key: "qualified", count: 1450, label: "1,450 MQLs", dropOffRate: 53.5, conversionRate: 0.30 },
      { name: "Conversions", key: "conversions", count: 418, label: "418 Buyers", dropOffRate: 71.2, conversionRate: 0.087 },
      { name: "Attributed Revenue", key: "revenue", count: 184500, label: "$184.5K GMV", dropOffRate: 0, conversionRate: 0.087 },
    ],
    summary: {
      totalSpend: 24500,
      totalRevenue: 184500,
      blendedRoas: 7.53,
      leadToCustomerRate: 13.4,
    },
  },
  {
    campaignId: "cmp-02",
    campaignName: "Q4 Enterprise AI Transformation Pilot",
    brandName: "Veritas AI Labs",
    objective: "LEADS",
    stages: [
      { name: "Impressions", key: "impressions", count: 210000, label: "210.0K Views", dropOffRate: 0, conversionRate: 100 },
      { name: "Clicks", key: "clicks", count: 7350, label: "7.35K Clicks", dropOffRate: 96.5, conversionRate: 3.5 },
      { name: "Leads Captured", key: "leads", count: 840, label: "840 Form Submissions", dropOffRate: 88.6, conversionRate: 0.40 },
      { name: "Marketing Qualified", key: "qualified", count: 560, label: "560 SQLs", dropOffRate: 33.3, conversionRate: 0.27 },
      { name: "Conversions", key: "conversions", count: 112, label: "112 Contracts", dropOffRate: 80.0, conversionRate: 0.053 },
      { name: "Attributed Revenue", key: "revenue", count: 128400, label: "$128.4K Contract ARR", dropOffRate: 0, conversionRate: 0.053 },
    ],
    summary: {
      totalSpend: 21000,
      totalRevenue: 128400,
      blendedRoas: 6.11,
      leadToCustomerRate: 13.3,
    },
  },
  {
    campaignId: "cmp-03",
    campaignName: "Urban Brew Club Monthly Subscription Blitz",
    brandName: "Urban Brew Co",
    objective: "RETENTION",
    stages: [
      { name: "Impressions", key: "impressions", count: 320000, label: "320.0K Views", dropOffRate: 0, conversionRate: 100 },
      { name: "Clicks", key: "clicks", count: 22400, label: "22.4K Clicks", dropOffRate: 93.0, conversionRate: 7.0 },
      { name: "Leads Captured", key: "leads", count: 1980, label: "1,980 Re-engaged", dropOffRate: 91.2, conversionRate: 0.62 },
      { name: "Marketing Qualified", key: "qualified", count: 1120, label: "1,120 Subscribers", dropOffRate: 43.4, conversionRate: 0.35 },
      { name: "Conversions", key: "conversions", count: 316, label: "316 Renewals", dropOffRate: 71.8, conversionRate: 0.099 },
      { name: "Attributed Revenue", key: "revenue", count: 55520, label: "$55.5K LTV Renewals", dropOffRate: 0, conversionRate: 0.099 },
    ],
    summary: {
      totalSpend: 8200,
      totalRevenue: 55520,
      blendedRoas: 6.77,
      leadToCustomerRate: 16.0,
    },
  },
];

// ATTRIBUTION MODELS COMPARISON (Base Data for Recalculation)
export const SEED_ATTRIBUTION_COMPARISON: AttributionCreditItem[] = [
  {
    channel: "Google Search",
    firstTouchCredit: 38.4,
    lastTouchCredit: 24.2,
    linearCredit: 29.5,
    positionBasedCredit: 34.0,
    firstTouchRevenue: 141473,
    lastTouchRevenue: 89158,
    linearRevenue: 108684,
    positionBasedRevenue: 125263,
    color: "#4285F4",
  },
  {
    channel: "Instagram",
    firstTouchCredit: 31.2,
    lastTouchCredit: 16.8,
    linearCredit: 22.4,
    positionBasedCredit: 25.6,
    firstTouchRevenue: 114947,
    lastTouchRevenue: 61895,
    linearRevenue: 82526,
    positionBasedRevenue: 94316,
    color: "#E1306C",
  },
  {
    channel: "WhatsApp",
    firstTouchCredit: 4.8,
    lastTouchCredit: 32.5,
    linearCredit: 18.2,
    positionBasedCredit: 19.8,
    firstTouchRevenue: 17684,
    lastTouchRevenue: 119737,
    linearRevenue: 67053,
    positionBasedRevenue: 72947,
    color: "#25D366",
  },
  {
    channel: "Email",
    firstTouchCredit: 6.5,
    lastTouchCredit: 15.2,
    linearCredit: 14.1,
    positionBasedCredit: 11.2,
    firstTouchRevenue: 23947,
    lastTouchRevenue: 56000,
    linearRevenue: 51947,
    positionBasedRevenue: 41263,
    color: "#EA4335",
  },
  {
    channel: "LinkedIn",
    firstTouchCredit: 12.5,
    lastTouchCredit: 6.8,
    linearCredit: 9.6,
    positionBasedCredit: 10.4,
    firstTouchRevenue: 46053,
    lastTouchRevenue: 25053,
    linearRevenue: 35368,
    positionBasedRevenue: 38316,
    color: "#0A66C2",
  },
  {
    channel: "RCS",
    firstTouchCredit: 2.1,
    lastTouchCredit: 4.5,
    linearCredit: 3.2,
    positionBasedCredit: 3.5,
    firstTouchRevenue: 7737,
    lastTouchRevenue: 16579,
    linearRevenue: 11789,
    positionBasedRevenue: 12895,
    color: "#34A853",
  },
  {
    channel: "SMS",
    firstTouchCredit: 1.8,
    lastTouchCredit: 3.0,
    linearCredit: 2.4,
    positionBasedCredit: 2.6,
    firstTouchRevenue: 6632,
    lastTouchRevenue: 11053,
    linearRevenue: 8842,
    positionBasedRevenue: 9579,
    color: "#F4B400",
  },
  {
    channel: "Voice/IVR",
    firstTouchCredit: 1.5,
    lastTouchCredit: 1.8,
    linearCredit: 1.6,
    positionBasedCredit: 1.6,
    firstTouchRevenue: 5526,
    lastTouchRevenue: 6632,
    linearRevenue: 5895,
    positionBasedRevenue: 5895,
    color: "#9C27B0",
  },
  {
    channel: "X",
    firstTouchCredit: 1.2,
    lastTouchCredit: 0.2,
    linearCredit: 0.6,
    positionBasedCredit: 0.8,
    firstTouchRevenue: 4421,
    lastTouchRevenue: 737,
    linearRevenue: 2211,
    positionBasedRevenue: 2947,
    color: "#1DA1F2",
  },
];

// TOP 20 CONVERTING CUSTOMER JOURNEY PATHS
export const SEED_TOP_20_JOURNEY_PATHS: ConvertingPathItem[] = [
  {
    id: "path-01",
    path: ["Google Search", "Instagram", "WhatsApp", "Purchase"],
    conversionsCount: 142,
    conversionRate: 18.4,
    attributedRevenue: 68400,
    avgDaysToConvert: 4.2,
  },
  {
    id: "path-02",
    path: ["Instagram", "Email", "WhatsApp", "Purchase"],
    conversionsCount: 118,
    conversionRate: 16.2,
    attributedRevenue: 54200,
    avgDaysToConvert: 6.8,
  },
  {
    id: "path-03",
    path: ["Google Search", "Email", "Purchase"],
    conversionsCount: 96,
    conversionRate: 14.5,
    attributedRevenue: 42800,
    avgDaysToConvert: 8.5,
  },
  {
    id: "path-04",
    path: ["LinkedIn", "Google Search", "Email", "WhatsApp", "Purchase"],
    conversionsCount: 74,
    conversionRate: 22.1,
    attributedRevenue: 38600,
    avgDaysToConvert: 14.2,
  },
  {
    id: "path-05",
    path: ["Instagram", "WhatsApp", "Purchase"],
    conversionsCount: 68,
    conversionRate: 12.8,
    attributedRevenue: 29400,
    avgDaysToConvert: 2.1,
  },
  {
    id: "path-06",
    path: ["Google Search", "RCS", "WhatsApp", "Purchase"],
    conversionsCount: 52,
    conversionRate: 15.4,
    attributedRevenue: 22100,
    avgDaysToConvert: 3.5,
  },
  {
    id: "path-07",
    path: ["LinkedIn", "Email", "Voice/IVR", "Purchase"],
    conversionsCount: 46,
    conversionRate: 19.8,
    attributedRevenue: 21500,
    avgDaysToConvert: 18.0,
  },
  {
    id: "path-08",
    path: ["Instagram", "Instagram Ad", "Email", "Purchase"],
    conversionsCount: 41,
    conversionRate: 11.2,
    attributedRevenue: 17800,
    avgDaysToConvert: 7.2,
  },
  {
    id: "path-09",
    path: ["X", "Google Search", "WhatsApp", "Purchase"],
    conversionsCount: 35,
    conversionRate: 9.4,
    attributedRevenue: 14200,
    avgDaysToConvert: 5.4,
  },
  {
    id: "path-10",
    path: ["SMS Blast", "WhatsApp Chatbot", "Purchase"],
    conversionsCount: 32,
    conversionRate: 17.5,
    attributedRevenue: 12600,
    avgDaysToConvert: 1.2,
  },
  {
    id: "path-11",
    path: ["Google Search", "Direct Visit", "Purchase"],
    conversionsCount: 29,
    conversionRate: 8.6,
    attributedRevenue: 11800,
    avgDaysToConvert: 0.5,
  },
  {
    id: "path-12",
    path: ["Email Newsletter", "Instagram", "WhatsApp", "Purchase"],
    conversionsCount: 26,
    conversionRate: 14.0,
    attributedRevenue: 9800,
    avgDaysToConvert: 9.1,
  },
  {
    id: "path-13",
    path: ["LinkedIn Post", "LinkedIn InMail", "Email", "Purchase"],
    conversionsCount: 24,
    conversionRate: 21.0,
    attributedRevenue: 9400,
    avgDaysToConvert: 21.5,
  },
  {
    id: "path-14",
    path: ["RCS Carousel", "Direct Checkout", "Purchase"],
    conversionsCount: 21,
    conversionRate: 13.8,
    attributedRevenue: 8200,
    avgDaysToConvert: 0.8,
  },
  {
    id: "path-15",
    path: ["Instagram Reel", "Website Form", "Email", "Purchase"],
    conversionsCount: 18,
    conversionRate: 10.5,
    attributedRevenue: 7400,
    avgDaysToConvert: 11.0,
  },
  {
    id: "path-16",
    path: ["Google Search", "Voice/IVR Callback", "Purchase"],
    conversionsCount: 16,
    conversionRate: 16.8,
    attributedRevenue: 6900,
    avgDaysToConvert: 2.4,
  },
  {
    id: "path-17",
    path: ["WhatsApp Broadcast", "WhatsApp Agent", "Purchase"],
    conversionsCount: 15,
    conversionRate: 24.2,
    attributedRevenue: 6200,
    avgDaysToConvert: 0.4,
  },
  {
    id: "path-18",
    path: ["X Mention", "Website Visit", "Email", "Purchase"],
    conversionsCount: 12,
    conversionRate: 7.8,
    attributedRevenue: 4800,
    avgDaysToConvert: 8.2,
  },
  {
    id: "path-19",
    path: ["Instagram DM", "WhatsApp Concierge", "Purchase"],
    conversionsCount: 10,
    conversionRate: 18.0,
    attributedRevenue: 4200,
    avgDaysToConvert: 1.8,
  },
  {
    id: "path-20",
    path: ["SMS Link", "Mobile Landing Page", "Purchase"],
    conversionsCount: 8,
    conversionRate: 11.5,
    attributedRevenue: 3100,
    avgDaysToConvert: 0.6,
  },
];

// EFFORT VS OUTCOME MATRIX (16 Activities Classified into 4 Quadrants)
// Quadrant logic:
// High effort: totalEffortHours >= 30
// Low effort: totalEffortHours < 30
// High ROI: attributedRoi >= 250%
// Low ROI: attributedRoi < 250%
export const SEED_EFFORT_ACTIVITIES: EffortLogActivity[] = [
  // 1. High effort / High ROI -> CONTINUE_INVESTING (totalEffortHours >= 30, attributedRoi >= 250)
  {
    id: "eff-01",
    activityName: "Bi-Weekly High-Production Video Case Studies",
    channel: "YouTube & LinkedIn",
    contentCreationHours: 18,
    designHours: 12,
    videoProductionHours: 24,
    publishingActions: 8,
    communityResponses: 45,
    campaignManagementHours: 6,
    seoWorkHours: 8,
    paidSpend: 2400,
    totalEffortHours: 68,
    attributedRoi: 412,
    quadrant: "CONTINUE_INVESTING",
    aiRecommendation: "Maintain dedicated production cadence; allocate +15% creative budget for localized subtitles.",
    reasoning: "High manual hours are fully justified by superior client retention and 412% closed revenue attribution.",
    suggestedAgent: "Content Agent + Campaign Agent",
  },
  {
    id: "eff-02",
    activityName: "Cornerstone Industry Benchmark Pillar Guides",
    channel: "Organic Search & Blog",
    contentCreationHours: 25,
    designHours: 10,
    videoProductionHours: 0,
    publishingActions: 4,
    communityResponses: 15,
    campaignManagementHours: 4,
    seoWorkHours: 18,
    paidSpend: 500,
    totalEffortHours: 57,
    attributedRoi: 365,
    quadrant: "CONTINUE_INVESTING",
    aiRecommendation: "Continue publishing monthly. Transform chapters into micro-content clips to cross-pollinate social.",
    reasoning: "Generates compounding organic high-intent backlinks and leads with a 365% attributable pipeline yield.",
    suggestedAgent: "SEO Agent",
  },
  {
    id: "eff-03",
    activityName: "Executive LinkedIn Thought Leadership Hub",
    channel: "LinkedIn",
    contentCreationHours: 14,
    designHours: 8,
    videoProductionHours: 4,
    publishingActions: 24,
    communityResponses: 92,
    campaignManagementHours: 5,
    seoWorkHours: 2,
    paidSpend: 1200,
    totalEffortHours: 37,
    attributedRoi: 295,
    quadrant: "CONTINUE_INVESTING",
    aiRecommendation: "Sustain executive ghostwriting cadence; schedule interactive polls mid-week.",
    reasoning: "Produces high-value inbound enterprise inquiries at 295% ROI.",
    suggestedAgent: "Brand Guardian + Content Agent",
  },
  {
    id: "eff-04",
    activityName: "Omnichannel Black Friday Promotional Architecture",
    channel: "All 9 Channels",
    contentCreationHours: 22,
    designHours: 16,
    videoProductionHours: 12,
    publishingActions: 48,
    communityResponses: 180,
    campaignManagementHours: 18,
    seoWorkHours: 6,
    paidSpend: 14500,
    totalEffortHours: 92,
    attributedRoi: 540,
    quadrant: "CONTINUE_INVESTING",
    aiRecommendation: "Codify workflow into reusable annual journey template for seasonal blitzes.",
    reasoning: "Peak seasonality combined with multi-channel synergy yields record 540% return.",
    suggestedAgent: "Campaign Agent",
  },

  // 2. High effort / Low ROI -> OPTIMISE_OR_AUTOMATE (totalEffortHours >= 30, attributedRoi < 250)
  {
    id: "eff-05",
    activityName: "Manual Daily Social DM & Comment Triage",
    channel: "Instagram, X & Facebook",
    contentCreationHours: 2,
    designHours: 0,
    videoProductionHours: 0,
    publishingActions: 0,
    communityResponses: 340,
    campaignManagementHours: 8,
    seoWorkHours: 0,
    paidSpend: 0,
    totalEffortHours: 46,
    attributedRoi: 110,
    quadrant: "OPTIMISE_OR_AUTOMATE",
    aiRecommendation: "Migrate 80% of routine inquiries to Engagement Agent in AI_PLUS_HUMAN mode to save 36 hrs/mo.",
    reasoning: "Team spends 46 hours manually replying to repeat queries with only 110% return. Automation would free capacity.",
    suggestedAgent: "Engagement Agent",
  },
  {
    id: "eff-06",
    activityName: "Manual Multi-Platform Daily Social Scheduling",
    channel: "All Social Platforms",
    contentCreationHours: 8,
    designHours: 6,
    videoProductionHours: 2,
    publishingActions: 90,
    communityResponses: 10,
    campaignManagementHours: 12,
    seoWorkHours: 0,
    paidSpend: 0,
    totalEffortHours: 38,
    attributedRoi: 85,
    quadrant: "OPTIMISE_OR_AUTOMATE",
    aiRecommendation: "Deploy Publishing Agent to auto-schedule based on algorithmic heatmaps.",
    reasoning: "38 hours spent copy-pasting posts across networks yielding just 85% ROI. Ripe for 1-click batch publishing.",
    suggestedAgent: "Publishing Agent",
  },
  {
    id: "eff-07",
    activityName: "Custom Per-Lead PDF Proposals",
    channel: "Email & Direct Sales",
    contentCreationHours: 18,
    designHours: 14,
    videoProductionHours: 0,
    publishingActions: 15,
    communityResponses: 25,
    campaignManagementHours: 8,
    seoWorkHours: 0,
    paidSpend: 0,
    totalEffortHours: 45,
    attributedRoi: 165,
    quadrant: "OPTIMISE_OR_AUTOMATE",
    aiRecommendation: "Create dynamic modular templates in Content Studio; auto-populate from CRM deal records.",
    reasoning: "High design overhead delays sales cycle; templating will reduce effort by 65%.",
    suggestedAgent: "Content Agent",
  },
  {
    id: "eff-08",
    activityName: "Weekly Manual SEO Keyword Position Scraping",
    channel: "Organic Search",
    contentCreationHours: 4,
    designHours: 0,
    videoProductionHours: 0,
    publishingActions: 0,
    communityResponses: 0,
    campaignManagementHours: 8,
    seoWorkHours: 22,
    paidSpend: 150,
    totalEffortHours: 34,
    attributedRoi: 95,
    quadrant: "OPTIMISE_OR_AUTOMATE",
    aiRecommendation: "Delegate rank tracking entirely to Module 09 SEO Agent background cron.",
    reasoning: "34 manual hours spent compiling spreadsheets can be 100% automated with live API telemetry.",
    suggestedAgent: "SEO Agent",
  },

  // 3. Low effort / High ROI -> SCALE_IMMEDIATELY (totalEffortHours < 30, attributedRoi >= 250)
  {
    id: "eff-09",
    activityName: "Automated WhatsApp Abandoned Cart Recoveries",
    channel: "WhatsApp Business API",
    contentCreationHours: 3,
    designHours: 2,
    videoProductionHours: 0,
    publishingActions: 120,
    communityResponses: 80,
    campaignManagementHours: 2,
    seoWorkHours: 0,
    paidSpend: 420,
    totalEffortHours: 15,
    attributedRoi: 680,
    quadrant: "SCALE_IMMEDIATELY",
    aiRecommendation: "Expand triggers to browse-abandonment and 30-day replenishment cadences immediately.",
    reasoning: "Near-zero manual upkeep (15 hrs setup) delivers an exceptional 680% ROI via instant WhatsApp conversions.",
    suggestedAgent: "WhatsApp Agent",
  },
  {
    id: "eff-10",
    activityName: "RCS Interactive Rich Carousel Broadcasts",
    channel: "RCS Messaging",
    contentCreationHours: 4,
    designHours: 4,
    videoProductionHours: 0,
    publishingActions: 6,
    communityResponses: 25,
    campaignManagementHours: 2,
    seoWorkHours: 0,
    paidSpend: 650,
    totalEffortHours: 16,
    attributedRoi: 440,
    quadrant: "SCALE_IMMEDIATELY",
    aiRecommendation: "Double segment volume on Android devices; RCS tap-through rate is 3.4x higher than SMS.",
    reasoning: "Rich interactive action buttons require minimal design effort but generate high immediate checkout conversions.",
    suggestedAgent: "Campaign Agent",
  },
  {
    id: "eff-11",
    activityName: "High-Intent Google Search Non-Brand Exact Match",
    channel: "Google Search",
    contentCreationHours: 2,
    designHours: 0,
    videoProductionHours: 0,
    publishingActions: 12,
    communityResponses: 0,
    campaignManagementHours: 4,
    seoWorkHours: 2,
    paidSpend: 4800,
    totalEffortHours: 10,
    attributedRoi: 510,
    quadrant: "SCALE_IMMEDIATELY",
    aiRecommendation: "Increase daily ad spend cap by 30%; CPA is $42 well below our $90 CAC target.",
    reasoning: "Strict exact-match negative keyword hygiene yields high conversion with negligible management overhead.",
    suggestedAgent: "Campaign Agent",
  },
  {
    id: "eff-12",
    activityName: "Post-Purchase Automated VIP Onboarding Sequence",
    channel: "Email & WhatsApp",
    contentCreationHours: 5,
    designHours: 3,
    videoProductionHours: 0,
    publishingActions: 85,
    communityResponses: 30,
    campaignManagementHours: 2,
    seoWorkHours: 0,
    paidSpend: 180,
    totalEffortHours: 14,
    attributedRoi: 485,
    quadrant: "SCALE_IMMEDIATELY",
    aiRecommendation: "Introduce second upsell step with personalized discount token at day 14.",
    reasoning: "Automated trigger sequence drives repeat orders with minimal human touchpoints.",
    suggestedAgent: "WhatsApp Agent",
  },

  // 4. Low effort / Low ROI -> RECONSIDER (totalEffortHours < 30, attributedRoi < 250)
  {
    id: "eff-13",
    activityName: "Un-targeted Promotional SMS Blasts",
    channel: "SMS",
    contentCreationHours: 2,
    designHours: 0,
    videoProductionHours: 0,
    publishingActions: 4,
    communityResponses: 12,
    campaignManagementHours: 2,
    seoWorkHours: 0,
    paidSpend: 1800,
    totalEffortHours: 8,
    attributedRoi: 35,
    quadrant: "RECONSIDER",
    aiRecommendation: "Pause untargeted SMS immediately. High opt-out rate (3.4%) risks carrier filtering. Shift budget to RCS.",
    reasoning: "8 hours of effort and $1,800 spend produced only $2,430 revenue (35% ROI) with elevated brand attrition.",
    suggestedAgent: "Campaign Agent",
  },
  {
    id: "eff-14",
    activityName: "Generic Organic X Promotional Tweets",
    channel: "X",
    contentCreationHours: 6,
    designHours: 3,
    videoProductionHours: 0,
    publishingActions: 45,
    communityResponses: 8,
    campaignManagementHours: 2,
    seoWorkHours: 0,
    paidSpend: 300,
    totalEffortHours: 19,
    attributedRoi: 25,
    quadrant: "RECONSIDER",
    aiRecommendation: "Cease generic product link tweets; pivot solely to technical thread commentary or community AMAs.",
    reasoning: "Organic feed algorithms demote outbound links; reach has plummeted 65% with virtually zero pipeline impact.",
    suggestedAgent: "Engagement Agent",
  },
  {
    id: "eff-15",
    activityName: "Broad Audience Cold Display Banner Ads",
    channel: "Display Network",
    contentCreationHours: 3,
    designHours: 8,
    videoProductionHours: 0,
    publishingActions: 10,
    communityResponses: 0,
    campaignManagementHours: 4,
    seoWorkHours: 0,
    paidSpend: 2500,
    totalEffortHours: 17,
    attributedRoi: 45,
    quadrant: "RECONSIDER",
    aiRecommendation: "Cancel broad display campaigns; reallocate remaining credit to Google Search and Retargeting.",
    reasoning: "High accidental click rate, 92% bounce rate, negative contribution margin.",
    suggestedAgent: "Campaign Agent",
  },
  {
    id: "eff-16",
    activityName: "Weekly Routine Cold Voice/IVR Broadcasts",
    channel: "Voice/IVR",
    contentCreationHours: 3,
    designHours: 0,
    videoProductionHours: 0,
    publishingActions: 8,
    communityResponses: 15,
    campaignManagementHours: 3,
    seoWorkHours: 0,
    paidSpend: 950,
    totalEffortHours: 11,
    attributedRoi: 60,
    quadrant: "RECONSIDER",
    aiRecommendation: "Restrict Voice/IVR strictly to opted-in delivery confirmations and urgent high-value callbacks.",
    reasoning: "Cold outreach calls generate high consumer friction and 60% ROI.",
    suggestedAgent: "Campaign Agent",
  },
];

// Helper to calculate quadrant correctly from inputs
export function classifyEffortQuadrant(
  totalEffortHours: number,
  attributedRoi: number
): "CONTINUE_INVESTING" | "OPTIMISE_OR_AUTOMATE" | "SCALE_IMMEDIATELY" | "RECONSIDER" {
  const isHighEffort = totalEffortHours >= 30;
  const isHighRoi = attributedRoi >= 250;

  if (isHighEffort && isHighRoi) return "CONTINUE_INVESTING";
  if (isHighEffort && !isHighRoi) return "OPTIMISE_OR_AUTOMATE";
  if (!isHighEffort && isHighRoi) return "SCALE_IMMEDIATELY";
  return "RECONSIDER";
}

// 300 SOCIAL MENTIONS SEED DATA GENERATOR
export function generate300SocialMentions(): SocialMentionItem[] {
  const platforms: SocialMentionItem["platform"][] = [
    "X",
    "INSTAGRAM",
    "LINKEDIN",
    "REDDIT",
    "YOUTUBE",
    "WEB_NEWS",
    "GOOGLE_REVIEWS",
  ];

  const authors = [
    { handle: "@sarah_tech_lead", name: "Sarah Jenkins", followers: 42100 },
    { handle: "@martech_daily", name: "MarTech Review", followers: 125000 },
    { handle: "@growth_dan", name: "Dan Thorne", followers: 18400 },
    { handle: "@elena_saas", name: "Elena Rostova", followers: 31200 },
    { handle: "@r_marketing_mod", name: "Reddit Moderator /r/marketing", followers: 8500 },
    { handle: "@alex_startup_ceo", name: "Alex Chen", followers: 64000 },
    { handle: "@priya_crm", name: "Priya Sharma", followers: 22000 },
    { handle: "@tech_insider_uk", name: "Tech Insider UK", followers: 340000 },
    { handle: "@marcus_scale", name: "Marcus Brody", followers: 15300 },
    { handle: "@dev_sam", name: "Samira Patel", followers: 9800 },
    { handle: "@claire_b2b", name: "Claire Dupont", followers: 48900 },
    { handle: "@omnichannel_pro", name: "Omnichannel Pro News", followers: 88000 },
  ];

  const positiveSnippets = [
    "OmniBrand OS cut our weekly social & WhatsApp scheduling time by 75%. The unified CRM attribution actually makes sense.",
    "Loving the new RCS campaign capabilities from OmniBrand! Engagement is through the roof compared to legacy SMS.",
    "The 24-hour WhatsApp service window guardrail saved our team from Meta account suspension. Brilliant product.",
    "Just migrated our agency client accounts to OmniBrand OS. Effort matrix revealed exactly where our designers were burning time.",
    "Impressive multi-touch attribution. First time our CFO and CMO agreed on our Google Search vs Instagram ROAS split.",
    "The AI Lead Agent scored our inbound WhatsApp enquiries in seconds. Conversion rate jumped 30%.",
    "Finally an enterprise platform that doesn't feel like a 2012 enterprise portal. The dark glassmorphism UI is gorgeous.",
    "Huge shoutout to the OmniBrand support team for their rapid API webhook resolution yesterday.",
  ];

  const neutralSnippets = [
    "Testing OmniBrand OS against Sprout Social and HubSpot for our Q1 agency stack evaluation.",
    "Anyone else using OmniBrand's RCS Rich Cards? Wondering how carrier delivery rates compare in Western Europe.",
    "OmniBrand OS announced support for Google Business Profile automated review responses in their latest release.",
    "Comparing the First Touch vs Position Based attribution models in OmniBrand. The shift in credit is notable.",
    "Interesting read on MarTech Daily discussing how OmniBrand OS handles multi-tenant workspace isolation.",
    "Setting up the 9 AI agents in OmniBrand. Starting in AI_PLUS_HUMAN mode before letting them run auto.",
  ];

  const negativeSnippets = [
    "Experiencing a slight delay on Instagram webhook delivery in OmniBrand OS this morning. Anyone else seeing this?",
    "Wish the TikTok direct publishing API restrictions weren't so strict. OmniBrand correctly warns us, but still frustrating.",
    "Encountered a rate limit warning when trying to send 15,000 WhatsApp broadcasts without template pre-approval.",
    "Our team found the Attribution journey path inspector a bit complex on first glance. Needs a quicker filter.",
    "The daily spend cap banner disabled our Content Agent mid-afternoon. Good safety guardrail, but need higher cap option.",
  ];

  const mentions: SocialMentionItem[] = [];
  const now = Date.now();

  for (let i = 1; i <= 300; i++) {
    const platform = platforms[i % platforms.length];
    const author = authors[i % authors.length];
    // 60% positive, 25% neutral, 15% negative
    const rand = (i * 17 + 23) % 100;
    let sentiment: SocialMentionItem["sentiment"] = "POSITIVE";
    let snippet = positiveSnippets[i % positiveSnippets.length];
    let sentimentScore = 0.45 + ((i % 50) / 100);

    if (rand > 85) {
      sentiment = "NEGATIVE";
      snippet = negativeSnippets[i % negativeSnippets.length];
      sentimentScore = -0.3 - ((i % 40) / 100);
    } else if (rand > 60) {
      sentiment = "NEUTRAL";
      snippet = neutralSnippets[i % neutralSnippets.length];
      sentimentScore = -0.05 + ((i % 15) / 100);
    }

    // Spread over last 90 days
    const daysAgo = Math.floor((i / 300) * 89);
    const hoursAgo = (i * 3) % 24;
    const date = new Date(now - (daysAgo * 86400000) - (hoursAgo * 3600000));

    const reachEstimate = Math.round(author.followers * (0.08 + (i % 20) / 100));

    mentions.push({
      id: `men-${i.toString().padStart(4, "0")}`,
      brandId: i % 2 === 0 ? "brand-01" : "brand-02",
      platform,
      authorHandle: author.handle,
      authorName: author.name,
      authorFollowers: author.followers,
      snippet,
      sentiment,
      sentimentScore: Math.round(sentimentScore * 100) / 100,
      reachEstimate,
      keywordMentioned: i % 3 === 0 ? "OmniBrand" : i % 3 === 1 ? "WhatsApp API" : "Attribution ROAS",
      competitorMentioned: i % 5 === 0 ? "Sprout Social" : i % 7 === 0 ? "HubSpot" : undefined,
      sourceUrl: `https://${platform.toLowerCase()}.com/post/mention-${i}`,
      hasResponseTask: sentiment === "NEGATIVE" || i % 8 === 0,
      responseTaskId: (sentiment === "NEGATIVE" || i % 8 === 0) ? `task-resp-${i}` : undefined,
      createdAt: date.toISOString(),
    });
  }

  return mentions;
}

export const SEED_300_MENTIONS = generate300SocialMentions();

// SOCIAL LISTENING ALERT RULES
export const SEED_ALERT_RULES: SocialAlertRule[] = [
  {
    id: "alert-01",
    name: "Spike in Negative Social Sentiment",
    condition: "Negative sentiment exceeds 15% of mentions in 24h",
    negativeThreshold: 15,
    timeWindowHours: 24,
    notifyChannels: ["Email", "Slack", "WhatsApp"],
    isEnabled: true,
  },
  {
    id: "alert-02",
    name: "High-Influence Account Critique (>50k Followers)",
    condition: "Author with >50K followers posts negative mention",
    negativeThreshold: 1,
    timeWindowHours: 1,
    notifyChannels: ["Email", "WhatsApp"],
    isEnabled: true,
  },
  {
    id: "alert-03",
    name: "Competitor Comparison Surge",
    condition: "Mentions co-referencing HubSpot or Sprout exceed 20/day",
    negativeThreshold: 20,
    timeWindowHours: 24,
    notifyChannels: ["Slack"],
    isEnabled: false,
  },
];
