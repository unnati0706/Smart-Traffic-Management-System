import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsService, PrismaService],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return aggregated traffic analytics', async () => {
    const res = await service.getTrafficAnalytics();
    expect(res).toHaveProperty('totalIntersections');
    expect(res).toHaveProperty('trafficStateDistribution');
  });

  it('should return environmental impact analytics', async () => {
    const res = await service.getEnvironmentAnalytics();
    expect(res).toHaveProperty('co2ReductionKg');
    expect(res).toHaveProperty('fuelSavedLiters');
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });
});
