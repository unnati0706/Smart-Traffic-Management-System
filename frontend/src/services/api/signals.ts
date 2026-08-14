import { api } from './client';
import { TrafficSignal, AIRecommendation } from '../../types';

export interface UpdateSignalModePayload {
  mode: 'FIXED' | 'ADAPTIVE_AI' | 'MANUAL_OVERRIDE';
}

export interface UpdateSignalTimingPayload {
  northSouthGreen: number;
  eastWestGreen: number;
  mode?: 'FIXED' | 'ADAPTIVE_AI' | 'MANUAL_OVERRIDE';
}

export const signalsService = {
  getSignals: async (): Promise<TrafficSignal[]> => {
    try {
      const response = await api.get<TrafficSignal[]>('/signals');
      return response.data;
    } catch {
      return [
        {
          id: 'sig-101',
          name: 'Central Ave & 5th Main St',
          location: { lat: 12.9716, lng: 77.5946 },
          mode: 'ADAPTIVE_AI',
          currentPhase: 'NORTH_SOUTH_GREEN',
          phaseRemaining: 18,
          cycleLength: 90,
          northSouthGreen: 45,
          eastWestGreen: 45,
        },
        {
          id: 'sig-102',
          name: 'MG Road Junction',
          location: { lat: 12.9785, lng: 77.5998 },
          mode: 'ADAPTIVE_AI',
          currentPhase: 'EAST_WEST_GREEN',
          phaseRemaining: 24,
          cycleLength: 120,
          northSouthGreen: 30,
          eastWestGreen: 90,
          recommendedNorthSouthGreen: 65,
          recommendedEastWestGreen: 55,
          aiRecommendationId: 'rec-01',
        },
        {
          id: 'sig-103',
          name: 'Tech Park Expressway',
          location: { lat: 12.9654, lng: 77.6087 },
          mode: 'FIXED',
          currentPhase: 'NORTH_SOUTH_GREEN',
          phaseRemaining: 5,
          cycleLength: 85,
          northSouthGreen: 25,
          eastWestGreen: 60,
          recommendedNorthSouthGreen: 50,
          recommendedEastWestGreen: 50,
          aiRecommendationId: 'rec-02',
        },
        {
          id: 'sig-104',
          name: 'Outer Ring Road Flyover Slip',
          location: { lat: 12.9812, lng: 77.6214 },
          mode: 'MANUAL_OVERRIDE',
          currentPhase: 'ALL_RED',
          phaseRemaining: 3,
          cycleLength: 100,
          northSouthGreen: 60,
          eastWestGreen: 40,
        },
      ];
    }
  },

  getSignalById: async (id: string): Promise<TrafficSignal> => {
    const response = await api.get<TrafficSignal>(`/signals/${id}`);
    return response.data;
  },

  updateSignalMode: async (id: string, mode: 'FIXED' | 'ADAPTIVE_AI' | 'MANUAL_OVERRIDE'): Promise<void> => {
    await api.patch(`/signals/${id}/mode`, { mode });
  },

  updateSignalTiming: async (id: string, payload: UpdateSignalTimingPayload): Promise<void> => {
    await api.patch(`/signals/${id}/timing`, payload);
  },

  approveRecommendation: async (recommendationId: string): Promise<void> => {
    await api.post(`/signal-recommendations/${recommendationId}/approve`);
  },
};
