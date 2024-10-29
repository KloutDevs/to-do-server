import { Workspace, WorkspaceCollaborator } from '@/contexts/domain/models';

export abstract class WorkspaceRepository {
  /**
   * Method for getting all workspaces.
   *
   * @param limit - The number of users to be returned.
   * By default it will return all users.
   *
   * @param orderBy - The order of the users to be returned. Order by 'desc' or 'asc'.
   * By default it will return users in descending order.
   *
   * @returns {Promise<Workspace[]>} Returns a promise with an array of users.
   */
  abstract getAllWorkspaces(
    limit?: number,
    orderBy?: string,
  ): Promise<Workspace[]>;

  /**
   * Method for getting all workspaces of a specific user.
   *
   * @param userId - The id of the user to get the workspaces of.
   *
   * @returns {Promise<Workspace[]>} Returns a promise with an array of workspaces.
   * 
   * @throws BadRequestException If the userId is not provided.
   * 
   * @throws NotFoundException If the user with the provided userId is not found.
   */
  abstract getAllWorkspacesOfUserId(userId: string): Promise<Workspace[]>;

  /**
   * Method for getting all workspaces Created by a specific user.
   *
   * @param userId - The id of the user to get the workspaces of.
   *
   * @returns {Promise<Workspace[]>} Returns a promise with an array of workspaces.
   *
   * @note This method ONLY returns workspaces CREATED by the user provided.
   * 
   * @thrown BadRequestException If the userId is not provided.
   *    
   * @throws NotFoundException If the user with the provided userId is not found.
   */
  abstract getWorkspacesByUserId(userId: string): Promise<Workspace[]>;

  /**
   * Method for getting all workspaces that a specific user is a collaborator of.
   *
   * @param userId - The id of the user to get the workspaces of.
   *
   * @returns {Promise<Workspace[]>} Returns a promise with an array of workspaces where the user is a collaborator.
   *
   * @note This method ONLY returns workspaces that the user provided is a COLLABORATOR of.
   * 
   * @throws BadRequestException If the userId is not provided.
   * 
   * @throws NotFoundException If the user with the provided userId is not found.
   */
  abstract getAllWorkspacesAsCollaboratorOfUserId(
    userId: string,
  ): Promise<Workspace[]>;

  /**
   * Method for getting a workspace by its id.
   *
   * @param workspaceId - The id of the workspace to get.
   *
   * @returns {Promise<Workspace>} Returns a promise with the workspace.
   * 
   * @thrown BadRequestException If the workspaceId is not provided.
   * 
   * @thrown NotFoundException If the workspace with the provided workspaceId is not found.
   */
  abstract getWorkspaceById(workspaceId: string): Promise<Workspace>;

  /**
   * Method for get all collaborators in a workspace
   *
   * @param workspaceId - The id of the workspace to get the collaborators of.
   *
   * @returns {Promise<WorkspaceCollaborator[]>} Returns a promise with an array of collaborators.
   */
  abstract getAllCollaboratorsInWorkspace(
    workspaceId: string,
  ): Promise<WorkspaceCollaborator[]>;

  /**
   * Method for create a new workspace.
   *
   * @param userId - The id of the user who is creating the workspace.
   * 
   * @param name - The name of the new workspace.
   * 
   * @param description - The description of the new workspace.
   *
   * @returns {Promise<Workspace>} Returns a promise with the new workspace.
   * 
   * @throw BadRequestException If the userId is not provided.
   * 
   * @throw BadRequestException If the name is not provided.
   * 
   * @throw BadRequestException If the description is not provided.
   * 
   * @throw NotFoundException If the user with the provided userId is not found.
   */
  abstract createWorkspace(
    userId: string,
    name: string,
    description: string,
  ): Promise<Workspace>;

  /**
   * Method for updating a workspace.
   *
   * @param workspaceId - The id of the workspace to update.
   * @param workspaceBody - The body of the new workspace to be updated.
   *
   * @returns {Promise<Workspace>} Returns a promise with the updated workspace.
   * 
   * @thrown BadRequestException If the workspaceId is not provided.
   * 
   * @thrown BadRequestException If the workspaceBody is not provided.
   * 
   * @thrown NotFoundException If the workspace with the provided workspaceId is not found.
   */
  abstract updateWorkspace(
    workspaceId: string,
    workspaceBody: Workspace,
  ): Promise<Workspace>;

  /**
   * Method for deleting a workspace.
   * 
   * @param workspaceId - The id of the workspace to delete.
   * 
   * @returns {Promise<Workspace>} Returns a promise with the deleted workspace.
   * 
   * @thrown BadRequestException If the workspaceId is not provided.
   * 
   * @thrown NotFoundException If the workspace with the provided workspaceId is not found.
   */
  abstract deleteWorkspace(workspaceId: string): Promise<void>;

  /**
   * Method for adding a user as a collaborator to a workspace.
   * 
   * @param workspaceId - The id of the workspace where the user will be added as a collaborator.
   * @param userId - The id of the user to be added as a collaborator.
   * 
   * @returns {Promise<WorkspaceCollaborator>} Returns a promise with the added collaborator.
   * 
   * @thrown BadRequestException If the workspaceId is not provided.
   * 
   * @thrown BadRequestException If the userId is not provided.
   * 
   * @thrown NotFoundException If the workspace with the provided workspaceId is not found.
   * 
   * @thrown NotFoundException If the user with the provided userId is not found.
   * 
   * @thrown AlreadyExistsException If the user is already a collaborator.
   */
  abstract addCollaboratorToWorkspace(
    workspaceId: string,
    userId: string,
  ): Promise<WorkspaceCollaborator>;

  /**
   * Method for removing a user as a collaborator from a workspace.
   * 
   * @param workspaceId - The id of the workspace where the user will be removed as a collaborator.
   * @param userId - The id of the user to be removed as a collaborator.
   * 
   * @returns {Promise<WorkspaceCollaborator>} Returns a promise with the removed collaborator.
   * 
   * @thrown BadRequestException If the workspaceId is not provided.
   * 
   * @thrown BadRequestException If the userId is not provided.
   * 
   * @thrown NotFoundException If the workspace with the provided workspaceId is not found.
   * 
   * @thrown NotFoundException If the user with the provided userId is not found.
   * 
   * @thrown AlreadyExistsException If the user isn't a collaborator.
   */
  abstract removeCollaboratorFromWorkspace(
    workspaceId: string,
    userId: string,
  ): Promise<WorkspaceCollaborator>;
}
