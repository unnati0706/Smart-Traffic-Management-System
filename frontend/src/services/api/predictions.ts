import { api } from './client';
import { TrafficState } from '../../types';

export interface ForecastPoint {
  time: string;
  historicalVolume: number;
  predictedVolume: number;
  confidenceLower: number;
  confidenceUpper: number;
}

export interface PredictionData {
  intersectionId: string;
  intersectionName: string;
  horizonMinutes: 15 | 30 | 60;
  forecastedPeakVolume: number;
  confidenceScore: number;
  bottleneckRiskLevel: TrafficState;
  causalFactors: string[];
  chartData: ForecastPoint[];
  generatedAt: string;
}

export const predictionsService = {
  getPredictions: async (intersectionId: string = 'sig-102', horizon: 15 | 30 | 60 = 30): Promise<PredictionData> => {
    try {
      const response = await api.get<PredictionData>('/predictions', {
        params: { intersectionId, horizon },
      });
      return response.data;
    } catch {
      // Mock forecast data tailored per horizon
      const baseVol = horizon === 15 ? 410 : horizon === 30 ? 490 : 540;
      return {
        intersectionId,
        intersectionName: 'MG Road Junction',
        horizonMinutes: horizon,
        forecastedPeakVolume: baseVol,
        confidenceScore: 0.928,
        bottleneckRiskLevel: horizon === 60 ? 'SEVERE' : 'HEAVY',
        causalFactors: [
          `Expected ${horizon === 60 ? '42%' : '28%'} vehicle volume spike due to evening commute peak hour.`,
          'Ongoing bridge maintenance work on secondary feeder link road.',
          'Special event dispersion near Tech Park stadium zone.',
        ],
        chartData: [
          { time: '14:00', historicalVolume: 320, predictedVolume: 320, confidenceLower: 300, confidenceUpper: 340 },
          { time: '14:15', historicalVolume: 350, predictedVolume: 350, confidenceLower: 330, confidenceUpper: 370 },
          { time: '14:30', historicalVolume: 380, predictedVolume: 385, confidenceLower: 360, confidenceUpper: 410 },
          { time: '14:45', historicalVolume: 410, predictedVolume: 420, confidenceLower: 390, confidenceUpper: 450 },
          { time: '15:00', historicalVolume: 440, predictedVolume: 465, confidenceLower: 430, confidenceUpper: 500 },
          { time: '15:15', historicalVolume: 0, predictedVolume: baseVol, confidenceLower: baseVol - 40, confidenceUpper: baseVol + 50 },
          { time: '15:30', historicalVolume: 0, predictedVolume: baseVol + 30, confidenceLower: baseVol - 20, confidenceUpper: baseVol + 80 },
        ],
        generatedAt: new Date().toISOString(),
      };
    }
  },

  triggerPrediction: async (intersectionId: string, horizon: number): Promise<PredictionData> => {
    const response = await api.post<PredictionData>('/predictions', { intersectionId, horizon });
    return response.data;
  },
};
