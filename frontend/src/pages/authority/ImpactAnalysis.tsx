import React from 'react';
import { PieChart, Leaf, Clock, Fuel, ShieldCheck, Zap, HeartPulse } from 'lucide-react';
import { KPICard } from '../../components/ui/KPICard/KPICard';
import styles from './ImpactAnalysis.module.css';

export const ImpactAnalysis: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Civic Impact Scorecard</h1>
          <p className={styles.subtitle}>
            Quantified evaluation of time saved, emissions reduced, and emergency response speedup.
          </p>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <KPICard title="Total Commute Time Saved" value="18.5" unit="min / trip" icon={<Clock size={20} />} />
        <KPICard title="Estimated Fuel Saved" value="14,200" unit="L / month" icon={<Fuel size={20} />} />
        <KPICard title="CO2 Abatement" value="34.8" unit="tons / month" icon={<Leaf size={20} />} />
      </div>

      <div className={styles.impactPanel}>
        <div className={styles.panelTitle}>
          Environmental & Emergency Sustainability Highlights
        </div>
        <div className={styles.impactGrid}>
          <div className={styles.impactCard}>
            <div className={styles.cardHeader}>
              <HeartPulse size={20} color="var(--color-status-emergency)" />
              <span>Ambulance Response Speedup</span>
            </div>
            <div className={styles.cardValue}>-42% Time</div>
            <div className={styles.cardDesc}>
              Green waves cut emergency arrival times from 21 mins down to 12.2 mins on critical hospital routes.
            </div>
          </div>

          <div className={styles.impactCard}>
            <div className={styles.cardHeader}>
              <Zap size={20} color="var(--color-primary)" />
              <span>Idling Emissions Reduction</span>
            </div>
            <div className={styles.cardValue}>-28.4% Idling</div>
            <div className={styles.cardDesc}>
              Adaptive signal timing prevented an estimated 110,000 idle stop-and-go delays this month.
            </div>
          </div>

          <div className={styles.impactCard}>
            <div className={styles.cardHeader}>
              <ShieldCheck size={20} color="var(--color-status-normal)" />
              <span>Civic Satisfaction Index</span>
            </div>
            <div className={styles.cardValue}>4.6 / 5.0</div>
            <div className={styles.cardDesc}>
              Public commuter feedback rate on route predictability and smart parking availability.
            </div>
          </div>
        </div>
      </div>

      <div className={styles.badge}>
        PROTOTYPE ESTIMATED RESULTS BASED ON SIMULATION MODELS & LIVE TELEMETRY
      </div>
    </div>
  );
};
