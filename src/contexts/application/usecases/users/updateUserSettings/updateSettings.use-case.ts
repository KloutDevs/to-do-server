import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '@/contexts/domain/repositories';
import { UserSettings } from '@/contexts/domain/models';

@Injectable()
export class UpdateSettingsUseCase {

  // This constructor takes a UserRepository as a dependency
  constructor(@Inject('userRepository') private userRepository: UserRepository) {}

  // This method returns the user settings by email
  async run(userId: string, updateSettings: UserSettings): Promise<UserSettings> {

    // Get the user by ID

    await this.userRepository.updateUser(userId, {
      language_preference: updateSettings.language_preference,
      timezone: updateSettings.timezone,
    });

    // Return the updated user settings
    return {
      language_preference: updateSettings.language_preference,
      timezone: updateSettings.timezone,
    };

    
  }
}
