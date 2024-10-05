import {Injectable, Inject, BadRequestException} from '@nestjs/common';
import { AuthRepository } from '@/contexts/domain/repositories';

@Injectable()
export class LogoutUseCase {
    constructor(@Inject('authRepository') private authRepository:AuthRepository){}
    async execute(userId: string){
        return await this.authRepository.logout(userId);
    }
}