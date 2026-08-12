import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Permissions('analytics.view')
  @Get('analytics/traffic')
  async getTrafficAnalytics() {
    return this.analyticsService.getTrafficAnalytics();
  }

  @Permissions('analytics.view')
  @Get('analytics/congestion')
  async getCongestionAnalytics() {
    return this.analyticsService.getCongestionAnalytics();
  }

  @Permissions('analytics.view')
  @Get('analytics/incidents')
  async getIncidentsAnalytics() {
    return this.analyticsService.getIncidentsAnalytics();
  }

  @Permissions('analytics.view')
  @Get('analytics/signals')
  async getSignalsAnalytics() {
    return this.analyticsService.getSignalsAnalytics();
  }

  @Permissions('analytics.view')
  @Get('analytics/emergency')
  async getEmergencyAnalytics() {
    return this.analyticsService.getEmergencyAnalytics();
  }

  @Permissions('analytics.view')
  @Get('impact')
  async getImpactAnalytics() {
    return this.analyticsService.getImpactAnalytics();
  }

  @Permissions('analytics.view')
  @Get('environment')
  async getEnvironmentAnalytics() {
    return this.analyticsService.getEnvironmentAnalytics();
  }
}
