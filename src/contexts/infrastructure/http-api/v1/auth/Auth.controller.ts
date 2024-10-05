import { Controller, Headers, Post, UseGuards, BadRequestException, Body, UsePipes, ValidationPipe, Query, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { 
  LoginValidationGuard
 } from '@/contexts/shared/guards';
import { 
  LoginUseCase, 
  RegisterUseCase, 
  VerifyEmailUseCase, 
  ResendEmailVerificationUseCase,
  LogoutUseCase
} from '@/contexts/application/usecases/auth';
import { Public } from '@/contexts/shared/decorators';
import { API_VERSION } from '@/contexts/infrastructure/http-api/v1/route.constants';
import { 
  LoginRequestDto, 
  LoginResponseDto, 
  RegisterRequestDto, 
  RegisterResponseDto, 
  VerifyEmailRequestDto
} from '@/contexts/infrastructure/http-api/v1/auth/dtos';

@Public()
@Controller(`${API_VERSION}/auth`)
export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private registerUseCase: RegisterUseCase,
    private verifyEmailUseCase: VerifyEmailUseCase,
    private resendEmailVerificationUseCase: ResendEmailVerificationUseCase,
    private logoutUseCase: LogoutUseCase,
  ) {}

  @UseGuards(LoginValidationGuard, AuthGuard('local'))
  @Post('login')
  async login(@Body() loginBody: LoginRequestDto): Promise<LoginResponseDto | BadRequestException> {
    return this.loginUseCase.login(loginBody);
  }
  
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() registerBody: RegisterRequestDto): Promise<RegisterResponseDto | BadRequestException> {
    return this.registerUseCase.register(registerBody);
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Headers('authorization') token: string): Promise<{message: string} | BadRequestException> {
    token = token.replace('Bearer ', '');
    return await this.logoutUseCase.execute(token);
  }

  @Post('verify-email')
  @UsePipes(new ValidationPipe())
  async verifyEmail(@Body() verifyEmailBody: VerifyEmailRequestDto): Promise<boolean | BadRequestException> {
    return this.verifyEmailUseCase.verifyEmail(verifyEmailBody);
  }

  @Get('verify-email')
  async confirmEmail(@Query('token') token: string): Promise<boolean | BadRequestException> {
    return this.verifyEmailUseCase.confirmVerification(token);
  }

  @Post('resend-email')
  async resendEmail(@Body() verifyEmailBody: VerifyEmailRequestDto): Promise<boolean | BadRequestException> {
    return this.resendEmailVerificationUseCase.resendEmailVerification(verifyEmailBody);
  }

}