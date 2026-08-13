import React, { useState } from 'react';
import { PredictionChart } from '../../components/charts/PredictionChart';
import { Button } from '../../components/ui/Button/Button';
import { KPICard } from '../../components/ui/KPICard/KPICard';
import { TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

export const AIPredictions: React.FC = () => {
  const [horizon, setHorizon] = useState<15 | 30 | 60>(30);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-title)', fontWeight: 'bold' }}>AI Traffic Demand Prediction Engine</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Machine learning forecast of bottleneck formation across major arterial corridors.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {([15, 30, 60] as const).map((h) => (
            <Button
              key={h}
              variant={horizon === h ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setHorizon(h)}
            >
              {h}m Horizon
            </Button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
        <KPICard title="Forecasted Peak Volume" value="490" unit="veh/min" icon={<TrendingUp size={20} />} />
        <KPICard title="Prediction Horizon" value={`${horizon}`} unit="minutes" icon={<Sparkles size={20} />} />
        <KPICard title="Model Confidence Score" value="92.8%" unit="confidence" icon={<Sparkles size={20} />} />
      </div>

      <PredictionChart title={`Forecasted Vehicle Volume (${horizon}-Minute Horizon)`} />

      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--border-radius-md)',
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        <div style={{ fontSize: 'var(--font-size-label)', fontWeight: 'bold', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
          AI Causal Factors & Model Reasoning
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-body)', color: 'var(--color-text-primary)' }}>
          <AlertCircle size={18} color="var(--color-status-moderate)" />
          <span>Expected 28% demand spike at 15:30 due to evening peak hour commute and ongoing maintenance on link road.</span>
        </div>
      </div>
    </div>
  );
};
