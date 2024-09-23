import { Module } from '@nestjs/common';
import {PrismaService} from '@/contexts/infrastructure/prisma/prisma.service'

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
