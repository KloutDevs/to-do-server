import { Inject, Injectable } from '@nestjs/common';
import { TaskRepository } from '@/contexts/domain/repositories/task.repository.port';
import { CreateTaskBody, Task } from '@/contexts/domain/models';

@Injectable()
export class CreateTaskUseCase {

  // This constructor takes a taskRepository as a dependency
  constructor(@Inject('taskRepository') private taskRepository: TaskRepository) {}
  
  // This function takes a userId as a parameter and a partial task object, after returns the task created
  async run(userId: string, task: CreateTaskBody): Promise<Task> {

    // Call the repository method to create a task and get the all object already created
    return await this.taskRepository.createTask(userId, task);

  }
}