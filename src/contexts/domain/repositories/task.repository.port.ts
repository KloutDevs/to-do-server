import { Task } from "@/contexts/domain/models";

export abstract class TaskRepository {

    /**
     * Method to get all tasks
     * 
     * @param limit - The number of tasks to return. This is optional and defaults return all tasks.
     * 
     * @param orderBy - The order to return the tasks in. You can specify 'desc' for descending order or 'asc' for ascending order.  Default is 'desc'.
     * 
     * @returns {Promise<Task[]>} An array of all tasks in the app
     * 
     * @throws ForbiddenException If the user is not authorized to access to all tasks in the app.
     */
    abstract getAllTasks(limit?: number, orderBy?: 'desc' | 'asc'): Promise<Task[]>;

    /**
     * Method for getting all tasks in a workspace
     * 
     * @param workspaceId - The ID of the workspace where we want to get tasks for.
     * 
     * @returns {Promise<Task[]>} An array of tasks in the specified workspace.
     * 
     * @throws BadRequestException If the workspaceId is not provided.
     * 
     * @throws NotFoundException If the workspace with the provided workspaceId is not found.
     * 
     * @throws ForbiddenException If the user is not authorized to access to the specified workspace or hasn't admin role.
     */
    abstract getAllTasksByWorkspaceId(workspaceId: string): Promise<Task[]>;

    /**
     * Method for getting all tasks created by a user in all workspaces where he stays.
     * 
     * @param userId - The ID of the user who's tasks we want to get.
     *  
     * @returns {Promise<Task[]>} An array of tasks created by the user in all workspaces.
     * 
     * @note This method will return tasks that are CREATED by the user provided. It will not return subtasks of tasks created by the user.
     * 
     * @throws BadRequestException If the userId is not provided.
     * 
     * @throws NotFoundException If the user with the provided userId is not found.
     * 
     * @throws ForbiddenException If the user is not authorized to access to the tasks created by the user or hasn't admin role.
     */
    abstract getAllTasksCreatedByUser(userId: string): Promise<Task[]>;

    /**
     * Method for getting all tasks assigned to a user in a workspace
     * 
     * @param userId - The ID of the user who's tasks we want to get.
     * 
     * @returns {Promise<Task[]>} An array of tasks assigned to the user in all workspaces.
     * 
     * @throws BadRequestException If the userId is not provided.
     * 
     * @throws NotFoundException If the user with the provided userId is not found.
     * 
     * @throws ForbiddenException If the user is not authorized to access to the tasks assigned to the user or hasn't admin role.
     */
    abstract getAllTasksAssignedToUser(userId: string): Promise<Task[]>;

    /**
     * Method for getting all tasks assigned to the user provided and all tasks created by him in all workspaces.
     * 
     * @param userId - The ID of the user who's tasks we want to get.
     * 
     * @returns {Promise<Task[]>} An array of tasks assigned to the user and created by him in all workspaces.
     * 
     * @throws BadRequestException If the userId is not provided.
     * 
     * @throws NotFoundException If the user with the provided userId is not found.
     * 
     * @throws ForbiddenException If the user is not authorized to access to the tasks assigned to the user or hasn't admin role.
     */
    abstract getAllTasksOfUser(userId: string): Promise<Task[]>;

    /**
     * Method for getting a specified task by ID
     * 
     * @param taskId - The ID of the task we want to get.
     * 
     * @returns {Promise<Task>} The task with the ID provided.
     * 
     * @throws BadRequestException If the taskId is not provided.
     * 
     * @throws NotFoundException If the task with the provided taskId is not found.
     */
    abstract getTaskById(taskId: string): Promise<Task>;


    /**
     * Method for create a new Task in the app
     * 
     * @param userId - The user ID of the user whose task we want to create.
     * 
     * @param task - The task we want to create as partial object.
     * 
     * @returns {Promise<Task>} The task that was created.
     * 
     * @throws BadRequestException If the userId is not provided.
     * 
     * @throws NotFoundException If the user with the provided userId is not found.
     * 
     * @throws ForbiddenException If the user is not authorized to create a task or hasn't admin role in the workspace.
     */
    abstract createTask(userId: string, task: Partial<Task>): Promise<Task>;

    /**
     * Method for deleting a task by ID
     * 
     * @param taskId - The ID of the task we want to delete.
     * 
     * @throws BadRequestException If the taskId is not provided.
     * 
     * @throws NotFoundException If the task with the provided taskId is not found.
     * 
     * @throws ForbiddenException If the user is not authorized to delete the task or hasn't admin role in the workspace.
     */
    abstract deleteTask(taskId: string): Promise<void>;

    /**
     * Method for updating a task by ID
     * 
     * @param taskId - The ID of the task we want to update.
     * 
     * @param task - The task we want to update as partial object.
     * 
     * @returns {Promise<Task>} The task that was updated.
     * 
     * @throws BadRequestException If the taskId is not provided.
     * 
     * @throws BadRequestException If the task object is not provided.
     * 
     * @throws BadRequestException If the workspaceId is not provided in the task object.
     * 
     * @throws NotFoundException If the createdBy user of the task is not found.
     * 
     * @throws NotFoundException If the workspace with the provided workspaceId is not found.
     * 
     * @throws NotFoundException If the task with the provided taskId is not found.
     * 
     * @throws ForbiddenException If the user is not authorized to update the task or hasn't admin role in the workspace.
     */
    abstract updateTask(taskId: string, task: Partial<Task>): Promise<Task>;
}