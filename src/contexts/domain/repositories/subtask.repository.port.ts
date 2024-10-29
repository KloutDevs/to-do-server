import { SubTask } from "../models/subtask.entity";

export abstract class SubTaskRepository {


    /**
     * Method to get all sub tasks
     * 
     * @param limit - The number of sub tasks to return. This is optional and defaults return all sub tasks.
     * 
     * @param orderBy - The order to return the sub tasks in. You can specify 'desc' for descending order or 'asc' for ascending order.  Default is 'desc'.
     * 
     * @returns {Promise<SubTask[]>} An array of all sub tasks in the app
     * 
     * @throws ForbiddenException If the user is not authorized to access to all sub tasks in the app.
     */
    abstract getAllSubTasks(limit?: number, orderBy?: 'desc' | 'asc'): Promise<SubTask[]>;

    /**
     * Method for getting all sub tasks by parent task id
     * 
     * @param parentTaskId - The ID of the parent task where we want to get sub tasks for.
     * 
     * @returns {Promise<SubTask[]>} An array of sub tasks from the specified parent task.
     * 
     * @throws BadRequestException If the parentTaskId is not provided.
     * 
     * @throws NotFoundException If the parent task with the provided parentTaskId is not found.
     * 
     * @throws ForbiddenException If the user is not authorized to access to the specified parent task or hasn't admin role.
     */
    abstract getAllSubTasksByParentTaskId(parentTaskId: string): Promise<SubTask[]>;

    /**
     * Method for getting all sub tasks in a workspace
     * 
     * @param workspaceId - The ID of the workspace where we want to get sub tasks for.
     * 
     * @returns {Promise<SubTask[]>} An array of sub tasks in the specified workspace.
     * 
     * @throws BadRequestException If the workspaceId is not provided.
     * 
     * @throws NotFoundException If the workspace with the provided workspaceId is not found.
     * 
     * @throws ForbiddenException If the user is not authorized to access to the specified workspace or hasn't admin role.
     */
    abstract getAllSubTasksByWorkspaceId(workspaceId: string): Promise<SubTask[]>;

    /**
     * Method for getting all sub tasks created by a user in all workspaces where he stays.
     * 
     * @param userId - The ID of the user who's sub tasks we want to get.
     *  
     * @returns {Promise<SubTask[]>} An array of sub tasks created by the user in all workspaces.
     * 
     * @note This method will return sub tasks that are CREATED by the user provided. It will not return parent tasks of sub tasks created by the user.
     * 
     * @throws BadRequestException If the userId is not provided.
     * 
     * @throws NotFoundException If the user with the provided userId is not found.
     * 
     * @throws NotFoundException If the workspace provided don't have any task, so it not have subtasks.
     * 
     * @throws ForbiddenException If the user is not authorized to access to the sub tasks created by the user or hasn't admin role.
     */
    abstract getAllSubTasksCreatedByUser(userId: string): Promise<SubTask[]>;

    /**
     * Method for getting all sub tasks assigned to a user in a workspace
     * 
     * @param userId - The ID of the user who's sub tasks we want to get.
     * 
     * @returns {Promise<SubTask[]>} An array of sub tasks assigned to the user in all workspaces.
     * 
     * @throws BadRequestException If the userId is not provided.
     * 
     * @throws NotFoundException If the user with the provided userId is not found.
     * 
     * @throws ForbiddenException If the user is not authorized to access to the sub tasks assigned to the user or hasn't admin role.
     */
    abstract getAllSubTasksAssignedToUser(userId: string): Promise<SubTask[]>;

    /**
     * Method for getting all sub tasks assigned to the user provided and all sub tasks created by him in all workspaces.
     * 
     * @param userId - The ID of the user who's sub tasks we want to get.
     * 
     * @returns {Promise<SubTask[]>} An array of sub tasks assigned to the user and created by him in all workspaces.
     * 
     * @throws BadRequestException If the userId is not provided.
     * 
     * @throws NotFoundException If the user with the provided userId is not found.
     * 
     * @throws ForbiddenException If the user is not authorized to access to the sub tasks assigned to the user or hasn't admin role.
     */
    abstract getAllSubTasksOfUser(userId: string): Promise<SubTask[]>;

    /**
     * Method for getting a specified sub task by ID
     * 
     * @param subTaskId - The ID of the sub task we want to get.
     * 
     * @returns {Promise<SubTask>} The sub task with the ID provided.
     * 
     * @throws BadRequestException If the subTaskId is not provided.
     * 
     * @throws NotFoundException If the sub task with the provided subTaskId is not found.
     */
    abstract getSubTaskById(subTaskId: string): Promise<SubTask>;


    /**
     * Method for create a new Sub Task in the app
     * 
     * @param userId - The user ID of the user whose sub task we want to create.
     * 
     * @param subtask - The sub task we want to create as partial object.
     * 
     * @returns {Promise<SubTask>} The sub task that was created.
     * 
     * @throws BadRequestException If the userId is not provided.
     * 
     * @throws NotFoundException If the user with the provided userId is not found.
     * 
     * @throws BadRequestException If the subtask object is not provided.
     * 
     * @throws BadRequestException If the parent task id is not provided in the subtask object.
     * 
     * @throws NotFoundException If the parent task with the provided parent task id is not found.
     * 
     * @throws NotFoundException If the workspace with the provided parent task id is not found.
     * 
     * @throws ForbiddenException If the user is not authorized to create a sub task or hasn't admin role in the workspace.
     */
    abstract createSubTask(userId: string, subtask: Partial<SubTask>): Promise<SubTask>;

    /**
     * Method for deleting a sub task by ID
     * 
     * @param subTaskId - The ID of the sub task we want to delete.
     * 
     * @throws BadRequestException If the subTaskId is not provided.
     * 
     * @throws NotFoundException If the task with the provided subTaskId is not found.
     * 
     * @throws ForbiddenException If the user is not authorized to delete the sub task or hasn't admin role in the workspace.
     */
    abstract deleteSubTask(subTaskId: string): Promise<void>;

    /**
     * Method for updating a sub task by ID
     * 
     * @param subTaskId - The ID of the sub task we want to update.
     * 
     * @param subTask - The task we want to update as partial object.
     * 
     * @returns {Promise<SubTask>} The sub task that was updated.
     * 
     * @throws BadRequestException If the subTaskId is not provided.
     * 
     * @throws BadRequestException If the subtask object is not provided.
     * 
     * @throws BadRequestException If the parent task id is not provided in the subtask object.
     * 
     * @throws NotFoundException If the createdBy user of the sub task is not found.
     * 
     * @throws NotFoundException If the parent task with the provided parentTaskId is not found.
     * 
     * @throws NotFoundException If the workspace of the parent task not found.
     * 
     * @throws NotFoundException If the sub task with the provided subTaskId is not found.
     * 
     * @throws ForbiddenException If the user is not authorized to update the sub task or hasn't admin role in the workspace.
     */
    abstract updateSubTask(subTaskId: string, task: Partial<SubTask>): Promise<SubTask>;
}