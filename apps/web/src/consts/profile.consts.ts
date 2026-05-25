import type { EnglishLevel } from "../types/profile.types";

export const TARGET_TOEIC_OPTIONS = [
  { value: 450, label: "450" },
  { value: 600, label: "600" },
  { value: 750, label: "750" },
  { value: 900, label: "900+" }
] as const;

export const ENGLISH_LEVEL_OPTIONS: ReadonlyArray<{ value: EnglishLevel; label: string }> = [
  { value: "Newbie", label: "Newbie" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Upper-Intermediate", label: "Upper-Intermediate" },
  { value: "Advanced", label: "Advanced" }
];

export const PRESET_AVATAR_OPTIONS = ["owl-blue", "fox-green", "cat-violet", "bear-amber", "panda-mint", "robot-cyan"] as const;




