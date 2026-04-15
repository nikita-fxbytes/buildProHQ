import { BadRequestException } from '@nestjs/common';
import { MESSAGES } from '../constants/messages';

/** Allowed image MIME types for task / field photo uploads (aligned with Multer fileFilter). */
export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

/**
 * Validates an uploaded image before persisting metadata (used by FilesController and can be reused by other modules).
 */
export function assertImageUploadAllowed(
  mimetype: string,
  originalName: string,
  sizeBytes: number,
  maxBytes: number,
): void {
  const okMime = ALLOWED_IMAGE_MIME_TYPES.has(mimetype);
  const okExt = /\.(jpe?g|png|webp|heic|heif)$/i.test(originalName);
  if (!okMime && !okExt) {
    throw new BadRequestException(MESSAGES.FILES.INVALID_TYPE);
  }
  if (sizeBytes > maxBytes) {
    throw new BadRequestException(MESSAGES.FILES.TOO_LARGE);
  }
}
