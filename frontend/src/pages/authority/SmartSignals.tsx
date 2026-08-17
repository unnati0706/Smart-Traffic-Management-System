import React, { useEffect, useState } from 'react';
import { Check, Edit, Wifi, WifiOff } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { TrafficStatusBadge } from '../../components/ui/TrafficStatusBadge/TrafficStatusBadge';
import { Dialog } from '../../components/ui/Dialog/Dialog';
import { Input } from '../../components/ui/Input/Input';
import { socketManager } from '../../services/websocket/socketManager';
import styles from './SmartSignals.module.css';

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
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    socketManager.connect();
    const unsubStatus = socketManager.onStatusChange(setWsConnected);

    const unsubSignalUpdate = socketManager.subscribe('signal_updated', (data: Partial<SignalRow> & { id: string }) => {
      setSignals((prev) =>
        prev.map((s) => (s.id === data.id ? { ...s, ...data } : s))
      );
    });

    return () => {
      unsubStatus();
      unsubSignalUpdate();
    };
  }, []);

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
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Smart Signal Controller Inventory</h1>
          <p className={styles.subtitle}>
            Adaptive AI timing configuration and manual emergency override control panel.
          </p>
        </div>
        <div className={styles.wsIndicator}>
          {wsConnected ? (
            <span style={{ color: 'var(--color-status-normal)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
              <Wifi size={16} /> Live Gateway Connected
            </span>
          ) : (
            <span style={{ color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <WifiOff size={16} /> Gateway Standby
            </span>
          )}
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.cell}>Signal Node</th>
              <th className={styles.cell}>Flow State</th>
              <th className={styles.cell}>Control Mode</th>
              <th className={styles.cell}>Allocated Cycle (N-S / E-W)</th>
              <th className={styles.cell}>AI Recommendation</th>
              <th className={styles.cellRight}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((sig) => (
              <tr key={sig.id} className={styles.tableRow}>
                <td className={styles.cell} style={{ fontWeight: 'bold' }}>{sig.name}</td>
                <td className={styles.cell}>
                  <TrafficStatusBadge status={sig.status} showIcon={false} />
                </td>
                <td className={styles.cell}>
                  <select
                    className={styles.modeSelect}
                    value={sig.mode}
                    onChange={(e) => handleModeChange(sig.id, e.target.value as any)}
                  >
                    <option value="ADAPTIVE_AI">ADAPTIVE_AI</option>
                    <option value="FIXED">FIXED</option>
                    <option value="MANUAL_OVERRIDE">MANUAL_OVERRIDE</option>
                  </select>
                </td>
                <td className={styles.cell}>
                  {sig.nsGreen}s / {sig.ewGreen}s
                </td>
                <td className={styles.cell}>
                  {sig.recommendedNsGreen ? (
                    <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                      {sig.recommendedNsGreen}s / {sig.recommendedEwGreen}s
                    </span>
                  ) : (
                    <span style={{ color: 'var(--color-text-muted)' }}>Optimal</span>
                  )}
                </td>
                <td className={styles.cellRight}>
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
          <div className={styles.modalContent}>
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
