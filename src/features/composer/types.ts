import { Platform, AspectRatio, AiModel, ContentStatus } from "@/types";

export interface ImageVariant {
  id: string;
  url: string;
  gradient: string;
  seed: string;
  model: AiModel;
  aspectRatio: AspectRatio;
  selected: boolean;
}

export interface PlatformVariantData {
  platform: Platform;
  caption: string;
  hashtags: string[];
  ctaText: string;
  ctaUrl: string;
  aspectRatio: AspectRatio;
  brandCheckPass: boolean;
  brandCheckNotes?: string;
}

export interface RevisionHistoryEntry {
  id: string;
  timestamp: string;
  prompt: string;
  feedback: string;
  mediaUrl: string;
  model: AiModel;
}

export interface ApprovalRecordData {
  actorName: string;
  decision: "APPROVED" | "REJECTED" | "CHANGES_REQUESTED";
  notes: string;
  complianceCheck: boolean;
  createdAt: string;
}

export interface ComposerWizardState {
  isOpen: boolean;
  step: 1 | 2 | 3 | 4 | 5;
  selectedBrandId: string;
  selectedPlatforms: Platform[];
  platformAspectRatios: Partial<Record<Platform, AspectRatio>>;
  campaignName: string;

  // Step 3 state
  masterPrompt: string;
  enhancedPrompt: string;
  isEnhanceWithTone: boolean;
  selectedModel: AiModel;
  isGenerating: boolean;
  generatedVariants: ImageVariant[];
  selectedVariantId: string;
  repurposedVariants: Partial<Record<Platform, PlatformVariantData>>;
  saveToMediaLibrary: boolean;

  // Step 4 state
  activePreviewPlatform: Platform;
  approvalRecord: ApprovalRecordData | null;
  revisionHistory: RevisionHistoryEntry[];
  revisionDrawerOpen: boolean;
  isRegenerating: boolean;
  complianceAcknowledged: boolean;

  // Step 5 state
  scheduleMode: "IMMEDIATE" | "SCHEDULED";
  scheduledDate: string;
  timezone: string;
  perChannelSchedule: Partial<Record<Platform, string>>;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  ctaType: "LINK" | "LEAD_FORM" | "WHATSAPP_CHAT" | "QR_CODE" | "LANDING_PAGE";
  ctaUrl: string;
}
