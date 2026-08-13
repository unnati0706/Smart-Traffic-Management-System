import React from 'react';
import styles from './KPICard.module.css';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, unit, icon, trend }) => {
  return (
    <div className={styles.kpiCard}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {icon && <div className={styles.iconWrapper}>{icon}</div>}
      </div>
      <div className={styles.valueContainer}>
        <span className={styles.value}>{value}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
      {trend && (
        <div className={`${styles.trend} ${trend.isPositive ? styles.trendUp : styles.trendDown}`}>
          {trend.value}
        </div>
      )}
    </div>
  );
};
