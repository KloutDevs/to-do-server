import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class RegisterRequestDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  language_preference?: string;

  @IsOptional()
  @IsString()
  timezone?: string;
}
