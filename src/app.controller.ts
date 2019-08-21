import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly appService: AppService;

  constructor() {
    this.appService = new AppService();
    this.appService.connect().then();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
