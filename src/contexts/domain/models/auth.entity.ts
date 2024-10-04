import { UUID } from 'crypto';

export interface validateUser {
  email: string;
  password: string;
}

export type AccessToken = {
  access_token: string;
};

export type AccessTokenPayload = {
  userId: UUID;
  email: string;
};

export interface RegisterRequest {
    username: string,
    email: string,
    password: string,
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  userId: string;
}