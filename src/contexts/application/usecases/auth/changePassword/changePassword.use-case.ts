import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '@/contexts/domain/repositories';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChangePasswordUseCase {
  // Inject the userRepository from the application module using the PrismaUserRepository
  constructor(
    @Inject('userRepository') private userRepository: UserRepository,
  ) {}

  /**
   * Changes the password of the user with the provided ID.
   *
   * @param userId - The ID of the user whose password is to be changed.
   * @param oldPassword - The current password of the user.
   * @param newPassword - The new password of the user.
   *
   * @returns A promise that resolves to a boolean value indicating whether the password was changed successfully, or rejects with a BadRequestException or NotFoundException if the password change fails.
   *
   * @throws BadRequestException - If the userId is not provided.
   *
   * @throws BadRequestException - If the oldPassword is not provided.
   *
   * @throws BadRequestException - If the newPassword is not provided.
   *
   * @throws BadRequestException - If the newPassword and the oldPassword are the same, as this would mean that the user is trying to change their password to the same thing.
   *
   * @throws NotFoundException - If the user with the provided ID is not found in the database.
   *
   * @throws BadRequestException - If the oldPassword provided does not match the hashed password in the database.
   *
   */
  async run(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean | BadRequestException | NotFoundException> {
    // Check if the user with the provided ID exists
    const user = await this.userRepository.findUniqueById(userId);
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Check if the oldPassword matches the hashed password in the database
    const isMatch: boolean = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new BadRequestException('Old password does not match.');

    // Hash the newPassword
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the user's password in the database and throw an error if it fails
    await this.userRepository
      .updateUser(userId, { password: hashedPassword })
      .catch((e) => {
        console.error(e);
        throw new BadRequestException('Password could not be changed.');
      });

    // Return true if the password was successfully changed
    return true;
  }
}
