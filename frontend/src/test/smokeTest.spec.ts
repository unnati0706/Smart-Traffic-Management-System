import { describe, it, expect } from 'vitest';
import { router } from '../app/router';
import { api, apiClient } from '../services/api/client';
import { authService } from '../services/api/auth';
import { socketManager } from '../services/websocket/socketManager';

describe('Frontend End-to-End System Smoke Test (Phase 30)', () => {
  it('initializes React Router configuration with valid routes', () => {
    expect(router).toBeDefined();
    expect(router.routes.length).toBeGreaterThan(0);
  });

  it('exports core API client methods and aliases', () => {
    expect(apiClient).toBeInstanceOf(Function);
    expect(api.get).toBeInstanceOf(Function);
    expect(api.post).toBeInstanceOf(Function);
    expect(api.patch).toBeInstanceOf(Function);
    expect(api.delete).toBeInstanceOf(Function);
  });

  it('provides mock auth service fallback', async () => {
    const res = await authService.login({ email: 'admin@traffic.gov' });
    expect(res).toHaveProperty('accessToken');
    expect(res.user.role).toBe('ADMIN');
  });

  it('initializes WebSocket manager instance', () => {
    expect(socketManager).toBeDefined();
    expect(socketManager.getConnectedStatus()).toBe(false);
  });
});
