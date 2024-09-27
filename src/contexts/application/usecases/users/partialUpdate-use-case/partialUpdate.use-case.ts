import { Inject, Injectable } from "@nestjs/common";
import { UserRepository } from "@/contexts/domain/repositories/user.repository.port";
import { User } from "@/contexts/domain/models/user.entity";

@Injectable()
export class PartialUpdateUseCase {
    constructor (@Inject('userRepository') private UserRepository: UserRepository){}
    async execute(userId: string, user: Partial<User>): Promise<User>{
        return await this.UserRepository.partialUpdate(userId, user);
    }
}