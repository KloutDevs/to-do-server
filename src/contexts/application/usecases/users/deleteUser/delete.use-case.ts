import { UserRepository } from '@/contexts/domain/repositories/';
import { Inject } from '@nestjs/common';

export class deleteUserUseCase{

    // This constructor takes a UserRepository as a dependency
    constructor(@Inject('userRepository') private UserRepository:UserRepository){}

    // This method delete a user by ID.
    async run(userId: string): Promise<{message: string}>{

        // Delete the user by ID using the UserRepository
        await this.UserRepository.deleteUser(userId);

        // Return a message that the user was deleted successfully
        return {message: 'User deleted successfully'};
    }
}