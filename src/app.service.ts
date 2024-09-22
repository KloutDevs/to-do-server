import { Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import { User } from '@prisma/client';
import { UUID } from 'crypto';

@Injectable()
export class AppService {
  constructor(private userService: UserService) {}
  async getHello(email: string): Promise<string> {
    const user: User = await this.userService.findOneByEmail(email);
    return `Hello ${user.username}!`;
  }
}