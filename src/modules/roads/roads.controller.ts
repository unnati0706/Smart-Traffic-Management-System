import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RoadsService } from './roads.service';
import { CreateRoadDto } from './dto/create-road.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roads')
export class RoadsController {
  constructor(private readonly roadsService: RoadsService) {}

  @Permissions('traffic.view')
  @Get()
  async findAll() {
    return this.roadsService.findAll();
  }

  @Permissions('settings.manage')
  @Post()
  async create(@Body() createRoadDto: CreateRoadDto) {
    return this.roadsService.create(createRoadDto);
  }

  @Permissions('traffic.view')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.roadsService.findOne(id);
  }
}
