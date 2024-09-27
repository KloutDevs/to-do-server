import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/contexts/infrastructure/prisma/prisma.service';
import { UserRepository } from '@/contexts/domain/repositories/user.repository.port';
import {
  CreateUserDTO,
  User,
  UserWithoutIdAndCreatedAt,
} from '@/contexts/domain/models/user.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private db: PrismaService) {}

  async create(user: CreateUserDTO, password: string): Promise<User> {
    return this.db.user.create({
      data: { ...user, password },
    });
  }

  async delete(id: string): Promise<User> {
    const deleteUser = await this.db.user.findUnique({ where: { id } });
    if(!deleteUser) throw new NotFoundException(`User with ID ${id} not found`);
    return this.db.user.delete({
      where: { id },
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { email } });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { username } });
  }

  async getAllUsers(): Promise<User[]> {
    return this.db.user.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async partialUpdate(
    id: string,
    partialUser: Partial<UserWithoutIdAndCreatedAt>
  ): Promise<User> {
    const updateUser = await this.db.user.findUnique({ where: { id } });
    if (!updateUser) throw new NotFoundException(`User with ID ${id} not found`);
    return await this.db.user.update({
      where: { id },
      data: partialUser,
    });
  }
}