import { Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { RedirectDto } from './dto/redirect.dto';

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
  async register(@Req() req: Request, @Res() res: Response, @Query() { url }: RegisterDto) {
    const result = await this.appService.register(url);
    res.status(result.isNew ? 201 : 200).send({
      url: `http://localhost:3000/${result.id}`,
    });
  }

  @Get(':id')
  async redirect(@Res() res: Response, @Param() { id }: RedirectDto) {
    try {
      res.redirect(301, (await this.appService.getOriginalURL(id)).url);
    } catch (e) {
      res.status(404).send({
        msg: 'Not Found',
      });
    }
  }
}
