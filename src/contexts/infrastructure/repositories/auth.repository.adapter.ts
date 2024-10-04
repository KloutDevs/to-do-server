import { AccessToken, RegisterRequest, validateUser } from '@/contexts/domain/models/auth.entity';
import { BadRequestException, Injectable, Inject} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@/contexts/domain/models/user.entity';
import { AuthRepository } from '@/contexts/domain/repositories/auth.repository.port';
import { PrismaUserRepository } from '@/contexts/infrastructure/repositories/prisma-user.repository.adapter';
import { RedisBlacklistUseCase } from '@/contexts/application/usecases/auth';

@Injectable()
export class AuthService implements AuthRepository {
  constructor(
    @Inject('userRepository') private userService: PrismaUserRepository,
    private jwtService: JwtService,
    private redisBlacklistService: RedisBlacklistUseCase,
  ) {}

  async validateUser(user: validateUser): Promise<User> {
    const searchUser = await this.userService.findOneByEmail(user.email);
    if(!searchUser) {
        throw new BadRequestException('User not found.');
    }
    const isMatch: boolean = bcrypt.compareSync(user.password, searchUser.password);
    if(!isMatch){
        throw new BadRequestException('Password does not match.')
    }
    return searchUser;
  }

  async login(user: User): Promise<AccessToken> {
    const payload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async logout(token: string): Promise<{message: string}> {
    console.log(`This is the token: ${token}`);
    const decodedToken = this.jwtService.decode(token);
    console.log('This is the decodedToken')
    console.log(decodedToken);
    const expirationTime = decodedToken.exp - Math.floor(Date.now() / 1000);
    await this.redisBlacklistService.addToBlacklist(token, expirationTime);
    return { message: 'Successfully logged out' };
  }

  async register(user: RegisterRequest): Promise<AccessToken>{
    const existingEmail = await this.userService.findOneByEmail(user.email);
    if(existingEmail) throw new BadRequestException('Email already exists.');
    const existingUsername = await this.userService.findOneByUsername(user.username);
    if(existingUsername) throw new BadRequestException('Username already exists.');
    const hashedPassword = await bcrypt.hash(user.password, 10);
    let newUser = await this.userService.create(user, hashedPassword);
    return this.login(newUser)
  }

  async verifyEmail(userId: string): Promise<Boolean> {
    return false;
  }

  async resendVerificationEmail(userId: string): Promise<Boolean> {
    return false;
  }

  async resetPassword(userId: string): Promise<Boolean> {
    return false;
  }

  async resetPasswordConfirm(userId: string, newPassword: string): Promise<Boolean> {
    return false;
  }

  async changePassword(userId: string, lastPassword: string, newPassword: string): Promise<Boolean> {
      const user = await this.userService.findOneById(userId);
      if(!user) throw new BadRequestException('User not found.');
      if(user.password !== lastPassword) throw new BadRequestException('Password does not match.');
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await this.userService.partialUpdate(userId, user);
      return true;
  }

  async refreshToken(token: AccessToken): Promise<AccessToken> {
    return token;
  }

  async getGitHubProvider(): Promise<void> {
    return;
  }

  async getGoogleProvider(): Promise<void> {
    return;
  }

  async revokeRefreshToken(token: AccessToken): Promise<Boolean> {
    return false;
  }

  async enable2FA(userId: string): Promise<Boolean> {
    return false;
  }

  async verify2FA(userId: string): Promise<Boolean> {
    return false;
  }

  async linkDevice(userId: string): Promise<Boolean> {
    return false;
  }

}