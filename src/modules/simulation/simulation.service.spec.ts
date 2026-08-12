import { Test, TestingModule } from '@nestjs/testing';
import { SimulationService } from './simulation.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventsGateway } from '../../websocket/gateway/events.gateway';

describe('SimulationService', () => {
  let service: SimulationService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulationService,
        PrismaService,
        {
          provide: EventsGateway,
          useValue: {
            broadcastSimulationCompleted: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SimulationService>(SimulationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should run simulation for ACCIDENT scenario and calculate metrics', async () => {
    const run = await service.create({
      scenario: 'ACCIDENT',
      parameters: { laneClosureCount: 2 },
    });

    expect(run).toHaveProperty('id');
    expect(run.status).toBe('COMPLETED');
    expect(Array.isArray(run.results)).toBe(true);

    const metrics = run.results.map((r) => r.metric);
    expect(metrics).toContain('Average Waiting Time');
    expect(metrics).toContain('CO2 Emissions');
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });
});
