import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/contexts/shared/prisma/prisma.service';
import { TagRepository } from '@/contexts/domain/repositories/tag.repository.port';
import { Tag } from '@/contexts/domain/models';
import { AlreadyExistsException } from '@/contexts/shared/lib/errors';

@Injectable()
export class PrismaTagRepository implements TagRepository {

  constructor(private db: PrismaService) {}
  
  async getAllTags(limit?: number, orderBy?: 'desc' | 'asc'): Promise<Tag[]> {

    // Return all tags in descending order by default or the order and limit specified
    return this.db.tags.findMany({
      orderBy: { name: orderBy ?? 'desc' },
      take: limit,
    });

  }

  async getTagsByWorkspaceId(workspaceId: string): Promise<Tag[]> {

    // Check if workspaceId is provided
    if (!workspaceId) throw new BadRequestException('Workspace ID is required');

    // Check if workspace exists, if not throw an NotFoundException
    const workspace = await this.db.workspace.findUnique({
      where: { id: workspaceId },
    });
    if (!workspace) throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);

    // Get all tags within the workspace
    const tags = await this.db.tags.findMany({
      where: { workspace_id: workspaceId },
    });

    // Return the tags found
    return tags;
  }

  async getTagsCreatedByUser(userId: string): Promise<Tag[]> {

    // Check if userId is provided
    if (!userId) throw new BadRequestException('User ID is required');

    // Check if user exists, if not throw an NotFoundException
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Get all tags created by the user provided
    const tags = await this.db.tags.findMany({
      where: { created_by: userId },
    });

    // Return the tags found
    return tags;
  }

  async getTagsOfUser(userId: string): Promise<Tag[]> {

    // Check if userId is provided
    if (!userId) throw new BadRequestException('User ID is required');

    // Check if user exists, if not throw an NotFoundException
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Get all tags of the user provided, where the user is the creator and the workspace is null
    const tags = await this.db.tags.findMany({
      where: { 
        AND: [
          { created_by: userId },
          { workspace_id: null },
        ]
    }});

    // Return the tags found
    return tags;
  }

  async getTagById(tagId: string): Promise<Tag> {

    // Check if tagId is provided
    if (!tagId) throw new BadRequestException('Tag ID is required');

    // Check if tag exists, if not throw an NotFoundException
    const tag = await this.db.tags.findUnique({ where: { tag_id: tagId } });
    if (!tag) throw new NotFoundException(`Tag with ID ${tagId} not found`);

    // Return the tag found
    return tag;
  }

  async getTagByNameAndUserId(name: string, userId: string): Promise<Tag> {

    // Check if name is provided
    if (!name) throw new BadRequestException('Name is required');

    // Check if userId is provided
    if (!userId) throw new BadRequestException('User ID is required');

    // Check if tag exists, if not throw an NotFoundException
    const tag = await this.db.tags.findFirst({
      where: {
        name,
        created_by: userId,
      },
    });
    if (!tag) throw new NotFoundException(`Tag with name ${name} and user ID ${userId} not found`);

    // Return the tag found
    return tag;
  }

  async createNewTag(workspaceId: string, userId: string, name: string, color: string): Promise<Tag> {

    // Check if workspaceId is provided
    if (!workspaceId) throw new BadRequestException('Workspace ID is required');

    // Check if userId is provided
    if (!userId) throw new BadRequestException('User ID is required');

    // Check if name is provided
    if (!name) throw new BadRequestException('Name is required');

    // Check if color is provided
    if (!color) throw new BadRequestException('Color is required');

    // Check if workspace exists, if not throw an NotFoundException
    const workspace = await this.db.workspace.findUnique({
      where: { id: workspaceId },
    });
    if (!workspace) throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);

    // Check if user exists, if not throw an NotFoundException
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Check if the tag already exists
    const tagAlreadyExists = await this.db.tags.findFirst({
      where: {
        name,
        created_by: userId,
      },
    });
    if(tagAlreadyExists) throw new AlreadyExistsException(`Tag with name ${name} already exists`);

    // Create the new tag.
    const createdTag = await this.db.tags.create({
      data: {
        workspace_id: workspaceId,
        created_by: userId,
        name: name,
        color: color,
      },
    });

    // Return the tag created
    return createdTag;
  }

  async updateTag(tagId: string, tag: Partial<Tag>): Promise<Tag> {

    // Check if tagId is provided
    if (!tagId) throw new BadRequestException('Tag ID is required');

    // Check if tag object is provided
    if(!tag) throw new BadRequestException('Tag Object is required');

    // Check if workspaceId is provided in the Tag Object
    if (!tag.workspace_id) throw new BadRequestException('Workspace ID in Tag Object is required');

    // Check if userId is provided in the Tag Object
    if (!tag.created_by) throw new BadRequestException('User ID in Tag Object is required');

    // Check if name is provided in the Tag Object
    if (!tag.name) throw new BadRequestException('Name in Tag Object is required');

    // Check if color is provided in the Tag Object
    if (!tag.color) throw new BadRequestException('Color in Tag Object is required');

    // Check if workspace exists, if not throw an NotFoundException
    const workspace = await this.db.workspace.findUnique({
      where: { id: tag.workspace_id },
    });
    if (!workspace) throw new NotFoundException(`Workspace with ID ${tag.workspace_id} not found`);

    // Check if user exists, if not throw an NotFoundException
    const user = await this.db.user.findUnique({ where: { id: tag.created_by } });
    if (!user) throw new NotFoundException(`User with ID ${tag.created_by} not found`);

    //Check if the tag with the provided name already exists
    const tagAlreadyExists = await this.db.tags.findFirst({
      where: {
        name: tag.name,
        created_by: tag.created_by,
      },
    });
    if(tagAlreadyExists) throw new AlreadyExistsException(`Tag with name ${tag.name} already exists`);

    // Update the tag with the provided tagId and tag data
    const updatedTag = await this.db.tags.update({
      where: { tag_id: tagId },
      data: {
        name: tag.name,
        color: tag.color,
      },
    });

    // Return the tag updated
    return updatedTag;
  }

  async deleteTag(tagId: string): Promise<void> {

    // Check if tagId is provided
    if (!tagId) throw new BadRequestException('Tag ID is required');
    
    // Check if tag exists, if not throw an NotFoundException
    const tag = await this.db.tags.findUnique({ where: { tag_id: tagId } });
    if (!tag) throw new NotFoundException(`Tag with ID ${tagId} not found`);

    // Delete the tag
    await this.db.tags.delete({
      where: { tag_id: tagId },
    });

  }

}