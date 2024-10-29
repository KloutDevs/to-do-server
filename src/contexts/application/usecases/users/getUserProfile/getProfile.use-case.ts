import { UserProfile } from '@/contexts/domain/models';
import { UserRepository } from '@/contexts/domain/repositories';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetProfileUseCase {

  // This constructor takes a UserRepository as a dependency
  constructor(@Inject('userRepository') private userRepository: UserRepository) {}

  // This method returns the user profile by ID
  async run(userId: string): Promise<UserProfile> {

    // Get the user by ID
    const user = await this.userRepository.findUniqueById(userId);

    // Return only the user profile
    return {
      username: user.username,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
      profile_picture_url: user.profile_picture_url,
      banner_picture_url: user.banner_picture_url,
    };
  }
}
