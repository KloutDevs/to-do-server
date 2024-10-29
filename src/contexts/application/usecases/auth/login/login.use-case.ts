import { Inject, Injectable } from '@nestjs/common';
import { AuthServicePort } from '@/contexts/domain/services/auth.service.port';
import { AccessToken, LoginRequestBody } from '@/contexts/domain/models/auth.entity';

@Injectable()
export class LoginUseCase {
    constructor(@Inject('authService') private authSerivce: AuthServicePort) {}

    async run(user: LoginRequestBody): Promise<AccessToken> {
        
        return this.authSerivce.login(user);
    }
}