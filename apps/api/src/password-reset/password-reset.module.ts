import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { MailModule } from "../mail/mail.module";
import { PrismaModule } from "../prisma/prisma.module";
import { UsersModule } from "../users/users.module";
import { PasswordResetController } from "./password-reset.controller";
import { PasswordResetRepository } from "./password-reset.repository";
import { PasswordResetService } from "./password-reset.service";

@Module({
  imports: [PrismaModule, UsersModule, MailModule, AuthModule],
  controllers: [PasswordResetController],
  providers: [PasswordResetService, PasswordResetRepository]
})
export class PasswordResetModule {}
