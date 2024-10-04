import { IsString, MinLength, IsUUID } from 'class-validator';

export class VerifyEmailRequestDto {
  @IsString()
  @IsUUID()
  @MinLength(36)
  userId: string;
}