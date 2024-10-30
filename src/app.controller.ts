import { Controller, Get } from '@nestjs/common';
@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return "You've reached the end of world 2024!!!! \n ☠️";
  }
}
