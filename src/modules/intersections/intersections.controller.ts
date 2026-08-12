import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { IntersectionsService } from './intersections.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('intersections')
export class IntersectionsController {
  constructor(private readonly intersectionsService: IntersectionsService) {}

  @Permissions('traffic.view')
  @Get()
  async findAll() {
    return this.intersectionsService.findAll();
  }

  @Permissions('traffic.view')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.intersectionsService.findOne(id);
  }
}
