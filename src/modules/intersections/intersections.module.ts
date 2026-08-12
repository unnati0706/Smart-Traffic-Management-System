import { Module } from '@nestjs/common';
import { IntersectionsService } from './intersections.service';
import { IntersectionsController } from './intersections.controller';

@Module({
  controllers: [IntersectionsController],
  providers: [IntersectionsService],
  exports: [IntersectionsService],
})
export class IntersectionsModule {}
