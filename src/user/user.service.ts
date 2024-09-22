import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from '@prisma/client';
import { UUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(private db: PrismaService) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.db.user.findFirst({
      where: {email}
    })
  }

  async findOneById(id: UUID): Promise<User | null>{
    return await this.db.user.findFirst({
      where: {id}
    })
  }

  async create(user: CreateUserDto, password: string):Promise<User> {
    return await this.db.user.create({
      data: {
        username: user.username,
        email: user.email,
        password_hash: password,
        language_preference: user.language_preference,
        timezone: user.timezone,
      },
    });
  }

  async update(id: UUID, updateUserDto: UpdateUserDto):Promise<User> {
    return await this.db.user.update({
      where: {id},
      data: updateUserDto
    });

  }

  async delete(id: UUID):Promise<{id: string}>{
    return await this.db.user.delete({
      where: {id},
      select: {id: true}
    })
  }

  async getUser(id: UUID):Promise<User> {
    return await this.db.user.findFirst({ where: { id } });
  }

  async getAllUsers():Promise<User[]> {
    return await this.db.user.findMany({
      orderBy: { created_at: 'desc' },
    });
  }
}
