import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app/app.module';
import { JwtAuthGuard } from './contexts_OLD/shared/guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
/*   const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalPipes(new ValidationPipe()); */
  await app.listen(3040);
}
bootstrap();