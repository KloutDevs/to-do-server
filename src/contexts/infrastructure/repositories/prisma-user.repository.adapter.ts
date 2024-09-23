import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/contexts/infrastructure/prisma/prisma.service';
import { UserRepository } from '@/contexts/domain/repositories/user.repository.port';
import {
  CreateUserDTO,
  User,
  UserWithoutIdAndCreatedAt,
} from '@/contexts/domain/models/user.entity';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private db: PrismaService) {}

  async create(user: CreateUserDTO, password: string): Promise<User> {
    user.password = password;
    return await this.db.user.create({
      data: user,
    });
  }
  async delete(id: string): Promise<User> {
    return await this.db.user.delete({
      where: { id },
    });
  }
  async findOneById(id: string): Promise<User | null> {
    const user = await this.db.user.findUnique({ where: { id } });
    return user ?? null;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.db.user.findUnique({ where: { email } });
    return user ?? null;
  }
  async getAllUsers(): Promise<User[]> {
    return await this.db.user.findMany({
      orderBy: { created_at: 'desc' },
    });
  }
  async update(
    id: string,
    updateUserDto: UserWithoutIdAndCreatedAt,
  ): Promise<User> {
    return await this.db.user.update({
      where: { id },
      data: updateUserDto,
    });
  }
}
