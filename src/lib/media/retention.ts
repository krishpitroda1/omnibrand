export interface RetentionPolicy {
  policyName: string;
  category: "EPHEMERAL_PREVIEW" | "CAMPAIGN_ACTIVE" | "ARCHIVED" | "GDPR_PURGE";
  retentionDays: number;
  autoDelete: boolean;
}

export const MEDIA_RETENTION_POLICIES: Record<string, RetentionPolicy> = {
  EPHEMERAL_PREVIEW: {
    policyName: "Ephemeral AI Generations & Draft Previews",
    category: "EPHEMERAL_PREVIEW",
    retentionDays: 7,
    autoDelete: true,
  },
  CAMPAIGN_ACTIVE: {
    policyName: "Active Campaign Assets",
    category: "CAMPAIGN_ACTIVE",
    retentionDays: -1, // Permanent until campaign archived
    autoDelete: false,
  },
  ARCHIVED: {
    policyName: "Archived Campaign Historical Records",
    category: "ARCHIVED",
    retentionDays: 365,
    autoDelete: true,
  },
  GDPR_PURGE: {
    policyName: "GDPR Right to Be Forgotten Purge",
    category: "GDPR_PURGE",
    retentionDays: 0, // Immediate purge
    autoDelete: true,
  },
};

export function shouldAssetBePruned(uploadedAt: Date, policy: RetentionPolicy): boolean {
  if (policy.retentionDays < 0) return false;
  const ageDays = (Date.now() - uploadedAt.getTime()) / (1000 * 60 * 60 * 24);
  return ageDays > policy.retentionDays;
}
