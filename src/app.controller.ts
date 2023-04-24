import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppControllerTsController {
  @Get('')
  hello() {
    return 'Hello';
  }
}
