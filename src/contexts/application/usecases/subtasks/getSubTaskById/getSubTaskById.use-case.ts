import { SubTaskRepository } from '@/contexts/domain/repositories/';
import { Inject, Injectable } from '@nestjs/common';
import { SubTask } from '@/contexts/domain/models';

@Injectable()
export class GetSubTaskByIdUseCase {
  
  // This constructor takes a subTaskRepository as a dependency
  constructor(@Inject('subTaskRepository') private subTaskRepository: SubTaskRepository) {}
  
  // This function takes a subTaskId as a parameter and returns the sub task with the given ID
  async run(subTaskId: string): Promise<SubTask> {

    // Call the repository method to get a specific sub task by its ID
    return await this.subTaskRepository.getSubTaskById(subTaskId);
  }
}