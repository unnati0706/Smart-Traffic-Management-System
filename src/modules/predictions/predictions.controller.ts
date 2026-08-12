import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller()
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  @Permissions('traffic.view')
  @Get('predictions')
  async findAll() {
    return this.predictionsService.findAll();
  }

  @Permissions('traffic.view')
  @Post('predictions')
  async create(@Body() dto: CreatePredictionDto) {
    return this.predictionsService.create(dto);
  }

  @Permissions('traffic.view')
  @Get('predictions/:id')
  async findOne(@Param('id') id: string) {
    return this.predictionsService.findOne(id);
  }

  @Permissions('traffic.view')
  @Get('explanations/:intersectionId')
  async getExplanation(@Param('intersectionId') intersectionId: string) {
    return this.predictionsService.getExplanation(intersectionId);
  }
}
