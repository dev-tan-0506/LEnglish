import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AvatarService } from "./avatar.service";
import { ProfileController } from "./profile.controller";
import { ProfileRepository } from "./profile.repository";
import { ProfileService } from "./profile.service";

@Module({
  imports: [PrismaModule],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository, AvatarService],
  exports: [ProfileService]
})
export class ProfileModule {}
