import { IsString, IsEmail, MinLength, IsOptional, IsEnum, IsArray } from 'class-validator';
import { Role } from '@/contexts/shared/types/roles';

export class CreateUserDto {
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

  @IsEnum(Role, { each: true })
  @IsArray()
  roles: Role[];
}

