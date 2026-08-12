import { Test, TestingModule } from '@nestjs/testing';
import { CvService } from './cv.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CvService', () => {
  let service: CvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CvService, PrismaService],
    }).compile();

    service = module.get<CvService>(CvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create CV processing job', async () => {
    const job = await service.createCvJob('intersection-123');
    expect(job).toHaveProperty('jobId');
    expect(job.status).toBe('PROCESSING');
  });

  it('should retrieve CV detections', async () => {
    const detections = await service.getDetections('job-123');
    expect(detections).toHaveProperty('detections');
    expect(Array.isArray(detections.detections)).toBe(true);
  });
});
