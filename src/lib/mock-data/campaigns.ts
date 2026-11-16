import {
  Platform,
  AspectRatio,
  ContentStatus,
  AiModel,
  CampaignObjective,
} from "@/types";

export interface PublishJobItem {
  id: string;
  workspaceId: string;
  campaignId: string;
  campaignName: string;
  brandName: string;
  brandColor: string;
  platform: Platform;
  idempotencyKey: string;
  status: ContentStatus;
  scheduledAt: string;
  publishedAt?: string;
  errorMessage?: string;
  retryCount: number;
  mediaUrl: string;
  caption: string;
}

export interface ChannelBudgetInfo {
  platform: Platform;
  allocatedBudget: number;
  spent: number;
  status: ContentStatus;
  consentGated: boolean;
  deliveryRate: number;
}

export interface CampaignItem {
  id: string;
  workspaceId: string;
  brandId: string;
  brandName: string;
  brandColor: string;
  name: string;
  description: string;
  objective: CampaignObjective;
  budget: number;
  spendToDate: number;
  status: ContentStatus;
  startDate: string;
  endDate: string;
  ownerUserId: string;
  ownerName: string;
  leadsCount: number;
  targetAudience: string;
  ctaLinks: {
    type: "LINK" | "LEAD_FORM" | "WHATSAPP_CHAT" | "QR_CODE" | "LANDING_PAGE";
    displayText: string;
    targetUrl: string;
  }[];
  channelBudgets: ChannelBudgetInfo[];
  channels: {
    platform: Platform;
    aspectRatio: AspectRatio;
    scheduledAt: string;
    status: ContentStatus;
  }[];
  caption: string;
  hashtags: string[];
  mediaUrl: string;
  aiModelUsed: AiModel;
  approvalRecord?: {
    actorName: string;
    decision: string;
    notes: string;
    createdAt: string;
  };
  utmUrl: string;
  publishJobs: PublishJobItem[];
}

export const MOCK_CAMPAIGNS: CampaignItem[] = [
  {
    id: "cmp-001",
    workspaceId: "ws-growth-lab",
    brandId: "brand-lumina",
    brandName: "Lumina Creative Labs",
    brandColor: "#E8B04B",
    name: "Architectural Radiance Lookbook",
    description: "Launch of the tactile brutalist studio series exploring golden hour interior reflections.",
    objective: "AWARENESS",
    budget: 12500,
    spendToDate: 11200,
    status: "PUBLISHED",
    startDate: "2026-11-10T14:00:00Z",
    endDate: "2026-11-20T18:00:00Z",
    ownerUserId: "usr-elena-01",
    ownerName: "Elena Rostova",
    leadsCount: 148,
    targetAudience: "Creative directors, boutique interior architects, and DTC design leaders aged 28-50.",
    ctaLinks: [
      {
        type: "LANDING_PAGE",
        displayText: "Explore Architectural Lookbook",
        targetUrl: "https://luminacreative.studio/lookbook",
      },
    ],
    channelBudgets: [
      { platform: "INSTAGRAM", allocatedBudget: 6000, spent: 5800, status: "PUBLISHED", consentGated: false, deliveryRate: 99.8 },
      { platform: "LINKEDIN", allocatedBudget: 4500, spent: 4100, status: "PUBLISHED", consentGated: false, deliveryRate: 99.4 },
      { platform: "PINTEREST", allocatedBudget: 2000, spent: 1300, status: "PUBLISHED", consentGated: false, deliveryRate: 98.7 },
    ],
    channels: [
      { platform: "INSTAGRAM", aspectRatio: "PORTRAIT_4_5", scheduledAt: "2026-11-10T14:00:00Z", status: "PUBLISHED" },
      { platform: "LINKEDIN", aspectRatio: "LANDSCAPE_16_9", scheduledAt: "2026-11-10T14:00:00Z", status: "PUBLISHED" },
      { platform: "PINTEREST", aspectRatio: "PORTRAIT_4_5", scheduledAt: "2026-11-10T14:00:00Z", status: "PUBLISHED" },
    ],
    caption: "Light as structure. Exploring tactile brutalist spaces sculpted by intentional golden hour reflections.",
    hashtags: ["#EditorialDesign", "#ArchitecturalLighting", "#LuminaLabs", "#SpatialAesthetics"],
    mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
    aiModelUsed: "FLUX_1_PRO",
    approvalRecord: {
      actorName: "Elena Rostova",
      decision: "APPROVED",
      notes: "Aesthetic mastery verified. Color balance matches BrandKit.",
      createdAt: "2026-11-09T16:30:00Z",
    },
    utmUrl: "https://luminacreative.studio/lookbook?utm_source=instagram&utm_medium=social_organic&utm_campaign=lookbook",
    publishJobs: [
      {
        id: "job-001-a",
        workspaceId: "ws-growth-lab",
        campaignId: "cmp-001",
        campaignName: "Architectural Radiance Lookbook",
        brandName: "Lumina Creative Labs",
        brandColor: "#E8B04B",
        platform: "INSTAGRAM",
        idempotencyKey: "idemp_lum_ig_001",
        status: "PUBLISHED",
        scheduledAt: "2026-11-10T14:00:00Z",
        publishedAt: "2026-11-10T14:00:12Z",
        retryCount: 0,
        mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
        caption: "Light as structure. Exploring tactile brutalist spaces sculpted by intentional golden hour reflections.",
      },
      {
        id: "job-001-b",
        workspaceId: "ws-growth-lab",
        campaignId: "cmp-001",
        campaignName: "Architectural Radiance Lookbook",
        brandName: "Lumina Creative Labs",
        brandColor: "#E8B04B",
        platform: "LINKEDIN",
        idempotencyKey: "idemp_lum_li_001",
        status: "PUBLISHED",
        scheduledAt: "2026-11-10T14:00:00Z",
        publishedAt: "2026-11-10T14:00:18Z",
        retryCount: 0,
        mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
        caption: "Aesthetic mastery in spatial storytelling. Why architectural framing redefines how high-growth brands communicate craft.",
      },
    ],
  },
  {
    id: "cmp-002",
    workspaceId: "ws-growth-lab",
    brandId: "brand-apex",
    brandName: "Apex Capital & DeFi",
    brandColor: "#2563EB",
    name: "Quantitative Collateral Ratio Report",
    description: "Weekly risk disclosure illustrating zero-liquidation parameters across protocol pools.",
    objective: "LEADS",
    budget: 18000,
    spendToDate: 7400,
    status: "SCHEDULED",
    startDate: "2026-11-14T09:00:00Z",
    endDate: "2026-11-24T18:00:00Z",
    ownerUserId: "usr-marcus-02",
    ownerName: "Marcus Chen",
    leadsCount: 64,
    targetAudience: "Family office allocators, hedge fund liquidity engineers, and Web3 treasury managers.",
    ctaLinks: [
      {
        type: "LEAD_FORM",
        displayText: "Request Institutional Audit Dossier",
        targetUrl: "https://apexcapital.fi/reports/collateral-q4",
      },
    ],
    channelBudgets: [
      { platform: "LINKEDIN", allocatedBudget: 11000, spent: 4800, status: "SCHEDULED", consentGated: false, deliveryRate: 99.6 },
      { platform: "X", allocatedBudget: 7000, spent: 2600, status: "SCHEDULED", consentGated: false, deliveryRate: 98.9 },
    ],
    channels: [
      { platform: "LINKEDIN", aspectRatio: "LANDSCAPE_16_9", scheduledAt: "2026-11-14T09:00:00Z", status: "SCHEDULED" },
      { platform: "X", aspectRatio: "LANDSCAPE_16_9", scheduledAt: "2026-11-14T09:00:00Z", status: "SCHEDULED" },
    ],
    caption: "Empirical risk modeling: Over-collateralized delta-neutral liquidity yields resilient alpha amidst volatile market cycles.",
    hashtags: ["#QuantitativeFinance", "#DeFiSecurity", "#InstitutionalYield", "#ApexCapital"],
    mediaUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1080&auto=format&fit=crop&q=80",
    aiModelUsed: "FLUX_1_PRO",
    approvalRecord: {
      actorName: "Marcus Chen",
      decision: "APPROVED",
      notes: "Regulatory disclaimers verified. All metrics match on-chain proof.",
      createdAt: "2026-11-12T11:00:00Z",
    },
    utmUrl: "https://apexcapital.fi/reports/collateral-q4?utm_source=linkedin&utm_medium=b2b&utm_campaign=risk_disclosure",
    publishJobs: [
      {
        id: "job-002-a",
        workspaceId: "ws-growth-lab",
        campaignId: "cmp-002",
        campaignName: "Quantitative Collateral Ratio Report",
        brandName: "Apex Capital & DeFi",
        brandColor: "#2563EB",
        platform: "LINKEDIN",
        idempotencyKey: "idemp_apex_li_002",
        status: "SCHEDULED",
        scheduledAt: "2026-11-14T09:00:00Z",
        retryCount: 0,
        mediaUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1080&auto=format&fit=crop&q=80",
        caption: "Empirical risk modeling: Over-collateralized delta-neutral liquidity yields resilient alpha amidst volatile market cycles.",
      },
      {
        id: "job-002-b",
        workspaceId: "ws-growth-lab",
        campaignId: "cmp-002",
        campaignName: "Quantitative Collateral Ratio Report",
        brandName: "Apex Capital & DeFi",
        brandColor: "#2563EB",
        platform: "X",
        idempotencyKey: "idemp_apex_x_002",
        status: "SCHEDULED",
        scheduledAt: "2026-11-14T09:00:00Z",
        retryCount: 0,
        mediaUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1080&auto=format&fit=crop&q=80",
        caption: "Zero-liquidation architecture through volatility spikes. Read the full quantitative breakdown.",
      },
    ],
  },
  {
    id: "cmp-003",
    workspaceId: "ws-enterprise-ventures",
    brandId: "brand-verdant",
    brandName: "Verdant Wellness Co.",
    brandColor: "#4D7C0F",
    name: "Cellular Longevity Extract Release",
    description: "Launch of clinical polyphenol botanical formulation with subcritical CO2 extraction proof.",
    objective: "SALES",
    budget: 22000,
    spendToDate: 19800,
    status: "PARTIAL",
    startDate: "2026-11-12T16:00:00Z",
    endDate: "2026-11-28T16:00:00Z",
    ownerUserId: "usr-sarah-03",
    ownerName: "Sarah Jenkins",
    leadsCount: 312,
    targetAudience: "Mindful biohackers, clinical nutritionists, and longevity professionals aged 30-65.",
    ctaLinks: [
      {
        type: "LINK",
        displayText: "Shop Clinical Botanical Extract",
        targetUrl: "https://verdantwellness.co/extract-longevity",
      },
    ],
    channelBudgets: [
      { platform: "INSTAGRAM", allocatedBudget: 12000, spent: 11400, status: "PUBLISHED", consentGated: false, deliveryRate: 99.4 },
      { platform: "FACEBOOK", allocatedBudget: 7000, spent: 6800, status: "PUBLISHED", consentGated: false, deliveryRate: 98.6 },
      { platform: "GOOGLE_BUSINESS", allocatedBudget: 3000, spent: 1600, status: "FAILED", consentGated: false, deliveryRate: 0 },
    ],
    channels: [
      { platform: "INSTAGRAM", aspectRatio: "PORTRAIT_4_5", scheduledAt: "2026-11-12T16:00:00Z", status: "PUBLISHED" },
      { platform: "FACEBOOK", aspectRatio: "SQUARE_1_1", scheduledAt: "2026-11-12T16:00:00Z", status: "PUBLISHED" },
      { platform: "GOOGLE_BUSINESS", aspectRatio: "LANDSCAPE_16_9", scheduledAt: "2026-11-12T16:00:00Z", status: "FAILED" },
    ],
    caption: "Cellular renewal meets clinical extraction science. 99.4% active polyphenol preservation with zero petrochemicals.",
    hashtags: ["#CellularLongevity", "#CleanBotanicals", "#ClinicalWellness", "#VerdantLife"],
    mediaUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1080&auto=format&fit=crop&q=80",
    aiModelUsed: "DALLE_3",
    approvalRecord: {
      actorName: "Sarah Jenkins",
      decision: "APPROVED",
      notes: "Organic claims verified by lab report #8841-COA.",
      createdAt: "2026-11-11T14:15:00Z",
    },
    utmUrl: "https://verdantwellness.co/extract-longevity?utm_source=instagram&utm_medium=social&utm_campaign=cellular_launch",
    publishJobs: [
      {
        id: "job-003-a",
        workspaceId: "ws-enterprise-ventures",
        campaignId: "cmp-003",
        campaignName: "Cellular Longevity Extract Release",
        brandName: "Verdant Wellness Co.",
        brandColor: "#4D7C0F",
        platform: "INSTAGRAM",
        idempotencyKey: "idemp_verd_ig_003",
        status: "PUBLISHED",
        scheduledAt: "2026-11-12T16:00:00Z",
        publishedAt: "2026-11-12T16:00:15Z",
        retryCount: 0,
        mediaUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1080&auto=format&fit=crop&q=80",
        caption: "Cellular renewal meets clinical extraction science.",
      },
      {
        id: "job-003-c",
        workspaceId: "ws-enterprise-ventures",
        campaignId: "cmp-003",
        campaignName: "Cellular Longevity Extract Release",
        brandName: "Verdant Wellness Co.",
        brandColor: "#4D7C0F",
        platform: "GOOGLE_BUSINESS",
        idempotencyKey: "idemp_verd_gbp_003",
        status: "FAILED",
        scheduledAt: "2026-11-12T16:00:00Z",
        errorMessage: "Google Business Profile OAuth token expired during scheduled call. Partial failure isolated.",
        retryCount: 3,
        mediaUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1080&auto=format&fit=crop&q=80",
        caption: "Local Austin Studio: Experience cellular longevity botanicals in person.",
      },
    ],
  },
  {
    id: "cmp-004",
    workspaceId: "ws-growth-lab",
    brandId: "brand-northline",
    brandName: "Northline Studios",
    brandColor: "#7C3AED",
    name: "Docuseries Premiere: Echoes of Steel",
    description: "Behind the lens visual rollout with anamorphic frame captures and director commentary.",
    objective: "ENGAGEMENT",
    budget: 15000,
    spendToDate: 4200,
    status: "PUBLISHING",
    startDate: "2026-11-13T15:00:00Z",
    endDate: "2026-11-28T22:00:00Z",
    ownerUserId: "usr-david-04",
    ownerName: "David Kim",
    leadsCount: 92,
    targetAudience: "Film festival programmers, commercial creative directors, and streaming entertainment producers.",
    ctaLinks: [
      {
        type: "LINK",
        displayText: "Watch Anamorphic Festival Trailer",
        targetUrl: "https://northlinestudios.film/echoes",
      },
    ],
    channelBudgets: [
      { platform: "X", allocatedBudget: 8000, spent: 2200, status: "PUBLISHING", consentGated: false, deliveryRate: 98.4 },
      { platform: "THREADS", allocatedBudget: 7000, spent: 2000, status: "PUBLISHING", consentGated: false, deliveryRate: 97.9 },
    ],
    channels: [
      { platform: "X", aspectRatio: "LANDSCAPE_16_9", scheduledAt: "2026-11-13T15:00:00Z", status: "PUBLISHING" },
      { platform: "THREADS", aspectRatio: "SQUARE_1_1", scheduledAt: "2026-11-13T15:00:00Z", status: "PUBLISHING" },
    ],
    caption: "Shadows tell what light forgets. 'Echoes of Steel' streaming trailer live today on 35mm anamorphic.",
    hashtags: ["#Docuseries", "#Anamorphic", "#Cinematography", "#NorthlineStudios"],
    mediaUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1080&auto=format&fit=crop&q=80",
    aiModelUsed: "FLUX_1_PRO",
    approvalRecord: {
      actorName: "David Kim",
      decision: "APPROVED",
      notes: "Soundtrack sync rights and cinematography verified.",
      createdAt: "2026-11-13T12:00:00Z",
    },
    utmUrl: "https://northlinestudios.film/echoes?utm_source=x&utm_medium=trailer&utm_campaign=echoes_premiere",
    publishJobs: [
      {
        id: "job-004-a",
        workspaceId: "ws-growth-lab",
        campaignId: "cmp-004",
        campaignName: "Docuseries Premiere: Echoes of Steel",
        brandName: "Northline Studios",
        brandColor: "#7C3AED",
        platform: "X",
        idempotencyKey: "idemp_north_x_004",
        status: "PUBLISHING",
        scheduledAt: "2026-11-13T15:00:00Z",
        retryCount: 0,
        mediaUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1080&auto=format&fit=crop&q=80",
        caption: "Shadows tell what light forgets. 'Echoes of Steel' streaming trailer live today.",
      },
    ],
  },
  {
    id: "cmp-005",
    workspaceId: "ws-growth-lab",
    brandId: "brand-lumina",
    brandName: "Lumina Creative Labs",
    brandColor: "#E8B04B",
    name: "Winter Design Residency Application Call",
    description: "Annual invitation for 4 resident creators exploring generative visual media and physical typography.",
    objective: "RETENTION",
    budget: 9500,
    spendToDate: 3100,
    status: "SCHEDULED",
    startDate: "2026-11-18T10:00:00Z",
    endDate: "2026-12-05T18:00:00Z",
    ownerUserId: "usr-elena-01",
    ownerName: "Elena Rostova",
    leadsCount: 75,
    targetAudience: "Senior typographers, generative visual artists, and spatial curators.",
    ctaLinks: [
      {
        type: "LEAD_FORM",
        displayText: "Submit Residency Portfolio",
        targetUrl: "https://luminacreative.studio/residency-2027",
      },
    ],
    channelBudgets: [
      { platform: "LINKEDIN", allocatedBudget: 5500, spent: 1800, status: "SCHEDULED", consentGated: false, deliveryRate: 99.1 },
      { platform: "INSTAGRAM", allocatedBudget: 4000, spent: 1300, status: "SCHEDULED", consentGated: false, deliveryRate: 98.8 },
    ],
    channels: [
      { platform: "LINKEDIN", aspectRatio: "LANDSCAPE_16_9", scheduledAt: "2026-11-18T10:00:00Z", status: "SCHEDULED" },
      { platform: "INSTAGRAM", aspectRatio: "PORTRAIT_4_5", scheduledAt: "2026-11-18T10:00:00Z", status: "SCHEDULED" },
    ],
    caption: "Seeking intentional makers. Applications are open for the Lumina Winter Creative Residency.",
    hashtags: ["#CreativeResidency", "#Typography", "#DesignFellowship", "#LuminaLabs"],
    mediaUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1080&auto=format&fit=crop&q=80",
    aiModelUsed: "SDXL_TURBO",
    approvalRecord: {
      actorName: "Elena Rostova",
      decision: "APPROVED",
      notes: "Stipend terms and studio dates finalized.",
      createdAt: "2026-11-12T17:00:00Z",
    },
    utmUrl: "https://luminacreative.studio/residency-2027?utm_source=linkedin&utm_medium=b2b&utm_campaign=winter_call",
    publishJobs: [
      {
        id: "job-005-a",
        workspaceId: "ws-growth-lab",
        campaignId: "cmp-005",
        campaignName: "Winter Design Residency Application Call",
        brandName: "Lumina Creative Labs",
        brandColor: "#E8B04B",
        platform: "LINKEDIN",
        idempotencyKey: "idemp_lum_li_005",
        status: "SCHEDULED",
        scheduledAt: "2026-11-18T10:00:00Z",
        retryCount: 0,
        mediaUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1080&auto=format&fit=crop&q=80",
        caption: "Seeking intentional makers. Applications are open for the Lumina Winter Creative Residency.",
      },
    ],
  },
  {
    id: "cmp-006",
    workspaceId: "ws-growth-lab",
    brandId: "brand-apex",
    brandName: "Apex Capital & DeFi",
    brandColor: "#2563EB",
    name: "Institutional Staking & L2 Sequencer Alpha",
    description: "Deep-dive analysis into MEV mitigation and decentralized sequencing economics.",
    objective: "APP_DOWNLOAD",
    budget: 14000,
    spendToDate: 0,
    status: "DRAFT",
    startDate: "2026-11-22T14:00:00Z",
    endDate: "2026-11-29T18:00:00Z",
    ownerUserId: "usr-amara-05",
    ownerName: "Amara Okafor",
    leadsCount: 12,
    targetAudience: "On-chain validator operators and algorithmic protocol treasuries.",
    ctaLinks: [
      {
        type: "LINK",
        displayText: "Download Sequencer Whitepaper & SDK",
        targetUrl: "https://apexcapital.fi/research/l2-sequencers",
      },
    ],
    channelBudgets: [
      { platform: "LINKEDIN", allocatedBudget: 8000, spent: 0, status: "DRAFT", consentGated: false, deliveryRate: 0 },
      { platform: "X", allocatedBudget: 6000, spent: 0, status: "DRAFT", consentGated: false, deliveryRate: 0 },
    ],
    channels: [
      { platform: "LINKEDIN", aspectRatio: "LANDSCAPE_16_9", scheduledAt: "2026-11-22T14:00:00Z", status: "DRAFT" },
      { platform: "X", aspectRatio: "LANDSCAPE_16_9", scheduledAt: "2026-11-22T14:00:00Z", status: "DRAFT" },
    ],
    caption: "How decentralized sequencer economics reshape MEV extraction in Layer-2 liquidity architectures.",
    hashtags: ["#SequencerEconomics", "#MEV", "#Layer2", "#ApexCapital"],
    mediaUrl: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1080&auto=format&fit=crop&q=80",
    aiModelUsed: "FLUX_1_PRO",
    utmUrl: "https://apexcapital.fi/research/l2-sequencers?utm_source=x&utm_medium=alpha&utm_campaign=mev_sequencer",
    publishJobs: [],
  },
];
