import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '@/contexts/domain/repositories';
import { UserProfile, UserProfileWithoutCreatedAt } from '@/contexts/domain/models';

@Injectable()
export class UpdateProfileUseCase {

  // This constructor takes a UserRepository as a dependency
  constructor(@Inject('userRepository') private userRepository: UserRepository) {}

  // This method returns the user settings by email
  async run(userId: string, userProfile: UserProfileWithoutCreatedAt): Promise<UserProfile> {

    // Get the user by ID
    const updatedUser = await this.userRepository.updateUser(userId, {
        username: userProfile.username,
        profile_picture_url: userProfile.profile_picture_url,
        banner_picture_url: userProfile.banner_picture_url,
        email: userProfile.email,
        name: userProfile.name,
    });

    // Return the updated user settings
    return {
        username: updatedUser.username,
        profile_picture_url: updatedUser.profile_picture_url,
        banner_picture_url: updatedUser.banner_picture_url,
        email: updatedUser.email,
        name: updatedUser.name,
        created_at: updatedUser.created_at,
    };

    
  }
}
