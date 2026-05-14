import { IsString, Matches, MinLength } from "class-validator";
import { PASSWORD_RESET_MESSAGES } from "../password-reset.messages";

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

export class ConfirmResetDto {
  @IsString()
  @MinLength(1)
  token!: string;

  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_REGEX, {
    message: PASSWORD_RESET_MESSAGES.PASSWORD_COMPLEXITY
  })
  password!: string;
}
