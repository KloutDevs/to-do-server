import { Inject, Injectable } from '@nestjs/common';
import { SubTaskRepository } from '@/contexts/domain/repositories';
import { SubTask } from '@/contexts/domain/models';

@Injectable()
export class CreateSubTaskUseCase {

  // This constructor takes a subTaskRepository as a dependency
  constructor(@Inject('subTaskRepository') private subTaskRepository: SubTaskRepository) {}
  
  // This function takes a userId as a parameter and a partial subtask object, after returns the subtask created
  async run(userId: string, subtask: Partial<SubTask>): Promise<SubTask> {

    // Call the repository method to create a subtask and get the all object already created
    return await this.subTaskRepository.createSubTask(userId, subtask);

  }
}