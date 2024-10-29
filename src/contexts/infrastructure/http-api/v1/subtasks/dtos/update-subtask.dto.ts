import { IsString, IsOptional, IsEnum, IsInt, IsDateString, IsUUID } from 'class-validator';
import { TaskStatus } from '@/contexts/shared/lib/types';

export class UpdateSubTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  status?: TaskStatus;

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsDateString()
  due_at?: Date;

  @IsOptional()
  @IsUUID()
  assignedTo?: string;
}