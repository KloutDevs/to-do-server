import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '@/contexts/shared/lib/types/roles';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { RedisBlacklistUseCase } from '@/contexts/application/usecases/auth';
import { getUserByEmailUseCase } from '@/contexts/application/usecases/users';
import { ROLES_KEY } from '@/contexts/shared/lib/decorators';

// This class is used to protect routes with JWT authentication
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  /* Implements the canActivate method from the AuthGuard class */
  constructor(
    // Get the reflector for access to metadata
    private reflector: Reflector,

    // Get the blacklist use cases
    private redisBlacklistUseCase: RedisBlacklistUseCase,

    // Get the getUserByEmail use case
    private getUserByEmail: getUserByEmailUseCase,
  ) {

    // Call the parent constructor
    super();

  }

  // This method is used to check if the route is public or not
  async canActivate(context: ExecutionContext): Promise<boolean> {

    // Get the isPublic value from the metadata with reflector
    const isPublic = this.reflector.getAllAndOverride('isPublic', [

      // Get the handler and class from the context
      context.getHandler(),
      context.getClass(),

    ]);

    // If the route is public, the user is allowed to access to the route
    if (isPublic) return true;

    // This will call the 'jwt' strategy and validate the token
    const canActivate = await super.canActivate(context);

    // If the token is not valid, we return false
    if (!canActivate) return false;

    // Get the request from the context
    const request = context.switchToHttp().getRequest();

    // Get the token from the request headers
    const token = this.extractTokenFromHeader(request);

    // If the route isn't pbulic, execute checks
    try {

      // If the token is not provided, throw an unauthorized exception
      if (!token) throw new UnauthorizedException('No token provided');

      // If the token is expired, throw a unauthorized exception
      const isBlacklisted = await this.redisBlacklistUseCase.isBlacklisted(token);
      if (isBlacklisted) throw new UnauthorizedException('Session is already expired.'); 

    } catch (e) {

      // If the token is expired, throw a forbidden exception
      if (e instanceof TokenExpiredError) throw new ForbiddenException('Session is already expired.');

      // If the token is invalid, throw an unauthorized exception
      throw new UnauthorizedException('Invalid token');
    }

    // Get the required roles from the metadata with reflector
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      // Get the handler and class from the context
      context.getHandler(),
      context.getClass(),
    ]);

    // If the required roles are provided, check if the user has the required roles
    if (requiredRoles && requiredRoles.length > 0) {

      // Get the user with the email from the request and check if it exists
      const user = await this.getUserByEmail.execute(request.user.email);
      if (!user) throw new UnauthorizedException(`User with email ${request.user.email} not found`);

      // Compare the user roles with the required roles and check if they match
      let hasPermission = requiredRoles.some((role) =>
        user.roles?.includes(role),
      );

      // If the user doesn't have the required roles, throw a forbidden exception
      if (!hasPermission) throw new ForbiddenException('You do not have permission to access this resource');
    }

    // If passed all checks, return true
    return true;
  }

  // This method is used to handle errors
  handleRequest(err, user, info) {

    // If there is an error, throw a forbidden exception
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    // If not exists a error, return the user
    return user;

  }

  // This method is used to extract the token from the request headers
  private extractTokenFromHeader(request: any): string | undefined {

    // Get the authorization header from the request headers
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    // Return the token if it exists
    return type === 'Bearer' ? token : undefined;
    
  }
}
