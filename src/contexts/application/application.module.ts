import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { PrismaUserRepository } from '@/contexts/infrastructure/repositories/prisma-user.repository.adapter';
import { AuthService } from '@/contexts/infrastructure/repositories/auth.repository.adapter';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../shared/strategy/jwt.strategy';
import { LocalStrategy } from '../shared/strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthUseCase } from '@/contexts/application/usecases/auth/auth.use-case';
import {deleteUserUseCase, getAllUsersUseCase, getUserByEmailUseCase, getUserByIdUseCase, updateUserUseCase} from '@/contexts/application/usecases/users'

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
    getUserByIdUseCase,
    getUserByEmailUseCase,
    deleteUserUseCase,
    updateUserUseCase,
    getAllUsersUseCase,
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
    AuthUseCase,
    getUserByIdUseCase,
    getUserByEmailUseCase,
    deleteUserUseCase,
    updateUserUseCase,
    getAllUsersUseCase,
  ],
})
export class ApplicationModule {}