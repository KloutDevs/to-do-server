import {
  AccessToken,
  LoginRequestBody,
  RegisterRequestBody,
  validateUserBody,
} from '@/contexts/domain/models/';

import { User } from '@/contexts/domain/models/';

export abstract class AuthServicePort {
  /**
   * Validates a user by checking if the provided email and password match a user in the database.
   *
   * @param userBody - The user's email and password to be validated.
   *
   * @returns A promise that resolves to a User object if the validation is successful, or rejects with a BadRequestException if the validation fails.
   *
   * @throws BadRequestException - If the userBody is not provided.
   *
   * @throws NotFoundException - If the user with the provided email is not found in the database.
   *
   * @throws BadRequestException - If the password provided does not match the hashed password in the database.
   *
   */
  abstract validateUser(userBody: validateUserBody): Promise<User>;

  /**
   * Logs in a user by creating an access token with the user's email and ID.
   *
   * @param user - The user object to be logged in.
   *
   * @returns A promise that resolves to an AccessToken object if the login is successful, or rejects with a BadRequestException if the login fails.
   *
   * @throws BadRequestException - If the user is not provided.
   *
   */
  abstract login(user: LoginRequestBody): Promise<AccessToken>;

  /**
   * Logs out a user by adding the access token to a blacklist and returning a success message.
   *
   * @param token - The access token to be logged out.
   *
   * @returns A promise that resolves to an object with a message property set to "Successfully logged out" if the logout is successful, or rejects with a BadRequestException if the logout fails.
   *
   * @throws BadRequestException - If the token is not provided.
   *
   */
  abstract logout(token: string): Promise<{ message: string }>;

  /**
   * Registers a new user by creating a new user in the database and returning an access token.
   *
   * @param userToRegister - The user object to be registered.
   *
   * @returns A promise that resolves to an AccessToken object if the registration is successful, or rejects with a BadRequestException or AlreadyExistsException if the registration fails.
   *
   * @throws BadRequestException - If the userToRegister is not provided.
   * 
   */
  abstract register(userToRegister: RegisterRequestBody): Promise<AccessToken>;


  /**
   * Changes a user's password by hashing the new password and updating the user in the database.
   *
   * @param userId - The ID of the user whose password is to be changed.
   * @param lastPassword - The user's current password.
   * @param newPassword - The user's new password.
   *
   * @returns A promise that resolves to a boolean value indicating whether the password was changed successfully, or rejects with a BadRequestException if the password change fails.
   *
   * @throws BadRequestException - If the userId is not provided.
   *
   * @throws BadRequestException - If the lastPassword is not provided.
   *
   * @throws BadRequestException - If the newPassword is not provided.
   *
   * @throws BadRequestException - If the newPassword and the lastPassword are the same, as this would mean that the user is trying to change their password to the same thing.
   *
   * @throws NotFoundException - If the user with the provided ID is not found in the database.
   *
   * @throws BadRequestException - If the lastPassword provided does not match the hashed password in the database.
   *
   */
  abstract changePassword(
    userId: string,
    lastPassword: string,
    newPassword: string,
  ): Promise<Boolean>;

  /**
   * Resets a user's password by hashing the new password and updating the user in the database.
   * This method should be used when a user forgets their password and needs to reset it.
   * 
   * This method verify the last password provided and the hashed password match.
   *
   * @param userId - The ID of the user whose password is to be reset.
   * @param newPassword - The user's new password.
   *
   * @returns A promise that resolves to a boolean value indicating whether the password was reset successfully, or rejects with a BadRequestException if the password reset fails.
   *
   * @throws BadRequestException - If the userId is not provided.
   *
   * @throws BadRequestException - If the newPassword is not provided.
   *
   * @throws NotFoundException - If the user with the provided ID is not found in the database.
   *
   */
  abstract resetPassword(userId: string, newPassword: string): Promise<Boolean>;
}

/*  TO-DO IN FUTURE VERSION

    abstract refreshToken(token: AccessToken): Promise<AccessToken>;
    abstract getGitHubProvider(): Promise<void>;
    abstract getGoogleProvider(): Promise<void>;
    abstract revokeRefreshToken(token: AccessToken): Promise<Boolean>;
    abstract enable2FA(userId: string): Promise<Boolean>;
    abstract verify2FA(userId: string): Promise<Boolean>;
    abstract linkDevice(userId: string): Promise<Boolean>;

*/
