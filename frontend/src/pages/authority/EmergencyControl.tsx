import React, { useEffect, useState } from 'react';
import { Siren, Clock, CheckCircle2, ShieldAlert, Radio, AlertOctagon } from 'lucide-react';
import { KPICard } from '../../components/ui/KPICard/KPICard';
import { MapContainer } from '../../components/maps/MapContainer/MapContainer';
import { Button } from '../../components/ui/Button/Button';
import { emergencyService } from '../../services/api/emergency';
import { EmergencyVehicle } from '../../types';
import styles from './EmergencyControl.module.css';

export const EmergencyControl: React.FC = () => {
  const [vehicles, setVehicles] = useState<EmergencyVehicle[]>([]);
  const [overrideActive, setOverrideActive] = useState(false);

  useEffect(() => {
    emergencyService.getActiveVehicles().then(setVehicles);
  }, []);

  const handleToggleOverride = () => {
    setOverrideActive((prev) => !prev);
  };

  const handleClearCorridor = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Emergency Green Corridor Control</h1>
          <p className={styles.subtitle}>
            Automated green wave prioritization for active ambulances and fire response units.
          </p>
        </div>
        <Button
          variant={overrideActive ? 'danger' : 'primary'}
          onClick={handleToggleOverride}
        >
          {overrideActive ? <AlertOctagon size={16} /> : <Radio size={16} />}
          {overrideActive ? 'Manual Override (Active)' : 'Activate Force Override'}
        </Button>
      </div>

      <div className={styles.kpiGrid}>
        <KPICard title="Active Corridors" value={vehicles.length} unit="enabled" icon={<Siren size={20} />} />
        <KPICard title="Average Time Saved" value="10.2" unit="mins" icon={<Clock size={20} />} />
        <KPICard title="Upcoming Signals Cleared" value={vehicles.length * 2} unit="signals" icon={<CheckCircle2 size={20} />} />
        <KPICard title="Pre-Emption State" value={overrideActive ? "MANUAL" : "AUTOMATED"} unit="mode" icon={<ShieldAlert size={20} />} />
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mapCard}>
          <MapContainer emergencyVehicles={vehicles} center={{ lat: 12.9720, lng: 77.5980 }} zoom={14} />
        </div>

        <div className={styles.feedPanel}>
          <div className={styles.panelTitle}>
            Active Green Corridor Feeds
          </div>

          {vehicles.length === 0 ? (
            <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-body)', textAlign: 'center', padding: 'var(--space-8)' }}>
              No emergency corridors currently active.
            </div>
          ) : (
            vehicles.map((v) => (
              <div key={v.id} className={styles.feedCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.vehicleCode}>
                    <Siren size={16} color="var(--color-status-emergency)" />
                    {v.code} ({v.type})
                  </span>
                  <span className={styles.badgeActive}>GREEN WAVE</span>
                </div>
                <div className={styles.destination}>
                  Destination: <strong>{v.destinationName}</strong>
                </div>
                <div className={styles.etaRow}>
                  <span>Normal ETA: <del>{v.etaNormal} mins</del></span>
                  <span className={styles.etaOptimized}>Optimized ETA: {v.etaOptimized} mins</span>
                </div>
                <div className={styles.actionRow}>
                  <Button variant="secondary" size="sm" onClick={() => handleClearCorridor(v.id)}>
                    Clear & Release Route
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
