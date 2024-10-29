import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@/contexts/domain/repositories';
import { UserSettings } from '@/contexts/domain/models';

@Injectable()
export class GetSettingsUseCase {

  // This constructor takes a UserRepository as a dependency
  constructor(@Inject('userRepository') private userRepository: UserRepository) {}

  // This method returns the user settings by email
  async run(email: string): Promise<UserSettings> {

    // Get the user by email
    const user = await this.userRepository.findUniqueByEmail(email);

    // If the user is not found, throw a not found exception
    if (!user) throw new NotFoundException(`User with email ${email} not found`);

    // Return the user settings
    return {
      language_preference: user.language_preference,
      timezone: user.timezone,
    };
  }
}
