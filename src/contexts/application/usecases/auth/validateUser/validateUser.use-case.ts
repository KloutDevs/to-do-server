import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from '@/contexts/domain/repositories/auth.repository.port';
import { validateUser } from '@/contexts/domain/models/auth.entity';
import { User } from '@/contexts/domain/models/user.entity';

@Injectable()
export class ValidateUserUseCase {
    constructor(@Inject('authRepository') private authRepository: AuthRepository) {}

    async validateUser(user: validateUser): Promise<User> {
        return this.authRepository.validateUser(user);
    }
}