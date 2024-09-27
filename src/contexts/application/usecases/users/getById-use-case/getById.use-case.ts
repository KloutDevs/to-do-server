import { UserRepository } from '@/contexts/domain/repositories/user.repository.port';
import { Inject } from '@nestjs/common';
import { User } from '@/contexts/domain/models/user.entity';

export class getUserByIdUseCase{
    constructor (@Inject('userRepository') private UserRepository: UserRepository){}
    async execute(userId: string): Promise<User>{
        const user = await this.UserRepository.findOneById(userId);
        return user;
    }
}