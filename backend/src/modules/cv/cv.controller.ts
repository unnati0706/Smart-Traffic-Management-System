import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CvService } from './cv.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Permissions('traffic.view')
  @Post('jobs')
  async createJob(
    @Body('intersectionId') intersectionId: string,
    @Body('videoUrl') videoUrl?: string,
  ) {
    return this.cvService.createCvJob(intersectionId, videoUrl);
  }

  @Permissions('traffic.view')
  @Get('jobs/:id')
  async getJobStatus(@Param('id') id: string) {
    return this.cvService.getJobStatus(id);
  }

  @Permissions('traffic.view')
  @Get('jobs/:id/detections')
  async getDetections(@Param('id') id: string) {
    return this.cvService.getDetections(id);
  }
}
