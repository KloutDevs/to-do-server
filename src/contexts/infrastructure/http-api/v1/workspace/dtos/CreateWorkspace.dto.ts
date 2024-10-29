import { Workspace } from "@/contexts/domain/models";
import { IsString, IsOptional, IsNotEmpty, MinLength } from "class-validator";

export class CreateWorkspaceDto implements Partial<Workspace> {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    name: string;

    @IsString()
    @IsOptional()
    @MinLength(5)
    description: string;
}