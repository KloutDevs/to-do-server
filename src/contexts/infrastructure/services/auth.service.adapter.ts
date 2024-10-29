import { User, AccessToken, RegisterRequestBody, validateUserBody } from '@/contexts/domain/models/';

import { BadRequestException, Injectable, Inject, NotFoundException} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { AuthServicePort } from '@/contexts/domain/services';

import { RedisBlacklistUseCase } from '@/contexts/application/usecases/auth';

import { UserRepository } from '@/contexts/domain/repositories';

@Injectable()
export class AuthService implements AuthServicePort {
  constructor(
    @Inject('userRepository') private userRepository: UserRepository,
    private jwtService: JwtService,
    private redisBlacklistService: RedisBlacklistUseCase,
  ) {}

  async validateUser(userBody: validateUserBody): Promise<User> {

    // Check if the userBody is provided
    if(!userBody) throw new BadRequestException('User Body is required');

    // Find the user by the provided email, and throw an error if it doesn't exist
    const user = await this.userRepository.findUniqueByEmail(userBody.email);
    if(!user) throw new NotFoundException(`User with email ${userBody.email} not found.`);

    // Check if the password matches the hashed password
    const isMatch: boolean = bcrypt.compareSync(userBody.password, user.password);
    if(!isMatch) throw new BadRequestException('Password does not match.')

    return user;
  }

  async login(user: User): Promise<AccessToken> {

    // Check if the user is provided
    if(!user) throw new BadRequestException('User is required');

    // Create a payload object with the user's email and the user's ID
    const payload = { email: user.email, sub: user.id };

    // Generate a random access token and return it
    return { access_token: this.jwtService.sign(payload) };
  }

  async logout(token: string): Promise<{message: string}> {

    // Check if the token is provided
    if(!token) throw new BadRequestException('Token is required');

    // Decode the token and get the expiration time
    const decodedToken = this.jwtService.decode(token);

    // Calculate the expiration time
    const expirationTime = decodedToken.exp - Math.floor(Date.now() / 1000);

    // Add the token to the blacklist and return a success message
    await this.redisBlacklistService.addToBlacklist(token, expirationTime);
    return { message: 'Successfully logged out' };
  }

  async register(userToRegister: RegisterRequestBody): Promise<AccessToken>{

    // Check if the userToRegister is provided
    if(!userToRegister) throw new BadRequestException('User body to register is required');

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(userToRegister.password, 12);

    // Create a new user with the hashed password
    const user = await this.userRepository.createNewUser(userToRegister, hashedPassword);

    // Login the user and return the access token
    return this.login(user);
  }

  async changePassword(userId: string, lastPassword: string, newPassword: string): Promise<Boolean> {

      // Check if the userId is provided
      if(!userId) throw new BadRequestException('User id is required.');

      // Check if the lastPassword is provided
      if(!lastPassword) throw new BadRequestException('Last password is required.');

      // Check if the newPassword is provided
      if(!newPassword) throw new BadRequestException('New password is required.');

      // Check if the newPassword and the lastPassword are the same, throw an error if they are
      if(lastPassword === newPassword) throw new BadRequestException('New password cannot be the same as the old password.');

      // Check if the user exists
      const user = await this.userRepository.findUniqueById(userId);
      if(!user) throw new NotFoundException(`User with id ${userId} not found.`);

      // Check if the last password provided and the hashed password match
      const isMatch: boolean = await bcrypt.compare(lastPassword, user.password);
      if(!isMatch) throw new BadRequestException('Password does not match.');

      // Hash the new password
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = newHashedPassword;

      // Update the user with the new password already hashed
      await this.userRepository.updateUser(userId, user);

      // Return true to indicate that the password was changed successfully
      return true;
  }

  async resetPassword(userId: string, newPassword: string): Promise<Boolean> {

    // Check if the userId is provided
    if(!userId) throw new BadRequestException('User id is required.');

    // Check if the newPassword is provided
    if(!newPassword) throw new BadRequestException('New password is required.');

    // Check if the user exists
    const user = await this.userRepository.findUniqueById(userId);
    if(!user) throw new NotFoundException(`User with id ${userId} not found.`);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Update the user with the new password already hashed
    await this.userRepository.updateUser(userId, user);

    // Return true to indicate that the password was changed successfully
    return true;
  }

}