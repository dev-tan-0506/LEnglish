import { IsIn, IsOptional, IsString } from "class-validator";
import { PRESET_AVATAR_IDS } from "../profile.types";

export class UpdateAvatarDto {
  @IsOptional()
  @IsString()
  @IsIn(PRESET_AVATAR_IDS)
  presetAvatarId?: string;
}
