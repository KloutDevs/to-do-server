import {
  Controller,
  Headers,
  Post,
  UseGuards,
  BadRequestException,
  Body,
  UsePipes,
  ValidationPipe,
  Query,
  Get,
  HttpStatus,
  HttpCode,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginValidationGuard } from '@/contexts/shared/guards';
import {
  LoginUseCase,
  RegisterUseCase,
  VerifyEmailUseCase,
  ResendEmailVerificationUseCase,
  LogoutUseCase,
  ChangePasswordUseCase,
  ResetPasswordUseCase,
} from '@/contexts/application/usecases/auth';
import { Public } from '@/contexts/shared/decorators';
import { API_VERSION } from '@/contexts/infrastructure/http-api/v1/route.constants';
import {
  ChangePasswordDto,
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  ResetPasswordConfirmDto,
  ResetPasswordRequestDto,
  VerifyEmailRequestDto,
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
    private changePasswordUseCase: ChangePasswordUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  @UseGuards(LoginValidationGuard, AuthGuard('local'))
  @Post('login')
  async login(
    @Body() loginBody: LoginRequestDto,
  ): Promise<LoginResponseDto | BadRequestException> {
    return this.loginUseCase.login(loginBody);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(
    @Body() registerBody: RegisterRequestDto,
  ): Promise<RegisterResponseDto | BadRequestException> {
    return this.registerUseCase.register(registerBody);
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Headers('authorization') token: string,
  ): Promise<{ message: string } | BadRequestException> {
    token = token.replace('Bearer ', '');
    return await this.logoutUseCase.execute(token);
  }

  @Post('verify-email')
  @UsePipes(new ValidationPipe())
  async verifyEmail(
    @Body() verifyEmailBody: VerifyEmailRequestDto,
  ): Promise<boolean | BadRequestException> {
    return this.verifyEmailUseCase.verifyEmail(verifyEmailBody);
  }

  @Get('verify-email')
  async confirmEmail(
    @Query('token') token: string,
  ): Promise<boolean | BadRequestException> {
    return this.verifyEmailUseCase.confirmVerification(token);
  }

  @Post('resend-email')
  async resendEmail(
    @Body() verifyEmailBody: VerifyEmailRequestDto,
  ): Promise<boolean | BadRequestException> {
    return this.resendEmailVerificationUseCase.resendEmailVerification(
      verifyEmailBody,
    );
  }
  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string } | BadRequestException> {
    const userId = req.user.id;
    const result = await this.changePasswordUseCase.execute(
      userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
    if (result === true) {
      return { message: 'Password changed successfully' };
    }
    throw new BadRequestException('Failed to change password');
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
  ): Promise<{ message: string } | BadRequestException> {
    const result = await this.resetPasswordUseCase.sendResetPasswordEmail(
      resetPasswordRequestDto.email,
      `${API_VERSION}/auth/reset-password/confirm`,
    );
    if (result === true) {
      return { message: 'Reset password email sent successfully' };
    }
    throw new BadRequestException('Failed to send reset password email');
  }

  @Post('reset-password/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmResetPassword(
    @Body() resetPasswordConfirmDto: ResetPasswordConfirmDto,
  ): Promise<{ message: string } | BadRequestException> {
    const result = await this.resetPasswordUseCase.confirmResetPassword(
      resetPasswordConfirmDto.token,
      resetPasswordConfirmDto.newPassword,
    );
    if (result === true) {
      return { message: 'Password reset successfully' };
    }
    throw new BadRequestException('Failed to reset password');
  }
}
