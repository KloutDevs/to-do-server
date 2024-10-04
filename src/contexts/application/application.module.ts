import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PrismaService } from '@/contexts/infrastructure/prisma/prisma.service';
import { PrismaUserRepository } from '@/contexts/infrastructure/repositories/prisma-user.repository.adapter';
import { AuthService } from '@/contexts/infrastructure/repositories/auth.repository.adapter';
import { PassportModule } from '@nestjs/passport';
import { 
  JwtStrategy,
  LocalStrategy
} from '@/contexts/shared/strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { 
  LoginUseCase,
  RegisterUseCase,
  ValidateUserUseCase,
  VerifyEmailUseCase,
  ResendEmailVerificationUseCase,
  RedisBlacklistUseCase,
  LogoutUseCase,
 } from '@/contexts/application/usecases/auth';
import {
  deleteUserUseCase,
  getAllUsersUseCase,
  getUserByEmailUseCase,
  getUserByIdUseCase,
  getUserByUsernameUseCase,
  PartialUpdateUseCase,
} from '@/contexts/application/usecases/users';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailRepository } from '@/contexts/infrastructure/repositories/email.repository.adapter';
import { CacheModule } from '@nestjs/cache-manager';
import {redisStore} from 'cache-manager-redis-yet';


@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAILJET_HOST'),
          port: configService.get<string>('MAILJET_PORT'),
          secure: false,
          auth: {
            user: configService.get<string>('MAILJET_PUBLIC_KEY'),
            pass: configService.get<string>('MAILJET_SECRET_KEY'),
          },
          logger: (configService.get<string>('NODE_ENV') == 'development') ? true : false,
          debug: (configService.get<string>('NODE_ENV') == 'development') ? true : false
        },
        defaults: {
          from: `"${process.env.MAILJET_FROM_NAME}" <${process.env.MAILJET_FROM_EMAIL}>`,
        },
        template: {
          dir: '@/contexts/infrastructure/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        }),
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    LoginUseCase,
    ValidateUserUseCase,
    RegisterUseCase,
    LogoutUseCase,
    VerifyEmailUseCase,
    ResendEmailVerificationUseCase,
    RedisBlacklistUseCase,
    getUserByIdUseCase,
    getUserByEmailUseCase,
    getUserByUsernameUseCase,
    deleteUserUseCase,
    PartialUpdateUseCase,
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
    },
    {
      provide: 'mailRepository',
      useClass: EmailRepository,
    },
    {
      provide: 'configService',
      useClass: ConfigService,
    }
  ],
  exports: [
    LoginUseCase,
    ValidateUserUseCase,
    RegisterUseCase,
    LogoutUseCase,
    VerifyEmailUseCase,
    ResendEmailVerificationUseCase,
    RedisBlacklistUseCase,
    getUserByIdUseCase,
    getUserByEmailUseCase,
    getUserByUsernameUseCase,
    deleteUserUseCase,
    PartialUpdateUseCase,
    getAllUsersUseCase
  ],
})
export class ApplicationModule {}
