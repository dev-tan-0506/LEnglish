import type { EnglishLevel } from "../../types/profile.types";
import { ENGLISH_LEVEL_OPTIONS } from "../../consts/profile.consts";
import { LEnButton } from "../ui/LEnButton";

type EnglishLevelSelectorProps = {
  value: EnglishLevel | null;
  onChange: (next: EnglishLevel) => void;
};

/** Renders the five-level English proficiency selector. */
export function EnglishLevelSelector({ value, onChange }: EnglishLevelSelectorProps) {
  return (
    <div>
      <p className="text-sm font-bold text-slate-100">Trình độ tiếng Anh hiện tại</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {ENGLISH_LEVEL_OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <LEnButton
              key={option.value}
              type="button"
              variant="secondary"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={`min-h-12 rounded-xl border px-3 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-violet-300 ${
                selected ? "border-violet-300 bg-violet-500/25" : "border-white/20 bg-white/5 hover:border-violet-200"
              }`}
            >
              {option.label}
            </LEnButton>
          );
        })}
      </div>
    </div>
  );
}




