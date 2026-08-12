import { Controller, Get } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  checkHealth() {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'Smart Traffic Management System Backend API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
