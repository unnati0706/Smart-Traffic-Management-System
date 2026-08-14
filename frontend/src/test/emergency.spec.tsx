import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { EmergencyControl } from '../pages/authority/EmergencyControl';
import { emergencyService } from '../services/api/emergency';

vi.mock('../components/maps/MapContainer/MapContainer', () => ({
  MapContainer: () => <div data-testid="mock-map-container">Map Container View</div>,
}));

describe('EmergencyControl Page & Service', () => {
  it('fetches and renders active emergency vehicle feeds', async () => {
    render(<EmergencyControl />);

    expect(screen.getByText(/Emergency Green Corridor Control/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-map-container')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Active Green Corridor Feeds/i)).toBeInTheDocument();
    });
  });

  it('fetches active vehicles from emergency service', async () => {
    const vehicles = await emergencyService.getActiveVehicles();
    expect(Array.isArray(vehicles)).toBe(true);
    expect(vehicles.length).toBeGreaterThan(0);
    expect(vehicles[0]).toHaveProperty('code');
    expect(vehicles[0]).toHaveProperty('destinationName');
  });
});
