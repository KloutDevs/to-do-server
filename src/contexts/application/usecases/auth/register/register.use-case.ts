import { Inject, Injectable } from '@nestjs/common';
import { AuthServicePort } from '@/contexts/domain/services';
import { AccessToken, RegisterRequestBody } from '@/contexts/domain/models/';

@Injectable()
export class RegisterUseCase {

    constructor(@Inject('authService') private authService: AuthServicePort) {}

    async run(user: RegisterRequestBody): Promise<AccessToken> {
        
        return this.authService.register(user);
    }
}