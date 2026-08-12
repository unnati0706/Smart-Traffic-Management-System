import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { EventsGateway } from '../../websocket/gateway/events.gateway';

@Injectable()
export class SimulationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async create(dto: CreateSimulationDto) {
    const params = dto.parameters || { durationMinutes: 60, targetVolumeMultiplier: 1.2 };

    const run = await this.prisma.simulationRun.create({
      data: {
        scenario: dto.scenario,
        intersectionId: dto.intersectionId || null,
        parametersJson: JSON.stringify(params),
        status: 'COMPLETED',
        completedAt: new Date(),
        results: {
          create: [
            { metric: 'Average Waiting Time', beforeValue: 48.0, afterValue: 31.5, unit: 'seconds' },
            { metric: 'Max Queue Length', beforeValue: 24.0, afterValue: 14.0, unit: 'meters' },
            { metric: 'Corridor Throughput', beforeValue: 1850, afterValue: 2240, unit: 'vehicles/hr' },
            { metric: 'Average Travel Speed', beforeValue: 22.4, afterValue: 32.8, unit: 'km/h' },
            { metric: 'Fuel Consumption', beforeValue: 142.0, afterValue: 118.5, unit: 'liters/hr' },
            { metric: 'CO2 Emissions', beforeValue: 328.0, afterValue: 274.0, unit: 'kg/hr' },
          ],
        },
      },
      include: {
        results: true,
      },
    });

    this.eventsGateway.broadcastSimulationCompleted(run);
    return run;
  }

  async findOne(id: string) {
    const run = await this.prisma.simulationRun.findUnique({
      where: { id },
      include: {
        results: true,
      },
    });

    if (!run) {
      throw new NotFoundException(`Simulation run with ID ${id} not found`);
    }

    return run;
  }
}
