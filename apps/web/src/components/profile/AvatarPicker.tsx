import { useRef } from "react";
import { uploadAvatar } from "../../services/profile";
import { PRESET_AVATAR_OPTIONS } from "../../consts/profile.consts";
import { LEnButton } from "../ui/LEnButton";

type AvatarPickerProps = {
  avatarPresetId: string | null;
  avatarUrl: string | null;
  onAvatarUpdated: (next: { avatarPresetId: string | null; avatarUrl: string | null }) => void;
};

/** Renders preset avatar choices and custom file upload for profile editing. */
export function AvatarPicker({ avatarPresetId, avatarUrl, onAvatarUpdated }: AvatarPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  /** Persists a selected preset avatar to the backend. */
  async function handlePresetPick(presetAvatarId: string) {
    const updated = await uploadAvatar({ presetAvatarId });
    onAvatarUpdated({ avatarPresetId: updated.avatarPresetId, avatarUrl: updated.avatarUrl });
  }

  /** Uploads a custom avatar file to the backend. */
  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const updated = await uploadAvatar({ file });
    onAvatarUpdated({ avatarPresetId: updated.avatarPresetId, avatarUrl: updated.avatarUrl });
    event.target.value = "";
  }

  return (
    <section>
      <p className="text-sm font-bold text-slate-100">Avatar</p>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-slate-700 text-xs font-bold">
          {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" /> : avatarPresetId ?? "None"}
        </div>
        <LEnButton
          type="button"
          variant="secondary"
          onClick={() => fileRef.current?.click()}
          className="rounded-full border border-white/25 bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/20"
        >
          Tải ảnh lên
        </LEnButton>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} className="hidden" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PRESET_AVATAR_OPTIONS.map((presetId) => {
          const selected = avatarPresetId === presetId;
          return (
            <LEnButton
              key={presetId}
              type="button"
              variant="secondary"
              onClick={() => handlePresetPick(presetId)}
              className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                selected ? "border-violet-300 bg-violet-500/25" : "border-white/20 bg-white/5 hover:border-violet-200"
              }`}
            >
              {presetId}
            </LEnButton>
          );
        })}
      </div>
    </section>
  );
}


