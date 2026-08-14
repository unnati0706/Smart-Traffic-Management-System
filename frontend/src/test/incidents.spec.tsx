import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { IncidentManagement } from '../pages/authority/IncidentManagement';
import { incidentsService } from '../services/api/incidents';

describe('IncidentManagement Page & Service', () => {
  it('renders incident management title and filter buttons', async () => {
    render(<IncidentManagement />);

    expect(screen.getByText(/Incident Response & Dispatch Management/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/All Incidents/i)).toBeInTheDocument();
      expect(screen.getByText(/Pending Dispatch/i)).toBeInTheDocument();
      expect(screen.getByText(/High Severity/i)).toBeInTheDocument();
    });
  });

  it('fetches incidents from incidentsService', async () => {
    const incidents = await incidentsService.getActiveIncidents();
    expect(Array.isArray(incidents)).toBe(true);
    expect(incidents.length).toBeGreaterThan(0);
    expect(incidents[0]).toHaveProperty('title');
    expect(incidents[0]).toHaveProperty('severity');
  });

  it('filters incidents by filter tab button click', async () => {
    render(<IncidentManagement />);

    await waitFor(() => {
      expect(screen.getByText(/Pending Dispatch/i)).toBeInTheDocument();
    });

    const pendingBtn = screen.getByText(/Pending Dispatch/i);
    fireEvent.click(pendingBtn);

    expect(pendingBtn.className).toContain('filterBtnActive');
  });
});
