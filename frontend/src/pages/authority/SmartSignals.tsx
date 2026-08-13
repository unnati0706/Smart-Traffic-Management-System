import React, { useState } from 'react';
import { Cpu, Check, Edit, ShieldAlert } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { TrafficStatusBadge } from '../../components/ui/TrafficStatusBadge/TrafficStatusBadge';
import { Dialog } from '../../components/ui/Dialog/Dialog';
import { Input } from '../../components/ui/Input/Input';

interface SignalRow {
  id: string;
  name: string;
  mode: 'FIXED' | 'ADAPTIVE_AI' | 'MANUAL_OVERRIDE';
  nsGreen: number;
  ewGreen: number;
  recommendedNsGreen?: number;
  recommendedEwGreen?: number;
  status: 'NORMAL' | 'MODERATE' | 'HEAVY' | 'SEVERE';
}

const MOCK_SIGNALS: SignalRow[] = [
  { id: 'sig-101', name: 'Central Ave & 5th Main St', mode: 'ADAPTIVE_AI', nsGreen: 45, ewGreen: 45, status: 'NORMAL' },
  { id: 'sig-102', name: 'MG Road Junction', mode: 'ADAPTIVE_AI', nsGreen: 30, ewGreen: 90, recommendedNsGreen: 65, recommendedEwGreen: 55, status: 'HEAVY' },
  { id: 'sig-103', name: 'Tech Park Expressway', mode: 'FIXED', nsGreen: 25, ewGreen: 60, recommendedNsGreen: 50, recommendedEwGreen: 50, status: 'SEVERE' },
];

export const SmartSignals: React.FC = () => {
  const [signals, setSignals] = useState<SignalRow[]>(MOCK_SIGNALS);
  const [editSignal, setEditSignal] = useState<SignalRow | null>(null);

  const handleModeChange = (id: string, mode: 'FIXED' | 'ADAPTIVE_AI' | 'MANUAL_OVERRIDE') => {
    setSignals((prev) => prev.map((s) => (s.id === id ? { ...s, mode } : s)));
  };

  const handleApprove = (id: string) => {
    setSignals((prev) =>
      prev.map((s) =>
        s.id === id && s.recommendedNsGreen
          ? {
              ...s,
              nsGreen: s.recommendedNsGreen,
              ewGreen: s.recommendedEwGreen || s.ewGreen,
              recommendedNsGreen: undefined,
              recommendedEwGreen: undefined,
            }
          : s
      )
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-title)', fontWeight: 'bold' }}>Smart Signal Controller Inventory</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Adaptive AI timing configuration and manual emergency override control panel.
        </p>
      </div>

      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--border-radius-md)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr
              style={{
                backgroundColor: 'var(--color-bg-surface-hover)',
                borderBottom: '1px solid var(--color-border)',
                fontSize: 'var(--font-size-label)',
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
              }}
            >
              <th style={{ padding: 'var(--space-4)' }}>Signal Node</th>
              <th style={{ padding: 'var(--space-4)' }}>Flow State</th>
              <th style={{ padding: 'var(--space-4)' }}>Control Mode</th>
              <th style={{ padding: 'var(--space-4)' }}>Allocated Cycle (N-S / E-W)</th>
              <th style={{ padding: 'var(--space-4)' }}>AI Recommendation</th>
              <th style={{ padding: 'var(--space-4)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((sig) => (
              <tr key={sig.id} style={{ borderBottom: '1px solid var(--color-border-subtle)', fontSize: 'var(--font-size-table)' }}>
                <td style={{ padding: 'var(--space-4)', fontWeight: 'bold' }}>{sig.name}</td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <TrafficStatusBadge status={sig.status} showIcon={false} />
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <select
                    style={{
                      backgroundColor: 'var(--color-bg-input)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border)',
                      padding: '4px 8px',
                      borderRadius: 'var(--border-radius-sm)',
                    }}
                    value={sig.mode}
                    onChange={(e) => handleModeChange(sig.id, e.target.value as any)}
                  >
                    <option value="ADAPTIVE_AI">ADAPTIVE_AI</option>
                    <option value="FIXED">FIXED</option>
                    <option value="MANUAL_OVERRIDE">MANUAL_OVERRIDE</option>
                  </select>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  {sig.nsGreen}s / {sig.ewGreen}s
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  {sig.recommendedNsGreen ? (
                    <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                      {sig.recommendedNsGreen}s / {sig.recommendedEwGreen}s
                    </span>
                  ) : (
                    <span style={{ color: 'var(--color-text-muted)' }}>Optimal</span>
                  )}
                </td>
                <td style={{ padding: 'var(--space-4)', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                    {sig.recommendedNsGreen && (
                      <Button variant="primary" size="sm" onClick={() => handleApprove(sig.id)}>
                        <Check size={14} /> Approve
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setEditSignal(sig)}>
                      <Edit size={14} /> Edit
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        open={!!editSignal}
        onOpenChange={(open) => !open && setEditSignal(null)}
        title={`Edit Signal Timing --- ${editSignal?.name}`}
      >
        {editSignal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input
              label="North-South Green Duration (Seconds)"
              type="number"
              value={editSignal.nsGreen}
              onChange={(e) => setEditSignal({ ...editSignal, nsGreen: Number(e.target.value) })}
            />
            <Input
              label="East-West Green Duration (Seconds)"
              type="number"
              value={editSignal.ewGreen}
              onChange={(e) => setEditSignal({ ...editSignal, ewGreen: Number(e.target.value) })}
            />
            <Button
              variant="primary"
              onClick={() => {
                setSignals((prev) => prev.map((s) => (s.id === editSignal.id ? editSignal : s)));
                setEditSignal(null);
              }}
            >
              Save Manual Overrides
            </Button>
          </div>
        )}
      </Dialog>
    </div>
  );
};
