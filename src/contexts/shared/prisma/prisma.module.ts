import { Module } from '@nestjs/common';
import {PrismaService} from '@/contexts/shared/prisma/prisma.service'

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
