"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { EnglishLevel, Profile } from "../../types/profile.types";
import { getMyProfile, updateMyProfile } from "../../services/profile";
import { TARGET_TOEIC_OPTIONS } from "../../consts/profile.consts";
import { ApiError } from "../../lib/client";
import { AvatarPicker } from "./AvatarPicker";
import { EnglishLevelSelector } from "./EnglishLevelSelector";
import { LEnButton } from "../ui/LEnButton";
import { LEnInput } from "../ui/LEnInput";
import { LEnSelect } from "../ui/LEnSelect";

/** Extracts a user-facing message from API validation or request errors. */
function getProfileSaveErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) {
    return "Lưu hồ sơ thất bại. Vui lòng thử lại.";
  }

  if (error.status === 400) {
    const details = error.details as { message?: string | string[] } | undefined;
    if (Array.isArray(details?.message) && details.message.length > 0) {
      return details.message.join(", ");
    }

    if (typeof details?.message === "string" && details.message.trim()) {
      return details.message;
    }
  }

  return typeof error.message === "string" && error.message.trim()
    ? error.message
    : "Lưu hồ sơ thất bại. Vui lòng thử lại.";
}

/** Loads and edits authenticated user profile fields and avatar settings. */
export function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [targetToeicScore, setTargetToeicScore] = useState<number>(600);
  const [bio, setBio] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [currentEnglishLevel, setCurrentEnglishLevel] = useState<EnglishLevel | null>(null);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /** Hydrates form state from the current profile endpoint. */
  useEffect(() => {
    async function load() {
      try {
        const data = await getMyProfile();
        setProfile(data);
        setName(data.name ?? "");
        setTargetToeicScore(data.targetToeicScore ?? 600);
        setBio(data.bio ?? "");
        setBirthdate(data.birthdate ?? "");
        setCurrentEnglishLevel(data.currentEnglishLevel ?? null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /** Submits editable fields to persist profile changes. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setStatusType("error");
      setStatus("Tên không được để trống.");
      return;
    }
    if (!currentEnglishLevel) {
      setStatusType("error");
      setStatus("Vui lòng chọn trình độ tiếng Anh.");
      return;
    }

    setSaving(true);
    setStatus("");
    try {
      const updated = await updateMyProfile({
        name: name.trim(),
        targetToeicScore,
        bio,
        birthdate,
        currentEnglishLevel
      });
      setProfile(updated);
      setStatusType("success");
      setStatus("Lưu hồ sơ thành công.");
    } catch (error) {
      setStatusType("error");
      setStatus(getProfileSaveErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-slate-200">Đang tải hồ sơ...</p>;

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl space-y-5 rounded-3xl border border-white/15 bg-slate-900/80 p-6 text-white shadow-2xl backdrop-blur">
      <h1 className="text-2xl font-extrabold">Hồ sơ của bạn</h1>

      <AvatarPicker
        avatarPresetId={profile?.avatarPresetId ?? null}
        avatarUrl={profile?.avatarUrl ?? null}
        onAvatarUpdated={(next) => setProfile((prev) => (prev ? { ...prev, ...next } : prev))}
      />

      <LEnInput label="Tên hiển thị" name="name" value={name} onChange={(event) => setName(event.target.value)} />

      <LEnSelect
        label="Mục tiêu TOEIC"
        value={targetToeicScore}
        onChange={(event) => setTargetToeicScore(Number(event.target.value))}
      >
        {TARGET_TOEIC_OPTIONS.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-800">
            {option.label}
          </option>
        ))}
      </LEnSelect>

      <label className="block text-sm font-bold text-slate-100">
        <span>Giới thiệu ngắn</span>
        <textarea
          className="mt-2 min-h-24 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white outline-none focus:border-violet-300"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          maxLength={280}
        />
      </label>

      <LEnInput label="Ngày sinh" name="birthdate" type="date" value={birthdate} onChange={(event) => setBirthdate(event.target.value)} />

      <EnglishLevelSelector value={currentEnglishLevel} onChange={setCurrentEnglishLevel} />

      {status ? <p className={`text-sm font-semibold ${statusType === "success" ? "text-emerald-300" : "text-rose-300"}`}>{status}</p> : null}

      <LEnButton className="w-full bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-[0_6px_0_rgb(76_29_149)] hover:from-violet-500 hover:to-violet-600" disabled={saving} type="submit">
        {saving ? "Đang lưu..." : "Lưu hồ sơ"}
      </LEnButton>
    </form>
  );
}






