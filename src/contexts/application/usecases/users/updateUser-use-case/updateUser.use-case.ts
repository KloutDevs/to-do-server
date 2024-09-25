import { User } from '@/contexts/domain/models/user.entity';
import { UserRepository } from '@/contexts/domain/repositories/user.repository.port';
import { Inject } from "@nestjs/common";

export class updateUserUseCase{
    constructor(@Inject('userRepository') private UserRepository: UserRepository){}
    async execute(userId: string, user: User): Promise<User>{
        const userUpdated = await this.UserRepository.update(userId, user);
        return userUpdated;
    }
}