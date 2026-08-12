import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { EventsGateway } from '../../websocket/gateway/events.gateway';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class IncidentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAll() {
    return this.prisma.incident.findMany({
      orderBy: { reportedAt: 'desc' },
      include: {
        intersection: true,
        citizenReports: true,
      },
    });
  }

  async findOne(id: string) {
    const incident = await this.prisma.incident.findUnique({
      where: { id },
      include: {
        intersection: true,
        citizenReports: true,
      },
    });

    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }

    return incident;
  }

  async create(dto: CreateIncidentDto, userId?: string) {
    const incident = await this.prisma.incident.create({
      data: dto,
      include: {
        intersection: true,
      },
    });

    await this.auditLogsService.createLog(
      userId || null,
      'CREATE_INCIDENT',
      'Incident',
      incident.id,
      { severity: incident.severity, type: incident.type },
    );

    this.eventsGateway.broadcastIncidentCreated(incident);
    return incident;
  }

  async update(id: string, dto: UpdateIncidentDto, userId?: string) {
    const existing = await this.findOne(id);

    const updated = await this.prisma.incident.update({
      where: { id },
      data: {
        ...dto,
        resolvedAt: dto.status === 'RESOLVED' ? new Date() : existing.resolvedAt,
      },
      include: {
        intersection: true,
      },
    });

    await this.auditLogsService.createLog(
      userId || null,
      'UPDATE_INCIDENT',
      'Incident',
      updated.id,
      dto,
    );

    this.eventsGateway.broadcastIncidentUpdated(updated);
    return updated;
  }

  async assign(id: string, userId: string, assignedToUserId: string) {
    const incident = await this.findOne(id);
    const updated = await this.prisma.incident.update({
      where: { id },
      data: {
        status: 'IN_PROGRESS',
      },
    });

    await this.auditLogsService.createLog(userId, 'ASSIGN_INCIDENT', 'Incident', id, {
      assignedToUserId,
    });

    this.eventsGateway.broadcastIncidentUpdated(updated);
    return updated;
  }
}
