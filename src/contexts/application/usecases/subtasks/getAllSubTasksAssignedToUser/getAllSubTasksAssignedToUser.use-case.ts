import { Inject, Injectable } from '@nestjs/common';
import { SubTaskRepository } from '@/contexts/domain/repositories';
import { SubTask } from '@/contexts/domain/models';

@Injectable()
export class GetAllSubTasksAssignedToUserUseCase {

  // This constructor takes a subTaskRepository as a dependency
  constructor(@Inject('subTaskRepository') private subTaskRepository: SubTaskRepository) {}
  
  // This function takes a userId as a parameter and returns an array of all subTasks assigned to the user provided
  async run(userId?: string): Promise<SubTask[]> {

    // Call the repository method to get all sub tasks assigned to the user provided
    return await this.subTaskRepository.getAllSubTasksAssignedToUser(userId);

  }
}