import { Inject, Injectable } from '@nestjs/common';
import { SubTaskRepository } from '@/contexts/domain/repositories/';
import { SubTask } from '@/contexts/domain/models';

@Injectable()
export class GetAllSubTasksByWorkspaceUseCase {

  // This constructor takes a subTaskRepository as a dependency
  constructor(@Inject('subTaskRepository') private subTaskRepository: SubTaskRepository) {}
  
  // This function takes a workspaceId as a parameter and returns an array of all sub tasks in the provided workspace
  async run(workspaceId?: string): Promise<SubTask[]> {

    // Call the repository method to get all sub tasks in a specific workspace
    return await this.subTaskRepository.getAllSubTasksByWorkspaceId(workspaceId);

  }
}