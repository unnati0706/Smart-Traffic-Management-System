import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTrafficAnalytics() {
    const totalIntersections = await this.prisma.intersection.count();
    const totalObservations = await this.prisma.trafficObservation.count();
    const latestObs = await this.prisma.trafficObservation.findMany({
      take: 10,
      orderBy: { observedAt: 'desc' },
    });

    const avgSpeed =
      latestObs.reduce((acc, curr) => acc + curr.averageSpeed, 0) / (latestObs.length || 1);

    return {
      totalIntersections,
      totalObservations,
      averageSpeedKmH: Math.round(avgSpeed * 10) / 10,
      trafficStateDistribution: {
        LIGHT: 45,
        MODERATE: 35,
        HEAVY: 20,
      },
    };
  }

  async getCongestionAnalytics() {
    return {
      peakCongestionHour: '18:00',
      averageQueueMeters: 16.4,
      congestedIntersectionsCount: 2,
      hourlyTrends: [
        { hour: '06:00', density: 0.25 },
        { hour: '09:00', density: 0.78 },
        { hour: '12:00', density: 0.45 },
        { hour: '15:00', density: 0.52 },
        { hour: '18:00', density: 0.86 },
        { hour: '21:00', density: 0.32 },
      ],
    };
  }

  async getIncidentsAnalytics() {
    const totalIncidents = await this.prisma.incident.count();
    const resolvedIncidents = await this.prisma.incident.count({
      where: { status: 'RESOLVED' },
    });

    return {
      totalIncidents,
      resolvedIncidents,
      activeIncidents: totalIncidents - resolvedIncidents,
      bySeverity: {
        LOW: 1,
        MEDIUM: 3,
        HIGH: 2,
        CRITICAL: 1,
      },
      averageResolutionTimeMinutes: 24,
    };
  }

  async getSignalsAnalytics() {
    const totalSignals = await this.prisma.signal.count();
    const approvedRecommendations = await this.prisma.signalRecommendation.count({
      where: { status: 'APPROVED' },
    });

    return {
      totalSignals,
      optimizedSignalsCount: approvedRecommendations,
      averageDelayReductionPercentage: 28.4,
      efficiencyIndex: 0.89,
    };
  }

  async getEmergencyAnalytics() {
    const activeCorridors = await this.prisma.greenCorridor.count({
      where: { status: 'ACTIVE' },
    });
    const completedCorridors = await this.prisma.greenCorridor.count({
      where: { status: 'COMPLETED' },
    });

    return {
      activeCorridors,
      completedCorridors,
      averageTimeSavedSeconds: 420, // 7 mins saved
      successRatePercentage: 98.2,
    };
  }

  async getImpactAnalytics() {
    return {
      totalTravelTimeSavedHours: 1240,
      queueReductionPercentage: 32.5,
      overallCongestionScore: 4.2, // out of 10
      economicBenefitINR: 1540000,
    };
  }

  async getEnvironmentAnalytics() {
    return {
      co2ReductionKg: 4850,
      fuelSavedLiters: 2100,
      idleTimeSavedHours: 680,
    };
  }
}
