import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmergencyVehicleDto, PlanGreenCorridorDto } from './dto/emergency.dto';
import { EventsGateway } from '../../websocket/gateway/events.gateway';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class EmergencyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAllVehicles() {
    return this.prisma.emergencyVehicle.findMany({
      include: {
        greenCorridors: {
          include: {
            intersections: {
              include: { intersection: true },
            },
          },
        },
      },
    });
  }

  async findOneVehicle(id: string) {
    const vehicle = await this.prisma.emergencyVehicle.findUnique({
      where: { id },
      include: {
        greenCorridors: {
          include: {
            intersections: {
              include: { intersection: true },
            },
          },
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException(`Emergency vehicle with ID ${id} not found`);
    }

    return vehicle;
  }

  async createVehicle(dto: CreateEmergencyVehicleDto) {
    const vehicle = await this.prisma.emergencyVehicle.create({
      data: {
        ...dto,
        status: 'DISPATCHED',
      },
    });

    this.eventsGateway.broadcastEmergencyVehicleUpdated(vehicle);
    return vehicle;
  }

  async planGreenCorridor(dto: PlanGreenCorridorDto, userId?: string) {
    const vehicle = await this.findOneVehicle(dto.emergencyVehicleId);
    const intersections = await this.prisma.intersection.findMany({
      take: 4,
      include: { signals: true },
    });

    const normalEtaSeconds = 900; // 15 mins
    const optimizedEtaSeconds = 480; // 8 mins
    const timeSavedSeconds = normalEtaSeconds - optimizedEtaSeconds;

    const corridor = await this.prisma.greenCorridor.create({
      data: {
        emergencyVehicleId: vehicle.id,
        origin: `${vehicle.latitude.toFixed(4)}, ${vehicle.longitude.toFixed(4)}`,
        destination: `${vehicle.destinationLatitude.toFixed(4)}, ${vehicle.destinationLongitude.toFixed(4)}`,
        normalEtaSeconds,
        optimizedEtaSeconds,
        timeSavedSeconds,
        status: 'ACTIVE',
        intersections: {
          create: intersections.map((intersection, idx) => ({
            intersectionId: intersection.id,
            sequence: idx + 1,
            recommendedPhase: 1, // Green priority phase
            recommendedDuration: 45,
          })),
        },
      },
      include: {
        intersections: {
          include: { intersection: true },
        },
      },
    });

    await this.prisma.emergencyVehicle.update({
      where: { id: vehicle.id },
      data: { status: 'IN_TRANSIT' },
    });

    await this.auditLogsService.createLog(
      userId || null,
      'CREATE_GREEN_CORRIDOR',
      'GreenCorridor',
      corridor.id,
      { vehicleId: vehicle.id, timeSavedSeconds },
    );

    this.eventsGateway.broadcastEmergencyVehicleUpdated({
      vehicleId: vehicle.id,
      corridorId: corridor.id,
      status: 'GREEN_CORRIDOR_ACTIVE',
    });

    return corridor;
  }

  async simulateGreenCorridor(id: string) {
    const corridor = await this.prisma.greenCorridor.findUnique({
      where: { id },
      include: {
        emergencyVehicle: true,
        intersections: { include: { intersection: true } },
      },
    });

    if (!corridor) {
      throw new NotFoundException(`Green Corridor with ID ${id} not found`);
    }

    return {
      corridorId: id,
      vehicleIdentifier: corridor.emergencyVehicle.identifier,
      normalEtaSeconds: corridor.normalEtaSeconds,
      optimizedEtaSeconds: corridor.optimizedEtaSeconds,
      timeSavedSeconds: corridor.timeSavedSeconds,
      savedPercentage: Math.round((corridor.timeSavedSeconds / corridor.normalEtaSeconds) * 100),
      intersectionsPreempted: corridor.intersections.length,
      simulatedTimeline: corridor.intersections.map((node) => ({
        sequence: node.sequence,
        intersectionName: node.intersection.name,
        preemptionGreenDuration: node.recommendedDuration,
        clearanceStatus: 'PREEMPTED_GREEN',
      })),
    };
  }
}
