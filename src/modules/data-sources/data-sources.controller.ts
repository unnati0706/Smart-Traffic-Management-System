import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DataSourcesService } from './data-sources.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('data-sources')
export class DataSourcesController {
  constructor(private readonly dataSourcesService: DataSourcesService) {}

  @Permissions('traffic.view')
  @Get()
  async findAll() {
    return this.dataSourcesService.findAll();
  }

  @Permissions('traffic.view')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.dataSourcesService.findOne(id);
  }
}
