import React, { useEffect, useState } from 'react';
import { Siren, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { KPICard } from '../../components/ui/KPICard/KPICard';
import { MapContainer } from '../../components/maps/MapContainer/MapContainer';
import { Button } from '../../components/ui/Button/Button';
import { emergencyService } from '../../services/api/emergency';
import { EmergencyVehicle } from '../../types';

export const EmergencyControl: React.FC = () => {
  const [vehicles, setVehicles] = useState<EmergencyVehicle[]>([]);

  useEffect(() => {
    emergencyService.getActiveVehicles().then(setVehicles);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-title)', fontWeight: 'bold' }}>Emergency Green Corridor Control</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Automated green wave prioritization for active ambulances and fire response units.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
        <KPICard title="Active Corridors" value={vehicles.length} unit="enabled" icon={<Siren size={20} />} />
        <KPICard title="Average Time Saved" value="10.2" unit="mins" icon={<Clock size={20} />} />
        <KPICard title="Upcoming Signals Cleared" value="2" unit="signals" icon={<CheckCircle2 size={20} />} />
        <KPICard title="Pre-Emption State" value="AUTOMATED" unit="mode" icon={<ShieldAlert size={20} />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
        <div style={{ height: '440px', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
          <MapContainer emergencyVehicles={vehicles} center={{ lat: 12.9720, lng: 77.5980 }} zoom={14} />
        </div>

        <div style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ fontSize: 'var(--font-size-label)', fontWeight: 'bold', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
            Active Green Corridor Feeds
          </div>

          {vehicles.map((v) => (
            <div key={v.id} style={{ backgroundColor: 'var(--color-bg-surface-hover)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-sm)', padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{v.code} ({v.type})</span>
                <span style={{ color: 'var(--color-status-emergency)' }}>GREEN WAVE ACTIVE</span>
              </div>
              <div style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
                Destination: <strong>{v.destinationName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-3)', fontSize: 'var(--font-size-metadata)' }}>
                <span>Normal ETA: <del>{v.etaNormal} mins</del></span>
                <strong style={{ color: 'var(--color-status-normal)' }}>Optimized ETA: {v.etaOptimized} mins</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
