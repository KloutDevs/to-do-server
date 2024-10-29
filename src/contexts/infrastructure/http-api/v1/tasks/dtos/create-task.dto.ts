import { TaskStatus } from '@/contexts/shared/lib/types';
import { IsString, IsOptional, IsEnum, IsInt, IsDateString, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @IsUUID()
  workspace_id: string;

  @IsString()
  @IsUUID()
  createdBy: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  status: TaskStatus;

  @IsOptional()
  @IsInt()
  priority: number;

  @IsOptional()
  @IsDateString()
  due_date: Date;

  @IsOptional()
  @IsUUID()
  assignedTo: string;
}