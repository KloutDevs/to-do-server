import { Controller, Request, Post, UseGuards, BadRequestException, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dtos/loginResponse.dto';
import { RegisterRequestDto } from './dtos/registerRequest.dto';
import { RegisterResponseDto } from './dtos/registerResponse.dto';
import { Public } from './decorator/public.decorator';

@Public() /* All routes in /auth are public */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local')) /* Use the local Strategy */
  @Post('login')
  @UsePipes(new ValidationPipe({transform: true}))
  async login(@Request() req): Promise<LoginResponseDto | BadRequestException> {
    return this.authService.login(req.user);
  }
  
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() registerBody:RegisterRequestDto): Promise<RegisterResponseDto | BadRequestException>{
    return await this.authService.register(registerBody);
  }

}
