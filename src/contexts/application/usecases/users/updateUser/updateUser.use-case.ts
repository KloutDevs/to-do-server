import { Inject, Injectable } from "@nestjs/common";
import { UserRepository } from "@/contexts/domain/repositories/user.repository.port";
import { User } from "@/contexts/domain/models/user.entity";

@Injectable()
export class UpdateUserUseCase {

    // This constructor takes a UserRepository as a dependency
    constructor (@Inject('userRepository') private UserRepository: UserRepository){}

    // This method updates a user by ID.
    async run(userId: string, user: Partial<User>): Promise<User>{

        // Update the user by ID using the UserRepository
        return await this.UserRepository.updateUser(userId, user);
    }
}