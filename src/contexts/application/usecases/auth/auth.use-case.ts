import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from '@/contexts/domain/repositories/auth.repository.port';
import { AccessToken, RegisterRequest, validateUser } from '@/contexts/domain/models/auth.entity';
import { User } from '@/contexts/domain/models/user.entity';

@Injectable()
export class AuthUseCase {
  constructor(@Inject('authRepository') private authRepository: AuthRepository) {}

  async validateUser(user: validateUser): Promise<User> {
    return this.authRepository.validateUser(user);
  }

  async login(user: User): Promise<AccessToken> {
    return this.authRepository.login(user);
  }

  async register(user: RegisterRequest): Promise<AccessToken> {
    return this.authRepository.register(user);
  }
}