import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SignalsService } from './signals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('signals')
export class SignalsController {
  constructor(private readonly signalsService: SignalsService) {}

  @Permissions('signal.view')
  @Get()
  async findAll() {
    return this.signalsService.findAll();
  }

  @Permissions('signal.view')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.signalsService.findOne(id);
  }
}
