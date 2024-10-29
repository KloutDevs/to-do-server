import { User } from '@/contexts/domain/models/user.entity';
import { UserRepository } from '@/contexts/domain/repositories/user.repository.port';
import { Inject } from "@nestjs/common";

export class getUserByEmailUseCase{

    // This constructor takes a UserRepository as a dependency
    constructor (@Inject('userRepository') private UserRepository: UserRepository){}

    // This method returns a user by email
    async run(email: string): Promise<User>{

        // Get the user by email using the UserRepository
        return await this.UserRepository.findUniqueByEmail(email);
    }
}