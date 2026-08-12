import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Permissions('incident.view')
  @Get()
  async findAll() {
    return this.incidentsService.findAll();
  }

  @Permissions('incident.create')
  @Post()
  async create(@Body() dto: CreateIncidentDto, @Request() req) {
    return this.incidentsService.create(dto, req.user.userId);
  }

  @Permissions('incident.view')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(id);
  }

  @Permissions('incident.update')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateIncidentDto,
    @Request() req,
  ) {
    return this.incidentsService.update(id, dto, req.user.userId);
  }

  @Permissions('incident.update')
  @Post(':id/assign')
  async assign(
    @Param('id') id: string,
    @Body('assignedToUserId') assignedToUserId: string,
    @Request() req,
  ) {
    return this.incidentsService.assign(id, req.user.userId, assignedToUserId);
  }
}
