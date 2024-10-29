import { Role } from '@/contexts/shared/lib/types/';
export interface User {
  id: string;
  username: string;
  email: string;
  password: string | null;
  created_at: Date;
  profile_picture_url: string | null;
  banner_picture_url: string | null;
  language_preference: string | null;
  timezone: string | null;
  name: string | null;
  emailVerified: Date | null;
  roles: Role[];
}

export type UserProfile = Pick<User, 'username' | 'profile_picture_url' | 'banner_picture_url' | 'email' | 'name' | 'created_at'>;

export type UserProfileWithoutCreatedAt = Omit<UserProfile, 'created_at'>;

export type UserSettings = Pick<User, 'language_preference' | 'timezone'>;
export interface verificationToken {
  identifier: string;
  token: string;
  expires: Date;
}
export type CreateUserDTO = Required<Pick<User, 'username' | 'email'>> &
  Partial<Omit<User, 'username' | 'email' | 'id' | 'created_at'>>;

export type UserWithoutIdAndCreatedAt = Required<
  Omit<User, 'id' | 'created_at'>
>;
