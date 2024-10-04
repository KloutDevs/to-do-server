import { CreateUserDTO, User, verificationToken } from "@/contexts/domain/models";

export abstract class UserRepository {
  abstract create(user: CreateUserDTO, password: string): Promise<User>;
  abstract delete(id: string): Promise<User>;
  abstract findOneById(userId): Promise<User | null>;
  abstract findOneByEmail(email: string): Promise<User | null>;
  abstract findOneByUsername(username: string): Promise<User | null>;
  abstract partialUpdate(id: string, user: Partial<User>): Promise<User>;
  abstract publicProfile(id: string): Promise<User>;
  abstract deleteExpiredToken(id: string): Promise<boolean>;
  abstract setVerificationToken(id: string, token: string): Promise<verificationToken>;
  abstract getTokensByIdentifier(id: string): Promise<verificationToken[]>;
  abstract findByVerificationToken(token: string): Promise<verificationToken>;
  abstract getAllUsers():Promise<User[]>;
}