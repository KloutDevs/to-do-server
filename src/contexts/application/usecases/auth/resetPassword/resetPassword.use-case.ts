import { Mail } from '@/contexts/domain/models';
import { MailService } from '@/contexts/domain/services';
import { UserRepository } from '@/contexts/domain/repositories';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';
import {hash} from 'bcrypt';

@Injectable()
export class ResetPasswordUseCase {

  // Define a constant for the cache keys in Redis
  private readonly RESETS_KEY = 'resets_emails';

  // Inject the necessary dependencies
  constructor(
    // Inject the mailService from the application module using the NestMailRepository
    // Use the MailService Port for type safety and maintain the arquitecture
    @Inject('mailService') private mailService: MailService,

    // Inject the userRepository from the application module using the PrismaUserRepository
    @Inject('userRepository') private userRepository: UserRepository,

    // Inject the cacheManager from the NestJS Cache module
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    // Inject the ConfigService from the NestJS Config module
    private configService: ConfigService,
  ) {}

  /**
   * Sends a reset password email to the provided email address.
   *
   * @param email - The email address to send the reset password email to.
   * @param route - The route to send the reset password email to.
   *
   * @returns A promise that resolves to a boolean value indicating whether the email was sent successfully, or rejects with a BadRequestException or NotFoundException if the email fails to send.
   *
   * @throws BadRequestException - If the email is not provided.
   *
   * @throws NotFoundException - If the user with the provided email is not found in the database.
   *
   */
  async sendResetPasswordEmail(email: string, route: string): Promise<boolean> {

    try {

      // Initialize an empty array to store the reset tokens if it doesn't exist in the cache
      let resetsList: Array<{
        email: string;
        token: string;
        expirationTime: number;
      }> = (await this.cacheManager.get(this.RESETS_KEY)) || [];

      // Check if the email already has a token and if it has expired
      let emailAlreadyHaveToken = resetsList.find((reset) => reset.email === email);

      // If the email has a token and it has expired, remove it from the list
      if (emailAlreadyHaveToken && emailAlreadyHaveToken.expirationTime < Date.now()) {
        resetsList = resetsList.filter((reset) => reset.email !== email);
      }

      // Check if the user with the provided email exists
      const user = await this.userRepository.findUniqueByEmail(email);
      if(!user) throw new NotFoundException(`User with email ${email} not found.`);

      // Generate a random UUID for the token and calculate the expiration time (15 minutes from now)
      const token = randomUUID();
      const expirationTime = Date.now() + (1000 * 60 * 15);

      // Add the email, token, and expiration time to the resets list
      resetsList.push({ email, token, expirationTime });
      await this.cacheManager.set(this.RESETS_KEY, resetsList);

      // Construct the reset password route with the token
      const resetUrl = `${this.configService.get<string>('APP_URL')}/${route}?token=${token}`;

      // Construct the mail object
      const mailToSend:Mail = {
        to: [{
          name: user.name || 'Dear User',
          email: user.email,
        }],
        from: {
          name: this.configService.get<string>('MAILJET_FROM_NAME'),
          email: this.configService.get<string>('MAILJET_FROM_EMAIL'),
        },
        subject: 'Reset your password',
        text: `Please reset your password by clicking the link below: ${resetUrl}`,
        html: `<p>Please reset your password by clicking <a href="${resetUrl}">this link</a>.</p>`,
      };

      return this.mailService.send(mailToSend);

    } catch (e) {

      console.error(e);

      // Return false if an error occurs
      return false;

    }
  }

  /**
   * Confirms the reset password for the user with the provided token.
   *
   * @param token - The token to confirm the reset password for.
   * @param newPassword - The new password to confirm the reset password for.
   *
   * @returns A promise that resolves to a boolean value indicating whether the reset password was confirmed successfully, or rejects with a BadRequestException or NotFoundException if the reset password confirmation fails.
   *
   * @throws BadRequestException - If the token is not provided.
   *
   * @throws BadRequestException - If the newPassword is not provided.
   *
   * @throws NotFoundException - If the user with the provided token is not found in the database.
   *
   */
  async confirmResetPassword(
    token: string,
    newPassword: string,
  ): Promise<boolean> {

    // Initialize an empty array to store the reset tokens if it doesn't exist in the cache
    let resetList: Array<{
      email: string;
      token: string;
      expirationTime: number;
    }> = (await this.cacheManager.get(this.RESETS_KEY)) || [];

    // Find the reset token in the list getted from the cache, and throw an error if it doesn't exist
    const reset = resetList.find((reset) => reset.token === token);
    if (!reset) throw new BadRequestException('Invalid token or not found.');

    // Check if the reset token is expired, and throw an error if it is
    if (reset.expirationTime < Date.now()) throw new BadRequestException('Token already expired.');

    // Find the user with the provided email, and throw an error if it doesn't exist
    const user = await this.userRepository.findUniqueByEmail(reset.email);
    if (!user) throw new NotFoundException(`User with email ${reset.email} not found.`);

    // Hash the new password
    const hashedPassword = await hash(newPassword, 12);

    // Update the user's password in the database
    await this.userRepository.updateUser(user.id, { password: hashedPassword }).then(async () => {

      //  Remove the reset token from the list
      resetList = resetList.filter((reset) => reset.token !== token);
      await this.cacheManager.set(this.RESETS_KEY, resetList);
      
      // Return true if the password was successfully reset
      return true;

    }).catch(e => {

      // Log the error and throw a InternalServerErrorException
      console.error(e);
      throw new InternalServerErrorException('Password could not be reset.');

    });

    // Return false if an error occurs
    return false;
  }
}
