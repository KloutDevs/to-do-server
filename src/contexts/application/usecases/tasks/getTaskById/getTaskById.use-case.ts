import { TaskRepository } from '@/contexts/domain/repositories/';
import { Inject, Injectable } from '@nestjs/common';
import { Task } from '@/contexts/domain/models';

@Injectable()
export class GetTaskByIdUseCase {
  
  // This constructor takes a taskRepository as a dependency
  constructor(@Inject('taskRepository') private taskRepository: TaskRepository) {}
  
  // This function takes a taskId as a parameter and returns the task with the given ID
  async run(taskId: string): Promise<Task> {

    // Call the repository method to get a specific task by its ID
    return await this.taskRepository.getTaskById(taskId);
  }
}