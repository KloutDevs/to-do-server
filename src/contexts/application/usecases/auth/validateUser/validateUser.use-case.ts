import { Inject, Injectable } from '@nestjs/common';
import { AuthServicePort } from '@/contexts/domain/services/auth.service.port';
import { validateUserBody } from '@/contexts/domain/models/auth.entity';
import { User } from '@/contexts/domain/models/user.entity';

@Injectable()
export class ValidateUserUseCase {
    
    constructor(@Inject('authService') private authService: AuthServicePort) {}

    async run(user: validateUserBody): Promise<User> {

        return this.authService.validateUser(user);

    }
}