import { Module } from '@nestjs/common';
import { PrismaUserRepository } from '@/contexts/infrastructure/repositories/prisma-user.repository.adapter';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { AuthUseCase } from './usecases/auth/auth.use-case';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AuthService } from '@/contexts/infrastructure/repositories/auth.repository.adapter';
import { LocalStrategy } from '../shared/strategy/local.strategy';
import { JwtStrategy } from '../shared/strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [
    AuthUseCase,
    PrismaService,
    JwtStrategy,
    LocalStrategy,
    {
      provide: 'userRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'authRepository',
      useClass: AuthService,
    }
  ],
  exports: [
    AuthUseCase
  ],
})
export class ApplicationModule {}