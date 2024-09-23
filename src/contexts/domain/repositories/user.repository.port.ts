import { CreateUserDTO, User, UserWithoutIdAndCreatedAt } from "@/contexts/domain/models/user.entity";

export abstract class UserRepository {
  abstract create(user: CreateUserDTO, password: string): Promise<User>;
  abstract delete(id: string): Promise<User>;
  abstract findOneById(id: string): Promise<User | null>;
  abstract findOneByEmail(email: string): Promise<User | null>;
  abstract update(id: string, user: UserWithoutIdAndCreatedAt): Promise<User>;
  abstract getAllUsers():Promise<User[]>;
}