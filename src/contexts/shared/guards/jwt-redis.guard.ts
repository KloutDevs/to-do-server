import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject, ForbiddenException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { RedisBlacklistUseCase } from '@/contexts/application/usecases/auth';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRedisGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private redisBlacklistUseCase: RedisBlacklistUseCase,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log(`Token: ${token}`);
    if (!token) {
      console.log('No token');
      throw new UnauthorizedException();
    }
    console.log('Token found');
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync(token, { secret });
      console.log('Payload found');
      console.log(payload);
      const isBlacklisted = await this.redisBlacklistUseCase.isBlacklisted(token);
      console.log('Is blacklisted');
      console.log(isBlacklisted);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token is blacklisted');
      }
      console.log('Token is not blacklisted');
    } catch(e) {
      if (e instanceof TokenExpiredError) {
        throw new ForbiddenException('Token has expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
