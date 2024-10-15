import { Role } from '@/contexts/shared/types/roles';
export interface User {
  id: string;
  username: string;
  email: string;
  password: string | null;  // Cambiar a null para coincidir con Prisma
  created_at: Date;
  profile_picture_url: string | null;
  banner_picture_url: string | null;
  language_preference: string | null;
  timezone: string | null;
  name: string | null;
  emailVerified: Date | null;
  roles: Role[];
}

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
