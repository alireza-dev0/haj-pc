export const DEFAULT_STORAGE_BUCKET = 'products';

export const DEFAULT_UPLOAD_FOLDER = 'products';

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

export const MIME_TO_EXTENSION: Record<AllowedImageMimeType, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
};

export function isAllowedImageMime(value: string): value is AllowedImageMimeType {
    return (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(value);
}
