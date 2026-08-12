import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Permissions('reports.create')
  @Post()
  async createReport(
    @Body('type') type: string,
    @Body('parameters') parameters: any,
    @Request() req,
  ) {
    return this.reportsService.createReport(type, parameters, req.user?.userId);
  }

  @Permissions('reports.create')
  @Get()
  async findAll() {
    return this.reportsService.findAll();
  }

  @Permissions('reports.create')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Permissions('reports.create')
  @Get(':id/download')
  async downloadReport(@Param('id') id: string) {
    return this.reportsService.downloadReport(id);
  }
}
