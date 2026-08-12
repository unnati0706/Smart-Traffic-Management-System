import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CitizenReportsService } from './citizen-reports.service';
import { CreateCitizenReportDto } from './dto/create-citizen-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('citizen-reports')
export class CitizenReportsController {
  constructor(private readonly citizenReportsService: CitizenReportsService) {}

  @Permissions('incident.create')
  @Post()
  async create(@Body() dto: CreateCitizenReportDto, @Request() req) {
    return this.citizenReportsService.create(dto, req.user?.userId);
  }

  @Permissions('incident.view')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.citizenReportsService.findOne(id);
  }
}
