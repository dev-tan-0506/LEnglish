import { IsEmail, IsString, Matches, MinLength } from "class-validator";
import { AUTH_ERROR_MESSAGES } from "../auth.messages";

// D-04: Minimum 8 chars, include uppercase, number, special character
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_REGEX, {
    message: AUTH_ERROR_MESSAGES.PASSWORD_COMPLEXITY
  })
  password!: string;

  @IsString()
  @MinLength(1)
  name!: string;
}
