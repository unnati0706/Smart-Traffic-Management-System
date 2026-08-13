import React from 'react';
import { PieChart, Leaf, Clock, Fuel } from 'lucide-react';
import { KPICard } from '../../components/ui/KPICard/KPICard';

export const ImpactAnalysis: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-title)', fontWeight: 'bold' }}>Civic Impact Scorecard</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Quantified evaluation of time saved, emissions reduced, and emergency response speedup.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
        <KPICard title="Total Commute Time Saved" value="18.5" unit="min / trip" icon={<Clock size={20} />} />
        <KPICard title="Estimated Fuel Saved" value="14,200" unit="L / month" icon={<Fuel size={20} />} />
        <KPICard title="CO2 Abatement" value="34.8" unit="tons / month" icon={<Leaf size={20} />} />
      </div>

      <div className="demo-data-badge" style={{ width: 'fit-content' }}>
        PROTOTYPE ESTIMATED RESULTS BASED ON SIMULATION MODELS
      </div>
    </div>
  );
};
