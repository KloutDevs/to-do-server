import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpCode, UsePipes, ValidationPipe, BadRequestException, UseGuards } from '@nestjs/common';
import { UpdateTaskDto, CreateTaskDto } from '@/contexts/infrastructure/http-api/v1/tasks/dtos';
import { API_VERSION } from '@/contexts/infrastructure/http-api/v1/';
import * as TaskUseCases from '@/contexts/application/usecases/tasks';
import { Roles, User as UserDecorator } from '@/contexts/shared/lib/decorators';
import { JwtAuthGuard } from '@/contexts/shared/lib/guards';
import { Task } from '@/contexts/domain/models';

@UseGuards(JwtAuthGuard)
@Controller(`${API_VERSION}/tasks`)
export class TaskController {

  // Implements the neccesaries use cases
  constructor(
    private readonly createTaskUseCase: TaskUseCases.CreateTaskUseCase,
    private readonly deleteTaskUseCase: TaskUseCases.DeleteTaskUseCase,
    private readonly updateTaskUseCase: TaskUseCases.UpdateTaskUseCase,
    private readonly getAllTasksAssignedToUserUseCase: TaskUseCases.GetAllTasksAssignedToUserUseCase,
    private readonly getAllTasksByWorkspaceUseCase: TaskUseCases.GetAllTasksByWorkspaceUseCase,
    private readonly getAllTasksCreatedByUserUseCase: TaskUseCases.GetAllTasksCreatedByUserUseCase,
    private readonly getAllTasksOfUserUseCase: TaskUseCases.GetAllTasksOfUserUseCase,
    private readonly getAllTasksUseCase: TaskUseCases.GetAllTasksUseCase,
    private readonly getTaskByIdUseCase: TaskUseCases.GetTaskByIdUseCase,
  ) {}

  // Create a new task
  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async createTask(@UserDecorator() user, @Body() taskDto: CreateTaskDto) {
    const task = await this.createTaskUseCase.run(user.id, taskDto);
    return {
      message: 'Task created successfully',
      task,
    };
  }

  // Get all tasks assigned to a user
  @Get('assigned-to/:userId')
  @HttpCode(HttpStatus.OK)
  async getAllTasksAssignedToUser(@Param('userId') userId: string): Promise<Task[]> {
    return await this.getAllTasksAssignedToUserUseCase.run(userId);
  }

  // Get all tasks of a workspace
  @Get('workspace/:workspaceId')
  @HttpCode(HttpStatus.OK)
  async getAllTasksByWorkspace(@Param('workspaceId') workspaceId: string): Promise<Task[]> {
    return await this.getAllTasksByWorkspaceUseCase.run(workspaceId);
  }

  // Get all tasks created by a user
  @Get('created-by/:userId')
  @HttpCode(HttpStatus.OK)
  async getAllTasksCreatedByUser(@Param('userId') userId: string): Promise<Task[]> {
    return await this.getAllTasksCreatedByUserUseCase.run(userId);
  }

  // Get all tasks of a user
  @Get('of/:userId')
  @HttpCode(HttpStatus.OK)
  async getAllTasksOfUser(@Param('userId') userId: string): Promise<Task[]> {
    return await this.getAllTasksOfUserUseCase.run(userId);
  }

  // Get all tasks in the application
  @Get()
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async getAllTasks(): Promise<Task[]> {
    return await this.getAllTasksUseCase.run();
  }

  // Get a unique task by Id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getTaskById(@Param('id') taskId: string): Promise<Task> {
    return await this.getTaskByIdUseCase.run(taskId);
  }

  // Update an existing task
  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async updateTask(@Param('id') taskId: string, @Body() taskDto: UpdateTaskDto) {
    const updatedTask = await this.updateTaskUseCase.run(taskId, taskDto);
    return {
      message: 'Task updated successfully',
      task: updatedTask,
    };
  }

  // Delete an existing task
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteTask(@Param('id') taskId: string) {
    await this.deleteTaskUseCase.run(taskId);
    return {
      message: 'Tarea eliminada exitosamente',
    };
  }
}