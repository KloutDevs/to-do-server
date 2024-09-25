import { Module } from '@nestjs/common';

import { ApplicationModule } from '@/contexts/application/application.module';
import { UserController } from '@/contexts/infrastructure/http-api/v1/users/User.controller';
import { AuthController } from '@/contexts/infrastructure/http-api/v1/auth/Auth.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [AuthController, UserController],
  providers: [],
  exports: [],
})
export class InfrastructureModule {}