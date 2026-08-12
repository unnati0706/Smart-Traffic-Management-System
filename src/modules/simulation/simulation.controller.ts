import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('simulations')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Permissions('simulation.create')
  @Post()
  async create(@Body() dto: CreateSimulationDto) {
    return this.simulationService.create(dto);
  }

  @Permissions('traffic.view')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.simulationService.findOne(id);
  }
}
