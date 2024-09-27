import { Inject } from '@nestjs/common';
import { UserRepository } from '@/contexts/domain/repositories/user.repository.port';
import { User } from '@/contexts/domain/models/user.entity';

export class deleteUserUseCase{
    constructor(@Inject('userRepository') private UserRepository:UserRepository){}
    async execute(userId: string): Promise<User>{
        const user = await this.UserRepository.delete(userId);
        return user;
    }
}