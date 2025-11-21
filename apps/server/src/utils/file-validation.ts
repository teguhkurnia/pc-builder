import { randomBytes } from "crypto";
import * as path from "path";

/**
 * Allowed image MIME types
 */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const;

/**
 * File type extensions mapping
 */
export const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

/**
 * Max file size in bytes (5MB default)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validate if file is an allowed image type
 */
export function isValidImageType(mimetype: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(mimetype as any);
}

/**
 * Validate file size
 */
export function isValidFileSize(
  size: number,
  maxSize: number = MAX_FILE_SIZE,
): boolean {
  return size > 0 && size <= maxSize;
}

/**
 * Generate unique filename with timestamp and random string
 */
export function generateUniqueFilename(
  originalFilename: string,
  mimetype: string,
): string {
  const timestamp = Date.now();
  const randomString = randomBytes(8).toString("hex");
  const ext = MIME_TO_EXT[mimetype] || path.extname(originalFilename);

  // Sanitize original filename (remove extension and special chars)
  const safeName = path
    .basename(originalFilename, path.extname(originalFilename))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50); // Limit length

  return `${timestamp}-${randomString}-${safeName}${ext}`;
}

/**
 * Sanitize filename to prevent directory traversal
 */
export function sanitizeFilename(filename: string): string {
  return path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, "");
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Validate uploaded file
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateUploadedFile(
  mimetype: string,
  size: number,
): FileValidationResult {
  if (!isValidImageType(mimetype)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
    };
  }

  if (!isValidFileSize(size)) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${formatFileSize(MAX_FILE_SIZE)}`,
    };
  }

  return { valid: true };
}
