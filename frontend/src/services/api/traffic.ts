import { apiClient } from './client';
import { Intersection, TrafficState } from '../../types';

const MOCK_INTERSECTIONS: Intersection[] = [
  {
    id: 'int-101',
    name: 'Central Avenue & 5th Main St',
    location: { lat: 12.9716, lng: 77.5946 },
    status: 'NORMAL',
    vehicleCount: 142,
    averageSpeed: 38,
    queueLength: 12,
    laneOccupancy: 35,
    signalId: 'sig-101',
    currentCycle: 90,
    greenTime: 45,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'int-102',
    name: 'MG Road Junction',
    location: { lat: 12.9756, lng: 77.6066 },
    status: 'HEAVY',
    vehicleCount: 380,
    averageSpeed: 14,
    queueLength: 95,
    laneOccupancy: 82,
    signalId: 'sig-102',
    currentCycle: 120,
    greenTime: 30,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'int-103',
    name: 'Tech Park Expressway & North Ring',
    location: { lat: 12.9815, lng: 77.6210 },
    status: 'SEVERE',
    vehicleCount: 520,
    averageSpeed: 6,
    queueLength: 210,
    laneOccupancy: 94,
    signalId: 'sig-103',
    currentCycle: 150,
    greenTime: 25,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'int-104',
    name: 'Airport Road Flyover',
    location: { lat: 12.9902, lng: 77.6405 },
    status: 'MODERATE',
    vehicleCount: 210,
    averageSpeed: 28,
    queueLength: 45,
    laneOccupancy: 58,
    signalId: 'sig-104',
    currentCycle: 90,
    greenTime: 40,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'int-105',
    name: 'Hospital Corridor Junction',
    location: { lat: 12.9650, lng: 77.5850 },
    status: 'EMERGENCY',
    vehicleCount: 290,
    averageSpeed: 22,
    queueLength: 60,
    laneOccupancy: 68,
    signalId: 'sig-105',
    currentCycle: 90,
    greenTime: 65,
    lastUpdated: new Date().toISOString(),
  },
];

export const trafficService = {
  getTrafficMapData: async (): Promise<Intersection[]> => {
    try {
      return await apiClient<Intersection[]>('/traffic/map');
    } catch {
      // Return seed data if backend is offline in prototype demo
      return MOCK_INTERSECTIONS;
    }
  },

  getIntersectionById: async (id: string): Promise<Intersection> => {
    try {
      return await apiClient<Intersection>(`/intersections/${id}`);
    } catch {
      const match = MOCK_INTERSECTIONS.find((i) => i.id === id);
      if (match) return match;
      return MOCK_INTERSECTIONS[0];
    }
  },
};
