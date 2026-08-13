import React, { useState } from 'react';
import { PlaySquare, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { KPICard } from '../../components/ui/KPICard/KPICard';

export const TrafficSimulator: React.FC = () => {
  const [scenario, setScenario] = useState('PEAK_SURGE');
  const [isRunning, setIsRunning] = useState(false);
  const [hasResults, setHasResults] = useState(true);

  const handleRunSimulation = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasResults(true);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-title)', fontWeight: 'bold' }}>Digital Twin Traffic Simulator</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Simulate scenario impacts on queue length, throughput, and fuel consumption before applying to live signals.
          </p>
        </div>

        <Button variant="primary" size="lg" disabled={isRunning} onClick={handleRunSimulation}>
          <PlaySquare size={18} /> {isRunning ? 'Running Simulation Model...' : 'Execute Digital Twin Simulation'}
        </Button>
      </div>

      <div style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)', padding: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--font-size-label)', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>SCENARIO:</span>
        <select
          style={{ backgroundColor: 'var(--color-bg-input)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--border-radius-sm)' }}
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
        >
          <option value="PEAK_SURGE">Evening Peak Commute Surge (+40% volume)</option>
          <option value="ROAD_CLOSURE">Inbound Flyover Closure Detour</option>
          <option value="HEAVY_RAIN">Heavy Monsoon Rain Visibility Delay</option>
        </select>
      </div>

      {hasResults && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
          <KPICard title="Simulated Queue Reduction" value="-24.5%" unit="delay" icon={<CheckCircle2 size={20} />} />
          <KPICard title="Throughput Improvement" value="+18.2%" unit="flow" icon={<CheckCircle2 size={20} />} />
          <KPICard title="Fuel Savings (Est)" value="420" unit="liters/day" icon={<CheckCircle2 size={20} />} />
          <KPICard title="CO2 Reduction (Est)" value="1.1" unit="tons/day" icon={<CheckCircle2 size={20} />} />
        </div>
      )}
    </div>
  );
};
