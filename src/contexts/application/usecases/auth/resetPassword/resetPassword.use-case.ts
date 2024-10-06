import { Mail } from '@/contexts/domain/models';
import { MailRepository, UserRepository } from '@/contexts/domain/repositories';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';
import {hash} from 'bcrypt';

@Injectable()
export class ResetPasswordUseCase {
  private readonly RESETS_KEY = 'resets_emails';
  constructor(
    @Inject('mailRepository') private emailRepository: MailRepository,
    @Inject('userRepository') private userRepository: UserRepository,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async sendResetPasswordEmail(email: string, route: string): Promise<boolean | BadRequestException | NotFoundException> {
    try {
      let resetsList: Array<{
        email: string;
        token: string;
        expirationTime: number;
      }> = (await this.cacheManager.get(this.RESETS_KEY)) || [];
      let emailAlreadyHaveToken = resetsList.find((reset) => reset.email === email);
      if (emailAlreadyHaveToken && emailAlreadyHaveToken.expirationTime < Date.now()) {
        resetsList = resetsList.filter((reset) => reset.email !== email);
      }

      const user = await this.userRepository.findOneByEmail(email);
      if(!user) throw new NotFoundException('User not found.');

      const token = randomUUID();
      const expirationTime = Date.now() + (1000 * 60 * 15);

      resetsList.push({ email, token, expirationTime });
      await this.cacheManager.set(this.RESETS_KEY, resetsList);

      const resetUrl = `${this.configService.get<string>('APP_URL')}/${route}?token=${token}`;

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

      return this.emailRepository.send(mailToSend);
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async confirmResetPassword(
    token: string,
    newPassword: string,
  ): Promise<boolean | BadRequestException | NotFoundException> {
    let resetList: Array<{
      email: string;
      token: string;
      expirationTime: number;
    }> = (await this.cacheManager.get(this.RESETS_KEY)) || [];
    const reset = resetList.find((reset) => reset.token === token);
    if (!reset) {
      throw new BadRequestException('Invalid token or not found.');
    }
    if (reset.expirationTime < Date.now()) {
      throw new BadRequestException('Token expired.');
    }
    const user = await this.userRepository.findOneByEmail(reset.email);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const hashedPassword = await hash(newPassword, 10);
    await this.userRepository.partialUpdate(user.id, { password: hashedPassword }).then(async () => {
      resetList = resetList.filter((reset) => reset.token !== token);
      await this.cacheManager.set(this.RESETS_KEY, resetList);
      return true;
    }).catch(e => {
      console.error(e);
      throw new BadRequestException('Password could not be reset.');
    });
    return false;
  }
}
