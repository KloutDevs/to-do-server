import { Inject, Injectable } from '@nestjs/common';
import { SubTaskRepository } from '@/contexts/domain/repositories';
import { SubTask } from '@/contexts/domain/models';

@Injectable()
export class UpdateSubTaskUseCase {

  // This constructor takes a subTaskRepository as a dependency
  constructor(@Inject('subTaskRepository') private subTaskRepository: SubTaskRepository) {}
  
  // This function takes a subTaskId as a parameter and returns the sub task updated
  async run(subTaskId: string, subTask: Partial<SubTask>): Promise<SubTask> {

    // Call the repository method to update a sub task
    return await this.subTaskRepository.updateSubTask(subTaskId, subTask);

  }
}