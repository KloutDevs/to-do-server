import { Inject, Injectable } from '@nestjs/common';
import { TagRepository } from '@/contexts/domain/repositories';
import { Tag } from '@/contexts/domain/models';

@Injectable()
export class GetAllTagsUseCase {

  // This constructor takes a tagRepository as a dependency
  constructor(@Inject('tagRepository') private tagRepository: TagRepository) {}

    // This function returns an array of all tags in the app, can provide a limit and orderBy parameters
    async run(limit?: number, orderBy?: 'desc' | 'asc'): Promise<Tag[]> {

      // Call the repository method to get all tags in the app
      return await this.tagRepository.getAllTags(
        limit,
        orderBy
      );

    } 
}
