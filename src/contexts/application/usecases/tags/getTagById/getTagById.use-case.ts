import { TagRepository } from '@/contexts/domain/repositories/';
import { Inject, Injectable } from '@nestjs/common';
import { Tag } from '@/contexts/domain/models';

@Injectable()
export class GetTagByIdUseCase {
  
  // This constructor takes a tagRepository as a dependency
  constructor(@Inject('tagRepository') private tagRepository: TagRepository) {}
  
  // This function takes a tagId as a parameter and returns the tag with the given ID
  async run(tagId: string): Promise<Tag> {

    // Call the repository method to get a specific tag by its ID
    return await this.tagRepository.getTagById(tagId);
  }
}