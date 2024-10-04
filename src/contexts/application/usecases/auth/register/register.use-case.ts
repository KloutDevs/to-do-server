import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from '@/contexts/domain/repositories/auth.repository.port';
import { AccessToken, RegisterRequest, validateUser } from '@/contexts/domain/models/auth.entity';
import { User } from '@/contexts/domain/models/user.entity';

@Injectable()
export class RegisterUseCase {
    constructor(@Inject('authRepository') private authRepository: AuthRepository) {}

    async register(user: RegisterRequest): Promise<AccessToken> {
        return this.authRepository.register(user);
    }
}