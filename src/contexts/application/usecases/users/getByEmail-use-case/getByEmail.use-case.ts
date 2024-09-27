import { User } from '@/contexts/domain/models/user.entity';
import { UserRepository } from '@/contexts/domain/repositories/user.repository.port';
import { Inject } from "@nestjs/common";

export class getUserByEmailUseCase{
    constructor (@Inject('userRepository') private UserRepository: UserRepository){}

    async execute(email: string): Promise<User>{
        const user = await this.UserRepository.findOneByEmail(email);
        return user;
    }
}