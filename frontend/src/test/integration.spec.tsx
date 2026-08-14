import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { authService } from '../services/api/auth';
import { ReportIncident } from '../pages/public/ReportIncident';

describe('End-to-End Integration Flow Suite (Phase 31)', () => {
  it('handles public incident report submission state flow', async () => {
    render(<ReportIncident />);

    expect(screen.getByText(/Report Road Incident/i)).toBeInTheDocument();

    const locationInput = screen.getByPlaceholderText(/Near Metro Station/i);

    fireEvent.change(locationInput, { target: { value: 'Central Ave 5th Cross' } });

    expect(locationInput).toHaveValue('Central Ave 5th Cross');

    const submitBtn = screen.getByRole('button', { name: /Submit Incident Report/i });
    expect(submitBtn).toBeInTheDocument();
  });

  it('handles authority login authentication flow', async () => {
    const authData = await authService.login({
      email: 'authority.control@traffic.gov',
      password: 'SecurePassword123!',
      role: 'TRAFFIC_AUTHORITY',
    });

    expect(authData).toHaveProperty('accessToken');
    expect(authData.user.email).toBe('authority.control@traffic.gov');
    expect(authData.user.role).toBe('TRAFFIC_AUTHORITY');
  });
});
