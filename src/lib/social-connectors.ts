import { Platform, AspectRatio } from "@/types";

export interface FormattedPayloadOptions {
  platform: Platform;
  caption: string;
  mediaUrl: string;
  aspectRatio: AspectRatio;
  scheduledAt?: string;
  hashtags: string[];
  ctaUrl?: string;
  brandName: string;
  workspaceId: string;
}

export interface AyrsharePayload {
  post: string;
  platforms: string[];
  mediaUrls: string[];
  scheduleDate?: string;
  shortenLinks: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  metadata: {
    workspaceId: string;
    brandName: string;
    aspectRatio: AspectRatio;
  };
}

export interface BufferPayload {
  text: string;
  profile_ids: string[];
  media: {
    photo?: string;
    thumbnail?: string;
    description?: string;
  };
  scheduled_at?: string;
  now?: boolean;
  top?: boolean;
}

export interface DirectApiPayload {
  channel_protocol: string;
  message_content: {
    body: string;
    tags: string[];
    action_button?: {
      title: string;
      url: string;
    };
  };
  media_attachment: {
    source_url: string;
    aspect_ratio: string;
    encoding: string;
  };
  security_context: {
    workspace_id: string;
    consent_record_verified: boolean;
    idempotency_token: string;
  };
}

export function formatAyrsharePayload(options: FormattedPayloadOptions): AyrsharePayload {
  const platformKeyMap: Record<Platform, string> = {
    INSTAGRAM: "instagram",
    FACEBOOK: "facebook",
    LINKEDIN: "linkedin",
    X: "twitter",
    YOUTUBE: "youtube",
    TIKTOK: "tiktok",
    PINTEREST: "pinterest",
    THREADS: "threads",
    GOOGLE_BUSINESS: "gmb",
  };

  const fullText = options.hashtags.length > 0
    ? `${options.caption}\n\n${options.hashtags.map((t) => (t.startsWith("#") ? t : `#${t}`)).join(" ")}`
    : options.caption;

  return {
    post: fullText,
    platforms: [platformKeyMap[options.platform] || "instagram"],
    mediaUrls: [options.mediaUrl],
    scheduleDate: options.scheduledAt,
    shortenLinks: true,
    utmSource: platformKeyMap[options.platform],
    utmMedium: "social_organic",
    utmCampaign: options.brandName.toLowerCase().replace(/[^a-z0-9]/g, "_"),
    metadata: {
      workspaceId: options.workspaceId,
      brandName: options.brandName,
      aspectRatio: options.aspectRatio,
    },
  };
}

export function formatBufferPayload(options: FormattedPayloadOptions): BufferPayload {
  const fullText = options.hashtags.length > 0
    ? `${options.caption}\n\n${options.hashtags.map((t) => (t.startsWith("#") ? t : `#${t}`)).join(" ")}`
    : options.caption;

  return {
    text: fullText,
    profile_ids: [`prof_${options.platform.toLowerCase()}_live_01`],
    media: {
      photo: options.mediaUrl,
      description: `OmniBrand OS dispatch for ${options.brandName}`,
    },
    scheduled_at: options.scheduledAt,
    now: !options.scheduledAt,
  };
}

export function formatDirectApiPayload(options: FormattedPayloadOptions): DirectApiPayload {
  return {
    channel_protocol: `PROTO_${options.platform}_GRAPH_V18`,
    message_content: {
      body: options.caption,
      tags: options.hashtags,
      action_button: options.ctaUrl
        ? {
            title: "Learn More",
            url: options.ctaUrl,
          }
        : undefined,
    },
    media_attachment: {
      source_url: options.mediaUrl,
      aspect_ratio: options.aspectRatio,
      encoding: "image/png",
    },
    security_context: {
      workspace_id: options.workspaceId,
      consent_record_verified: true,
      idempotency_token: `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    },
  };
}
