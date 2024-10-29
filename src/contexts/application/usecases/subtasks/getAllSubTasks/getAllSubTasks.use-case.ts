import { Inject, Injectable } from '@nestjs/common';
import { SubTaskRepository } from '@/contexts/domain/repositories';
import { SubTask } from '@/contexts/domain/models';

@Injectable()
export class GetAllSubTasksUseCase {

  // This constructor takes a subTaskRepository as a dependency
  constructor(@Inject('subTaskRepository') private subTaskRepository: SubTaskRepository) {}
  
    // This function returns an array of all sub tasks in the app, can provide a limit and orderBy parameters
  async run(limit?: number, orderBy?: 'desc' | 'asc'): Promise<SubTask[]> {

      // Call the repository method to get all subtasks in the app
    return await this.subTaskRepository.getAllSubTasks(
      limit,
      orderBy
    );
  } 
}
