import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  private readonly appService: AppService;

  constructor() {
    this.appService = new AppService();
    this.appService.connect().then();
  }

  @Get()
  @ApiExcludeEndpoint()
  getHello(): string {
    return AppService.getHello();
  }

  @Post('register.json')
  async register(@Req() req: Request, @Param() { url }: RegisterDto): Promise<{
    url: string;
  }> {
    return {
      url: `http://localhost:3000/${await this.appService.register(url)}`,
    };
  }
}
