import { Test, TestingModule } from '@nestjs/testing';
import { SignalRecommendationsService } from './signal-recommendations.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { EventsGateway } from '../../websocket/gateway/events.gateway';

describe('SignalRecommendationsService', () => {
  let service: SignalRecommendationsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignalRecommendationsService,
        PrismaService,
        AuditLogsService,
        {
          provide: EventsGateway,
          useValue: {
            broadcastSignalRecommendationCreated: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SignalRecommendationsService>(SignalRecommendationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate signal recommendation using optimization algorithm §13', async () => {
    const signal = await prisma.signal.findFirst();
    if (signal) {
      const rec = await service.generateRecommendation(signal.id);
      expect(rec).toHaveProperty('id');
      expect(rec.status).toBe('PENDING');
      expect(rec.confidence).toBeGreaterThan(0);
    }
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });
});
