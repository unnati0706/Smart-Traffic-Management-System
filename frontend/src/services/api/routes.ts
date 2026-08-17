import { apiClient } from './client';
import { LatLng, PlannedRoute } from '../../types';

export const routesService = {
  planRoute: async (origin: LatLng, destination: LatLng): Promise<PlannedRoute[]> => {
    try {
      return await apiClient<PlannedRoute[]>('/routes/plan', {
        method: 'POST',
        body: JSON.stringify({ origin, destination }),
      });
    } catch {
      // Mock fallback route options
      return [
        {
          id: 'route-opt-1',
          name: 'AI Dynamic Signal Priority Corridor',
          isRecommended: true,
          distanceKm: 8.4,
          etaMinutes: 18,
          delayMinutes: 2,
          overallState: 'NORMAL',
          geometry: [
            origin,
            { lat: (origin.lat + destination.lat) / 2 + 0.005, lng: (origin.lng + destination.lng) / 2 - 0.005 },
            destination,
          ],
          recommendationReason: 'AI signal optimization is active on Central Avenue corridor, reducing travel time by 7 mins.',
          incidentsOnRoute: 0,
        },
        {
          id: 'route-opt-2',
          name: 'Standard Ring Road Route',
          isRecommended: false,
          distanceKm: 9.8,
          etaMinutes: 26,
          delayMinutes: 10,
          overallState: 'HEAVY',
          geometry: [
            origin,
            { lat: origin.lat + 0.01, lng: origin.lng + 0.015 },
            { lat: destination.lat + 0.005, lng: destination.lng + 0.01 },
            destination,
          ],
          recommendationReason: 'Heavy congestion around MG Road junction due to active maintenance.',
          incidentsOnRoute: 1,
        },
      ];
    }
  },
};
