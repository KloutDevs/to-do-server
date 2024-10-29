import { MailService } from '@/contexts/domain/services';
import { UserRepository } from "@/contexts/domain/repositories";
import { VerifyEmailRequestBody, Mail } from "@/contexts/domain/models";
import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";

@Injectable()
export class VerifyEmailUseCase {

    // This constructor takes a MailService, UserRepository, and ConfigService as dependencies
    constructor(
        @Inject('mailService') private mailService: MailService,
        @Inject('userRepository') private userRepository: UserRepository,
        @Inject('configService') private configService: ConfigService,
    ) {}

    // This method verifies a user's email by sending them a verification email.
    async verifyEmail(verifyEmailRequest: VerifyEmailRequestBody): Promise<boolean> {


        // Get the user by ID, and throw an error if it doesn't exist
        const user = await this.userRepository.findUniqueById(verifyEmailRequest.userId);

        // Check if the user already has a verified email, and throw an error if they do
        if(user.emailVerified) throw new BadRequestException('User already verified.');

        // Get the tokens by the user's ID, and throw an error if already have a token
        const tokens = await this.userRepository.getTokensByIdentifier(verifyEmailRequest.userId);
        if(tokens.length > 0) throw new BadRequestException('User already have a token! Try with re-send method');

        // Generate a random UUID for the verification token
        const verificationToken = randomUUID();

        // Set the verification token for the user
        await this.userRepository.setVerificationToken(user.id, verificationToken);

        // Construct the verification URL with the token
        const verificationUrl = `${this.configService.get<string>('APP_URL')}/verify-email?token=${verificationToken}`;

        // Create a Mail object with the user's name and email, the verification URL, and the from email and name
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

        // Send the verification email using the MailService, and throw an error if it fails
        const mailSent = await this.mailService.send(mailToSend);
        if(!mailSent) throw new BadRequestException('Failed to send verification email.');

        // Return true to indicate that the email was sent successfully
        return true;
    }

    // This method confirms the verification of a user's email by checking if the token is valid and has not expired.
    async confirmVerification(token: string): Promise<boolean> {

        // Get the obtained token by the token, and throw an error if it doesn't exist
        const obtainedToken = await this.userRepository.findByVerificationToken(token);

        // Check if the obtained token is expired, and throw an BadRequestException if it is
        if (obtainedToken.expires < new Date()) {

            // Delete the expired token if is already expired
            await this.userRepository.deleteExpiredVerificationTokens(obtainedToken.identifier);
            throw new BadRequestException('Token expired.');
        }
    
        // Update the date when the email has been verified
        await this.userRepository.updateUser(obtainedToken.identifier, {
            emailVerified: new Date(),
        });

        // Delete the token after it has been verified
        await this.userRepository.deleteExpiredVerificationTokens(obtainedToken.identifier);

        // Return true to indicate that the email was verified successfully
        return true;
    }

}