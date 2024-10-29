import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from '@/contexts/shared/lib/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@User() user): Promise<string> {
    console.log("APP CONTROLLER");
    console.log(user);
    return await this.appService.getHello(user.email);
  }
}