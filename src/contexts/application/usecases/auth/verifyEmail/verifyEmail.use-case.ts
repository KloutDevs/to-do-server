import { Injectable, Inject } from "@nestjs/common";
import { MailRepository, UserRepository } from "@/contexts/domain/repositories";
import { BadRequestException } from "@nestjs/common";
import { Mail } from "@/contexts/domain/models";
import { ConfigService } from "@nestjs/config";
import { VerifyEmailRequest } from "@/contexts/domain/models";
import { randomUUID } from "crypto";

@Injectable()
export class VerifyEmailUseCase {
    constructor(
        @Inject('mailRepository') private mailRepository: MailRepository,
        @Inject('userRepository') private userRepository: UserRepository,
        @Inject('configService') private configService: ConfigService,
    ) {}
    async verifyEmail(verifyEmailRequest: VerifyEmailRequest): Promise<boolean> {
        const user = await this.userRepository.findOneById(verifyEmailRequest.userId);
        if(!user) throw new BadRequestException('User not found.');
        if(user.emailVerified) throw new BadRequestException('User already verified.');
        const tokens = await this.userRepository.getTokensByIdentifier(verifyEmailRequest.userId);
        if(tokens.length > 0) throw new BadRequestException('User already have a token! Try with re-send method');
        const verificationToken = randomUUID();
        await this.userRepository.setVerificationToken(user.id, verificationToken);
        const verificationUrl = `${this.configService.get<string>('APP_URL')}/verify-email?token=${verificationToken}`;

        const mailToSend:Mail = {
            to: [{
                name: user.name || 'New User',
                email: user.email,
            }],
            from: {
                name: this.configService.get<string>('MAILJET_FROM_NAME'),
                email: this.configService.get<string>('MAILJET_FROM_EMAIL'),

            },
            subject: 'Verify your email',
            text: `Please verify your email by clicking the link below: ${verificationUrl}`,
            html: `<p>Please verify your email by clicking <a href="${verificationUrl}">this link</a>.</p>`,
        };
        const mailSent = await this.mailRepository.send(mailToSend);
        if(!mailSent) throw new BadRequestException('Failed to send verification email.');
        return true;
    }

    async confirmVerification(token: string): Promise<boolean> {
        const obtainedToken = await this.userRepository.findByVerificationToken(token);
        if (!obtainedToken) {
            throw new BadRequestException('Invalid token or not found.');
        }

        if (obtainedToken.expires < new Date()) {
            await this.userRepository.deleteExpiredToken(obtainedToken.identifier);
            throw new BadRequestException('Token expired.');
        }
    
        await this.userRepository.partialUpdate(obtainedToken.identifier, {
            emailVerified: new Date(),
        });

        await this.userRepository.deleteExpiredToken(obtainedToken.identifier);
        return true;
    }

}