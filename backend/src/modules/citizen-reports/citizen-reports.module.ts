import { Module } from '@nestjs/common';
import { CitizenReportsService } from './citizen-reports.service';
import { CitizenReportsController } from './citizen-reports.controller';
import { IncidentsModule } from '../incidents/incidents.module';

@Module({
  imports: [IncidentsModule],
  controllers: [CitizenReportsController],
  providers: [CitizenReportsService],
  exports: [CitizenReportsService],
})
export class CitizenReportsModule {}
