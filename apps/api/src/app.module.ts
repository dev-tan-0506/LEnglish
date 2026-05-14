import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validateEnv } from "./common/config/env.schema";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { HealthController } from "./health.controller";
import { AuthModule } from "./auth/auth.module";
import { PasswordResetModule } from "./password-reset/password-reset.module";
import { ProfileModule } from "./profile/profile.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env", "../../.env.local"],
      validate: validateEnv
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ProfileModule,
    PasswordResetModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
