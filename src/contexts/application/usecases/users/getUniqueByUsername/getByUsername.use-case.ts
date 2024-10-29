import { UserRepository } from "@/contexts/domain/repositories/";
import { User } from "@/contexts/domain/models/";
import { Inject } from "@nestjs/common";

export class getUserByUsernameUseCase {

    // This constructor takes a UserRepository as a dependency
    constructor(@Inject('userRepository') private UserRepository: UserRepository) {}

    // This method returns a user by username
    async run(username: string): Promise<User> {

        // Get the user by username using the UserRepository
        return await this.UserRepository.findUniqueByUsername(username);
    }
}