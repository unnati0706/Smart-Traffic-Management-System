import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { CreateObservationDto } from './dto/create-observation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('traffic')
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Permissions('traffic.view')
  @Get('map')
  async getMapData() {
    return this.trafficService.getMapData();
  }

  @Permissions('traffic.view')
  @Get('observations')
  async getObservations(
    @Query('intersection') intersectionId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.trafficService.getObservations(intersectionId, limit);
  }

  @Permissions('traffic.view')
  @Post('observations')
  async createObservation(@Body() dto: CreateObservationDto) {
    return this.trafficService.createObservation(dto);
  }
}
