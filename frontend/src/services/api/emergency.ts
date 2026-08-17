import { apiClient } from './client';
import { EmergencyVehicle } from '../../types';

const MOCK_EMERGENCY_VEHICLES: EmergencyVehicle[] = [
  {
    id: 'em-301',
    code: 'AMB-8801',
    type: 'AMBULANCE',
    status: 'EN_ROUTE',
    currentLocation: { lat: 12.9720, lng: 77.5980 },
    destination: { lat: 12.9650, lng: 77.5850 },
    destinationName: 'City Trauma Center',
    etaNormal: 21,
    etaOptimized: 11,
    timeSaved: 10,
    speed: 54,
    activeGreenCorridor: true,
    upcomingSignals: [
      { signalId: 'sig-101', name: 'Central Ave & 5th St', status: 'GREEN' },
      { signalId: 'sig-105', name: 'Hospital Corridor Junction', status: 'PREPARING' },
    ],
  },
];

export const emergencyService = {
  getActiveVehicles: async (): Promise<EmergencyVehicle[]> => {
    try {
      return await apiClient<EmergencyVehicle[]>('/emergency-vehicles?status=active');
    } catch {
      return MOCK_EMERGENCY_VEHICLES;
    }
  },
};
