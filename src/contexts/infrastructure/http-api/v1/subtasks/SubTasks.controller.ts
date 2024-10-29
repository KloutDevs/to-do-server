import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpCode, UsePipes, ValidationPipe, BadRequestException, UseGuards } from '@nestjs/common';
import { API_VERSION } from '@/contexts/infrastructure/http-api/v1/';
import { CreateSubTaskDto, UpdateSubTaskDto } from '@/contexts/infrastructure/http-api/v1/subtasks/dtos';
import * as SubTaskUseCases from '@/contexts/application/usecases/subtasks';
import { Roles, User as UserDecorator } from '@/contexts/shared/lib/decorators';
import { JwtAuthGuard } from '@/contexts/shared/lib/guards';

@UseGuards(JwtAuthGuard)
@Controller(`${API_VERSION}/subtasks`)
export class SubTaskController {

  // Implements the neccessaries sub tasks use cases
  constructor(
    private readonly createSubTaskUseCase: SubTaskUseCases.CreateSubTaskUseCase,
    private readonly deleteSubTaskUseCase: SubTaskUseCases.DeleteSubTaskUseCase,
    private readonly getAllSubTasksAssignedToUserUseCase: SubTaskUseCases.GetAllSubTasksAssignedToUserUseCase,
    private readonly getAllSubTasksByParentUseCase: SubTaskUseCases.GetAllSubTasksByParentUseCase,
    private readonly getAllSubTasksByWorkspaceUseCase: SubTaskUseCases.GetAllSubTasksByWorkspaceUseCase,
    private readonly getAllSubTasksCreatedByUserUseCase: SubTaskUseCases.GetAllSubTasksCreatedByUserUseCase,
    private readonly getAllSubTasksOfUserUseCase: SubTaskUseCases.GetAllSubTasksOfUserUseCase,
    private readonly getAllSubTasksUseCase: SubTaskUseCases.GetAllSubTasksUseCase,
    private readonly getSubTaskByIdUseCase: SubTaskUseCases.GetSubTaskByIdUseCase,
    private readonly updateSubTaskUseCase: SubTaskUseCases.UpdateSubTaskUseCase,
  ) {}

  // Create a new subtask
  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async createSubTask(@UserDecorator() user, @Body() subTaskDto: CreateSubTaskDto) {
    const subTask = await this.createSubTaskUseCase.run(user.id, subTaskDto);
    return {
      message: 'Subtask created successfully',
      subTask,
    };
  }

  // Get all subtasks in the app
  @Get()
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async getAllSubTasks() {
    return await this.getAllSubTasksUseCase.run();
  }

  // Get an unique subtask by id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getSubTaskById(@Param('id') subTaskId: string) {
    return await this.getSubTaskByIdUseCase.run(subTaskId);
  }

  // Get all subtasks assigned to a user
  @Get('assigned/:userId')
  @HttpCode(HttpStatus.OK)
  async getAllSubTasksAssignedToUser(@Param('userId') userId: string) {
    return await this.getAllSubTasksAssignedToUserUseCase.run(userId);
  }

  // Get all subtasks created by a user
  @Get('created/:userId')
  @HttpCode(HttpStatus.OK)
  async getAllSubTasksCreatedByUser(@Param('userId') userId: string) {
    return await this.getAllSubTasksCreatedByUserUseCase.run(userId);
  }

  // Get all subtasks of a user
  @Get('of/:userId')
  @HttpCode(HttpStatus.OK)
  async getAllSubTasksOfUser(@Param('userId') userId: string) {
    return await this.getAllSubTasksOfUserUseCase.run(userId);
  }

  // Get all subtasks by parent task id
  @Get('byParent/:parentTaskId')
  @HttpCode(HttpStatus.OK)
  async getAllSubTasksByParent(@Param('parentTaskId') parentTaskId: string) {
    return await this.getAllSubTasksByParentUseCase.run(parentTaskId);
  }

  // Get all subtasks by workspace id
  @Get('byWorkspace/:workspaceId')
  @HttpCode(HttpStatus.OK)
  async getAllSubTasksByWorkspace(@Param('workspaceId') workspaceId: string) {
    return await this.getAllSubTasksByWorkspaceUseCase.run(workspaceId);
  }

  // Update a subtask
  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async updateSubTask(@Param('id') subTaskId: string, @Body() subTaskDto: UpdateSubTaskDto) {
    const updatedSubTask = await this.updateSubTaskUseCase.run(subTaskId, subTaskDto);
    return {
      message: 'Subtask updated successfully',
      subTask: updatedSubTask,
    };
  }

  // Delete a subtask by id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteSubTask(@Param('id') subTaskId: string) {
    await this.deleteSubTaskUseCase.run(subTaskId);
    return {
      message: 'Subtask deleted successfully',
    };
  }
}