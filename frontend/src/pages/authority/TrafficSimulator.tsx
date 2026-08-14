import React, { useState } from 'react';
import { PlaySquare, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { KPICard } from '../../components/ui/KPICard/KPICard';
import styles from './TrafficSimulator.module.css';

interface ScenarioData {
  queue: string;
  throughput: string;
  fuel: string;
  co2: string;
  bottleneckRisk: string;
  avgSpeed: string;
  recommendedGreen: string;
}

export const TrafficSimulator: React.FC = () => {
  const [scenario, setScenario] = useState<string>('PEAK_SURGE');
  const [isRunning, setIsRunning] = useState(false);
  const [hasResults, setHasResults] = useState(true);

  const scenarioMap: Record<string, ScenarioData> = {
    PEAK_SURGE: {
      queue: '-24.5%',
      throughput: '+18.2%',
      fuel: '420 L/day',
      co2: '1.1 tons/day',
      bottleneckRisk: 'Low (12%)',
      avgSpeed: '32 km/h (+6 km/h)',
      recommendedGreen: '75s North-South / 45s East-West',
    },
    ROAD_CLOSURE: {
      queue: '-15.0%',
      throughput: '+12.4%',
      fuel: '310 L/day',
      co2: '0.8 tons/day',
      bottleneckRisk: 'Moderate (38%)',
      avgSpeed: '24 km/h (+4 km/h)',
      recommendedGreen: '90s Main Detour Corridor',
    },
    HEAVY_RAIN: {
      queue: '-19.2%',
      throughput: '+14.1%',
      fuel: '380 L/day',
      co2: '0.95 tons/day',
      bottleneckRisk: 'Low (18%)',
      avgSpeed: '28 km/h (+5 km/h)',
      recommendedGreen: 'Extended Safety All-Yellow (4s)',
    },
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    setHasResults(false);
    setTimeout(() => {
      setIsRunning(false);
      setHasResults(true);
    }, 1200);
  };

  const current = scenarioMap[scenario] || scenarioMap.PEAK_SURGE;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Digital Twin Traffic Simulator</h1>
          <p className={styles.subtitle}>
            Simulate scenario impacts on queue length, throughput, and fuel consumption before applying to live signals.
          </p>
        </div>

        <Button variant="primary" size="lg" disabled={isRunning} onClick={handleRunSimulation}>
          <PlaySquare size={18} /> {isRunning ? 'Running Digital Twin Simulation...' : 'Execute Simulation Run'}
        </Button>
      </div>

      <div className={styles.controlsBar}>
        <span className={styles.label}>SCENARIO PARAMETER:</span>
        <select
          className={styles.select}
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
        >
          <option value="PEAK_SURGE">Evening Peak Commute Surge (+40% volume)</option>
          <option value="ROAD_CLOSURE">Inbound Flyover Closure Detour</option>
          <option value="HEAVY_RAIN">Heavy Monsoon Rain Visibility Delay</option>
        </select>
      </div>

      {isRunning && (
        <div className={styles.progressPanel}>
          <div className={styles.spinner} />
          <div style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>
            Processing Micro-Simulation Neural Model...
          </div>
          <div style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)' }}>
            Evaluating 10,000 synthetic vehicle routing vectors across grid nodes.
          </div>
        </div>
      )}

      {hasResults && !isRunning && (
        <>
          <div className={styles.kpiGrid}>
            <KPICard title="Simulated Queue Reduction" value={current.queue} unit="delay" icon={<CheckCircle2 size={20} />} />
            <KPICard title="Throughput Improvement" value={current.throughput} unit="flow" icon={<CheckCircle2 size={20} />} />
            <KPICard title="Fuel Savings (Est)" value={current.fuel} unit="liters" icon={<CheckCircle2 size={20} />} />
            <KPICard title="CO2 Abatement (Est)" value={current.co2} unit="emissions" icon={<CheckCircle2 size={20} />} />
          </div>

          <div className={styles.scenarioSummary}>
            <div className={styles.summaryTitle}>
              Digital Twin Scenario Insights & Recommended Optimization
            </div>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <div className={styles.summaryCardLabel}>Predicted Bottleneck Risk</div>
                <div className={styles.summaryCardValue}>{current.bottleneckRisk}</div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryCardLabel}>Projected Average Grid Speed</div>
                <div className={styles.summaryCardValue}>{current.avgSpeed}</div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryCardLabel}>Recommended Signal Timing Policy</div>
                <div className={styles.summaryCardValue} style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-primary)' }}>
                  {current.recommendedGreen}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
