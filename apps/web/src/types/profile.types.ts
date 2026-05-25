export type EnglishLevel = "Newbie" | "Beginner" | "Intermediate" | "Upper-Intermediate" | "Advanced";

export type Profile = {
  id: string;
  userId: string;
  name: string;
  avatarPresetId: string | null;
  avatarUrl: string | null;
  targetToeicScore: number | null;
  bio: string | null;
  birthdate: string | null;
  currentEnglishLevel: EnglishLevel | null;
};

export type UpdateProfileInput = {
  name?: string;
  targetToeicScore?: number;
  bio?: string;
  birthdate?: string;
  currentEnglishLevel?: EnglishLevel;
};
