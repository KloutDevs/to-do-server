import { UserRepository } from '@/contexts/domain/repositories/';
import { User } from '@/contexts/domain/models/';
import { Inject } from '@nestjs/common';

export class getUserByIdUseCase{

    // This constructor takes a UserRepository as a dependency
    constructor (@Inject('userRepository') private UserRepository: UserRepository){}

    // This method returns a user by ID
    async run(userId: string): Promise<User>{

        // Get the user by ID using the UserRepository
        return await this.UserRepository.findUniqueById(userId);
    }
}