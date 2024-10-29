import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/contexts/shared/prisma/prisma.service';
import { SubTaskRepository } from '@/contexts/domain/repositories/subtask.repository.port';
import { SubTask, Task } from '@/contexts/domain/models';

@Injectable()
export class PrismaSubTaskRepository implements SubTaskRepository {
  
  constructor(private db: PrismaService) {}

  async getAllSubTasks(limit?: number, orderBy?: 'desc' | 'asc'): Promise<SubTask[]> {

    // Return all tasks in descending order by default or the order and limit specified
    return this.db.subtasks.findMany({
      orderBy: { created_at: orderBy ?? 'desc' },
      take: limit,
    });

  }

  async getAllSubTasksByParentTaskId(parentTaskId: string): Promise<SubTask[]> {

    // Check if parentTaskId is provided
    if (!parentTaskId) throw new BadRequestException('Parent Task ID is required');

    // Check if parentTask exists, if not throw a NotFoundException
    const parentTask = await this.db.task.findUnique({
      where: { task_id: parentTaskId },
      include: {
        subtasks: true,
      },
    });
    if (!parentTask) throw new NotFoundException(`Parent Task with ID ${parentTaskId} not found`);

    // Return the subtasks of the parent task
    return parentTask.subtasks;

  }

  async getAllSubTasksByWorkspaceId(workspaceId: string): Promise<SubTask[]> {

    // Check if workspaceId is provided
    if (!workspaceId) throw new BadRequestException('Workspace ID is required');
  
    // Check if workspace exists, if not throw a NotFoundException
    const workspace = await this.db.workspace.findUnique({
      where: { id: workspaceId },
    });
    if (!workspace) throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);
  
    // Get all tasks within the workspace, including their subtasks
    const tasksWithSubtasks = await this.db.task.findMany({
      where: { workspace_id: workspaceId },
      include: {
        subtasks: true,
      },
    });

    // Check if the workspce don't have any task, so it not have subtasks
    if(tasksWithSubtasks.length < 1) throw new NotFoundException(`No tasks found in workspace with ID ${workspaceId} and `);
  
    // Flatten the array of subtasks
    const allSubtasks = tasksWithSubtasks.flatMap(task => task.subtasks);
  
    // Map the Prisma Subtasks to your domain SubTask model if necessary
    const subtasks: SubTask[] = allSubtasks.map(subtask => ({
      subtask_id: subtask.subtask_id,
      task_id: subtask.task_id,
      createdBy: subtask.createdBy,
      title: subtask.title,
      description: subtask.description,
      status: subtask.status,
      priority: subtask.priority,
      created_at: subtask.created_at,
      updated_at: subtask.updated_at,
      due_at: subtask.due_at,
      completed_at: subtask.completed_at,
      assignedTo: subtask.assignedTo,
    }));
  
    // Return the subtasks found
    return subtasks;
  }

  async getAllSubTasksCreatedByUser(userId: string): Promise<SubTask[]> {

    // Check if userId is provided
    if (!userId) throw new BadRequestException('User ID is required');

    // Check if user exists, if not throw an NotFoundException
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Get all sub tasks created by the user provided
    const subtasks = await this.db.subtasks.findMany({
      where: { createdBy: userId },
    });

    // Return the sub tasks found
    return subtasks;
  }

  async getAllSubTasksAssignedToUser(userId: string): Promise<SubTask[]> {

    // Check if userId is provided
    if (!userId) throw new BadRequestException('User ID is required');

    // Check if user exists, if not throw an NotFoundException
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Get all sub tasks assigned to the user provided
    const subtasks = await this.db.subtasks.findMany({
      where: { assignedTo: userId },
    });

    // Return the sub tasks found
    return subtasks;
  }

  async getAllSubTasksOfUser(userId: string): Promise<SubTask[]> {

    // Check if userId is provided
    if (!userId) throw new BadRequestException('User ID is required');

    // Check if user exists, if not throw an NotFoundException
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Get all sub tasks assigned to the user provided and created by the user provided
    const subtasks = await this.db.subtasks.findMany({
      where: { OR: [{ createdBy: userId }, { assignedTo: userId }] },
    });

    // Return the sub tasks found
    return subtasks;
  }

  async getSubTaskById(subTaskId: string): Promise<SubTask> {

    // Check if subTaskId is provided
    if (!subTaskId) throw new BadRequestException('Sub Task ID is required');

    // Check if subTask exists, if not throw an NotFoundException
    const subTask = await this.db.subtasks.findUnique({ where: { subtask_id: subTaskId } });
    if (!subTask) throw new NotFoundException(`SubTask with ID ${subTaskId} not found`);

    // Return the task found
    return subTask;
  }

  async createSubTask(userId: string, subtask: Partial<SubTask>): Promise<SubTask> {

    // Check if userId is provided
    if (!userId) throw new BadRequestException('User ID is required');

    // Check if task is provided
    if(!subtask) throw new BadRequestException('Task Object is required');

    // Check if the parent task exists
    const parentTask = await this.db.task.findUnique({
      where: { task_id: subtask.task_id },
      include: {
        subtasks: true,
      },
    });
    if (!parentTask) throw new NotFoundException(`Parent Task with ID ${subtask.task_id} not found`);


    // Check if user exists, if not throw an NotFoundException
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Check if workspace exists, if not throw an NotFoundException
    const workspace = await this.db.workspace.findUnique({
      where: { id: parentTask.workspace_id },
    });
    if (!workspace) throw new NotFoundException(`Workspace with ID ${parentTask.workspace_id} not found`);

    // Create the new sub task.
    const createdSubTask = await this.db.subtasks.create({
      data: {
        createdBy: userId,
        task_id: parentTask.task_id,
        title: subtask.title,
        description: subtask.description,
        status: subtask.status,
        priority: subtask.priority,
        due_at: subtask.due_at,
        assignedTo: subtask.assignedTo,
      },
    });

    // Return the sub task created
    return createdSubTask;
  }

  async deleteSubTask(subTaskId: string): Promise<void> {

    // Check if subTaskId is provided
    if (!subTaskId) throw new BadRequestException('Task ID is required');
    
    // Check if the sub task exists, if not throw an NotFoundException
    const subtask = await this.db.subtasks.findUnique({ where: { subtask_id: subTaskId } });
    if (!subtask) throw new NotFoundException(`SubTask with ID ${subTaskId} not found`);

    // Delete the task from the database
    await this.db.subtasks.delete({
      where: { subtask_id: subTaskId },
    });

  }

  async updateSubTask(subTaskId: string, subTask: Partial<SubTask>): Promise<SubTask> {

    // Check if subTaskId is provided
    if (!subTaskId) throw new BadRequestException('Sub Task ID is required');

    // Check if subTask object is provided
    if(!subTask) throw new BadRequestException('SubTask Object is required');

    // Check if parent task is provided in the SubTask Object
    if (!subTask.task_id) throw new BadRequestException('Parent Task ID in SubTask Object is required');

    // Check if user exists, if not throw an NotFoundException
    const user = await this.db.user.findUnique({ where: { id: subTask.createdBy } });
    if (!user) throw new NotFoundException(`User with ID ${subTask.createdBy} not found`);

    // Check if the parent task exists, if not throw a Not Found Exception
    const parentTask = await this.db.task.findUnique({where: {task_id: subTask.task_id}})
    if(!parentTask) throw new NotFoundException(`Parent Task with ID ${subTask.task_id} not found`);

    // Check if workspace exists, if not throw an NotFoundException
    const workspace = await this.db.workspace.findUnique({
      where: { id: parentTask.workspace_id },
    });
    if (!workspace) throw new NotFoundException(`Workspace with ID ${parentTask.workspace_id} not found`);

    // Check if task exists, if not throw an NotFoundException
    const subTaskToUpdate = await this.db.subtasks.findUnique({ where: { subtask_id: subTaskId } });
    if (!subTaskToUpdate) throw new NotFoundException(`SubTask with ID ${subTaskId} not found`);

    // Update the sub task
    const updatedSubTask = await this.db.subtasks.update({
      where: { subtask_id: subTaskId },
      data: {
        title: subTask.title,
        description: subTask.description,
        status: subTask.status,
        priority: subTask.priority,
        due_at: subTask.due_at,
        assignedTo: subTask.assignedTo,
        completed_at: subTask.completed_at,
      },
    });

    // Return the sub tasks updated
    return updatedSubTask;
  }

}
