import { Inject, Injectable } from '@nestjs/common';
import { SubTaskRepository } from '@/contexts/domain/repositories/';

@Injectable()
export class DeleteSubTaskUseCase {

  // This constructor takes a taskRepository as a dependency
  constructor(@Inject('subTaskRepository') private subTaskRepository: SubTaskRepository) {}
  
  // This function takes a subTaksId as a parameter and returns a successfully message
  async run(subTaskId: string): Promise<{message: string}> {

    // Call the repository method to delete a sub task
    await this.subTaskRepository.deleteSubTask(subTaskId);

    // Return a successfully message
    return {message: "Successfully Deleted Task"}

  }
}