import { z } from "zod";

export interface validateUserBody {
  email: string;
  password: string;
}

export type AccessToken = {
  access_token: string;
};

export type AccessTokenPayload = {
  userId: string;
  email: string;
};

export interface RegisterRequestBody {
    username: string,
    email: string,
    password: string,
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface VerifyEmailRequestBody {
  userId: string;
}