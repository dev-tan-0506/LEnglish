import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export type CurrentUserInfo = {
  id: string;
  email: string;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserInfo | undefined => {
    const req = ctx.switchToHttp().getRequest();
    return req.user as CurrentUserInfo | undefined;
  }
);

