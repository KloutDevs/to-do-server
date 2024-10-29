import { Inject, Injectable } from '@nestjs/common';
import { SubTaskRepository } from '@/contexts/domain/repositories/';
import { SubTask } from '@/contexts/domain/models';

@Injectable()
export class GetAllSubTasksByParentUseCase {

  // This constructor takes a subTaskRepository as a dependency
  constructor(@Inject('subTaskRepository') private subTaskRepository: SubTaskRepository) {}
  
  // This function takes a taskId as a parameter and returns an array of all sub tasks where the parent task id matches the provided taskId
  async run(taskId: string): Promise<SubTask[]> {

    // Call the repository method to get all subtasks by parent task id
    return await this.subTaskRepository.getAllSubTasksByParentTaskId(taskId);

  }
}