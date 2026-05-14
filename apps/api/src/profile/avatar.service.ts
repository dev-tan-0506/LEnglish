import { BadRequestException, Injectable } from "@nestjs/common";
import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { PROFILE_ERROR_MESSAGES } from "./profile.messages";
import { PRESET_AVATAR_IDS, type AvatarUploadFile } from "./profile.types";

const AVATAR_UPLOAD_DIR = join(process.cwd(), "uploads", "avatars");
const MAX_AVATAR_BYTES = 1024 * 1024;
const ALLOWED_MIME_TYPES = new Map([
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/webp", ".webp"]
]);

@Injectable()
export class AvatarService {
  /** Validates and returns an allowed preset avatar id. */
  resolvePresetAvatar(presetAvatarId: string) {
    if (!PRESET_AVATAR_IDS.includes(presetAvatarId as any)) {
      throw new BadRequestException(PROFILE_ERROR_MESSAGES.INVALID_AVATAR_PRESET);
    }

    return presetAvatarId;
  }

  /** Validates an uploaded image and stores it under the local avatar directory. */
  async storeCustomAvatar(file: AvatarUploadFile) {
    const extension = ALLOWED_MIME_TYPES.get(file.mimetype);
    if (!extension) {
      throw new BadRequestException(PROFILE_ERROR_MESSAGES.INVALID_AVATAR_FILE_TYPE);
    }

    if (file.size > MAX_AVATAR_BYTES) {
      throw new BadRequestException(PROFILE_ERROR_MESSAGES.AVATAR_FILE_TOO_LARGE);
    }

    await mkdir(AVATAR_UPLOAD_DIR, { recursive: true });

    const safeExtension = extension || extname(file.originalname ?? "") || ".bin";
    const filename = `${crypto.randomBytes(16).toString("hex")}${safeExtension}`;
    await writeFile(join(AVATAR_UPLOAD_DIR, filename), file.buffer);

    return `/uploads/avatars/${filename}`;
  }
}
