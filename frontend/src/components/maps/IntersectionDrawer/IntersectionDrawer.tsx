import React from 'react';
import { Drawer } from '../../ui/Drawer/Drawer';
import { TrafficStatusBadge } from '../../ui/TrafficStatusBadge/TrafficStatusBadge';
import { Intersection } from '../../../types';
import styles from './IntersectionDrawer.module.css';

interface IntersectionDrawerProps {
  intersection: Intersection | null;
  onClose: () => void;
}

export const IntersectionDrawer: React.FC<IntersectionDrawerProps> = ({
  intersection,
  onClose,
}) => {
  if (!intersection) return null;

  return (
    <Drawer open={!!intersection} onOpenChange={(open) => !open && onClose()} title={intersection.name}>
      <div className={styles.drawerBody}>
        <div className={styles.statusHeader}>
          <span>Current State</span>
          <TrafficStatusBadge status={intersection.status} />
        </div>

        <div className={styles.sectionTitle}>Real-time Flow Metrics</div>
        <div className={styles.grid}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Vehicle Density</div>
            <div className={styles.statValue}>{intersection.vehicleCount} vehicles</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Average Speed</div>
            <div className={styles.statValue}>{intersection.averageSpeed} km/h</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Queue Length</div>
            <div className={styles.statValue}>{intersection.queueLength} meters</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Lane Occupancy</div>
            <div className={styles.statValue}>{intersection.laneOccupancy}%</div>
          </div>
        </div>

        <div className={styles.sectionTitle}>Signal Controller Status</div>
        <div className={styles.signalBox}>
          <div className={styles.signalRow}>
            <span>Signal ID</span>
            <span>{intersection.signalId || 'SIG-AUTONOMOUS'}</span>
          </div>
          <div className={styles.signalRow}>
            <span>Cycle Length</span>
            <span>{intersection.currentCycle || 90} seconds</span>
          </div>
          <div className={styles.signalRow}>
            <span>Allocated Green Time</span>
            <span style={{ color: 'var(--color-status-normal)', fontWeight: 'bold' }}>
              {intersection.greenTime || 45} seconds
            </span>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
