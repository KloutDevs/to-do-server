import {
  Controller,
  Headers,
  Post,
  UseGuards,
  Body,
  UsePipes,
  ValidationPipe,
  Query,
  Get,
  HttpStatus,
  HttpCode,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as AuthUseCases from '@/contexts/application/usecases/auth';
import { Public } from '@/contexts/shared/lib/decorators';
import { API_VERSION } from '@/contexts/infrastructure/http-api/v1/route.constants';
import * as AuthDtos from './dtos';
import { JwtAuthGuard } from '@/contexts/shared/lib/guards';

@Public()
@Controller(`${API_VERSION}/auth`)
export class AuthController {
  constructor(
    private readonly loginUseCase: AuthUseCases.LoginUseCase,
    private readonly registerUseCase: AuthUseCases.RegisterUseCase,
    private readonly verifyEmailUseCase: AuthUseCases.VerifyEmailUseCase,
    private readonly resendEmailVerificationUseCase: AuthUseCases.ResendEmailVerificationUseCase,
    private readonly logoutUseCase: AuthUseCases.LogoutUseCase,
    private readonly changePasswordUseCase: AuthUseCases.ChangePasswordUseCase,
    private readonly resetPasswordUseCase: AuthUseCases.ResetPasswordUseCase,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginBody: AuthDtos.LoginRequestDto,
  ): Promise<AuthDtos.LoginResponseDto> {
    return await this.loginUseCase.run(loginBody);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerBody: AuthDtos.RegisterRequestDto,
  ): Promise<AuthDtos.RegisterResponseDto> {
    return await this.registerUseCase.run(registerBody);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Headers('authorization') token: string,
  ): Promise<{ message: string }> {
    token = token.replace('Bearer ', '');
    await this.logoutUseCase.run(token);
    return { message: 'Successfully Logged Out' };
  }

  @Post('verify-email')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Body() verifyEmailBody: AuthDtos.VerifyEmailRequestDto,
  ): Promise<{ message: string }> {
    await this.verifyEmailUseCase.verifyEmail(verifyEmailBody);
    return { message: 'Verification email sent successfully' };
  }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  async confirmEmail(
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    await this.verifyEmailUseCase.confirmVerification(token);
    return { message: 'Email successfully verified' };
  }

  @Post('resend-email')
  @HttpCode(HttpStatus.OK)
  async resendEmail(
    @Body() verifyEmailBody: AuthDtos.VerifyEmailRequestDto,
  ): Promise<{ message: string }> {
    await this.resendEmailVerificationUseCase.resendEmailVerification(
      verifyEmailBody,
    );
    return { message: 'Verification email successfully re-sent' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: AuthDtos.ChangePasswordDto,
  ): Promise<{ message: string }> {
    const userId = req.user.id;
    await this.changePasswordUseCase.run(
      userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
    return { message: 'Password changed successfully' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordRequestDto: AuthDtos.ResetPasswordRequestDto,
  ): Promise<{ message: string }> {
    await this.resetPasswordUseCase.sendResetPasswordEmail(
      resetPasswordRequestDto.email,
      `${API_VERSION}/auth/reset-password/confirm`,
    );
    return {
      message: 'Password reset email sent successfully',
    };
  }

  @Post('reset-password/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmResetPassword(
    @Body() resetPasswordConfirmDto: AuthDtos.ResetPasswordConfirmDto,
  ): Promise<{ message: string }> {
    await this.resetPasswordUseCase.confirmResetPassword(
      resetPasswordConfirmDto.token,
      resetPasswordConfirmDto.newPassword,
    );
    return { message: 'Password reset successfully' };
  }
}
