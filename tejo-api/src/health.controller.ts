import { Controller, Get } from '@nestjs/common';

@Controller('')
export class HealthController {
  @Get('health')
  get() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('')
  root() {
    return { message: 'Tejo Beauty API', version: '0.1.0' };
  }
}


