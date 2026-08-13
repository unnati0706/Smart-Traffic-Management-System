import React from 'react';
import { PredictionChart } from '../../components/charts/PredictionChart';
import { KPICard } from '../../components/ui/KPICard/KPICard';
import { BarChart3, TrendingUp, Cpu, Siren } from 'lucide-react';

export const Analytics: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-title)', fontWeight: 'bold' }}>City Traffic Analytics Suite</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Historical traffic volume trends, congestion index monitoring, and signal efficiency metrics.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
        <KPICard title="Average Daily Volume" value="48,200" unit="vehicles" icon={<BarChart3 size={20} />} />
        <KPICard title="Congestion Index" value="3.2 / 5.0" unit="moderate" icon={<TrendingUp size={20} />} />
        <KPICard title="Signal Priority Success Rate" value="98.4%" unit="success" icon={<Cpu size={20} />} />
        <KPICard title="Emergency Green Corridors" value="14" unit="this week" icon={<Siren size={20} />} />
      </div>

      <PredictionChart title="24-Hour Congestion & Traffic Volume Analytics" />
    </div>
  );
};
