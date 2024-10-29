import { Inject, Injectable } from '@nestjs/common';
import { TaskRepository } from '@/contexts/domain/repositories';
import { Task } from '@/contexts/domain/models';

@Injectable()
export class GetAllTasksUseCase {

  // This constructor takes a taskRepository as a dependency
  constructor(@Inject('taskRepository') private taskRepository: TaskRepository) {}

    // This function returns an array of all tasks in the app, can provide a limit and orderBy parameters
    async run(limit?: number, orderBy?: 'desc' | 'asc'): Promise<Task[]> {

      // Call the repository method to get all tasks in the app
      return await this.taskRepository.getAllTasks(
        limit,
        orderBy
      );

    } 
}
