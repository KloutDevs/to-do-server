import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/contexts/shared/prisma/prisma.service';
import { Workspace, WorkspaceCollaborator } from '@/contexts/domain/models';
import { WorkspaceRepository } from '@/contexts/domain/repositories';
import { AlreadyExistsException } from '@/contexts/shared/lib/errors';

@Injectable()
export class PrismaWorkspaceRepository implements WorkspaceRepository {
  constructor(private db: PrismaService) {}

  async getAllWorkspaces(limit?: number, orderBy?: 'desc' | 'asc'): Promise<Workspace[]> {

    // Return all workspaces in descending order by default or the order and limit specified
    return this.db.workspace.findMany({
      orderBy: { created_at: (orderBy) ?? 'desc' },
      take: limit,
    });

  }

  async getAllWorkspacesOfUserId(userId: string): Promise<Workspace[]> {

    // Check if the userId is provided
    if(!userId) throw new BadRequestException('userId is required');

    // Check if the userId exists
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if(!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Find the workspaces owned by the user with the provided userId
    const ownedWorkspaces = await this.db.workspace.findMany({
      where: { user_id: userId },
    });

    // Find the workspaces where the user is a collaborator using a subquery
    const collaboratedWorkspaces = await this.db.workspace.findMany({
      where: {
        collaborators: {
          some: {
            collaborator_id: userId,
          },
        },
      },
    });

    // Combine the owned and collaborated workspaces into a single array
    const allWorkspaces = [...ownedWorkspaces, ...collaboratedWorkspaces];

    // Filter out any duplicates based on the workspace ID
    const uniqueWorkspaces = allWorkspaces.filter(
      (workspace, index, self) =>
        index === self.findIndex((t) => t.id === workspace.id),
    );

    // Return the unique workspaces of the user
    return uniqueWorkspaces;
  }

  async getWorkspacesByUserId(userId: string): Promise<Workspace[]> {

    // Check if the userId is provided
    if(!userId) throw new BadRequestException('userId is required');

    // Check if the userId exists
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if(!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Find the workspaces owned by the user with the provided userId
    const ownedWorkspaces = await this.db.workspace.findMany({
      where: { user_id: userId },
    });

    // Return the owned workspaces of the user
    return ownedWorkspaces;
  }

  async getAllWorkspacesAsCollaboratorOfUserId(userId: string): Promise<Workspace[]> {

    // Check if the userId is provided
    if(!userId) throw new BadRequestException('userId is required');

    // Check if the userId exists
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if(!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Find the workspaces where the user is a collaborator using a subquery
    const collaboratedWorkspaces = await this.db.workspace.findMany({
      where: {
        collaborators: {
          some: {
            collaborator_id: userId,
          },
        },
      },
    });

    // Return the workspaces where the user is a collaborator
    return collaboratedWorkspaces;
  }

  async getWorkspaceById(workspaceId: string): Promise<Workspace> {

    // Check if the workspaceId is provided
    if(!workspaceId) throw new BadRequestException('workspaceId is required');

    // Check if the workspaceId exists
    const workspace = await this.db.workspace.findUnique({ where: { id: workspaceId } });
    if(!workspace) throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);

    // Return the workspace with the provided workspaceId
    return workspace;
  }

  async getAllCollaboratorsInWorkspace(
    workspaceId: string,
  ): Promise<WorkspaceCollaborator[]> {

    // Check if the workspaceId is provided
    if(!workspaceId) throw new BadRequestException('workspaceId is required');

    // Check if the workspaceId exists
    const workspace = await this.db.workspace.findUnique({ where: { id: workspaceId } });
    if(!workspace) throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);

    // Find all collaborators in the workspace with the provided workspaceId
    const collaborators = await this.db.workspaceCollaborator.findMany({
      where: { workspace_id: workspaceId },
    });

    // Return the collaborators in the workspace
    return collaborators;
  }

  async createWorkspace(
    userId: string,
    name: string,
    description: string,
  ): Promise<Workspace> {

    // Check if the userId is provided
    if(!userId) throw new BadRequestException('User ID is required');

    // Check if the name is provided
    if(!name) throw new BadRequestException('Name is required');

    // Check if the description is provided
    if(!description) throw new BadRequestException('Description is required');

    // Check if the user exists
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if(!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Create a new workspace with the provided userId, name, and description
    return await this.db.workspace.create({
      data: {
        user_id: userId,
        name,
        description,
      },
    });
  }
  
  async updateWorkspace(
    workspaceId: string,
    workspaceBody: Workspace,
  ): Promise<Workspace> {

    // Check if the workspaceId is provided
    if(!workspaceId) throw new BadRequestException('workspaceId is required');

    // Check if the workspaceBody is provided
    if(!workspaceBody) throw new BadRequestException('workspaceBody is required');

    // Check if the workspace exists
    const workspace = await this.db.workspace.findUnique({ where: { id: workspaceId } });
    if(!workspace) throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);

    // Update the workspace with the provided workspaceId and workspace data
    const updatedWorkspace = await this.db.workspace.update({
      where: { id: workspaceId },
      data: workspaceBody,
    });

    // Return the updated workspace
    return updatedWorkspace;
  }

  async deleteWorkspace(workspaceId: string): Promise<void> {
    
    // Check if the workspaceId is provided
    if(!workspaceId) throw new BadRequestException('workspaceId is required');

    // Check if the workspace exists
    const workspace = await this.db.workspace.findUnique({ where: { id: workspaceId } });
    if(!workspace) throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);

    await this.db.workspace.delete({
      where: { id: workspaceId },
    });
  }

  async addCollaboratorToWorkspace(
    workspaceId: string,
    userId: string,
  ): Promise<WorkspaceCollaborator> {

    // Check if the workspaceId is provided
    if(!workspaceId) throw new BadRequestException('workspaceId is required');

    // Check if the userId is provided
    if(!userId) throw new BadRequestException('userId is required');

    // Check if the workspace exists
    const workspace = await this.db.workspace.findUnique({ where: { id: workspaceId } });
    if(!workspace) throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);

    // Check if the user exists
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if(!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Check if the user is already a collaborator of the workspace
    const isCollaborator = await this.db.workspaceCollaborator.findUnique({
      where: {
        'collaborator_id_workspace_id': {
          workspace_id: workspaceId,
          collaborator_id: userId,
        }
      },
    });
    if(isCollaborator) throw new AlreadyExistsException('User is already a collaborator of the workspace');

    // Add the user as a collaborator to the workspace with the provided workspaceId
    const addedCollaborator = await this.db.workspaceCollaborator.create({
      data: {
        workspace_id: workspaceId,
        collaborator_id: userId,
      },
    });

    // Return the added collaborator
    return addedCollaborator;
  }

  async removeCollaboratorFromWorkspace(
    workspaceId: string,
    userId: string,
  ): Promise<WorkspaceCollaborator> {

    // Check if the workspaceId is provided
    if(!workspaceId) throw new BadRequestException('workspaceId is required');

    // Check if the userId is provided
    if(!userId) throw new BadRequestException('userId is required');

    // Check if the workspace exists
    const workspace = await this.db.workspace.findUnique({ where: { id: workspaceId } });
    if(!workspace) throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);

    // Check if the user exists
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if(!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Remove the user as a collaborator from the workspace with the provided workspaceId
    const collaborator = await this.db.workspaceCollaborator.delete({
      where: {
        collaborator_id_workspace_id: {
          collaborator_id: userId,
          workspace_id: workspaceId,
        },
      },
    });

    // Return the removed collaborator
    return collaborator;
  }

}
