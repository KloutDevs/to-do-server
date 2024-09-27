import { User } from "@/contexts/domain/models/user.entity";
import { UserRepository } from "@/contexts/domain/repositories/user.repository.port";
import { Inject } from "@nestjs/common";

export class getUserByUsernameUseCase {
    constructor(@Inject('userRepository') private UserRepository: UserRepository) {}

    async execute(username: string): Promise<User> {
        const user = await this.UserRepository.findOneByUsername(username);
        return user;
    }
}