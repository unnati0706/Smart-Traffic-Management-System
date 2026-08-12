import {
  Controller,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SignalRecommendationsService } from './signal-recommendations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller()
export class SignalRecommendationsController {
  constructor(
    private readonly recommendationsService: SignalRecommendationsService,
  ) {}

  @Permissions('signal.recommend')
  @Post('signals/:id/recommendations')
  async generateRecommendation(@Param('id') signalId: string, @Request() req) {
    return this.recommendationsService.generateRecommendation(
      signalId,
      req.user.userId,
    );
  }

  @Permissions('signal.recommend')
  @Post('signal-recommendations/:id/simulate')
  async simulateRecommendation(@Param('id') id: string) {
    return this.recommendationsService.simulateRecommendation(id);
  }

  @Permissions('signal.approve')
  @Post('signal-recommendations/:id/approve')
  async approveRecommendation(@Param('id') id: string, @Request() req) {
    return this.recommendationsService.approveRecommendation(
      id,
      req.user.userId,
    );
  }
}
