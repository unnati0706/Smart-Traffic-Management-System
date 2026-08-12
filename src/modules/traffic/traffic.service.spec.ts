import { Test, TestingModule } from '@nestjs/testing';
import { TrafficService } from './traffic.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventsGateway } from '../../websocket/gateway/events.gateway';

describe('TrafficService', () => {
  let service: TrafficService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrafficService,
        PrismaService,
        {
          provide: EventsGateway,
          useValue: {
            broadcastTrafficUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TrafficService>(TrafficService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return map data in GeoJSON FeatureCollection format', async () => {
    const mapData = await service.getMapData();
    expect(mapData.type).toBe('FeatureCollection');
    expect(Array.isArray(mapData.features)).toBe(true);
  });

  it('should fetch observations list', async () => {
    const observations = await service.getObservations();
    expect(Array.isArray(observations)).toBe(true);
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });
});
