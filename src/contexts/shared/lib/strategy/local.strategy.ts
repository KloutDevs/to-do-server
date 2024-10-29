import { Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthServicePort } from '@/contexts/domain/services';
import { User } from '@/contexts/domain/models/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  // This constructor takes the authService as a dependency
  constructor(@Inject('authService') private authService: AuthServicePort) {

    // Call the parent constructor with the options
    super({

      // Set the usernameField option to email
      usernameField: 'email',

    });
  }

  // This method is called when the strategy is used to validate the user
  async validate(email: string, password: string): Promise<User> {

    // If the email or password is not provided, throw a bad request exception
    if (!email || !password) throw new BadRequestException('Email and password are required');

    // Validate the user with the email and password
    const validatedUser = await this.authService.validateUser({email, password});
    
    // If the user is not found, throw an unauthorized exception
    if (!validatedUser) throw new UnauthorizedException('Invalid email or password');

    // Return the validated user
    return validatedUser;
  }
}
