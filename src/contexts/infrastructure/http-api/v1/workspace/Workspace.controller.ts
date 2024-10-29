import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpCode, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { CreateWorkspaceDto } from '@/contexts/infrastructure/http-api/v1/workspace/dtos';
import { API_VERSION } from '@/contexts/infrastructure/http-api/v1/';
import * as WorkspaceUseCases from '@/contexts/application/usecases/workspaces';
import { User as UserDecorator, Roles } from '@/contexts/shared/lib/decorators';
import { JwtAuthGuard } from '@/contexts/shared/lib/guards';
import { Workspace } from '@/contexts/domain/models';

@UseGuards(JwtAuthGuard)
@Controller(`${API_VERSION}/workspaces`)
export class WorkspaceController {
  
  constructor(
    private readonly createWorkspaceUseCase: WorkspaceUseCases.CreateWorkspaceUseCase,
    private readonly deleteWorkspaceUseCase: WorkspaceUseCases.DeleteWorkspaceUseCase,
    private readonly updateWorkspaceUseCase: WorkspaceUseCases.UpdateWorkspaceUseCase,
    private readonly getAllWorkspacesUseCase: WorkspaceUseCases.GetAllWorkspacesUseCase,
    private readonly getWorkspacesByUserUseCase: WorkspaceUseCases.GetAllWorkspacesCreatedByUserUseCase,
    private readonly getWorkspacesOfUserUseCase: WorkspaceUseCases.GetAllWorkspacesOfUserUseCase,
    private readonly getWorkspacesAsCollaborator: WorkspaceUseCases.GetAllWorkspacesAsCollaborator,
    private readonly getWorkspaceByIdUseCase: WorkspaceUseCases.GetWorkspaceByIdUseCase,
    private readonly addCollaboratorUseCase: WorkspaceUseCases.AddCollaboratorUseCase,
    private readonly getCollaboratorsUseCase: WorkspaceUseCases.GetCollaboratorsUseCase,
    private readonly deleteCollaboratorUseCase: WorkspaceUseCases.DeleteCollaboratorUseCase,
  ) {}

  // Create workspace route
  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async createWorkspace(@UserDecorator() user, @Body() workspaceDto: CreateWorkspaceDto) {
    const workspace = await this.createWorkspaceUseCase.run(user.id, workspaceDto.name, workspaceDto.description);
    return {
      message: 'Workspace created successfully',
      workspace,
    };
  }


  // Get all workspaces route
  @Get()
  @Roles("ADMIN")
  @HttpCode(HttpStatus.OK)
  async getAllWorkspaces(): Promise<Workspace[]> {
    return await this.getAllWorkspacesUseCase.run();
  }

  // Get all workspaces of the user (as owner or collaborator)
  @Get('my-workspaces')
  @HttpCode(HttpStatus.OK)
  async getMyWorkspaces(@UserDecorator() user): Promise<Workspace[]> {
    return await this.getWorkspacesOfUserUseCase.run(user.id);
  }

  // Get all workspaces of a user as collaborator
  @Get('collaborated-by/:userId')
  @HttpCode(HttpStatus.OK)
  async getWorkspacesCollaboratedByMe(@Param('userId') userId: string): Promise<Workspace[]> {
    return await this.getWorkspacesAsCollaborator.run(userId);
  }

  // Get all workspaces created by a user
  @Get('created-by/:userId')
  @HttpCode(HttpStatus.OK)
  async getWorkspacesCreatedByMe(@Param('userId') userId: string): Promise<Workspace[]> {
    return await this.getWorkspacesByUserUseCase.run(userId);
  }

  // Get an unique workspace by Id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getWorkspaceById(@Param('id') workspaceId: string): Promise<Workspace> {
    return await this.getWorkspaceByIdUseCase.run(workspaceId);
  }

  // Update an existing workspace
  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async updateWorkspace(@Param('id') workspaceId: string, @Body() workspace: Workspace) {
    const updatedWorkspace = await this.updateWorkspaceUseCase.run(workspaceId, workspace);
    return {
      message: 'Workspace updated successfully',
      workspace: updatedWorkspace,
    };
  }

  // Delete an existing workspace
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteWorkspace(@Param('id') workspaceId: string) {
    await this.deleteWorkspaceUseCase.run(workspaceId);
    return {
      message: 'Workspace deleted successfully',
    };
  }

  // Add a collaborator to a workspace
  @Post(':id/collaborators')
  @HttpCode(HttpStatus.CREATED)
  async addCollaborator(@Param('id') workspaceId: string, @Body('userId') userId: string) {
    const collaborator = await this.addCollaboratorUseCase.run(workspaceId, userId);
    return {
      message: 'Collaborator added successfully',
      collaborator,
    };
  }

  // Get all collaborators of a workspace
  @Get(':id/collaborators')
  @HttpCode(HttpStatus.OK)
  async getCollaborators(@Param('id') workspaceId: string) {
    const collaborators = await this.getCollaboratorsUseCase.run(workspaceId);
    return collaborators;
  }

  // Remove a collaborator from a workspace
  @Delete(':id/collaborators/:userId')
  @HttpCode(HttpStatus.OK)
  async removeCollaborator(@Param('id') workspaceId: string, @Param('userId') userId: string) {
    await this.deleteCollaboratorUseCase.run(workspaceId, userId);
    return {
      message: 'Collaborator removed succesfully',
    };
  }

}