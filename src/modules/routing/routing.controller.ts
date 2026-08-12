import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RoutingService } from './routing.service';
import { PlanRouteDto } from './dto/plan-route.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('routes')
export class RoutingController {
  constructor(private readonly routingService: RoutingService) {}

  @Permissions('traffic.view')
  @Post('plan')
  async planRoute(@Body() dto: PlanRouteDto) {
    return this.routingService.planRoute(dto);
  }
}
