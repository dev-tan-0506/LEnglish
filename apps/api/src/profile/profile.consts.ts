import { join } from "node:path";

export const AVATAR_UPLOAD_DIR = join(process.cwd(), "uploads", "avatars");
export const MAX_AVATAR_BYTES = 1024 * 1024;
export const ALLOWED_AVATAR_MIME_TYPES = new Map([
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/webp", ".webp"]
]);
