import { Inject, Injectable } from '@nestjs/common';
import { TaskRepository } from '@/contexts/domain/repositories/task.repository.port';
import { Task } from '@/contexts/domain/models';

@Injectable()
export class UpdateTaskUseCase {

  // This constructor takes a taskRepository as a dependency
  constructor(@Inject('taskRepository') private taskRepository: TaskRepository) {}
  
  // This function takes a taksId as a parameter and returns the task updated
  async run(taskId: string, task: Partial<Task>): Promise<Task> {

    // Call the repository method to update a task
    return await this.taskRepository.updateTask(taskId, task);

  }
}