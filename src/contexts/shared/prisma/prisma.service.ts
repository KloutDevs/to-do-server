import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  // This method is called when the Prisma module is initialized
  async onModuleInit() {
    await this.$connect();
  }

  // This method is called when the Prisma module is destroyed
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
