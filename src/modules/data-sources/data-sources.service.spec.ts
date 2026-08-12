import { Test, TestingModule } from '@nestjs/testing';
import { DataSourcesService } from './data-sources.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('DataSourcesService', () => {
  let service: DataSourcesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataSourcesService, PrismaService],
    }).compile();

    service = module.get<DataSourcesService>(DataSourcesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return list of government data sources §21', async () => {
    const sources = await service.findAll();
    expect(Array.isArray(sources)).toBe(true);
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });
});
