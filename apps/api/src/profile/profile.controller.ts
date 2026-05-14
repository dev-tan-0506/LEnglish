import { Body, Controller, Get, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUser, type CurrentUserInfo } from "../common/decorators/current-user.decorator";
import { UpdateAvatarDto } from "./dto/update-avatar.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfileService } from "./profile.service";
import type { AvatarUploadFile } from "./profile.types";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /** Delegates current profile loading to the profile service. */
  @Get("me")
  async me(@CurrentUser() user: CurrentUserInfo) {
    return this.profileService.getMe(user.id);
  }

  /** Delegates current profile updates to the profile service. */
  @Patch("me")
  async updateMe(@CurrentUser() user: CurrentUserInfo, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateMe(user.id, dto);
  }

  /** Delegates preset or uploaded avatar updates to the profile service. */
  @Post("avatar")
  @UseInterceptors(FileInterceptor("file"))
  async updateAvatar(
    @CurrentUser() user: CurrentUserInfo,
    @Body() dto: UpdateAvatarDto,
    @UploadedFile() file?: AvatarUploadFile
  ) {
    return this.profileService.updateAvatar(user.id, dto, file);
  }
}
