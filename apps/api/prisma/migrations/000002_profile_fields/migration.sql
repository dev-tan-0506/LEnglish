ALTER TABLE "profiles"
  ADD COLUMN "avatar_preset_id" TEXT,
  ADD COLUMN "avatar_url" TEXT,
  ADD COLUMN "target_toeic_score" INTEGER,
  ADD COLUMN "bio" TEXT,
  ADD COLUMN "birthdate" TIMESTAMP(3),
  ADD COLUMN "current_english_level" TEXT;
