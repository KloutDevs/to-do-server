import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /* Implements the jwt strategy to the guard */
  constructor(private reflector: Reflector) {
    /* Get the reflector for access to metadata  */
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      /* Verify if the route have the Public decorator */ context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    return super.canActivate(
      context,
    ); /* If the route isn't public, manage the auth with the token */
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      /* Verify if don't exists a error and there is a user */
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
