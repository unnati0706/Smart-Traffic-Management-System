import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCitizenReportDto } from './dto/create-citizen-report.dto';
import { IncidentsService } from '../incidents/incidents.service';
import { EventsGateway } from '../../websocket/gateway/events.gateway';

@Injectable()
export class CitizenReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly incidentsService: IncidentsService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async create(dto: CreateCitizenReportDto, userId?: string) {
    const report = await this.prisma.citizenReport.create({
      data: {
        ...dto,
        userId: userId || null,
        status: 'SUBMITTED',
      },
    });

    // Per §9: When a valid citizen report is accepted, associate or create an incident
    const nearestIntersection = await this.prisma.intersection.findFirst();

    if (nearestIntersection) {
      const incident = await this.incidentsService.create(
        {
          type: dto.type,
          intersectionId: nearestIntersection.id,
          latitude: dto.latitude,
          longitude: dto.longitude,
          severity: 'MEDIUM',
          source: 'CITIZEN',
          description: `[Citizen Report] ${dto.description}`,
        },
        userId,
      );

      await this.prisma.citizenReport.update({
        where: { id: report.id },
        data: {
          incidentId: incident.id,
          status: 'INCIDENT_CREATED',
        },
      });
    }

    return report;
  }

  async findOne(id: string) {
    const report = await this.prisma.citizenReport.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        incident: true,
      },
    });

    if (!report) {
      throw new NotFoundException(`Citizen Report with ID ${id} not found`);
    }

    return report;
  }
}
