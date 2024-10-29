import { Inject, Injectable } from '@nestjs/common';
import { TagRepository } from '@/contexts/domain/repositories';
import { Tag } from '@/contexts/domain/models';

@Injectable()
export class GetAllTagsByWorkspaceUseCase {

  // This constructor takes a tagRepository as a dependency
  constructor(@Inject('tagRepository') private tagRepository: TagRepository) {}
  
  // This function takes a workspaceId as a parameter and returns an array of all tags in the provided workspace
  async run(workspaceId?: string): Promise<Tag[]> {

    // Call the repository method to get all tags in a specific workspace
    return await this.tagRepository.getTagsByWorkspaceId(workspaceId);

  }
}