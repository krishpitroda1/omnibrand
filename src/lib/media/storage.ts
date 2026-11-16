import crypto from "crypto";

export interface PresignedUploadConfig {
  workspaceId: string;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  assetKey: string;
  cdnUrl: string;
  headers: Record<string, string>;
  expiresInSeconds: number;
}

const CDN_BASE_URL = process.env.CDN_BASE_URL || "https://cdn.omnibrand.io";
const S3_BUCKET = process.env.S3_BUCKET || "omnibrand-media-assets";

/**
 * Generates an S3/MinIO/Supabase Storage compatible presigned upload URL
 */
export function createPresignedUploadUrl(config: PresignedUploadConfig): PresignedUploadResponse {
  const fileExt = config.fileName.split(".").pop() || "jpg";
  const uniqueId = crypto.randomBytes(8).toString("hex");
  const assetKey = `${config.workspaceId}/${Date.now()}-${uniqueId}.${fileExt}`;

  // S3 SigV4 or MinIO compatible simulated presigned URL
  const uploadUrl = `https://${S3_BUCKET}.s3.amazonaws.com/${assetKey}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE&X-Amz-Date=${new Date()
    .toISOString()
    .replace(/[:-]|\.\d{3}/g, "")}&X-Amz-Expires=3600&X-Amz-SignedHeaders=content-type;host&X-Amz-Signature=mock_sigv4_hash_${uniqueId}`;

  const cdnUrl = `${CDN_BASE_URL}/${assetKey}`;

  return {
    uploadUrl,
    assetKey,
    cdnUrl,
    headers: {
      "Content-Type": config.contentType,
      "x-amz-server-side-encryption": "AES256",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
    expiresInSeconds: 3600,
  };
}

export function getCdnUrlForAsset(assetKey: string): string {
  return `${CDN_BASE_URL}/${assetKey}`;
}
