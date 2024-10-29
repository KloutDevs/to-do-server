
import * as authUseCases from '@/contexts/application/usecases/auth';
import * as workspaceUseCases from '@/contexts/application/usecases/workspaces';
import * as userUseCases from '@/contexts/application/usecases/users';
import * as subTaskUseCases from '@/contexts/application/usecases/subtasks';
import * as tagsUseCases from '@/contexts/application/usecases/tags';
import * as tasksUseCases from '@/contexts/application/usecases/tasks';
import * as repositories from '@/contexts/infrastructure/repositories';
import * as services from '@/contexts/infrastructure/services';

import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { JwtStrategy, LocalStrategy } from '@/contexts/shared/lib/strategy';
import { PrismaService } from '@/contexts/shared/prisma/prisma.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule } from '@nestjs/cache-manager';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

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
          logger:
            configService.get<string>('NODE_ENV') == 'development'
              ? true
              : false,
          debug:
            configService.get<string>('NODE_ENV') == 'development'
              ? true
              : false,
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

  // 
  providers: [

    // Add the use cases to the providers array because otherwise they can't be exported.
    ...Object.values(authUseCases),
    ...Object.values(userUseCases),
    ...Object.values(workspaceUseCases),
    ...Object.values(tasksUseCases),
    ...Object.values(subTaskUseCases),
    ...Object.values(tagsUseCases),

    // Add all strategies and services for the use in use-cases
    PrismaService,
    JwtStrategy,
    LocalStrategy,

    // Add the repositories and services to the providers array for the injection in the use-cases
    {
      provide: 'userRepository',
      useClass: repositories.PrismaUserRepository,
    },
    {
      provide: 'authService',
      useClass: services.AuthService,
    },
    {
      provide: 'workspaceRepository',
      useClass: repositories.PrismaWorkspaceRepository,
    },
    {
      provide: 'subTaskRepository',
      useClass: repositories.PrismaSubTaskRepository,
    },
    {
      provide: 'tagRepository',
      useClass: repositories.PrismaTagRepository,
    },
    {
      provide: 'taskRepository',
      useClass: repositories.PrismaTaskRepository,
    },
    {
      provide: 'mailService',
      useClass: services.NestMailRepository,
    },
    
    // Add the ConfigService for the use in the use-cases
    {
      provide: 'configService',
      useClass: ConfigService,
    },
  ],

  // Export the use cases from the application module for the use in the infrastructure module
  exports: [
    ...Object.values(authUseCases),
    ...Object.values(userUseCases),
    ...Object.values(workspaceUseCases),
    ...Object.values(tasksUseCases),
    ...Object.values(subTaskUseCases),
    ...Object.values(tagsUseCases),
  ],

})
export class ApplicationModule {}
