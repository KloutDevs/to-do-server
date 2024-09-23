import { InfrastructureModule } from '@/contexts/infrastructure/infrastructure.module';
import { ApplicationModule } from '@/contexts/application/application.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/contexts/shared/guards';
import { PrismaUserRepository } from '@/contexts/infrastructure/repositories/prisma-user.repository.adapter';
import { PrismaService } from '@/contexts/infrastructure/prisma/prisma.service';
import { JwtStrategy } from '@/contexts/shared/strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApplicationModule,
    InfrastructureModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: 'userRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    JwtStrategy
  ],
})
export class AppModule {}