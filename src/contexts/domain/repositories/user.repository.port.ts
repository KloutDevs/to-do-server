import { CreateUserDTO, User } from "@/contexts/domain/models/user.entity";

export abstract class UserRepository {
  abstract create(user: CreateUserDTO, password: string): Promise<User>;
  abstract delete(id: string): Promise<User>;
  abstract findOneById(userId): Promise<User | null>;
  abstract findOneByEmail(email: string): Promise<User | null>;
  abstract findOneByUsername(username: string): Promise<User | null>;
  abstract partialUpdate(id: string, user: Partial<User>): Promise<User>;
  abstract getAllUsers():Promise<User[]>;
}