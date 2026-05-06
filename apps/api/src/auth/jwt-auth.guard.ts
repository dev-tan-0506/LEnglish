import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { IS_PUBLIC_KEY } from "../common/decorators/public.decorator";
import { TokenService } from "./token.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
    private readonly tokens: TokenService
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const cookieName = String(this.config.get("AUTH_ACCESS_COOKIE_NAME"));
    const token = (req.cookies?.[cookieName] ?? "") as string;
    if (!token) throw new UnauthorizedException("Missing access token");

    const payload = await this.tokens.verifyAccessToken(token).catch(() => null);
    if (!payload?.sub || !payload.email) throw new UnauthorizedException("Invalid access token");

    req.user = { id: payload.sub, email: payload.email };
    return true;
  }
}

