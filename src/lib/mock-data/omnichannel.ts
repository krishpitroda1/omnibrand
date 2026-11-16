import {
  OmniChannel,
  TemplateCategory,
  TemplateStatus,
  ConsentStatus,
  SendStatus,
} from "@/types";

export interface ChannelStatusInfo {
  channel: OmniChannel;
  name: string;
  provider: string;
  health: "HEALTHY" | "DEGRADED" | "DOWN";
  latencyMs: number;
  throughputToday: number;
  creditsRemaining: number;
  deliveryRate: number; // Percentage e.g. 99.4
  costPerUnit: number;
  restrictionsNote?: string;
}

export interface MessageTemplateItem {
  id: string;
  workspaceId: string;
  brandId: string;
  name: string;
  channel: OmniChannel;
  category: TemplateCategory;
  language: string;
  body: string;
  variables: string[];
  status: TemplateStatus;
  rejectionReason?: string;
  lastUpdated: string;
}

export interface ContactItem {
  id: string;
  workspaceId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  stage: "LEAD" | "QUALIFIED" | "OPPORTUNITY" | "CUSTOMER";
  createdAt: string;
  channelConsents: Record<OmniChannel, {
    status: ConsentStatus;
    source: string;
    proofReference: string;
    manuallyOverridden?: boolean;
    overrideReason?: string;
    updatedAt: string;
  }>;
}

export interface PolicyCheckResult {
  passed: boolean;
  checks: {
    rule: string;
    status: "PASS" | "FAIL" | "WARN";
    details: string;
  }[];
}

export interface MessageSendItem {
  id: string;
  workspaceId: string;
  contactId: string;
  contactName: string;
  recipient: string;
  channel: OmniChannel;
  templateId?: string;
  templateName?: string;
  status: SendStatus;
  cost: number;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  clickedAt?: string;
  errorMessage?: string;
  policyCheckResult: PolicyCheckResult;
  payload: Record<string, unknown>;
}

export interface ConversationItem {
  id: string;
  workspaceId: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  contactAvatar: string;
  channel: OmniChannel;
  status: "OPEN" | "WAITING_ON_CUSTOMER" | "RESOLVED";
  lastInboundAt: string;
  lastOutboundAt: string;
  windowHoursRemaining: number; // WhatsApp 24-hr invariant
  windowExpiresAt: string;
  unreadCount: number;
  messages: {
    id: string;
    sender: "INBOUND" | "OUTBOUND" | "SYSTEM";
    text: string;
    timestamp: string;
    status?: SendStatus;
    isTemplate?: boolean;
    templateName?: string;
  }[];
}

// =========================================================================
// A. CHANNEL STATUS BOARD SEED
// =========================================================================
export const MOCK_CHANNELS_STATUS: ChannelStatusInfo[] = [
  {
    channel: "WHATSAPP",
    name: "WhatsApp Business API",
    provider: "SMSCloud Hub (WABA Direct)",
    health: "HEALTHY",
    latencyMs: 78,
    throughputToday: 18420,
    creditsRemaining: 481580,
    deliveryRate: 99.8,
    costPerUnit: 0.038,
    restrictionsNote: "Enforcing 24-hour customer service window. Outside window, templates strictly required.",
  },
  {
    channel: "RCS",
    name: "RCS Business Messaging",
    provider: "SMSCloud Hub (Google RBM)",
    health: "HEALTHY",
    latencyMs: 112,
    throughputToday: 6840,
    creditsRemaining: 493160,
    deliveryRate: 98.9,
    costPerUnit: 0.024,
    restrictionsNote: "Rich cards with interactive chips & verified sender badges enabled.",
  },
  {
    channel: "SMS",
    name: "A2P 10DLC Shortcode SMS",
    provider: "SMSCloud Hub / Twilio Super Network",
    health: "HEALTHY",
    latencyMs: 65,
    throughputToday: 32100,
    creditsRemaining: 467900,
    deliveryRate: 99.2,
    costPerUnit: 0.012,
    restrictionsNote: "Carrier STOP/UNSUBSCRIBE auto-reply active. Zero marketing without prior explicit opt-in.",
  },
  {
    channel: "VOICE",
    name: "Programmable Voice & IVR",
    provider: "SMSCloud Hub Voice Engine",
    health: "HEALTHY",
    latencyMs: 140,
    throughputToday: 890,
    creditsRemaining: 499110,
    deliveryRate: 97.4,
    costPerUnit: 0.055,
    restrictionsNote: "Inbound IVR concierge with whisper transfer & consent verification.",
  },
  {
    channel: "EMAIL",
    name: "Transactional & Dedicated Email",
    provider: "Resend / Amazon SES Dedicated Pool",
    health: "HEALTHY",
    latencyMs: 45,
    throughputToday: 84200,
    creditsRemaining: 915800,
    deliveryRate: 99.6,
    costPerUnit: 0.001,
    restrictionsNote: "DMARC, DKIM, and BIMI verified. One-click RFC 8058 list unsubscribe active.",
  },
  {
    channel: "WEB_PUSH",
    name: "Browser Web Push Notifications",
    provider: "VAPID WebPush Gateway",
    health: "HEALTHY",
    latencyMs: 38,
    throughputToday: 12400,
    creditsRemaining: 987600,
    deliveryRate: 96.2,
    costPerUnit: 0.0005,
    restrictionsNote: "Browser permission gated. Respects user Do Not Disturb system flags.",
  },
];

// =========================================================================
// B. TEMPLATES SEED (8 Templates across channels)
// =========================================================================
export const MOCK_TEMPLATES: MessageTemplateItem[] = [
  {
    id: "tpl-wa-01",
    workspaceId: "ws-growth-lab",
    brandId: "brand-lumina",
    name: "catalog_reengagement_v1",
    channel: "WHATSAPP",
    category: "MARKETING",
    language: "en_US",
    body: "Hello {{1}}, our design team just released the new {{2}} collection. Would you like to review the tactile architectural lookbook?",
    variables: ["Contact Name", "Collection Name"],
    status: "APPROVED",
    lastUpdated: "2026-11-10T12:00:00Z",
  },
  {
    id: "tpl-wa-02",
    workspaceId: "ws-growth-lab",
    brandId: "brand-lumina",
    name: "consultation_appointment_confirm",
    channel: "WHATSAPP",
    category: "UTILITY",
    language: "en_US",
    body: "Hi {{1}}, your studio creative consultation has been reserved for {{2}} at {{3}}. Please reply YES to confirm or RESCHEDULE to adjust.",
    variables: ["Client Name", "Date", "Time Slot"],
    status: "APPROVED",
    lastUpdated: "2026-11-08T09:30:00Z",
  },
  {
    id: "tpl-wa-03",
    workspaceId: "ws-growth-lab",
    brandId: "brand-apex",
    name: "yield_report_summary_hsm",
    channel: "WHATSAPP",
    category: "MARKETING",
    language: "en_US",
    body: "Apex Institutional: The weekly collateral & risk disclosure for {{1}} is now ready. Review risk metrics: {{2}}",
    variables: ["Portfolio Name", "Secure Link"],
    status: "APPROVED",
    lastUpdated: "2026-11-05T14:15:00Z",
  },
  {
    id: "tpl-wa-04",
    workspaceId: "ws-growth-lab",
    brandId: "brand-apex",
    name: "vip_alpha_airdrop_promo",
    channel: "WHATSAPP",
    category: "MARKETING",
    language: "en_US",
    body: "Exclusive {{1}} guaranteed 50x returns on our new liquidity token! Claim your instant allocation: {{2}}",
    variables: ["User Handle", "Link"],
    status: "REJECTED",
    rejectionReason: "Meta Policy Violation: Financial promotion promising guaranteed returns without regulatory disclosures.",
    lastUpdated: "2026-11-02T16:45:00Z",
  },
  {
    id: "tpl-rcs-01",
    workspaceId: "ws-growth-lab",
    brandId: "brand-lumina",
    name: "rcs_rich_lookbook_hero",
    channel: "RCS",
    category: "MARKETING",
    language: "en_US",
    body: "Experience tactile brutalist spatial design. Hello {{1}}, tap below to explore the {{2}} virtual showroom.",
    variables: ["First Name", "Season"],
    status: "APPROVED",
    lastUpdated: "2026-11-09T11:20:00Z",
  },
  {
    id: "tpl-sms-01",
    workspaceId: "ws-growth-lab",
    brandId: "brand-verdant",
    name: "sms_order_tracking_update",
    channel: "SMS",
    category: "UTILITY",
    language: "en_US",
    body: "Verdant Wellness: Hi {{1}}, your organic botanical formulation order #{{2}} is out for delivery with courier tracking {{3}}. Reply STOP to opt out.",
    variables: ["Name", "Order Number", "Tracking URL"],
    status: "APPROVED",
    lastUpdated: "2026-11-11T08:00:00Z",
  },
  {
    id: "tpl-email-01",
    workspaceId: "ws-growth-lab",
    brandId: "brand-northline",
    name: "docuseries_exclusive_screener",
    channel: "EMAIL",
    category: "MARKETING",
    language: "en_US",
    body: "Dear {{1}},\n\nYou are invited to private festival screener for '{{2}}'. Directed by our principal cinematic unit. Access expires {{3}}.",
    variables: ["VIP Name", "Film Title", "Expiration"],
    status: "APPROVED",
    lastUpdated: "2026-11-12T10:00:00Z",
  },
  {
    id: "tpl-push-01",
    workspaceId: "ws-growth-lab",
    brandId: "brand-lumina",
    name: "webpush_flash_creative_alert",
    channel: "WEB_PUSH",
    category: "MARKETING",
    language: "en_US",
    body: "New studio lookbook live: {{1}}. Tap to inspect high-res photography.",
    variables: ["Lookbook Title"],
    status: "PENDING",
    lastUpdated: "2026-11-13T14:00:00Z",
  },
];

export const MOCK_MESSAGE_TEMPLATES: MessageTemplateItem[] = MOCK_TEMPLATES;

// =========================================================================
// C. 40 SEEDED CONTACTS WITH CHANNEL CONSENTS
// =========================================================================
const FIRST_NAMES = [
  "Julian", "Claire", "Darius", "Seraphina", "Alexander", "Vivian", "Mateo",
  "Chloe", "Harrison", "Isabelle", "Lucas", "Aria", "Sebastian", "Camila",
  "Nico", "Giselle", "Finn", "Leila", "Maxwell", "Sienna", "Ethan",
  "Zara", "Caleb", "Nadia", "Liam", "Freya", "Noah", "Maya", "Elijah",
  "Astrid", "James", "Rowan", "Oliver", "Elise", "Leo", "Iris", "Mason",
  "Clara", "Logan", "Penelope"
];

const LAST_NAMES = [
  "Vance", "Dupont", "Sterling", "Lin", "Montgomery", "Zhang", "Navarro",
  "Mercer", "Thorne", "Fontaine", "Kowalski", "Sinclair", "Moretti", "Castillo",
  "De Vries", "Lombardi", "MacLeod", "Rahman", "Sinclair", "Hawthorne", "Crest",
  "Vogel", "Blackwood", "Sultana", "Winter", "Holt", "Fairfax", "Adler", "Kahn",
  "Solomon", "Lowell", "Barrett", "Gatsby", "Prescott", "St. James", "Kim", "Park",
  "Tanaka", "Vassiliev", "Rousseau"
];

const COMPANIES = [
  "Atelier Studio Labs", "Vanguard Media Group", "Apex Digital Assets",
  "Kensington Equity", "Boutique Creative Co", "Verdant Retail Group",
  "Aura Architecture Studio", "Obsidian Holdings", "Highline Visuals",
  "Sovereign Protocol Foundation", "Crestwood Capital", "Nordic Spatial"
];

export const MOCK_CONTACTS: ContactItem[] = FIRST_NAMES.map((first, idx) => {
  const last = LAST_NAMES[idx % LAST_NAMES.length];
  const name = `${first} ${last}`;
  const company = COMPANIES[idx % COMPANIES.length];
  const email = `${first.toLowerCase()}.${last.toLowerCase().replace(/[^a-z]/g, "")}@${company.toLowerCase().replace(/[^a-z]/g, "")}.com`;
  const phone = `+1 (${Math.floor(200 + Math.random() * 700)}) ${Math.floor(200 + Math.random() * 700)}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Specific known test cases
  const isJulian = first === "Julian";
  const isClaire = first === "Claire";
  const isDarius = first === "Darius";
  const isOptedOutCase = idx === 3 || idx === 11 || idx === 25; // Known hard block cases

  const stages: ("LEAD" | "QUALIFIED" | "OPPORTUNITY" | "CUSTOMER")[] = ["LEAD", "QUALIFIED", "OPPORTUNITY", "CUSTOMER"];
  const stage = stages[idx % 4];

  return {
    id: `cnt-${String(idx + 1).padStart(3, "0")}`,
    workspaceId: idx % 3 === 0 ? "ws-enterprise-ventures" : "ws-growth-lab",
    name,
    email,
    phone,
    company,
    stage,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (idx + 5)).toISOString(),
    channelConsents: {
      WHATSAPP: {
        status: isOptedOutCase ? "OPTED_OUT" : (isClaire || isJulian || idx % 2 === 0 ? "OPTED_IN" : "UNKNOWN"),
        source: isOptedOutCase ? "USER_UNSUBSCRIBE_KEYWORD" : (isClaire ? "INBOUND_WHATSAPP" : "WEBSITE_CONTACT_FORM"),
        proofReference: `PROOF_HASH_WABA_${1000 + idx}`,
        manuallyOverridden: idx === 7,
        overrideReason: idx === 7 ? "Direct executive consent confirmed in face-to-face studio meeting." : undefined,
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12 * (idx + 1)).toISOString(),
      },
      RCS: {
        status: isOptedOutCase ? "OPTED_OUT" : (idx % 3 === 0 ? "OPTED_IN" : "UNKNOWN"),
        source: "DOUBLE_OPT_IN_SMS",
        proofReference: `PROOF_HASH_RCS_${2000 + idx}`,
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (idx + 2)).toISOString(),
      },
      SMS: {
        status: isOptedOutCase ? "OPTED_OUT" : (idx % 4 !== 0 ? "OPTED_IN" : "UNKNOWN"),
        source: "WEB_CHECKOUT_CHECKBOX",
        proofReference: `PROOF_HASH_SMS_${3000 + idx}`,
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 36 * (idx + 1)).toISOString(),
      },
      VOICE: {
        status: idx % 5 === 0 ? "OPTED_IN" : "UNKNOWN",
        source: "INBOUND_IVR_CONSENT",
        proofReference: `PROOF_HASH_VOICE_${4000 + idx}`,
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
      EMAIL: {
        status: isOptedOutCase ? "OPTED_OUT" : "OPTED_IN",
        source: "NEWSLETTER_DOUBLE_OPT_IN",
        proofReference: `PROOF_HASH_EMAIL_${5000 + idx}`,
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      },
      WEB_PUSH: {
        status: idx % 2 === 0 ? "OPTED_IN" : "UNKNOWN",
        source: "BROWSER_NOTIFICATION_PROMPT",
        proofReference: `PROOF_HASH_PUSH_${6000 + idx}`,
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
      },
    },
  };
});

// =========================================================================
// D. 3 CONVERSATIONS DEMONSTRATING WHATSAPP 24-HOUR WINDOW
// =========================================================================
export const MOCK_CONVERSATIONS: ConversationItem[] = [
  {
    id: "conv-01-claire",
    workspaceId: "ws-growth-lab",
    contactId: "cnt-002",
    contactName: "Claire Dupont",
    contactPhone: "+1 (415) 890-2190",
    contactAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    channel: "WHATSAPP",
    status: "OPEN",
    lastInboundAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 minutes ago
    lastOutboundAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    windowHoursRemaining: 23, // ACTIVE WINDOW
    windowExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 23.4).toISOString(),
    unreadCount: 1,
    messages: [
      {
        id: "msg-c1",
        sender: "OUTBOUND",
        text: "Hello Claire, our design team just released the new Architectural Radiance collection. Would you like to review the lookbook?",
        timestamp: "Yesterday at 4:10 PM",
        status: "READ",
        isTemplate: true,
        templateName: "catalog_reengagement_v1",
      },
      {
        id: "msg-c2",
        sender: "INBOUND",
        text: "Yes, absolutely! Could you send over the updated catalog for the fall editorial line?",
        timestamp: "35m ago",
      },
      {
        id: "msg-c3",
        sender: "OUTBOUND",
        text: "Here is the direct link: https://luminacreative.studio/lookbook. Let us know which finishes you prefer.",
        timestamp: "18m ago",
        status: "DELIVERED",
      },
      {
        id: "msg-c4",
        sender: "INBOUND",
        text: "Thanks! Looking at the brutalist series now.",
        timestamp: "5m ago",
      },
    ],
  },
  {
    id: "conv-02-julian",
    workspaceId: "ws-growth-lab",
    contactId: "cnt-001",
    contactName: "Julian Vance",
    contactPhone: "+44 7911 123456",
    contactAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    channel: "WHATSAPP",
    status: "WAITING_ON_CUSTOMER",
    lastInboundAt: new Date(Date.now() - 1000 * 60 * 60 * 27).toISOString(), // 27 hours ago
    lastOutboundAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    windowHoursRemaining: 0, // EXPIRED WINDOW: ONLY TEMPLATES PERMITTED!
    windowExpiresAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    unreadCount: 0,
    messages: [
      {
        id: "msg-j1",
        sender: "INBOUND",
        text: "Could you send a quote for an executive creative retainer starting in December?",
        timestamp: "27 hours ago",
      },
      {
        id: "msg-j2",
        sender: "OUTBOUND",
        text: "We just prepared your custom retainer proposal. Standard consultation tier at $8.5k/mo.",
        timestamp: "26 hours ago",
        status: "READ",
      },
      {
        id: "msg-j3",
        sender: "SYSTEM",
        text: "WhatsApp 24-Hour Customer Service Window expired. Free-form text sending is locked. Select an approved HSM template to re-engage.",
        timestamp: "3 hours ago",
      },
    ],
  },
  {
    id: "conv-03-darius",
    workspaceId: "ws-growth-lab",
    contactId: "cnt-003",
    contactName: "Darius Sterling",
    contactPhone: "+1 (212) 555-8831",
    contactAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    channel: "WHATSAPP",
    status: "OPEN",
    lastInboundAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // 22 hours ago
    lastOutboundAt: new Date(Date.now() - 1000 * 60 * 60 * 21).toISOString(),
    windowHoursRemaining: 2, // BOUNDARY WINDOW: 2 HOURS REMAINING!
    windowExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    unreadCount: 0,
    messages: [
      {
        id: "msg-d1",
        sender: "INBOUND",
        text: "We scanned the gallery QR code at the Austin flagship. Do you have physical samples of the concrete tile finishes?",
        timestamp: "22 hours ago",
      },
      {
        id: "msg-d2",
        sender: "OUTBOUND",
        text: "Yes Darius! We can courier a tactile sample box to your Manhattan office today.",
        timestamp: "21 hours ago",
        status: "READ",
      },
    ],
  },
];

// =========================================================================
// E. 120 SEEDED MESSAGE SENDS WITH MIXED STATUSES & POLICY CHECK RESULTS
// =========================================================================
const CHANNELS_LIST: OmniChannel[] = ["WHATSAPP", "RCS", "SMS", "EMAIL"];
const STATUSES_LIST: SendStatus[] = [
  "DELIVERED", "READ", "CLICKED", "DELIVERED", "READ", "SENT", "QUEUED", "FAILED", "OPTED_OUT"
];

export const MOCK_MESSAGE_SENDS: MessageSendItem[] = Array.from({ length: 120 }).map((_, idx) => {
  const contact = MOCK_CONTACTS[idx % MOCK_CONTACTS.length];
  const channel = CHANNELS_LIST[idx % CHANNELS_LIST.length];
  const template = MOCK_TEMPLATES.find((t) => t.channel === channel) || MOCK_TEMPLATES[0];
  const status = STATUSES_LIST[idx % STATUSES_LIST.length];
  
  const recipient = channel === "EMAIL" ? contact.email : contact.phone;
  const cost = channel === "WHATSAPP" ? 0.038 : channel === "RCS" ? 0.024 : channel === "SMS" ? 0.012 : 0.001;

  const isJulian = contact.id === "cnt-001";
  const isFailed = status === "FAILED" || status === "OPTED_OUT";

  const policyCheckResult: PolicyCheckResult = {
    passed: !isFailed,
    checks: [
      {
        rule: "Explicit Channel Consent Verified",
        status: status === "OPTED_OUT" ? "FAIL" : "PASS",
        details: status === "OPTED_OUT"
          ? "Hard Block: Recipient marked OPTED_OUT in ConsentRecord."
          : `Consent verified via ${contact.channelConsents[channel]?.source || "WEB_FORM"} (${contact.channelConsents[channel]?.proofReference || "PROOF_OK"})`,
      },
      {
        rule: "WhatsApp 24-Hour Customer Window Compliance",
        status: channel === "WHATSAPP" && isJulian ? "WARN" : "PASS",
        details: channel === "WHATSAPP" && isJulian
          ? "Standard session expired. Re-engagement routed through Meta-approved HSM template."
          : "Active window verified or non-session channel.",
      },
      {
        rule: "Workspace Spend Cap & Credit Balance",
        status: "PASS",
        details: "Workspace credit balance sufficient (481,580 credits remaining).",
      },
      {
        rule: "Template Certification Status",
        status: template.status === "APPROVED" ? "PASS" : "FAIL",
        details: `Template '${template.name}' status: ${template.status}.`,
      },
    ],
  };

  const sentMinutesAgo = idx * 18 + 10;
  const sentDate = new Date(Date.now() - 1000 * 60 * sentMinutesAgo).toISOString();

  return {
    id: `snd-${String(1000 + idx)}`,
    workspaceId: contact.workspaceId,
    contactId: contact.id,
    contactName: contact.name,
    recipient,
    channel,
    templateId: template.id,
    templateName: template.name,
    status,
    cost,
    sentAt: sentDate,
    deliveredAt: status !== "QUEUED" && status !== "FAILED" ? new Date(new Date(sentDate).getTime() + 1200).toISOString() : undefined,
    readAt: status === "READ" || status === "CLICKED" ? new Date(new Date(sentDate).getTime() + 18000).toISOString() : undefined,
    clickedAt: status === "CLICKED" ? new Date(new Date(sentDate).getTime() + 45000).toISOString() : undefined,
    errorMessage: status === "FAILED" ? "Carrier Gateway Error: Temporary network timeout on remote carrier node." : status === "OPTED_OUT" ? "Blocked by Policy Gate: User explicitly revoked consent on this channel." : undefined,
    policyCheckResult,
    payload: {
      recipient,
      template: template.name,
      variables: [contact.name.split(" ")[0], "Architectural Radiance"],
      channelProtocol: `PROTO_${channel}_DISPATCH_V2`,
      idempotencyKey: `idemp_msg_${1000 + idx}`,
    },
  };
});
