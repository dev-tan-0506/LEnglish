import { Type } from "class-transformer";
import { IsIn, IsISO8601, IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { ENGLISH_LEVELS, TARGET_TOEIC_SCORES } from "../profile.types";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn(TARGET_TOEIC_SCORES)
  targetToeicScore?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsISO8601()
  birthdate?: string;

  @IsOptional()
  @IsString()
  @IsIn(ENGLISH_LEVELS)
  currentEnglishLevel?: string;
}
