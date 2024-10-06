import { AccessToken, LoginRequest, RegisterRequest, validateUser } from "@/contexts/domain/models/auth.entity";
import { User } from "@/contexts/domain/models/user.entity";

export abstract class AuthRepository{
    abstract validateUser(params: validateUser): Promise<User>;
    abstract login(user: LoginRequest): Promise<AccessToken>;
    abstract logout(token: string): Promise<{message: string}>;
    abstract register(user: RegisterRequest): Promise<AccessToken>;
    abstract changePassword(userId: string, lastPassword: string, newPassword: string): Promise<Boolean>;
    abstract refreshToken(token: AccessToken): Promise<AccessToken>;
    abstract getGitHubProvider(): Promise<void>;
    abstract getGoogleProvider(): Promise<void>;
    abstract revokeRefreshToken(token: AccessToken): Promise<Boolean>;
    abstract enable2FA(userId: string): Promise<Boolean>;
    abstract verify2FA(userId: string): Promise<Boolean>;
    abstract linkDevice(userId: string): Promise<Boolean>;
}
