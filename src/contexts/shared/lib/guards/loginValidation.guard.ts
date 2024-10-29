import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { LoginRequestDto } from '@/contexts/infrastructure/http-api/v1/auth/dtos';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class LoginValidationGuard implements CanActivate {

  // This method is called before the controller method is executed.
  // It checks if the request body is valid according to the LoginRequestDto schema.
  async canActivate(context: ExecutionContext): Promise<boolean> {

    // Get the request from the context
    const request = context.switchToHttp().getRequest();

    // Get the loginDto from the request body and plain to class
    const loginDto = plainToClass(LoginRequestDto, request.body);

    // Validate the loginDto
    const errors = await validate(loginDto);

    // If there are errors, throw a bad request exception with the errors
    if (errors.length > 0) {

      // Get the error messages from the errors
      const messages = errors.map(error => Object.values(error.constraints)).flat();
      
      // Throw a bad request exception with the error messages
      throw new BadRequestException(messages);

    }

    // If no errors, return true
    return true;
  }
}