import { Inject, Injectable } from '@nestjs/common';
import { TagRepository } from '@/contexts/domain/repositories/';
import { Tag } from '@/contexts/domain/models';

@Injectable()
export class GetTagByNameAndUserUseCase {

  // This constructor takes a tagRepository as a dependency
  constructor(@Inject('tagRepository') private tagRepository: TagRepository) {}
  
  // This function takes a userId and tag name as a parameter, after returns a specific tag
  async run(userId: string, tagName: string): Promise<Tag> {

    // Call the repository method to get a specific tag by name and userId provided
    return await this.tagRepository.getTagByNameAndUserId(userId, tagName);
  }
}