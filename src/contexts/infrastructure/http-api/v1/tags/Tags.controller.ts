import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, HttpCode, UsePipes, ValidationPipe, BadRequestException, UseGuards } from '@nestjs/common';
import { CreateTagDto, UpdateTagDto } from '@/contexts/infrastructure/http-api/v1/tags/dtos';
import { API_VERSION } from '@/contexts/infrastructure/http-api/v1/';
import * as TagUseCases from '@/contexts/application/usecases/tags';
import { Roles, User as UserDecorator } from '@/contexts/shared/lib/decorators';
import { JwtAuthGuard } from '@/contexts/shared/lib/guards';

@UseGuards(JwtAuthGuard)
@Controller(`${API_VERSION}/tags`)
export class TagController {

  // Implements the neccessaries tag use cases
  constructor(
    private readonly createTagUseCase: TagUseCases.CreateTagUseCase,
    private readonly deleteTagUseCase: TagUseCases.DeleteTagUseCase,
    private readonly getAllTagsByWorkspaceUseCase: TagUseCases.GetAllTagsByWorkspaceUseCase,
    private readonly getAllTagsCreatedByUserUseCase: TagUseCases.GetAllTagsCreatedByUserUseCase,
    private readonly getAllTagsOfUserUseCase: TagUseCases.GetAllTagsOfUserUseCase,
    private readonly getAllTagsUseCase: TagUseCases.GetAllTagsUseCase,
    private readonly getTagByIdUseCase: TagUseCases.GetTagByIdUseCase,
    private readonly getTagByNameAndUserUseCase: TagUseCases.GetTagByNameAndUserUseCase,
    private readonly updateTagUseCase: TagUseCases.UpdateTagUseCase,
  ) {}

  // Create a new tag
  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async createTag(@UserDecorator() user, @Body() tagDto: CreateTagDto) {
    const tag = await this.createTagUseCase.run(tagDto.workspace_id, user.id, tagDto);
    return {
      message: 'Tag created successfully',
      tag,
    };
  }

  // Get all tags in the app
  @Get()
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async getAllTags(@Query('limit') limit?: number, @Query('orderBy') orderBy?: 'asc' | 'desc') {
    return await this.getAllTagsUseCase.run(limit, orderBy);
  }

  // Get all tags created by a user
  @Get('created/:userId')
  @HttpCode(HttpStatus.OK)
  async getAllTagsCreatedByUser(@Param('userId') userId: string) {
    return await this.getAllTagsCreatedByUserUseCase.run(userId);
  }

  // Get all tags of a user
  @Get('of/:userId')
  @HttpCode(HttpStatus.OK)
  async getAllTagsOfUser(@Param('userId') userId: string) {
    return await this.getAllTagsOfUserUseCase.run(userId);
  }

  // Get all tags by workspace id
  @Get('byWorkspace/:workspaceId')
  @HttpCode(HttpStatus.OK)
  async getAllTagsByWorkspace(@Param('workspaceId') workspaceId: string) {
    return await this.getAllTagsByWorkspaceUseCase.run(workspaceId);
  }

  // Get an unique tag by id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getTagById(@Param('id') tagId: string) {
    return await this.getTagByIdUseCase.run(tagId);
  }

  // Get an unique tag by name and user id
  @Get('byName/:name/:userId')
  @HttpCode(HttpStatus.OK)
  async getTagByNameAndUser(@Param('name') name: string, @Param('userId') userId: string) {
    return await this.getTagByNameAndUserUseCase.run(name, userId);
  }

  // Update a tag
  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async updateTag(@Param('id') tagId: string, @Body() tagDto: UpdateTagDto) {
    const updatedTag = await this.updateTagUseCase.run(tagId, tagDto);
    return {
      message: 'Tag updated successfully',
      tag: updatedTag,
    };
  }

  // Delete a tag by id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteTag(@Param('id') tagId: string) {
    await this.deleteTagUseCase.run(tagId);
    return {
      message: 'Tag deleted successfully',
    };
  }

}