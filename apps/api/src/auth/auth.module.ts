import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { TokenService } from "./token.service";
import { AuthCookieService } from "../common/cookies/auth-cookie.service";
import { UsersModule } from "../users/users.module";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Module({
  imports: [JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    TokenService,
    AuthCookieService,
    JwtAuthGuard,
    { provide: APP_GUARD, useClass: JwtAuthGuard }
  ],
  exports: [AuthService, AuthRepository]
})
export class AuthModule {}
