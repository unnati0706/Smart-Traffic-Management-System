import React from 'react';
import { TrafficState } from '../../../types';
import { CheckCircle2, AlertTriangle, AlertOctagon, Flame, Siren, ShieldAlert } from 'lucide-react';
import styles from './TrafficStatusBadge.module.css';

interface TrafficStatusBadgeProps {
  status: TrafficState;
  showIcon?: boolean;
  className?: string;
}

const STATUS_ICONS: Record<TrafficState, React.ComponentType<{ className?: string }>> = {
  NORMAL: CheckCircle2,
  MODERATE: AlertTriangle,
  HEAVY: AlertOctagon,
  SEVERE: Flame,
  EMERGENCY: Siren,
  INCIDENT: ShieldAlert,
};

const STATUS_LABELS: Record<TrafficState, string> = {
  NORMAL: 'Normal Flow',
  MODERATE: 'Moderate Traffic',
  HEAVY: 'Heavy Delay',
  SEVERE: 'Severe Congestion',
  EMERGENCY: 'Emergency Corridor',
  INCIDENT: 'Active Incident',
};

export const TrafficStatusBadge: React.FC<TrafficStatusBadgeProps> = ({
  status,
  showIcon = true,
  className = '',
}) => {
  const IconComponent = STATUS_ICONS[status];
  const badgeClass = `${styles.badge} ${styles[status]} ${className}`.trim();

  return (
    <span className={badgeClass}>
      {showIcon && IconComponent && <IconComponent className={styles.icon} />}
      {STATUS_LABELS[status]}
    </span>
  );
};
