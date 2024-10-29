import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayload } from '@/contexts/domain/models/auth.entity';

// This class is used to validate the JWT token
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  // This constructor takes the config service and sets the global, jwtFromRequest, ignoreExpiration, and secretOrKey options
  // Use the config service to get the JWT_SECRET from the .env file
  constructor(private configService: ConfigService) {

    // Call the parent constructor with the options
    super({

      // Set the global option to true to enable global access to the strategy
      global: true,

      // Set the jwtFromRequest option to extract the token from the Authorization header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), /* Extract token from Authorization: Bearer {TOKEN} */
      
      // Set the ignoreExpiration for the strategy to false to allow expiration
      ignoreExpiration: false,

      // Set the secretOrKey option to the JWT_SECRET from the config service
      secretOrKey: configService.get<string>('JWT_SECRET'),

    });
  }

  // This method is called when the strategy is used to validate the token
  async validate(payload: AccessTokenPayload) {

    // Return the payload if the token is valid
    return payload;
    
  }
}