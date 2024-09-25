import { User } from '@/contexts/domain/models/user.entity';
import { UserRepository } from '@/contexts/domain/repositories/user.repository.port';
import { Inject } from "@nestjs/common";

export class getAllUsersUseCase{
    constructor (@Inject('userRepository') private UserRepository: UserRepository){}
    async execute():Promise<User[]>{
        const users = await this.UserRepository.getAllUsers();
        return users
    }
}