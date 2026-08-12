import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { CreateEmergencyVehicleDto, PlanGreenCorridorDto } from './dto/emergency.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller()
export class EmergencyController {
  constructor(private readonly emergencyService: EmergencyService) {}

  @Permissions('emergency.view')
  @Get('emergency-vehicles')
  async findAllVehicles() {
    return this.emergencyService.findAllVehicles();
  }

  @Permissions('emergency.manage')
  @Post('emergency-vehicles')
  async createVehicle(@Body() dto: CreateEmergencyVehicleDto) {
    return this.emergencyService.createVehicle(dto);
  }

  @Permissions('emergency.view')
  @Get('emergency-vehicles/:id')
  async findOneVehicle(@Param('id') id: string) {
    return this.emergencyService.findOneVehicle(id);
  }

  @Permissions('emergency.manage')
  @Post('green-corridors/plan')
  async planGreenCorridor(@Body() dto: PlanGreenCorridorDto, @Request() req) {
    return this.emergencyService.planGreenCorridor(dto, req.user?.userId);
  }

  @Permissions('emergency.manage')
  @Post('green-corridors/:id/simulate')
  async simulateGreenCorridor(@Param('id') id: string) {
    return this.emergencyService.simulateGreenCorridor(id);
  }
}
