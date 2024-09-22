import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayload } from '../types/accessTokenPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { /* Implements the JWT strategy */
  constructor(private configService: ConfigService) { /* Get the .env */
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), /* Extract token from Authorization: Bearer {TOKEN} */
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: AccessTokenPayload) { /* If the token is valid and hasn't expired */
    return payload;
  }
}