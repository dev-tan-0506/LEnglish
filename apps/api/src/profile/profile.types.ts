export const TARGET_TOEIC_SCORES = [450, 600, 750, 900] as const;

export const ENGLISH_LEVELS = [
  "Newbie",
  "Beginner",
  "Intermediate",
  "Upper-Intermediate",
  "Advanced"
] as const;

export const PRESET_AVATAR_IDS = [
  "owl-blue",
  "fox-green",
  "cat-violet",
  "bear-amber",
  "panda-mint",
  "robot-cyan"
] as const;

export type TargetToeicScore = (typeof TARGET_TOEIC_SCORES)[number];

export type EnglishLevel = (typeof ENGLISH_LEVELS)[number];

export type PresetAvatarId = (typeof PRESET_AVATAR_IDS)[number];

export type UpdateProfileInput = {
  name?: string;
  avatarPresetId?: string | null;
  avatarUrl?: string | null;
  targetToeicScore?: number | null;
  bio?: string | null;
  birthdate?: Date | null;
  currentEnglishLevel?: string | null;
};

export type AvatarUploadFile = {
  originalname?: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};
