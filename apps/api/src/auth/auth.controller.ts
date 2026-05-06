import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthCookieService } from "../common/cookies/auth-cookie.service";
import { Public } from "../common/decorators/public.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly cookies: AuthCookieService
  ) {}

  @Post("register")
  @Public()
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { user, accessToken, refreshToken } = await this.auth.register(dto);

    res.cookie(this.cookies.accessCookieName, accessToken, this.cookies.getAccessCookieOptions());
    res.cookie(
      this.cookies.refreshCookieName,
      refreshToken,
      this.cookies.getRefreshCookieOptions()
    );

    return user;
  }

  @Post("login")
  @Public()
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { user, accessToken, refreshToken } = await this.auth.login(dto);

    res.cookie(this.cookies.accessCookieName, accessToken, this.cookies.getAccessCookieOptions());
    res.cookie(
      this.cookies.refreshCookieName,
      refreshToken,
      this.cookies.getRefreshCookieOptions()
    );

    return user;
  }

  @Post("refresh")
  @Public()
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = (req.cookies?.[this.cookies.refreshCookieName] ?? "") as string;
    if (!refreshToken) throw new UnauthorizedException("Missing refresh token");

    const { user, accessToken, refreshToken: newRefreshToken } = await this.auth.refresh(refreshToken);

    res.cookie(this.cookies.accessCookieName, accessToken, this.cookies.getAccessCookieOptions());
    res.cookie(
      this.cookies.refreshCookieName,
      newRefreshToken,
      this.cookies.getRefreshCookieOptions()
    );

    return user;
  }

  @Post("logout")
  @Public()
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = (req.cookies?.[this.cookies.refreshCookieName] ?? "") as string;
    await this.auth.logout(refreshToken || undefined);

    res.clearCookie(this.cookies.accessCookieName, this.cookies.getClearCookieOptions());
    res.clearCookie(this.cookies.refreshCookieName, this.cookies.getClearCookieOptions());

    return { ok: true };
  }

  @Get("me")
  async me(@CurrentUser() user: { id: string; email: string }) {
    return this.auth.me(user.id);
  }
}
