import { Controller, Request, Post, UseGuards, BadRequestException, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUseCase } from '@/contexts/application/usecases/auth/auth.use-case';
import { LoginResponseDto } from './dtos/loginResponse.dto';
import { RegisterRequestDto } from './dtos/registerRequest.dto';
import { RegisterResponseDto } from './dtos/registerResponse.dto';
import { Public } from '@/contexts/shared/decorators';
import { API_VERSION } from '@/contexts/infrastructure/http-api/v1/route.constants';

@Public()
@Controller(`${API_VERSION}/auth`)
export class AuthController {
  constructor(private authUseCase: AuthUseCase) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @UsePipes(new ValidationPipe({transform: true}))
  async login(@Request() req): Promise<LoginResponseDto | BadRequestException> {
    return this.authUseCase.login(req.user);
  }
  
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() registerBody: RegisterRequestDto): Promise<RegisterResponseDto | BadRequestException> {
    return this.authUseCase.register(registerBody);
  }
}