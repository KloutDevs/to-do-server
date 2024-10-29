import { Inject, Injectable } from '@nestjs/common';
import { TagRepository } from '@/contexts/domain/repositories';
import { Tag } from '@/contexts/domain/models';

@Injectable()
export class GetAllTagsOfUserUseCase {

  // This constructor takes a tagRepository as a dependency
  constructor(@Inject('tagRepository') private tagRepository: TagRepository) {}
  
  // This function takes a userId as a parameter and returns an array of all tags of the user provided
  async run(userId?: string): Promise<Tag[]> {

    // Call the repository method to get all tags of to the user provided
    return await this.tagRepository.getTagsOfUser(userId);

  }
}