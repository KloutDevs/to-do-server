import { Inject, Injectable } from '@nestjs/common';
import { TagRepository } from '@/contexts/domain/repositories';

@Injectable()
export class DeleteTagUseCase {

  // This constructor takes a tagRepository as a dependency
  constructor(@Inject('tagRepository') private tagRepository: TagRepository) {}
  
  // This function takes a tagId as a parameter and returns a successfully message
  async run(tagId: string): Promise<{message: string}> {

    // Call the repository method to delete a tag
    await this.tagRepository.deleteTag(tagId);

    // Return a successfully message
    return {message: "Successfully Deleted Tag"}

  }
}