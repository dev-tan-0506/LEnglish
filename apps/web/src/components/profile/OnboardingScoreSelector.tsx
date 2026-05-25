"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateMyProfile } from "../../services/profile";
import { TARGET_TOEIC_OPTIONS } from "../../consts/profile.consts";
import { LEnButton } from "../ui/LEnButton";

/** Renders one-step TOEIC score onboarding and saves target score. */
export function OnboardingScoreSelector() {
  const router = useRouter();
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** Persists the selected TOEIC score and routes to the profile area. */
  async function handleSave() {
    if (!selectedScore) {
      setError("Vui lòng chọn mục tiêu TOEIC.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await updateMyProfile({ targetToeicScore: selectedScore });
      router.push("/profile");
    } catch {
      setError("Không thể lưu mục tiêu lúc này. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-slate-900/80 p-6 text-white shadow-2xl backdrop-blur">
      <h1 className="text-2xl font-extrabold">Mục tiêu TOEIC của bạn?</h1>
      <p className="mt-2 text-sm text-slate-200">Chọn mức phù hợp để cá nhân hóa lộ trình học ngay từ đầu.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {TARGET_TOEIC_OPTIONS.map((option) => {
          const selected = selectedScore === option.value;
          return (
            <LEnButton
              key={option.value}
              type="button"
              aria-pressed={selected}
              variant="secondary"
              onClick={() => setSelectedScore(option.value)}
              className={`min-h-24 rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-violet-300 ${
                selected
                  ? "border-violet-300 bg-violet-500/30 shadow-[0_0_0_2px_rgba(196,181,253,0.7)]"
                  : "border-white/20 bg-white/5 hover:-translate-y-0.5 hover:border-violet-200"
              }`}
            >
              <p className="text-lg font-black">{option.label}</p>
              <p className="text-xs text-slate-200">Điểm mục tiêu</p>
            </LEnButton>
          );
        })}
      </div>

      {error ? <p className="mt-4 text-sm font-semibold text-rose-300">{error}</p> : null}

      <LEnButton className="mt-6 w-full bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-[0_6px_0_rgb(76_29_149)] hover:from-violet-500 hover:to-violet-600" disabled={loading} onClick={handleSave}>
        {loading ? "Đang lưu..." : "Lưu mục tiêu"}
      </LEnButton>
    </section>
  );
}



