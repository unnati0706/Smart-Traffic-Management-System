import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../features/auth/AuthContext';

const TestComponent = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Logged Out'}</div>
      <div data-testid="user-name">{user?.name}</div>
      <button onClick={() => login('officer@traffic.gov.in', 'TRAFFIC_AUTHORITY')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  it('provides authentication state and role access', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status').textContent).toBe('Logged Out');
  });
});
