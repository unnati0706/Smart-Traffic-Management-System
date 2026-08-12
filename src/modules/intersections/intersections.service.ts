import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IntersectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.intersection.findMany({
      include: {
        road: true,
        signals: {
          include: {
            phases: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const intersection = await this.prisma.intersection.findUnique({
      where: { id },
      include: {
        road: true,
        signals: {
          include: {
            phases: true,
          },
        },
        trafficObservations: {
          orderBy: { observedAt: 'desc' },
          take: 10,
        },
        incidents: {
          where: { status: { not: 'RESOLVED' } },
        },
      },
    });

    if (!intersection) {
      throw new NotFoundException(`Intersection with ID ${id} not found`);
    }

    return intersection;
  }
}
