import { AccessToken, RegisterRequest, validateUser } from "@/contexts/domain/models/auth.entity";
import { User } from "@/contexts/domain/models/user.entity";

export abstract class AuthRepository{
    abstract validateUser(params: validateUser): Promise<User>;
    abstract login(user: User): Promise<AccessToken>;
    abstract register(user: RegisterRequest): Promise<AccessToken>;
}