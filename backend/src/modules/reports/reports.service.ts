import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(type: string, parameters?: any, userId?: string) {
    const report = await this.prisma.report.create({
      data: {
        type: type || 'TRAFFIC_SUMMARY',
        parametersJson: JSON.stringify(parameters || {}),
        status: 'COMPLETED',
        filePath: `/storage/reports/report_${Date.now()}.${type === 'CSV' ? 'csv' : 'pdf'}`,
        generatedBy: userId || 'SYSTEM',
      },
    });

    return report;
  }

  async findAll() {
    return this.prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return report;
  }

  async downloadReport(id: string) {
    const report = await this.findOne(id);
    return {
      id: report.id,
      type: report.type,
      filename: `traffic_report_${report.id.substring(0, 8)}.csv`,
      contentType: 'text/csv',
      content: `ID,Timestamp,TrafficState,AverageSpeed,ActiveIncidents\n1,2026-08-12T12:00:00Z,MODERATE,34.5,1\n2,2026-08-12T13:00:00Z,HEAVY,22.1,2\n3,2026-08-12T14:00:00Z,LIGHT,42.0,0\n`,
    };
  }
}
