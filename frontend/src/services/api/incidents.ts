import { apiClient } from './client';
import { Incident } from '../../types';

const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'inc-201',
    title: 'Two-vehicle Collision on MG Road',
    type: 'ACCIDENT',
    severity: 'HIGH',
    status: 'VERIFIED',
    location: { lat: 12.9760, lng: 77.6070 },
    address: 'Near MG Road Metro Station',
    description: 'Minor collision blocking two central lanes. Traffic police dispatched.',
    reportedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    assignedOfficer: 'Officer K. Sharma (#4402)',
  },
  {
    id: 'inc-202',
    title: 'Water Pipeline Maintenance',
    type: 'CONSTRUCTION',
    severity: 'MEDIUM',
    status: 'DISPATCHED',
    location: { lat: 12.9820, lng: 77.6220 },
    address: 'Tech Park Link Road',
    description: 'Scheduled civic maintenance reducing carriageway from 3 to 1 lane.',
    reportedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
  },
  {
    id: 'inc-203',
    title: 'Tree Branch Down on Flyover',
    type: 'HAZARD',
    severity: 'LOW',
    status: 'REPORTED',
    location: { lat: 12.9690, lng: 77.5910 },
    address: '5th Main Flyover Ramp',
    description: 'Heavy rain caused branch debris on left shoulder.',
    reportedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
];

export const incidentsService = {
  getActiveIncidents: async (): Promise<Incident[]> => {
    try {
      return await apiClient<Incident[]>('/incidents?status=active');
    } catch {
      return MOCK_INCIDENTS;
    }
  },

  getIncidentById: async (id: string): Promise<Incident> => {
    try {
      return await apiClient<Incident>(`/incidents/${id}`);
    } catch {
      return MOCK_INCIDENTS.find(i => i.id === id) || MOCK_INCIDENTS[0];
    }
  },

  submitCitizenReport: async (formData: FormData): Promise<{ id: string; message: string; timestamp: string }> => {
    try {
      return await apiClient<{ id: string; message: string; timestamp: string }>('/citizen-reports', {
        method: 'POST',
        body: formData,
      });
    } catch {
      // Mock fallback response for frontend demo submission
      const newId = `REP-${Math.floor(100000 + Math.random() * 900000)}`;
      return {
        id: newId,
        message: 'Incident report submitted successfully. Verification in progress.',
        timestamp: new Date().toISOString(),
      };
    }
  },
};
