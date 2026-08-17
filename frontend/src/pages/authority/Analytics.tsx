import React, { useState } from 'react';
import { PredictionChart } from '../../components/charts/PredictionChart';
import { KPICard } from '../../components/ui/KPICard/KPICard';
import { BarChart3, TrendingUp, Cpu, Siren } from 'lucide-react';
import styles from './Analytics.module.css';

export const Analytics: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<'volume' | 'delay' | 'speed'>('volume');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>City Traffic Analytics Suite</h1>
          <p className={styles.subtitle}>
            Historical traffic volume trends, congestion index monitoring, and signal efficiency metrics.
          </p>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <KPICard title="Average Daily Volume" value="48,200" unit="vehicles" icon={<BarChart3 size={20} />} />
        <KPICard title="Congestion Index" value="3.2 / 5.0" unit="moderate" icon={<TrendingUp size={20} />} />
        <KPICard title="Signal Priority Success Rate" value="98.4%" unit="success" icon={<Cpu size={20} />} />
        <KPICard title="Emergency Green Corridors" value="14" unit="this week" icon={<Siren size={20} />} />
      </div>

      <div className={styles.filterBar}>
        <div className={styles.metricTabs}>
          <button
            className={`${styles.metricBtn} ${activeMetric === 'volume' ? styles.metricBtnActive : ''}`}
            onClick={() => setActiveMetric('volume')}
          >
            Hourly Traffic Volume
          </button>
          <button
            className={`${styles.metricBtn} ${activeMetric === 'delay' ? styles.metricBtnActive : ''}`}
            onClick={() => setActiveMetric('delay')}
          >
            Average Delay Index
          </button>
          <button
            className={`${styles.metricBtn} ${activeMetric === 'speed' ? styles.metricBtnActive : ''}`}
            onClick={() => setActiveMetric('speed')}
          >
            Corridor Average Speed
          </button>
        </div>

        <div style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)' }}>
          Timeframe: <strong>Last 24 Hours (Real-time telemetry)</strong>
        </div>
      </div>

      <div className={styles.chartCard}>
        <PredictionChart
          title={
            activeMetric === 'volume'
              ? '24-Hour Traffic Volume Analytics (Vehicles / Hr)'
              : activeMetric === 'delay'
              ? '24-Hour Average Delay Index (Mins Delay / km)'
              : '24-Hour Grid Corridor Speed Trends (km/h)'
          }
        />
      </div>
    </div>
  );
};
