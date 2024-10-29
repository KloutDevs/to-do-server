import { Inject, Injectable } from '@nestjs/common';
import { TaskRepository } from '@/contexts/domain/repositories/task.repository.port';

@Injectable()
export class DeleteTaskUseCase {

  // This constructor takes a taskRepository as a dependency
  constructor(@Inject('taskRepository') private taskRepository: TaskRepository) {}
  
  // This function takes a taksId as a parameter and returns a successfully message
  async run(taskId: string): Promise<{message: string}> {

    // Call the repository method to delete a task
    await this.taskRepository.deleteTask(taskId);

    // Return a successfully message
    return {message: "Successfully Deleted Task"}

  }
}