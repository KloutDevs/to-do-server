import {Injectable, Inject, BadRequestException} from '@nestjs/common';
import { AuthServicePort } from '@/contexts/domain/services';

@Injectable()
export class LogoutUseCase {

    constructor(@Inject('authService') private authService: AuthServicePort) {}

    async run(userId: string){

        return await this.authService.logout(userId);
    }
}