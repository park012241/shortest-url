import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
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
  async register(@Req() req: Request, @Res() res: Response, @Param() { url }: RegisterDto) {
    const result = await this.appService.register(url);
    res.status(result.isNew ? 201 : 200).send({
      url: `http://localhost:3000/${result.id}`,
    });
  }
}
