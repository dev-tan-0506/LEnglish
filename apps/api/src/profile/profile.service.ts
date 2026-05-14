import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AvatarService } from "./avatar.service";
import { UpdateAvatarDto } from "./dto/update-avatar.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { PROFILE_ERROR_MESSAGES } from "./profile.messages";
import { ProfileRepository } from "./profile.repository";
import type { AvatarUploadFile, UpdateProfileInput } from "./profile.types";

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly avatarService: AvatarService
  ) {}

  /** Loads the authenticated user's profile. */
  async getMe(userId: string) {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) throw new NotFoundException(PROFILE_ERROR_MESSAGES.PROFILE_NOT_FOUND);
    return this.toResponse(profile);
  }

  /** Updates editable profile fields for the authenticated user. */
  async updateMe(userId: string, dto: UpdateProfileDto) {
    const input: UpdateProfileInput = {
      ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
      ...(dto.targetToeicScore !== undefined ? { targetToeicScore: dto.targetToeicScore } : {}),
      ...(dto.bio !== undefined ? { bio: dto.bio.trim() } : {}),
      ...(dto.birthdate !== undefined ? { birthdate: new Date(dto.birthdate) } : {}),
      ...(dto.currentEnglishLevel !== undefined ? { currentEnglishLevel: dto.currentEnglishLevel } : {})
    };

    const profile = await this.profileRepository.updateByUserId(userId, input);
    return this.toResponse(profile);
  }

  /** Updates the authenticated user's avatar from a preset id or custom upload. */
  async updateAvatar(userId: string, dto: UpdateAvatarDto, file?: AvatarUploadFile) {
    if (dto.presetAvatarId) {
      const avatarPresetId = this.avatarService.resolvePresetAvatar(dto.presetAvatarId);
      const profile = await this.profileRepository.updateByUserId(userId, {
        avatarPresetId,
        avatarUrl: null
      });
      return this.toResponse(profile);
    }

    if (file) {
      const avatarUrl = await this.avatarService.storeCustomAvatar(file);
      const profile = await this.profileRepository.updateByUserId(userId, {
        avatarPresetId: null,
        avatarUrl
      });
      return this.toResponse(profile);
    }

    throw new BadRequestException(PROFILE_ERROR_MESSAGES.AVATAR_FILE_REQUIRED);
  }

  /** Shapes profile persistence records into API responses. */
  private toResponse(profile: any) {
    return {
      id: profile.id,
      userId: profile.userId,
      name: profile.name,
      avatarPresetId: profile.avatarPresetId ?? null,
      avatarUrl: profile.avatarUrl ?? null,
      targetToeicScore: profile.targetToeicScore ?? null,
      bio: profile.bio ?? null,
      birthdate: profile.birthdate ? new Date(profile.birthdate).toISOString().slice(0, 10) : null,
      currentEnglishLevel: profile.currentEnglishLevel ?? null
    };
  }
}
