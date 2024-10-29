import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/contexts/shared/prisma/prisma.service';
import { TaskRepository } from '@/contexts/domain/repositories/task.repository.port';
import { CreateTaskBody, Task } from '@/contexts/domain/models';

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private db: PrismaService) {}

  async getAllTasks(limit?: number, orderBy?: 'desc' | 'asc'): Promise<Task[]> {
    // Return all tasks in descending order by default or the order and limit specified
    return this.db.task.findMany({
      orderBy: { created_at: orderBy ?? 'desc' },
      take: limit,
    });
  }

  async getAllTasksByWorkspaceId(workspaceId: string): Promise<Task[]> {
    // Check if workspaceId is provided
    if (!workspaceId) throw new BadRequestException('Workspace ID is required');

    // Check if workspace exists, if not throw an NotFoundException
    const workspace = await this.db.workspace.findUnique({
      where: { id: workspaceId },
    });
    if (!workspace)
      throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);

    // Get all tasks within the workspace provided
    const task = await this.db.task.findMany({
      where: { workspace_id: workspaceId },
    });

    // Return the tasks found
    return task;
  }

  async getAllTasksCreatedByUser(userId: string): Promise<Task[]> {
    // Check if userId is provided
    if (!userId) throw new BadRequestException('User ID is required');

    // Check if user exists, if not throw an NotFoundException
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Get all tasks created by the user provided
    const tasks = await this.db.task.findMany({
      where: { createdBy: userId },
    });

    // Return the tasks found
    return tasks;
  }

  async getAllTasksAssignedToUser(userId: string): Promise<Task[]> {
    // Check if userId is provided
    if (!userId) throw new BadRequestException('User ID is required');

    // Check if user exists, if not throw an NotFoundException
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Get all tasks assigned to the user provided
    const tasks = await this.db.task.findMany({
      where: { assignedTo: userId },
    });

    // Return the tasks found
    return tasks;
  }

  async getAllTasksOfUser(userId: string): Promise<Task[]> {
    // Check if userId is provided
    if (!userId) throw new BadRequestException('User ID is required');

    // Check if user exists, if not throw an NotFoundException
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Get all tasks assigned to the user provided and created by the user provided
    const tasks = await this.db.task.findMany({
      where: { OR: [{ createdBy: userId }, { assignedTo: userId }] },
    });

    // Return the tasks found
    return tasks;
  }

  async getTaskById(taskId: string): Promise<Task> {
    // Check if taskId is provided
    if (!taskId) throw new BadRequestException('Task ID is required');

    // Check if task exists, if not throw an NotFoundException
    const task = await this.db.task.findUnique({ where: { task_id: taskId } });
    if (!task) throw new NotFoundException(`Task with ID ${taskId} not found`);

    // Return the task found
    return task;
  }

  async createTask(userId: string, task: Partial<Task>): Promise<Task> {

    // Check if userId is provided
    if (!userId) throw new BadRequestException('User ID is required');

    // Check if task is provided
    if(!task) throw new BadRequestException('Task Object is required');

    // Check if workspaceId is provided in the Task Object
    if (!task.workspace_id) throw new BadRequestException('Workspace ID in Task Object is required');

    // Check if user exists, if not throw an NotFoundException
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Check if workspace exists, if not throw an NotFoundException
    const workspace = await this.db.workspace.findUnique({
      where: { id: task.workspace_id },
    });
    if (!workspace) throw new NotFoundException(`Workspace with ID ${task.workspace_id} not found`);

    // Create the new task.
    const createdTask = await this.db.task.create({
      data: {
        createdBy: userId,
        workspace_id: task.workspace_id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date,
        assignedTo: task.assignedTo,
      },
    });

    // Return the task created
    return createdTask;
  }

  async deleteTask(taskId: string): Promise<void> {

    // Check if taskId is provided
    if (!taskId) throw new BadRequestException('Task ID is required');
    
    // Check if task exists, if not throw an NotFoundException
    const task = await this.db.task.findUnique({ where: { task_id: taskId } });
    if (!task) throw new NotFoundException(`Task with ID ${taskId} not found`);

    // Delete the task
    await this.db.task.delete({
      where: { task_id: taskId },
    });

  }

  async updateTask(taskId: string, task: Partial<Task>): Promise<Task> {

    // Check if taskId is provided
    if (!taskId) throw new BadRequestException('Task ID is required');

    // Check if task object is provided
    if(!task) throw new BadRequestException('Task Object is required');

    // Check if workspaceId is provided in the Task Object
    if (!task.workspace_id) throw new BadRequestException('Workspace ID in Task Object is required');

    // Check if user exists, if not throw an NotFoundException
    const user = await this.db.user.findUnique({ where: { id: task.createdBy } });
    if (!user) throw new NotFoundException(`User with ID ${task.createdBy} not found`);

    // Check if workspace exists, if not throw an NotFoundException
    const workspace = await this.db.workspace.findUnique({
      where: { id: task.workspace_id },
    });
    if (!workspace) throw new NotFoundException(`Workspace with ID ${task.workspace_id} not found`);

    // Check if task exists, if not throw an NotFoundException
    const taskToUpdate = await this.db.task.findUnique({ where: { task_id: taskId } });
    if (!taskToUpdate) throw new NotFoundException(`Task with ID ${taskId} not found`);

    // Update the task
    const updatedTask = await this.db.task.update({
      where: { task_id: taskId },
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date,
        assignedTo: task.assignedTo,
        completed_at: task.completed_at,
      },
    });

    // Return the task updated
    return updatedTask;
  }

}
