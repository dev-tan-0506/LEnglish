import { Body, Controller, Post } from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator";
import { ConfirmResetDto } from "./dto/confirm-reset.dto";
import { RequestResetDto } from "./dto/request-reset.dto";
import { PasswordResetService } from "./password-reset.service";

@Controller("password-reset")
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  /** Delegates password reset requests to the reset service. */
  @Post("request")
  @Public()
  async request(@Body() dto: RequestResetDto) {
    return this.passwordResetService.requestReset(dto.email);
  }

  /** Delegates password reset confirmation to the reset service. */
  @Post("confirm")
  @Public()
  async confirm(@Body() dto: ConfirmResetDto) {
    return this.passwordResetService.confirmReset(dto.token, dto.password);
  }
}
