import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AccessToken } from './types/accessToken';

import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { RegisterRequestDto } from './dtos/registerRequest.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    console.log(`authService.validateUser EMAIL: ${email} PASSWORD ${password}`)
    const user = await this.userService.findOneByEmail(email);
    if(!user) {
        throw new BadRequestException('User not found.');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    console.log(`Is match: ${isMatch}`);
    if(!isMatch){
        throw new BadRequestException('Password does not match.')
    }
    return user;
  }

  async login(user: User): Promise<AccessToken> {
    const payload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(user: RegisterRequestDto): Promise<AccessToken>{
    const existingUser = await this.userService.findOneByEmail(user.email);
    if(existingUser) throw new BadRequestException('Email already exists.');
    const hashedPassword = await bcrypt.hash(user.password, 10);
    let newUser = await this.userService.create(user, hashedPassword);
    return this.login(newUser)
  }

}