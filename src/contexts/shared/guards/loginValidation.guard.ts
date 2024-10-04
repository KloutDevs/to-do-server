import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { LoginRequestDto } from '@/contexts/infrastructure/http-api/v1/auth/dtos';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class LoginValidationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const loginDto = plainToClass(LoginRequestDto, request.body);
    const errors = await validate(loginDto);
    console.log(errors);
    if (errors.length > 0) {
      const messages = errors.map(error => Object.values(error.constraints)).flat();
      throw new BadRequestException(messages);
    }

    return true;
  }
}