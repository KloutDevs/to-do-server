import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@/contexts/domain/repositories';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject('userRepository') private userRepository: UserRepository,
  ) {}

  async execute(userId: string, oldPassword: string, newPassword: string): Promise<boolean | BadRequestException | NotFoundException> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const isMatch: boolean = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password does not match.');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.partialUpdate(userId, { password: hashedPassword }).then(async () => {
      return true;
    }).catch(e => {
      console.error(e);
      throw new BadRequestException('Password could not be changed.');
    });
    return false;
  }
}