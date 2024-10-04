export interface User{
    id: string,
    username: string,
    email: string,
    password: string,
    created_at: Date,
    profile_picture_url: string,
    banner_picture_url: string,
    language_preference: string,
    timezone: string,
    name: string,
    emailVerified: Date,
  }

  export interface verificationToken {
    identifier: string,
    token: string,
    expires: Date,
  }
  export type CreateUserDTO = Required<Pick<User, 'username' | 'email'>> & Partial<Omit<User, 'username' | 'email' | 'id' | 'created_at'>>;
  
  export type UserWithoutIdAndCreatedAt = Required<Omit<User, 'id' | 'created_at'>>;
