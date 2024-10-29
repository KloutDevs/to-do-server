import { Inject, Injectable } from '@nestjs/common';
import { User } from '@/contexts/domain/models/user.entity';
import { UserRepository } from '@/contexts/domain/repositories';

@Injectable()
export class AppService {
  constructor(@Inject('userRepository') private userService: UserRepository) {}
  async getHello(email: string): Promise<string> {
    const user: User = await this.userService.findUniqueByEmail(email);
    return `Hello ${user.username}!`;
  }
}