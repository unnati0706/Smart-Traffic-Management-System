import { describe, it, expect } from 'vitest';
import { signalsService } from '../services/api/signals';

describe('signalsService API', () => {
  it('fetches signals list', async () => {
    const signals = await signalsService.getSignals();
    expect(Array.isArray(signals)).toBe(true);
    expect(signals.length).toBeGreaterThan(0);
    expect(signals[0]).toHaveProperty('name');
    expect(signals[0]).toHaveProperty('currentPhase');
  });

  it('fetches signal details by ID', async () => {
    const signals = await signalsService.getSignals();
    const firstId = signals[0].id;
    expect(firstId).toBeDefined();
  });

  it('updates signal mode to MANUAL_OVERRIDE', async () => {
    await expect(signalsService.updateSignalMode('sig-101', 'MANUAL_OVERRIDE')).resolves.not.toThrow();
  });

  it('updates signal timing', async () => {
    await expect(
      signalsService.updateSignalTiming('sig-101', { northSouthGreen: 60, eastWestGreen: 40 })
    ).resolves.not.toThrow();
  });
});
