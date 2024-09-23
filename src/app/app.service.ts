import { Inject, Injectable } from '@nestjs/common';
import { User } from '@/contexts/domain/models/user.entity';
import { PrismaUserRepository } from '@/contexts/infrastructure/repositories/prisma-user.repository.adapter';

@Injectable()
export class AppService {
  constructor(@Inject('userRepository') private userService: PrismaUserRepository) {}
  async getHello(email: string): Promise<string> {
    const user: User = await this.userService.findOneByEmail(email);
    return `Hello ${user.username}!`;
  }
}