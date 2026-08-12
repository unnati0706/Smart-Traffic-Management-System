import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CvService {
  constructor(private readonly prisma: PrismaService) {}

  async createCvJob(intersectionId: string, videoUrl?: string) {
    const jobId = `cv_job_${Date.now()}`;
    return {
      jobId,
      intersectionId,
      status: 'PROCESSING',
      videoUrl: videoUrl || '/storage/cv_feeds/intersection_camera_01.mp4',
      createdAt: new Date(),
    };
  }

  async getJobStatus(jobId: string) {
    return {
      jobId,
      status: 'COMPLETED',
      framesProcessed: 1800,
      totalVehiclesDetected: 342,
      completedAt: new Date(),
    };
  }

  async getDetections(jobId: string) {
    return {
      jobId,
      detections: [
        { vehicleClass: 'CAR', confidence: 0.94, trackId: 'trk_001', x: 120, y: 340, width: 85, height: 45 },
        { vehicleClass: 'BUS', confidence: 0.91, trackId: 'trk_002', x: 210, y: 280, width: 140, height: 75 },
        { vehicleClass: 'MOTORCYCLE', confidence: 0.88, trackId: 'trk_003', x: 450, y: 410, width: 40, height: 30 },
      ],
    };
  }
}
