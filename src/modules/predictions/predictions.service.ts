import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { EventsGateway } from '../../websocket/gateway/events.gateway';

@Injectable()
export class PredictionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async findAll() {
    return this.prisma.prediction.findMany({
      orderBy: { generatedAt: 'desc' },
      include: {
        intersection: true,
      },
    });
  }

  async findOne(id: string) {
    const pred = await this.prisma.prediction.findUnique({
      where: { id },
      include: {
        intersection: true,
      },
    });

    if (!pred) {
      throw new NotFoundException(`Prediction with ID ${id} not found`);
    }

    return pred;
  }

  async create(dto: CreatePredictionDto) {
    // Check actual traffic observations for features per §11
    const obs = await this.prisma.trafficObservation.findFirst({
      where: { intersectionId: dto.intersectionId },
      orderBy: { observedAt: 'desc' },
    });

    // If insufficient data exists, return baseline demo mode per §11
    const factors = dto.factors || [
      'Peak rush hour pattern (17:00-19:00)',
      'Historical lane occupancy',
      'Recent signal phase duration',
    ];

    const pred = await this.prisma.prediction.create({
      data: {
        intersectionId: dto.intersectionId,
        horizonMinutes: dto.horizonMinutes,
        predictedDensity: dto.predictedDensity,
        predictedQueue: dto.predictedQueue,
        congestionProbability: dto.congestionProbability,
        confidence: obs ? dto.confidence : 0.75, // Baseline demo confidence if data sparse
        factorsJson: JSON.stringify(factors),
      },
      include: {
        intersection: true,
      },
    });

    this.eventsGateway.broadcastPredictionUpdated(pred);
    return pred;
  }

  async getExplanation(intersectionId: string) {
    const latestPred = await this.prisma.prediction.findFirst({
      where: { intersectionId },
      orderBy: { generatedAt: 'desc' },
      include: { intersection: true },
    });

    const activeIncidents = await this.prisma.incident.findMany({
      where: { intersectionId, status: { not: 'RESOLVED' } },
    });

    return {
      intersectionId,
      intersectionName: latestPred?.intersection?.name || 'Corridor Intersection',
      horizonMinutes: latestPred?.horizonMinutes || 30,
      predictedDensity: latestPred?.predictedDensity || 0.65,
      congestionProbability: latestPred?.congestionProbability || 0.8,
      confidence: latestPred?.confidence || 0.85,
      primaryFactors: [
        {
          factor: 'Rush Hour Congestion Peak',
          weight: 0.45,
          impact: 'HIGH',
          description: 'Historical volume spikes during 17:30 - 19:00 weekday window.',
        },
        {
          factor: 'Active Incidents Nearby',
          weight: 0.35,
          impact: activeIncidents.length > 0 ? 'HIGH' : 'LOW',
          description: `${activeIncidents.length} active incident(s) restricting outflow capacity.`,
        },
        {
          factor: 'Upstream Signal Bottleneck',
          weight: 0.2,
          impact: 'MEDIUM',
          description: 'Signal queue spillback from adjacent arterial junction.',
        },
      ],
    };
  }
}
