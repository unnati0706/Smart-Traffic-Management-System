import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateObservationDto } from './dto/create-observation.dto';
import { EventsGateway } from '../../websocket/gateway/events.gateway';

@Injectable()
export class TrafficService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async getMapData() {
    const intersections = await this.prisma.intersection.findMany({
      include: {
        road: true,
        trafficObservations: {
          orderBy: { observedAt: 'desc' },
          take: 1,
        },
        incidents: {
          where: { status: { not: 'RESOLVED' } },
        },
      },
    });

    const features = intersections.map((intersection) => {
      const latestObs = intersection.trafficObservations[0];
      const congestionLevel = !latestObs
        ? 'LOW'
        : latestObs.density > 0.75
        ? 'HEAVY'
        : latestObs.density > 0.4
        ? 'MODERATE'
        : 'LOW';

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [intersection.longitude, intersection.latitude],
        },
        properties: {
          id: intersection.id,
          name: intersection.name,
          roadName: intersection.road.name,
          congestionLevel,
          vehicleCount: latestObs?.vehicleCount || 0,
          averageSpeed: latestObs?.averageSpeed || 0,
          activeIncidents: intersection.incidents.length,
        },
      };
    });

    return {
      type: 'FeatureCollection',
      features,
    };
  }

  async getObservations(intersectionId?: string, limit = 50) {
    return this.prisma.trafficObservation.findMany({
      where: intersectionId ? { intersectionId } : {},
      orderBy: { observedAt: 'desc' },
      take: Number(limit),
      include: {
        intersection: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async createObservation(dto: CreateObservationDto) {
    const obs = await this.prisma.trafficObservation.create({
      data: dto,
      include: {
        intersection: true,
      },
    });

    // Emit realtime WebSocket event per §23
    this.eventsGateway.broadcastTrafficUpdate(obs);

    return obs;
  }
}
