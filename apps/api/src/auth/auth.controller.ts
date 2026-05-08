import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { AuthRequest, AuthResponse } from "./auth.types";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Public } from "../common/decorators/public.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Delegates account registration to the auth service. */
  @Post("register")
  @Public()
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: AuthResponse) {
    return this.authService.register(dto, res);
  }

  /** Delegates credential login to the auth service. */
  @Post("login")
  @Public()
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: AuthResponse) {
    return this.authService.login(dto, res);
  }

  /** Delegates access token refresh to the auth service. */
  @Post("refresh")
  @Public()
  async refresh(@Req() req: AuthRequest, @Res({ passthrough: true }) res: AuthResponse) {
    return this.authService.refresh(req, res);
  }

  /** Delegates logout and cookie cleanup to the auth service. */
  @Post("logout")
  @Public()
  async logout(@Req() req: AuthRequest, @Res({ passthrough: true }) res: AuthResponse) {
    return this.authService.logout(req, res);
  }

  /** Returns the currently authenticated user's profile. */
  @Get("me")
  async me(@CurrentUser() user: { id: string; email: string }) {
    return this.authService.me(user.id);
  }
}
