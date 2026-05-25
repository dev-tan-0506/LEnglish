import { api } from "../lib/client";
import { API_ENDPOINTS } from "../consts/endpoints";
import type { Profile, UpdateProfileInput } from "../types/profile.types";

/** Loads the authenticated user's profile from the backend. */
export function getMyProfile() {
  return api.get<Profile>(API_ENDPOINTS.profile.me);
}

/** Sends editable profile fields to the backend profile update endpoint. */
export function updateMyProfile(input: UpdateProfileInput) {
  return api.patch<Profile>(API_ENDPOINTS.profile.me, input);
}

/** Updates avatar by preset id or custom file upload through the profile avatar endpoint. */
export async function uploadAvatar(input: { presetAvatarId?: string; file?: File }) {
  const formData = new FormData();
  if (input.presetAvatarId) formData.append("presetAvatarId", input.presetAvatarId);
  if (input.file) formData.append("file", input.file);

  return api.post<Profile>(API_ENDPOINTS.profile.avatar, formData);
}





