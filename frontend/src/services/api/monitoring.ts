import { api } from './client';

export interface BoundingBox {
  id: number;
  label: string;
  category: 'CAR' | 'BUS' | 'TRUCK' | 'TWO_WHEELER';
  top: string;
  left: string;
  width: string;
  height: string;
  confidence: number;
}

export interface CVJobTelemetry {
  jobId: string;
  cameraId: string;
  cameraName: string;
  status: 'IDLE' | 'PROCESSING' | 'ACTIVE';
  fps: number;
  latencyMs: number;
  totalVehicles: number;
  passengerCars: number;
  buses: number;
  trucks: number;
  twoWheelers: number;
  queueLengthMeters: number;
  laneOccupancyPercent: number;
  detections: BoundingBox[];
}

export const monitoringService = {
  createJob: async (cameraId: string): Promise<{ jobId: string }> => {
    try {
      const response = await api.post<{ jobId: string }>('/cv/jobs', { cameraId });
      return response.data;
    } catch {
      return { jobId: `cv_job_${Date.now()}` };
    }
  },

  getJobTelemetry: async (jobId: string, cameraId: string): Promise<CVJobTelemetry> => {
    try {
      const response = await api.get<CVJobTelemetry>(`/cv/jobs/${jobId}`);
      return response.data;
    } catch {
      // Mock telemetry tailored per camera node
      if (cameraId.includes('102')) {
        return {
          jobId,
          cameraId,
          cameraName: 'CAM-102 (MG Road Junction)',
          status: 'ACTIVE',
          fps: 30,
          latencyMs: 14,
          totalVehicles: 48,
          passengerCars: 32,
          buses: 6,
          trucks: 2,
          twoWheelers: 8,
          queueLengthMeters: 95,
          laneOccupancyPercent: 82,
          detections: [
            { id: 1, label: 'CAR (98%)', category: 'CAR', top: '30%', left: '25%', width: '120px', height: '80px', confidence: 0.98 },
            { id: 2, label: 'BUS (95%)', category: 'BUS', top: '45%', left: '50%', width: '160px', height: '110px', confidence: 0.95 },
            { id: 3, label: 'CAR (99%)', category: 'CAR', top: '60%', left: '15%', width: '110px', height: '75px', confidence: 0.99 },
            { id: 4, label: 'TWO-WHEELER (91%)', category: 'TWO_WHEELER', top: '35%', left: '70%', width: '60px', height: '50px', confidence: 0.91 },
          ],
        };
      } else {
        return {
          jobId,
          cameraId,
          cameraName: 'CAM-101 (Central Ave Approach)',
          status: 'ACTIVE',
          fps: 30,
          latencyMs: 11,
          totalVehicles: 24,
          passengerCars: 16,
          buses: 2,
          trucks: 1,
          twoWheelers: 5,
          queueLengthMeters: 35,
          laneOccupancyPercent: 44,
          detections: [
            { id: 101, label: 'CAR (97%)', category: 'CAR', top: '40%', left: '30%', width: '110px', height: '70px', confidence: 0.97 },
            { id: 102, label: 'CAR (96%)', category: 'CAR', top: '55%', left: '60%', width: '115px', height: '75px', confidence: 0.96 },
            { id: 103, label: 'TWO-WHEELER (89%)', category: 'TWO_WHEELER', top: '30%', left: '45%', width: '55px', height: '45px', confidence: 0.89 },
          ],
        };
      }
    }
  },
};
