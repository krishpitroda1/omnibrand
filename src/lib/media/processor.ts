import crypto from "crypto";

export const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/quicktime",
]);

export const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
export const MAX_VIDEO_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB

export interface MediaValidationResult {
  isValid: boolean;
  error?: string;
  mediaType?: "IMAGE" | "VIDEO";
}

/**
 * Validates MIME type and byte size boundaries
 */
export function validateMediaUpload(contentType: string, sizeBytes: number): MediaValidationResult {
  if (!ALLOWED_MIME_TYPES.has(contentType)) {
    return {
      isValid: false,
      error: `Disallowed media type '${contentType}'. Allowed types: JPEG, PNG, WebP, GIF, MP4, MOV.`,
    };
  }

  const isVideo = contentType.startsWith("video/");
  const maxSize = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;

  if (sizeBytes > maxSize) {
    const maxMb = maxSize / (1024 * 1024);
    return {
      isValid: false,
      error: `File size exceeds platform limit of ${maxMb}MB for ${isVideo ? "videos" : "images"}.`,
    };
  }

  return {
    isValid: true,
    mediaType: isVideo ? "VIDEO" : "IMAGE",
  };
}

/**
 * Malware scan hook for uploaded buffer (checks known test signatures like EICAR)
 */
export async function scanFileForMalware(buffer: Buffer): Promise<{ isClean: boolean; virusName?: string }> {
  // EICAR standard test string signature check
  const eicarPattern = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*";
  const fileContent = buffer.toString("utf8", 0, Math.min(buffer.length, 1024));

  if (fileContent.includes(eicarPattern)) {
    return { isClean: false, virusName: "EICAR-Test-Signature" };
  }

  return { isClean: true };
}

/**
 * Calculates responsive variant dimensions for all 4 standard social aspect ratios
 */
export function getStandardDerivativeDimensions(originalWidth: number, originalHeight: number) {
  return [
    { ratio: "1:1", name: "Square Feed", width: 1080, height: 1080, format: "webp" },
    { ratio: "4:5", name: "Instagram Portrait", width: 1080, height: 1350, format: "webp" },
    { ratio: "16:9", name: "Landscape YouTube/LinkedIn", width: 1920, height: 1080, format: "webp" },
    { ratio: "9:16", name: "Vertical Reel/Story/Short", width: 1080, height: 1920, format: "webp" },
  ];
}
