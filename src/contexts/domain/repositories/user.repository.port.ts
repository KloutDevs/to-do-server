import {
  CreateUserDTO,
  User,
  UserProfile,
  UserSettings,
  verificationToken,
} from '@/contexts/domain/models';

export abstract class UserRepository {
  /**
   * Method for creating a new user
   *
   * @param userBody - The user object to be created
   *
   * @param passwordHashed - The password already hashed for the user
   *
   * @Error BadRequestException is thrown if the userBody or passwordHashed is not provided.
   *
   * @Error AlreadyExistsException is thrown if the email or username already exists.
   *
   * @returns {Promise<User>} Returns a promise with the created user
   */
  abstract createNewUser(
    userBody: CreateUserDTO,
    passwordHashed: string,
  ): Promise<User>;

  /**
   * Method for delete a user by ID.
   *
   * @param userId - The user id to be deleted.
   *
   * @Error BadRequestException is thrown if the userId is not provided.
   *
   * @Error NotFoundException is thrown if the user with the provided userId is not found.
   *
   * @Error ForbiddenException is thrown if the user is not the owner of the user or if the user is not an admin.
   *
   * @returns {Promise<void>} Returns a void promise.
   */
  abstract deleteUser(userId: string): Promise<void>;

  /**
   * Method for finding a user by ID.
   *
   * @param userId - The user ID to be found.
   *
   * @Error BadRequestException is thrown if the userId is not provided.
   *
   * @Error NotFoundException is thrown if the user with the provided userId is not found.
   *
   * @Error ForbiddenException is thrown if the user is not the owner of the user or if the user is not an admin.
   *
   * @returns {Promise<User | null>} Returns a promise with the user or null if not found.
   */
  abstract findUniqueById(userId): Promise<User>;

  /**
   * Method for finding a user by email.
   *
   * @param email - The email to be found.
   *
   * @Error BadRequestException is thrown if the email is not provided.
   *
   * @Error NotFoundException is thrown if the user with the provided email is not found.
   *
   * @Error ForbiddenException is thrown if the user is not the owner of the user or if the user is not an admin.
   *
   * @returns {Promise<User | null>} Returns a promise with the user or null if not found.
   */
  abstract findUniqueByEmail(email: string): Promise<User | null>;

  /**
   * Method for finding a user by username.
   *
   * @param username - The username to be found.
   *
   * @Error BadRequestException is thrown if the username is not provided.
   *
   * @Error NotFoundException is thrown if the user with the provided username is not found.
   *
   * @Error ForbiddenException is thrown if the user is not the owner of the user or if the user is not an admin.
   *
   * @returns {Promise<User | null>} Returns a promise with the user or null if not found.
   */
  abstract findUniqueByUsername(username: string): Promise<User | null>;

  /**
   * Method for updating a user by ID.
   *
   * @param userId - The user ID to be updated.
   *
   * @param userBody - The user object to be updated, this can be partial.
   *
   * @Error BadRequestException is thrown if the userId or userBody is not provided.
   *
   * @Error NotFoundException is thrown if the user with the provided userId is not found.
   *
   * @Error ForbiddenException is thrown if the user is not the owner of the user or if the user is not an admin.
   *
   * @returns {Promise<User>} Returns a promise with the updated user.
   */
  abstract updateUser(userId: string, userBody: Partial<User>): Promise<User>;

  /**
   * Method for getting all users.
   *
   * @param limit - The number of users to be returned.
   * By default it will return all users.
   *
   * @param orderBy - The order of the users to be returned. Order by 'desc' or 'asc'.
   * By default it will return users in descending order.
   *
   * @returns {Promise<User[]>} Returns a promise with an array of users.
   */
  abstract getAllUsers(limit?: number, orderBy?: 'desc' | 'asc'): Promise<User[]>;

  /**
   * Method for getting a user public profile by ID.
   *
   * @param userId - The user ID to be found.
   *
   * @Error BadRequestException is thrown if the userId is not provided.
   *
   * @Error NotFoundException is thrown if the user with the provided userId is not found.
   *
   * @returns {Promise<UserProfile>} Returns a promise with the user profile.
   */
  abstract getPublicProfile(userId: string): Promise<UserProfile>;

  /**
   * Method for getting a user settings by ID.
   *
   * @param userId - The user ID to be found.
   *
   * @Error BadRequestException is thrown if the userId is not provided.
   *
   * @Error NotFoundException is thrown if the user with the provided userId is not found.
   *
   * @Error ForbiddenException is thrown if the user is not the owner of the user or if the user is not an admin.
   *
   * @returns {Promise<UserSettings>} Returns a promise with the user settings.
   */
  abstract getUserSettings(userId: string): Promise<UserSettings>;

  // Methods for email verification

  /**
   * Method for delete any Email verification tokens by Identifier
   * In this case, the identifier is a user ID.
   *
   * @param userId - The user ID used as identifier.
   * 
   * @Error BadRequestException is thrown if the userId is not provided.
   * 
   * @Returns {Promise<boolean>} Returns a promise with a boolean value indicating if any token was deleted.
   */
  abstract deleteExpiredVerificationTokens(userId: string): Promise<boolean>;

  /**
   * Method for setting a Email verification token by Identifier
   * In this case, the identifier is a user ID.
   *
   * @param userId - The user ID will used as identifier for the token.
   * @param token - The token to be set.
   *
   * @Error BadRequestException is thrown if the userId or token is not provided.
   * 
   * @returns {Promise<verificationToken>} Returns a promise with the verification token created.
   */
  abstract setVerificationToken(
    userId: string,
    token: string,
  ): Promise<verificationToken>;

  /**
   * Method for getting all Email verification tokens by Identifier if exists
   * In this case, the identifier is a user ID.
   *
   * @param userId - The user ID used as identifier.
   *
   * @Error BadRequestException is thrown if the userId is not provided.
   * 
   * @Error NotFoundException is thrown if does not exist any verification tokens for the user.
   * 
   * @returns {Promise<verificationToken[]>} Returns a promise with an array of verification tokens.
   */
  abstract getTokensByIdentifier(userId: string): Promise<verificationToken[]>;

  /**
   *  Method for finding a Email verification token by token.
   *
   * @param token - The token to be found.
   *
   * @Error BadRequestException is thrown if the token is not provided.
   * 
   * @Error NotFoundException is thrown if the token is not found.
   * 
   * @returns {Promise<verificationToken>} Returns a promise with the verification token object.
   */
  abstract findByVerificationToken(token: string): Promise<verificationToken>;
}
