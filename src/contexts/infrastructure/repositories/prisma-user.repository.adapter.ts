import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/contexts/infrastructure/prisma/prisma.service';
import { UserRepository } from '@/contexts/domain/repositories/user.repository.port';
import {
  CreateUserDTO,
  User,
  UserWithoutIdAndCreatedAt,
  verificationToken,
} from '@/contexts/domain/models/user.entity';
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

  async publicProfile(id: string): Promise<User> {
    return this.db.user.findUnique({ where: { id } });
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

  async setVerificationToken(id: string, token: string): Promise<verificationToken> {
    const updateToken = await this.db.verificationToken.create({
      data: {
        identifier: id,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      },
    });
    return updateToken;
  }

  async findByVerificationToken(token: string): Promise<verificationToken> {
    return this.db.verificationToken.findUnique({
      where: { token },
    });
  }

  async getTokensByIdentifier(id: string): Promise<verificationToken[]> {
    return this.db.verificationToken.findMany({
      where: { identifier: id },
    });
  }

  async deleteExpiredToken(id: string): Promise<boolean> {
    const deletedTokens = await this.db.verificationToken.deleteMany({
      where: { identifier: id },
    });
    if (deletedTokens.count === 0) return false;
    return true;
  }

}