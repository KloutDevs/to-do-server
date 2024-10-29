import { Inject, Injectable } from '@nestjs/common';
import { TaskRepository } from '@/contexts/domain/repositories/task.repository.port';
import { Task } from '@/contexts/domain/models';

@Injectable()
export class GetAllTasksByWorkspaceUseCase {

  // This constructor takes a taskRepository as a dependency
  constructor(@Inject('taskRepository') private taskRepository: TaskRepository) {}
  
  // This function takes a workspaceId as a parameter and returns an array of all tasks in the provided workspace
  async run(workspaceId?: string): Promise<Task[]> {

    // Call the repository method to get all tasks in a specific workspace
    return await this.taskRepository.getAllTasksByWorkspaceId(workspaceId);

  }
}