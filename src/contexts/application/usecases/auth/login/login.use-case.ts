import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from '@/contexts/domain/repositories/auth.repository.port';
import { AccessToken, LoginRequest } from '@/contexts/domain/models/auth.entity';

@Injectable()
export class LoginUseCase {
    constructor(@Inject('authRepository') private authRepository: AuthRepository) {}

    async login(user: LoginRequest): Promise<AccessToken> {
        return this.authRepository.login(user);
    }
}