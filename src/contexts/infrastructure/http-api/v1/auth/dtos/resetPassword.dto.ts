import { IsString, IsEmail, MinLength } from 'class-validator';

export class ResetPasswordRequestDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordConfirmDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}