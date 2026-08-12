import { Test, TestingModule } from '@nestjs/testing';
import { PredictionsService } from './predictions.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventsGateway } from '../../websocket/gateway/events.gateway';

describe('PredictionsService', () => {
  let service: PredictionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PredictionsService,
        PrismaService,
        {
          provide: EventsGateway,
          useValue: {
            broadcastPredictionUpdated: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PredictionsService>(PredictionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return list of predictions', async () => {
    const predictions = await service.findAll();
    expect(Array.isArray(predictions)).toBe(true);
  });

  it('should return prediction explanation factors for intersection', async () => {
    const intersection = await prisma.intersection.findFirst();
    if (intersection) {
      const explanation = await service.getExplanation(intersection.id);
      expect(explanation).toHaveProperty('intersectionId');
      expect(explanation).toHaveProperty('primaryFactors');
    }
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });
});
