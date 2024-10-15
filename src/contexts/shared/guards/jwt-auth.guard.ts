import { Role } from '@/contexts/shared/types/roles';
import { TokenExpiredError } from '@nestjs/jwt';
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { RedisBlacklistUseCase } from '@/contexts/application/usecases/auth';
import { getUserByEmailUseCase } from '@/contexts/application/usecases/users';
import { ROLES_KEY } from '../decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /* Implements the canActivate method from the AuthGuard class */
  constructor(
    private reflector: Reflector, // Get the reflector for access to metadata
    private redisBlacklistUseCase: RedisBlacklistUseCase,
    private getUserByEmail: getUserByEmailUseCase,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    // This will call the 'jwt' strategy and validate the token
    const canActivate = await super.canActivate(context);

    if (!canActivate) {
      // If the token is not valid, we return false
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    try {
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      const isBlacklisted =
        await this.redisBlacklistUseCase.isBlacklisted(token);
      if (isBlacklisted) {
        throw new UnauthorizedException('Session is already expired.');
      }
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new ForbiddenException('Session is already expired.');
      }
      throw new UnauthorizedException('Invalid token');
    }

    
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if(requiredRoles && requiredRoles.length > 0) {
      const user = await this.getUserByEmail.execute(request.user.email);
      if(!user) throw new UnauthorizedException('User not found');
      console.log('User in requiredRoles');
      console.log(user);
      console.log(requiredRoles);
      let hasPermission =  requiredRoles.some((role) => user.roles?.includes(role));
      console.log(hasPermission)
      if (!hasPermission) {
        throw new ForbiddenException('You do not have permission to access this resource');
      }
    }

    return true;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      /* Verify if don't exists a error and there is a user */
      throw err || new UnauthorizedException();
    }
    return user;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
