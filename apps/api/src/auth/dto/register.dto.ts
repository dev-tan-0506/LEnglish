import { IsEmail, IsString, Matches, MinLength } from "class-validator";

// D-04: Minimum 8 chars, include uppercase, number, special character
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_REGEX, {
    message: "Password must include uppercase, number, and special character"
  })
  password!: string;

  @IsString()
  @MinLength(1)
  name!: string;
}

