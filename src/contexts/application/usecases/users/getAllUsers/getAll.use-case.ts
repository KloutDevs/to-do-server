import { User } from '@/contexts/domain/models/';
import { UserRepository } from '@/contexts/domain/repositories/';
import { Inject } from "@nestjs/common";

export class getAllUsersUseCase{

    // This constructor takes a UserRepository as a dependency
    constructor (@Inject('userRepository') private UserRepository: UserRepository){}

    // This method returns all users if the user is admin.
    async run(limit?: number, orderBy?: "desc" | "asc"):Promise<User[]>{

        // Get all users in the app.
        return await this.UserRepository.getAllUsers(
            limit,
            orderBy,
        );
    }
}