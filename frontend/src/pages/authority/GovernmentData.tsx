import React, { useState } from 'react';
import { Database, ShieldCheck, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import styles from './GovernmentData.module.css';

interface DataSource {
  id: string;
  name: string;
  provider: string;
  type: string;
  status: 'VERIFIED' | 'CONNECTED' | 'DEMO';
  lastSync: string;
}

const INITIAL_SOURCES: DataSource[] = [
  { id: 'ds-1', name: 'Municipal Camera Feed API', provider: 'City Traffic Police', type: 'REST / RTSP Stream', status: 'VERIFIED', lastSync: '10s ago' },
  { id: 'ds-2', name: 'OpenStreetMap & OSRM Engine', provider: 'OpenStreetMap Foundation', type: 'GeoJSON / OSRM', status: 'VERIFIED', lastSync: 'Live' },
  { id: 'ds-3', name: 'Smart Parking Sensor Gateway', provider: 'Civic IoT Infrastructure', type: 'MQTT / WebSocket', status: 'DEMO', lastSync: '1m ago' },
  { id: 'ds-4', name: 'Emergency Vehicle GPS Dispatch API', provider: 'State Ambulance Network', type: 'Webhook / WebSocket', status: 'VERIFIED', lastSync: 'Just now' },
];

export const GovernmentData: React.FC = () => {
  const [sources, setSources] = useState<DataSource[]>(INITIAL_SOURCES);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setSources((prev) =>
        prev.map((s) => ({ ...s, lastSync: 'Just now' }))
      );
      setIsSyncing(false);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Government & Open Data Integrations</h1>
          <p className={styles.subtitle}>
            Verified external API data sources, IoT gateways, and metadata status.
          </p>
        </div>

        <Button variant="secondary" onClick={handleSyncAll} disabled={isSyncing}>
          <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
          {isSyncing ? 'Syncing Feeds...' : 'Sync Data Connectors'}
        </Button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.cell}>Data Source</th>
              <th className={styles.cell}>Provider</th>
              <th className={styles.cell}>Connector Type</th>
              <th className={styles.cell}>Last Sync</th>
              <th className={styles.cellRight}>Verification Status</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.id} className={styles.tableRow}>
                <td className={styles.cell} style={{ fontWeight: 'bold' }}>{s.name}</td>
                <td className={styles.cell}>{s.provider}</td>
                <td className={styles.cell}>{s.type}</td>
                <td className={styles.cell}>{s.lastSync}</td>
                <td className={styles.cellRight}>
                  <span className={s.status === 'VERIFIED' ? styles.statusVerified : styles.statusDemo}>
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
