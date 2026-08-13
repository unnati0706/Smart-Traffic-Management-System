import React from 'react';
import { Database, CheckCircle, ShieldCheck } from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  provider: string;
  type: string;
  status: 'VERIFIED' | 'CONNECTED' | 'DEMO';
  lastSync: string;
}

const SOURCES: DataSource[] = [
  { id: 'ds-1', name: 'Municipal Camera Feed API', provider: 'City Traffic Police', type: 'REST / RTSP Stream', status: 'VERIFIED', lastSync: '10s ago' },
  { id: 'ds-2', name: 'OpenStreetMap & OSRM Engine', provider: 'OpenStreetMap Foundation', type: 'GeoJSON / OSRM', status: 'VERIFIED', lastSync: 'Live' },
  { id: 'ds-3', name: 'Smart Parking Sensor Gateway', provider: 'Civic IoT Infrastructure', type: 'MQTT / WebSocket', status: 'DEMO', lastSync: '1m ago' },
];

export const GovernmentData: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-title)', fontWeight: 'bold' }}>Government & Open Data Integrations</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Verified external API data sources, IoT gateways, and metadata status.
        </p>
      </div>

      <div style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-surface-hover)', borderBottom: '1px solid var(--color-border)', fontSize: 'var(--font-size-label)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              <th style={{ padding: 'var(--space-4)' }}>Data Source</th>
              <th style={{ padding: 'var(--space-4)' }}>Provider</th>
              <th style={{ padding: 'var(--space-4)' }}>Connector Type</th>
              <th style={{ padding: 'var(--space-4)' }}>Last Sync</th>
              <th style={{ padding: 'var(--space-4)', textAlign: 'right' }}>Verification Status</th>
            </tr>
          </thead>
          <tbody>
            {SOURCES.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border-subtle)', fontSize: 'var(--font-size-table)' }}>
                <td style={{ padding: 'var(--space-4)', fontWeight: 'bold' }}>{s.name}</td>
                <td style={{ padding: 'var(--space-4)' }}>{s.provider}</td>
                <td style={{ padding: 'var(--space-4)' }}>{s.type}</td>
                <td style={{ padding: 'var(--space-4)' }}>{s.lastSync}</td>
                <td style={{ padding: 'var(--space-4)', textAlign: 'right' }}>
                  <span style={{ color: 'var(--color-status-normal)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={16} /> {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
