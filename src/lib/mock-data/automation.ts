import {
  JourneyItem,
  TriggerCardItem,
  AutomationRuleItem,
  EventLogItem,
  IntegrationRegistryItem,
  JourneyStatus,
} from "@/types";

// ============================================================================
// 3 SEEDED JOURNEYS (2 Published, 1 Draft)
// ============================================================================
export const MOCK_JOURNEYS: JourneyItem[] = [
  {
    id: "jrn-01-lead-nurture",
    workspaceId: "ws-growth-lab",
    brandId: "brand-lumina",
    brandName: "Lumina Creative",
    name: "Omnichannel High-Intent Lead Nurture",
    description: "Multi-channel sequence triggered on website form inquiry, routing through WhatsApp consent check and AI lookbook dispatch.",
    status: "PUBLISHED",
    version: 3,
    triggerType: "WEBSITE_ENQUIRY",
    enrolledCount: 142,
    completedCount: 98,
    conversionRate: 69.0,
    canvasData: {
      nodes: [
        {
          id: "node-1",
          type: "triggerNode",
          position: { x: 250, y: 50 },
          data: { label: "Website Enquiry Form Submitted", triggerType: "WEBSITE_ENQUIRY", channel: "WEB" },
        },
        {
          id: "node-2",
          type: "conditionNode",
          position: { x: 250, y: 180 },
          data: { label: "Has WhatsApp Opt-In?", rule: "consent.WHATSAPP == OPTED_IN" },
        },
        {
          id: "node-3",
          type: "actionNode",
          position: { x: 100, y: 320 },
          data: { label: "Send WhatsApp Lookbook HSM", channel: "WHATSAPP", template: "catalog_reengagement_v1" },
        },
        {
          id: "node-4",
          type: "actionNode",
          position: { x: 400, y: 320 },
          data: { label: "Send Email Lookbook PDF", channel: "EMAIL", template: "autumn_lookbook_hero" },
        },
        {
          id: "node-5",
          type: "delayNode",
          position: { x: 250, y: 460 },
          data: { label: "Delay 24 Hours", duration: "24h" },
        },
        {
          id: "node-6",
          type: "agentNode",
          position: { x: 250, y: 580 },
          data: { label: "Lead Agent: Score Interaction", agent: "Lead Agent" },
        },
        {
          id: "node-7",
          type: "goalNode",
          position: { x: 250, y: 700 },
          data: { label: "Goal: Creative Consultation Booked", targetMetric: "Form Submission" },
        },
      ],
      edges: [
        { id: "e1-2", source: "node-1", target: "node-2" },
        { id: "e2-3", source: "node-2", target: "node-3", label: "Yes (Opted In)" },
        { id: "e2-4", source: "node-2", target: "node-4", label: "No (Fallback)" },
        { id: "e3-5", source: "node-3", target: "node-5" },
        { id: "e4-5", source: "node-4", target: "node-5" },
        { id: "e5-6", source: "node-5", target: "node-6" },
        { id: "e6-7", source: "node-6", target: "node-7" },
      ],
    },
    createdAt: "2026-10-10T12:00:00Z",
    updatedAt: "2026-11-10T14:30:00Z",
  },
  {
    id: "jrn-02-re-engagement",
    workspaceId: "ws-growth-lab",
    brandId: "brand-apex",
    brandName: "Apex Global Capital",
    name: "Dormant Client 90-Day Re-engagement",
    description: "Re-activates institutional partners inactive for 90+ days via executive Macro Alpha memorandum on LinkedIn & WhatsApp.",
    status: "PUBLISHED",
    version: 2,
    triggerType: "INACTIVITY_90D",
    enrolledCount: 86,
    completedCount: 47,
    conversionRate: 54.6,
    canvasData: {
      nodes: [
        {
          id: "node-r1",
          type: "triggerNode",
          position: { x: 250, y: 50 },
          data: { label: "90 Days Inactive Inbound", triggerType: "INACTIVITY_90D", channel: "SYSTEM" },
        },
        {
          id: "node-r2",
          type: "actionNode",
          position: { x: 250, y: 180 },
          data: { label: "Audit WhatsApp 24h Window", channel: "WHATSAPP", agent: "WhatsApp Agent" },
        },
        {
          id: "node-r3",
          type: "actionNode",
          position: { x: 250, y: 310 },
          data: { label: "Dispatch HSM 'yield_report_summary_hsm'", channel: "WHATSAPP" },
        },
        {
          id: "node-r4",
          type: "goalNode",
          position: { x: 250, y: 440 },
          data: { label: "Goal: Audit Memo Downloaded", targetMetric: "Link Click" },
        },
      ],
      edges: [
        { id: "er1-2", source: "node-r1", target: "node-r2" },
        { id: "er2-3", source: "node-r2", target: "node-r3" },
        { id: "er3-4", source: "node-r3", target: "node-r4" },
      ],
    },
    createdAt: "2026-10-15T09:00:00Z",
    updatedAt: "2026-11-08T11:20:00Z",
  },
  {
    id: "jrn-03-milan-rsvp",
    workspaceId: "ws-growth-lab",
    brandId: "brand-lumina",
    brandName: "Lumina Creative",
    name: "Milan Gala VIP RSVP & Access Pass",
    description: "On-site exhibition flow: physical QR scan at palazzo entrance issues cryptographic digital ticket and instant portfolio pass.",
    status: "DRAFT",
    version: 1,
    triggerType: "QR_CODE_SCAN",
    enrolledCount: 0,
    completedCount: 0,
    conversionRate: 0.0,
    canvasData: {
      nodes: [
        {
          id: "node-m1",
          type: "triggerNode",
          position: { x: 250, y: 50 },
          data: { label: "Milan Entrance QR Scanned", triggerType: "QR_CODE_SCAN", channel: "QR_CODE" },
        },
        {
          id: "node-m2",
          type: "actionNode",
          position: { x: 250, y: 180 },
          data: { label: "Send WhatsApp Digital Badge", channel: "WHATSAPP" },
        },
        {
          id: "node-m3",
          type: "goalNode",
          position: { x: 250, y: 310 },
          data: { label: "Goal: Vernissage Exhibition Entry", targetMetric: "Badge Validation" },
        },
      ],
      edges: [
        { id: "em1-2", source: "node-m1", target: "node-m2" },
        { id: "em2-3", source: "node-m2", target: "node-m3" },
      ],
    },
    createdAt: "2026-11-12T16:00:00Z",
    updatedAt: "2026-11-12T16:00:00Z",
  },
];

// ============================================================================
// EXACTLY 9 TRIGGER CARDS
// ============================================================================
export const MOCK_TRIGGER_LIBRARY: TriggerCardItem[] = [
  {
    id: "trg-01",
    triggerType: "NEW_INSTAGRAM_COMMENT",
    name: "New Instagram comment",
    channel: "Instagram",
    iconName: "Instagram",
    description: "Fires whenever a user leaves a comment on an organic post, carousel, or ad creative.",
    category: "Social",
  },
  {
    id: "trg-02",
    triggerType: "NEW_FACEBOOK_MESSAGE",
    name: "New Facebook Page message",
    channel: "Facebook",
    iconName: "Facebook",
    description: "Fires when a direct customer inquiry arrives in the official Facebook business inbox.",
    category: "Social",
  },
  {
    id: "trg-03",
    triggerType: "NEW_LINKEDIN_LEAD",
    name: "New LinkedIn lead",
    channel: "LinkedIn",
    iconName: "Linkedin",
    description: "Fires when a prospect submits a native LinkedIn Lead Gen form on a sponsored flight.",
    category: "Social",
  },
  {
    id: "trg-04",
    triggerType: "WEBSITE_ENQUIRY",
    name: "Website enquiry",
    channel: "Website",
    iconName: "Globe",
    description: "Fires when a visitor submits an RFP or creative inquiry via the corporate site.",
    category: "Web & Forms",
  },
  {
    id: "trg-05",
    triggerType: "WHATSAPP_INBOUND",
    name: "WhatsApp inbound message",
    channel: "WhatsApp",
    iconName: "MessageSquare",
    description: "Fires on any customer-initiated WhatsApp text, opening the 24-hour service window.",
    category: "Messaging",
  },
  {
    id: "trg-06",
    triggerType: "EMAIL_LINK_CLICK",
    name: "Email link click",
    channel: "Email",
    iconName: "Mail",
    description: "Fires when a recipient clicks a tracked UTM link or editorial lookbook PDF button.",
    category: "Messaging",
  },
  {
    id: "trg-07",
    triggerType: "QR_CODE_SCAN",
    name: "QR code scan",
    channel: "QR Code",
    iconName: "QrCode",
    description: "Fires when an on-site physical gallery QR code or exhibition pass is scanned.",
    category: "Web & Forms",
  },
  {
    id: "trg-08",
    triggerType: "FORM_SUBMISSION",
    name: "Form submission",
    channel: "Forms",
    iconName: "FileCheck",
    description: "Fires on native OmniBrand OS form captures, survey responses, and newsletter opt-ins.",
    category: "Web & Forms",
  },
  {
    id: "trg-09",
    triggerType: "GOOGLE_BUSINESS_ENQUIRY",
    name: "Google Business Profile enquiry",
    channel: "Google Business",
    iconName: "Search",
    description: "Fires on direct chat inquiries and appointment bookings via Google Search & Maps.",
    category: "Social",
  },
];

// ============================================================================
// 25 AUTOMATION RULES
// ============================================================================
export const MOCK_AUTOMATION_RULES: AutomationRuleItem[] = [
  {
    id: "rul-01",
    workspaceId: "ws-growth-lab",
    brandId: "brand-lumina",
    name: "Auto-Welcome for Lookbook Downloads",
    description: "When website form submitted with lookbook intent, immediately send WhatsApp greeting.",
    status: "ACTIVE",
    triggerType: "WEBSITE_ENQUIRY",
    triggerLabel: "Website enquiry",
    actionType: "DISPATCH_WHATSAPP_TEMPLATE",
    actionLabel: "Send 'catalog_reengagement_v1'",
    conditionText: "Form type == 'lookbook_download' AND Consent == 'OPTED_IN'",
    executionCount: 384,
    lastExecutedAt: "2026-11-13T14:15:00Z",
    createdAt: "2026-10-01T10:00:00Z",
  },
  {
    id: "rul-02",
    workspaceId: "ws-growth-lab",
    brandId: "brand-lumina",
    name: "Severe Sentiment Auto-Escalation",
    description: "When Instagram comment polarity < -0.3, route task directly to Escalation Inbox.",
    status: "ACTIVE",
    triggerType: "NEW_INSTAGRAM_COMMENT",
    triggerLabel: "New Instagram comment",
    actionType: "CREATE_ESCALATION",
    actionLabel: "Escalate to Human PR/Care Manager",
    conditionText: "Sentiment < -0.30",
    executionCount: 19,
    lastExecutedAt: "2026-11-13T12:40:00Z",
    createdAt: "2026-10-02T11:00:00Z",
  },
  {
    id: "rul-03",
    workspaceId: "ws-growth-lab",
    brandId: "brand-apex",
    name: "Institutional Lead Auto-Scoring",
    description: "When LinkedIn Lead Gen form submitted, calculate lead score and notify Account Director.",
    status: "ACTIVE",
    triggerType: "NEW_LINKEDIN_LEAD",
    triggerLabel: "New LinkedIn lead",
    actionType: "ASSIGN_AGENT",
    actionLabel: "Lead Agent: Score & Assign Tier",
    conditionText: "Company revenue > $50M",
    executionCount: 92,
    lastExecutedAt: "2026-11-13T11:20:00Z",
    createdAt: "2026-10-04T09:30:00Z",
  },
  {
    id: "rul-04",
    workspaceId: "ws-growth-lab",
    brandId: "brand-lumina",
    name: "QR Code Vernissage Badge Dispatch",
    description: "When Milan gallery QR code is scanned, dispatch encrypted mobile admission pass.",
    status: "ACTIVE",
    triggerType: "QR_CODE_SCAN",
    triggerLabel: "QR code scan",
    actionType: "DISPATCH_WHATSAPP_TEMPLATE",
    actionLabel: "Send 'milan_vernissage_ticket'",
    conditionText: "Campaign == 'Milan Vernissage'",
    executionCount: 148,
    lastExecutedAt: "2026-11-12T18:00:00Z",
    createdAt: "2026-10-10T14:00:00Z",
  },
  {
    id: "rul-05",
    workspaceId: "ws-growth-lab",
    brandId: "brand-apex",
    name: "Google Business Inbound Routing",
    description: "When consultation booked via Google Business Profile, create Calendar event and send SMS confirmation.",
    status: "ACTIVE",
    triggerType: "GOOGLE_BUSINESS_ENQUIRY",
    triggerLabel: "Google Business Profile enquiry",
    actionType: "DISPATCH_SMS",
    actionLabel: "Send SMS Consultation Confirmation",
    conditionText: "Phone format is valid E.164",
    executionCount: 65,
    lastExecutedAt: "2026-11-11T16:30:00Z",
    createdAt: "2026-10-12T16:00:00Z",
  },
  // Rules 6-25 for full diversity
  ...Array.from({ length: 20 }).map((_, i) => {
    const triggers = [
      "NEW_INSTAGRAM_COMMENT", "NEW_FACEBOOK_MESSAGE", "NEW_LINKEDIN_LEAD",
      "WEBSITE_ENQUIRY", "WHATSAPP_INBOUND", "EMAIL_LINK_CLICK",
      "QR_CODE_SCAN", "FORM_SUBMISSION", "GOOGLE_BUSINESS_ENQUIRY"
    ];
    const trigger = triggers[i % triggers.length];
    return {
      id: `rul-${String(6 + i).padStart(2, "0")}`,
      workspaceId: "ws-growth-lab",
      brandId: i % 2 === 0 ? "brand-lumina" : "brand-apex",
      name: `Automated Action Handler #${6 + i}: ${trigger.replace(/_/g, " ")}`,
      description: "Automated trigger execution enforcing omnichannel consent and latency limits.",
      status: (i === 12 ? "INACTIVE" : i === 18 ? "TEST_MODE" : "ACTIVE") as "ACTIVE" | "INACTIVE" | "TEST_MODE",
      triggerType: trigger,
      triggerLabel: trigger.replace(/_/g, " "),
      actionType: "DISPATCH_WHATSAPP_TEMPLATE",
      actionLabel: "Autonomous Agent Dispatch",
      conditionText: "Consent == 'OPTED_IN' AND SpendCap != 'EXCEEDED'",
      executionCount: (i + 1) * 28 + 12,
      lastExecutedAt: new Date(Date.now() - 1000 * 60 * 60 * (i + 1)).toISOString(),
      createdAt: "2026-10-15T10:00:00Z",
    };
  }),
];

// ============================================================================
// 200 EVENT LOG ROWS (Including Failures & DLQ for Replay)
// ============================================================================
export const MOCK_EVENT_LOGS: EventLogItem[] = Array.from({ length: 200 }).map((_, idx) => {
  const isFailure = idx % 12 === 0;
  const isDLQ = idx % 28 === 0 && idx !== 0;
  const isRetried = idx % 20 === 0 && !isFailure;

  const eventTypes = [
    "whatsapp.inbound.message",
    "form.submission.lead",
    "instagram.comment.created",
    "email.link.clicked",
    "qr.code.scanned",
    "linkedin.lead.submitted",
    "carrier.delivery.receipt",
    "policy.gate.blocked"
  ];
  const eventName = eventTypes[idx % eventTypes.length];
  const minutesAgo = idx * 8 + 3;
  const createdAt = new Date(Date.now() - 1000 * 60 * minutesAgo).toISOString();

  let status: "PENDING" | "PROCESSED" | "FAILED" | "RETRIED" | "DLQ" = "PROCESSED";
  let errorMessage: string | undefined = undefined;

  if (isDLQ) {
    status = "DLQ";
    errorMessage = "Dead Letter Queue: Max retries (3/3) exceeded on remote carrier socket.";
  } else if (isFailure) {
    status = "FAILED";
    errorMessage = "Gateway 504: Downstream carrier webhook timeout. Awaiting auto-retry.";
  } else if (isRetried) {
    status = "RETRIED";
  }

  return {
    id: `evt-log-${String(1000 + idx)}`,
    workspaceId: "ws-growth-lab",
    eventName,
    source: eventName.startsWith("whatsapp") ? "SMSCloud Hub (WABA)" : eventName.startsWith("instagram") ? "Meta Graph API" : "OmniBrand Webhook Engine",
    status,
    payload: {
      eventId: `raw_event_${1000 + idx}`,
      protocol: "EVENT_DISPATCH_V2",
      contactPhone: idx % 2 === 0 ? "+1 (415) 890-2190" : "+44 7911 123456",
      metadata: {
        latencyMs: 14 + (idx * 3) % 40,
        carrierReceipt: `ACK_CARRIER_${1000 + idx}`,
        ip: "10.0.12.84",
      },
    },
    errorMessage,
    retryCount: isDLQ ? 3 : isFailure ? 1 : 0,
    maxRetries: 3,
    processedAt: status === "PROCESSED" || status === "RETRIED" ? new Date(new Date(createdAt).getTime() + 450).toISOString() : undefined,
    createdAt,
  };
});

// ============================================================================
// INTEGRATION REGISTRY (Webhooks, API keys, rate limits, health)
// ============================================================================
export const MOCK_INTEGRATIONS_REGISTRY: IntegrationRegistryItem[] = [
  {
    id: "reg-01",
    name: "SMSCloud Hub (WABA & RCS Direct)",
    category: "Messaging Gateway",
    provider: "SMSCloud Enterprise",
    webhookUrl: "https://api.omnibrand.io/v1/webhooks/smscloud-hub",
    rateLimit: "1,000 req/sec",
    currentUsage: "48 req/sec (Peak 142 req/sec)",
    healthStatus: "HEALTHY",
    lastHeartbeat: "Just now (42ms)",
  },
  {
    id: "reg-02",
    name: "Ayrshare Social Multi-Poster",
    category: "Social Network Hub",
    provider: "Ayrshare Business Max",
    webhookUrl: "https://api.omnibrand.io/v1/webhooks/ayrshare-dispatch",
    rateLimit: "120 req/min",
    currentUsage: "18 req/min",
    healthStatus: "HEALTHY",
    lastHeartbeat: "1m ago (78ms)",
  },
  {
    id: "reg-03",
    name: "Meta Graph API (IG & FB)",
    category: "Social Webhooks",
    provider: "Meta Verified Business Partner",
    webhookUrl: "https://api.omnibrand.io/v1/webhooks/meta-graph",
    rateLimit: "200 calls/hr per user",
    currentUsage: "42 calls/hr",
    healthStatus: "HEALTHY",
    lastHeartbeat: "30s ago (112ms)",
  },
  {
    id: "reg-04",
    name: "Google Search Console & Business API",
    category: "SEO & Local Listings",
    provider: "Google Cloud Platform",
    webhookUrl: "https://api.omnibrand.io/v1/webhooks/google-gsc",
    rateLimit: "100,000 queries/day",
    currentUsage: "4,200 queries/day",
    healthStatus: "HEALTHY",
    lastHeartbeat: "2m ago (140ms)",
  },
  {
    id: "reg-05",
    name: "SendGrid Email Relay",
    category: "Transactional & Marketing Mail",
    provider: "Twilio SendGrid Pro",
    webhookUrl: "https://api.omnibrand.io/v1/webhooks/sendgrid-events",
    rateLimit: "10,000 emails/sec",
    currentUsage: "120 emails/sec",
    healthStatus: "HEALTHY",
    lastHeartbeat: "Just now (34ms)",
  },
  {
    id: "reg-06",
    name: "Zapier & Make Inbound Bridge",
    category: "Automation Webhook Relay",
    provider: "Custom Inbound Dispatcher",
    webhookUrl: "https://api.omnibrand.io/v1/webhooks/incoming/relay",
    rateLimit: "500 req/sec",
    currentUsage: "12 req/sec",
    healthStatus: "HEALTHY",
    lastHeartbeat: "1m ago (65ms)",
  },
];
