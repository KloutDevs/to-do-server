import { Inject, Injectable } from '@nestjs/common';
import { TagRepository } from '@/contexts/domain/repositories';
import { Tag } from '@/contexts/domain/models';

@Injectable()
export class UpdateTagUseCase {

  // This constructor takes a tagRepository as a dependency
  constructor(@Inject('tagRepository') private tagRepository: TagRepository) {}
  
  // This function takes a tagId as a parameter and returns the tag updated
  async run(tagId: string, tag: Partial<Tag>): Promise<Tag> {

    // Call the repository method to update a tag
    return await this.tagRepository.updateTag(tagId, tag);

  }
}