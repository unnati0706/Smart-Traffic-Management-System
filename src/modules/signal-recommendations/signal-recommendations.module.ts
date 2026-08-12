import { Module } from '@nestjs/common';
import { SignalRecommendationsService } from './signal-recommendations.service';
import { SignalRecommendationsController } from './signal-recommendations.controller';

@Module({
  controllers: [SignalRecommendationsController],
  providers: [SignalRecommendationsService],
  exports: [SignalRecommendationsService],
})
export class SignalRecommendationsModule {}
