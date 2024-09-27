import { AccessToken, RegisterRequest, validateUser } from '@/contexts/domain/models/auth.entity';
import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@/contexts/domain/models/user.entity';
import { AuthRepository } from '@/contexts/domain/repositories/auth.repository.port';
import { PrismaUserRepository } from '@/contexts/infrastructure/repositories/prisma-user.repository.adapter';

@Injectable()
export class AuthService implements AuthRepository {
  constructor(
    @Inject('userRepository') private userService: PrismaUserRepository,
    private jwtService: JwtService
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
  async register(user: RegisterRequest): Promise<AccessToken>{
    const existingEmail = await this.userService.findOneByEmail(user.email);
    if(existingEmail) throw new BadRequestException('Email already exists.');
    const existingUsername = await this.userService.findOneByUsername(user.username);
    if(existingUsername) throw new BadRequestException('Username already exists.');
    const hashedPassword = await bcrypt.hash(user.password, 10);
    let newUser = await this.userService.create(user, hashedPassword);
    return this.login(newUser)
  }

}