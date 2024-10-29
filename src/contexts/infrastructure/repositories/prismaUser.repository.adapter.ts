import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { AlreadyExistsException } from '@/contexts/shared/lib/errors';

import { PrismaService } from '@/contexts/shared/prisma/prisma.service';

import { UserRepository } from '@/contexts/domain/repositories/';

import {
  CreateUserDTO,
  User,
  UserProfile,
  UserSettings,
  UserWithoutIdAndCreatedAt,
  verificationToken,
} from '@/contexts/domain/models/user.entity';

/**
 *  Class that implements the UserRepository interface using Prisma ORM.
 *  This class is responsible for interacting with the database and performing CRUD operations on the User entity.
 */
@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private db: PrismaService) {}

  async createNewUser(userBody: CreateUserDTO, passwordHashed: string): Promise<User> {

    // Check if the userBody is provided
    if(!userBody) throw new BadRequestException('User Body is required');

    // Check if the passwordHashed is provided
    if(!passwordHashed) throw new BadRequestException('Password is required');

    // Check if the email already exists
    const existingEmail = await this.db.user.findUnique({ where: { email: userBody.email } });
    if(existingEmail) throw new AlreadyExistsException('Email already exists.');

    // Check if the username already exists
    const existingUsername = await this.db.user.findUnique({ where: { username: userBody.username } });
    if(existingUsername) throw new AlreadyExistsException('Username already exists.');

    // Create a new user with the provided userBody and passwordHashed
    return this.db.user.create({
      data: { ...userBody, password: passwordHashed },
    });

  }

  async deleteUser(userId: string): Promise<void> {

    // Check if the userId is provided
    if(!userId) throw new BadRequestException('User ID is required');
    
    // Find the user by the provided userId, and throw an error if it doesn't exist
    const deleteUser = await this.db.user.findUnique({ where: { id: userId } });
    if (!deleteUser) throw new NotFoundException(`User with ID ${userId} not found.`);

    // Delete the user from the database if no errors were thrown
    this.db.user.delete({
      where: { id: userId },
    });
    
  }

  async findUniqueById(userId: string): Promise<User> {

    // Check if the userId is provided
    if(!userId) throw new BadRequestException('User ID is required');

    // Find the user by the provided userId, and throw an error if it doesn't exist
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    return user;
  }

  async findUniqueByEmail(email: string): Promise<User | null> {

    // Check if the email is provided
    if(!email) throw new BadRequestException('Email is required');

    // Find the user by the provided email, and throw an error if it doesn't exist
    const user = await this.db.user.findUnique({ where: { email: email } });
    if (!user) throw new NotFoundException(`User with email ${email} not found`);

    return user;
  }

  async findUniqueByUsername(username: string): Promise<User | null> {

    // Check if the username is provided
    if (!username) throw new BadRequestException('Username is required');

    const user = await this.db.user.findUnique({ where: { username: username } });
    if (!user) throw new NotFoundException(`User with username ${username} not found`);

    return user;
  }

  async getPublicProfile(userId: string): Promise<UserProfile> {

    // Check if the userId is provided
    if(!userId) throw new BadRequestException('User ID is required');

    // Find the user by the provided userId, and throw an error if it doesn't exist
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Return the public profile of the user
    return {
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      profile_picture_url: user.profile_picture_url,
      banner_picture_url: user.banner_picture_url,
      name: user.name,
    };
  }

  async getUserSettings(userId: string): Promise<UserSettings> {
    
    // Check if the userId is provided
    if(!userId) throw new BadRequestException('User ID is required');

    // Find the user by the provided userId, and throw an error if it doesn't exist
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Return the user settings
    return {
      language_preference: user.language_preference,
      timezone: user.timezone,
    }

  }

  async getAllUsers(limit?: number, orderBy?: 'desc' | 'asc'): Promise<User[]> {

    // Return all users in descending order by default or the order and limit specified
    return this.db.user.findMany({
      orderBy: { created_at: (orderBy) ?? 'desc' },
      take: limit,
    });

  }

  async updateUser(
    userId: string,
    userBody: Partial<UserWithoutIdAndCreatedAt>,
  ): Promise<User> {
    
    // Check if the userId is provided
    if(!userId) throw new BadRequestException('User ID is required');

    // Check if the userBody is provided
    if(!userBody) throw new BadRequestException('User body is required');

    // Find the user by the provided userId, and throw an error if it doesn't exist
    const updateUser = await this.db.user.findUnique({ where: { id: userId } });
    if (!updateUser) throw new NotFoundException(`User with ID ${userId} not found`);

    // Update the user in the database with the provided userBody
    return await this.db.user.update({
      where: { id: userId },
      data: userBody,
    });
  }

  async setVerificationToken(
    userId: string,
    token: string,
  ): Promise<verificationToken> {

    // Check if the userId is provided
    if(!userId) throw new BadRequestException('User ID is required');

    // Check if the token is provided
    if(!token) throw new BadRequestException('Token is required');

    // Create a new verification token for the user with the provided userId and token
    const updateToken = await this.db.verificationToken.create({
      data: {
        identifier: userId,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days expiration
      },
    });

    return updateToken;
  }

  async findByVerificationToken(token: string): Promise<verificationToken> {

    // Check if the token is provided
    if(!token) throw new BadRequestException('Token is required');

    // Find the verification token by the provided token, and throw an error if it doesn't exist
    const verificationToken = await this.db.verificationToken.findUnique({ where: { token }});
    if(!verificationToken) throw new NotFoundException('Verification token not found');

    return verificationToken;
  }

  async getTokensByIdentifier(userId: string): Promise<verificationToken[]> {

    // Check if the userId is provided
    if(!userId) throw new BadRequestException('User ID is required');

    // Find the verification tokens by the provided userId, and throw an error if it doesn't exist
    const tokens = await this.db.verificationToken.findMany({ where: { identifier: userId } });
    if(!tokens) throw new NotFoundException('Verification tokens not found');

    return tokens;
  }

  async deleteExpiredVerificationTokens(userId: string): Promise<boolean> {

    // Check if the userId is provided
    if(!userId) throw new BadRequestException('User ID is required');

    // Delete the verification tokens by the provided userId, and return true if any were deleted
    const deletedTokens = await this.db.verificationToken.deleteMany({
      where: { identifier: userId },
    });
    if (deletedTokens.count === 0) return false;
    return true;
  }
}
