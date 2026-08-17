import React from 'react';
import { Car, Navigation } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import styles from './SmartParking.module.css';

interface ParkingFacility {
  id: string;
  name: string;
  totalCapacity: number;
  available: number;
  distanceKm: number;
}

const DEMO_PARKING_LOTS: ParkingFacility[] = [
  { id: 'pk-1', name: 'Central Metro Underground Garage', totalCapacity: 240, available: 84, distanceKm: 0.8 },
  { id: 'pk-2', name: 'Tech Park Multi-Level Plaza', totalCapacity: 500, available: 12, distanceKm: 2.1 },
  { id: 'pk-3', name: 'Commercial District North Lot', totalCapacity: 150, available: 65, distanceKm: 1.4 },
];

export const SmartParking: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Smart Urban Parking Availability</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Real-time sensor occupancy tracking across major civic parking hubs.
          </p>
        </div>
        <div className="demo-data-badge">
          <span>DEMO DATA FEED</span>
        </div>
      </div>

      <div className={styles.grid}>
        {DEMO_PARKING_LOTS.map((lot) => {
          const occupancyPercent = Math.round(((lot.totalCapacity - lot.available) / lot.totalCapacity) * 100);

          return (
            <div key={lot.id} className={styles.parkingCard}>
              <div className={styles.cardHeader}>
                <div className={styles.lotName}>{lot.name}</div>
                <Car size={20} color="var(--color-primary)" />
              </div>

              <div className={styles.occupancyBar}>
                <div
                  className={styles.occupancyFill}
                  style={{
                    width: `${occupancyPercent}%`,
                    backgroundColor: occupancyPercent > 85 ? 'var(--color-status-severe)' : 'var(--color-primary)',
                  }}
                />
              </div>

              <div className={styles.spaceCount}>
                <span>Occupancy: {occupancyPercent}%</span>
                <strong style={{ color: lot.available > 20 ? 'var(--color-status-normal)' : 'var(--color-status-heavy)' }}>
                  {lot.available} spaces left
                </strong>
              </div>

              <Button variant="secondary" size="sm">
                <Navigation size={14} /> Navigate ({lot.distanceKm} km)
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
