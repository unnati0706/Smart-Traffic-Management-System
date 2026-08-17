import { api } from './client';
import { AIRecommendation, Incident, EmergencyVehicle, TrafficState } from '../../types';

export interface DashboardSummary {
  monitoredIntersectionsCount: number;
  activeIncidentsCount: number;
  activeGreenCorridorsCount: number;
  aiModelConfidenceAvg: number;
  networkCongestionLevel: TrafficState;
}

export interface SystemAlert {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  timestamp: string;
  source: string;
}

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    try {
      const response = await api.get<DashboardSummary>('/dashboard/summary');
      return response.data;
    } catch {
      return {
        monitoredIntersectionsCount: 42,
        activeIncidentsCount: 3,
        activeGreenCorridorsCount: 2,
        aiModelConfidenceAvg: 94.2,
        networkCongestionLevel: 'MODERATE',
      };
    }
  },

  getAlerts: async (): Promise<SystemAlert[]> => {
    try {
      const response = await api.get<SystemAlert[]>('/alerts');
      return response.data;
    } catch {
      return [
        {
          id: 'alt-101',
          type: 'CRITICAL',
          title: 'Severe Queue Detected',
          message: 'MG Road East approach queue length exceeded 120m threshold',
          timestamp: new Date().toISOString(),
          source: 'YOLO-CAM-102',
        },
        {
          id: 'alt-102',
          type: 'WARNING',
          title: 'Green Corridor Active',
          message: 'Ambulance AMB-992 en-route via Outer Ring Road corridor',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          source: 'EMERGENCY_DISPATCH',
        },
        {
          id: 'alt-103',
          type: 'INFO',
          title: 'AI Signal Timing Optimized',
          message: 'Adaptive timing applied at Central Ave & 5th Main St',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          source: 'RL_SIGNAL_ENGINE',
        },
      ];
    }
  },

  getAIRecommendations: async (): Promise<AIRecommendation[]> => {
    try {
      const response = await api.get<AIRecommendation[]>('/ai/recommendations');
      return response.data;
    } catch {
      return [
        {
          id: 'rec-01',
          signalId: 'sig-102',
          intersectionName: 'MG Road Junction',
          currentNorthSouthGreen: 30,
          recommendedNorthSouthGreen: 65,
          currentEastWestGreen: 90,
          recommendedEastWestGreen: 55,
          estimatedDelayReduction: 22.4,
          confidence: 0.94,
          reasoning: [
            'Computer Vision queue overflow detected on N-S approach',
            'Incident #inc-201 clearing on E-W corridor',
            'Evening commute peak volume spike anticipated in 10 minutes',
          ],
          createdAt: new Date().toISOString(),
          status: 'PENDING',
        },
        {
          id: 'rec-02',
          signalId: 'sig-103',
          intersectionName: 'Tech Park Expressway',
          currentNorthSouthGreen: 25,
          recommendedNorthSouthGreen: 50,
          currentEastWestGreen: 60,
          recommendedEastWestGreen: 50,
          estimatedDelayReduction: 18.5,
          confidence: 0.89,
          reasoning: [
            'Heavy two-wheeler queue detected at Northbound slip lane',
            'Transit bus headway priority request active',
          ],
          createdAt: new Date(Date.now() - 600000).toISOString(),
          status: 'PENDING',
        },
      ];
    }
  },

  approveRecommendation: async (recId: string): Promise<void> => {
    await api.post(`/signal-recommendations/${recId}/approve`);
  },
};
