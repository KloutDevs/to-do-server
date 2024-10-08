import { Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '@/contexts/infrastructure/repositories/auth.repository.adapter';
import { User } from '@/contexts/domain/models/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('authRepository') private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    const validatedUser = await this.authService.validateUser({email, password});
    if (!validatedUser) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return validatedUser;
  }
}
