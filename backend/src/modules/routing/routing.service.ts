import { Injectable } from '@nestjs/common';
import { PlanRouteDto } from './dto/plan-route.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RoutingService {
  constructor(private readonly prisma: PrismaService) {}

  async planRoute(dto: PlanRouteDto) {
    // Check for incidents near path
    const activeIncidents = await this.prisma.incident.count({
      where: { status: { not: 'RESOLVED' } },
    });

    const isCongested = activeIncidents > 2;

    const routeA = {
      id: 'route-a',
      distance_meters: 5200,
      duration_seconds: isCongested ? 900 : 600,
      traffic_state: isCongested ? 'HEAVY' : 'MODERATE',
      delay_seconds: isCongested ? 300 : 60,
      geometry: {
        type: 'LineString',
        coordinates: [
          [dto.originLongitude, dto.originLatitude],
          [
            (dto.originLongitude + dto.destinationLongitude) / 2,
            (dto.originLatitude + dto.destinationLatitude) / 2,
          ],
          [dto.destinationLongitude, dto.destinationLatitude],
        ],
      },
      recommended: !isCongested,
      reason: 'Shortest distance along main arterial corridor',
    };

    const routeB = {
      id: 'route-b',
      distance_meters: 6100,
      duration_seconds: 680,
      traffic_state: 'LIGHT',
      delay_seconds: 20,
      geometry: {
        type: 'LineString',
        coordinates: [
          [dto.originLongitude, dto.originLatitude],
          [
            (dto.originLongitude + dto.destinationLongitude) / 2 + 0.01,
            (dto.originLatitude + dto.destinationLatitude) / 2 - 0.01,
          ],
          [dto.destinationLongitude, dto.destinationLatitude],
        ],
      },
      recommended: isCongested,
      reason: 'Bypasses active incident area with lower predicted congestion',
    };

    return {
      routes: [routeA, routeB],
    };
  }
}
