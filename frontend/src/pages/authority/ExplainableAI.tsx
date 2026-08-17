import React, { useState } from 'react';
import { HelpCircle, CheckCircle, Cpu, ShieldCheck } from 'lucide-react';
import styles from './ExplainableAI.module.css';

interface DecisionFactor {
  name: string;
  value: string;
  weight: string;
  percentage: number;
  desc: string;
}

export const ExplainableAI: React.FC = () => {
  const [selectedJunction, setSelectedJunction] = useState('MG_ROAD');

  const junctionData: Record<string, { title: string; confidence: number; factors: DecisionFactor[] }> = {
    MG_ROAD: {
      title: 'MG Road - Central Circle Junction',
      confidence: 96.4,
      factors: [
        {
          name: 'Computer Vision Vehicles/Min',
          value: '380 veh/min',
          weight: '45% Impact',
          percentage: 45,
          desc: 'Direct camera queue count on N-S approach exceeded baseline threshold by 34%.',
        },
        {
          name: 'Upstream Delay Propagation',
          value: '+14 mins',
          weight: '30% Impact',
          percentage: 30,
          desc: 'Downstream MG Road flyover bottleneck spilling back into junction.',
        },
        {
          name: 'Active Incident Priority',
          value: '#inc-201',
          weight: '25% Impact',
          percentage: 25,
          desc: 'Accident blocking 2 inbound lanes required green extension for detour flow.',
        },
      ],
    },
    TECH_PARK: {
      title: 'Tech Park Outer Ring Road',
      confidence: 94.8,
      factors: [
        {
          name: 'Peak Office Commute Surge',
          value: '520 veh/min',
          weight: '55% Impact',
          percentage: 55,
          desc: 'Mass departure pattern detected from Tech Park gate exit sensors.',
        },
        {
          name: 'Weather Condition Impact',
          value: 'Heavy Rain',
          weight: '25% Impact',
          percentage: 25,
          desc: 'Slower vehicle traction requires 12% longer yellow/green interval transitions.',
        },
        {
          name: 'Public Transit Signal Request',
          value: 'Bus Priority',
          weight: '20% Impact',
          percentage: 20,
          desc: 'Express Electric Bus feeder requested green phase hold.',
        },
      ],
    },
  };

  const current = junctionData[selectedJunction] || junctionData.MG_ROAD;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Explainable AI Decision Audit</h1>
          <p className={styles.subtitle}>
            Transparent evidence breakdown for signal timing optimization across urban junctions.
          </p>
        </div>
      </div>

      <div className={styles.selectorBar}>
        <span style={{ fontSize: 'var(--font-size-label)', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>
          SELECT JUNCTION:
        </span>
        <select
          className={styles.select}
          value={selectedJunction}
          onChange={(e) => setSelectedJunction(e.target.value)}
        >
          <option value="MG_ROAD">MG Road - Central Circle Junction</option>
          <option value="TECH_PARK">Tech Park Outer Ring Road</option>
        </select>

        <div className={styles.confidenceBadge}>
          <ShieldCheck size={18} />
          <span>AI Decision Confidence: {current.confidence}%</span>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelTitle}>
          Causal Decision Factors (Evidence Breakdown --- {current.title})
        </div>

        {current.factors.map((f, i) => (
          <div key={i} className={styles.factorCard}>
            <div className={styles.factorTop}>
              <div>
                <div className={styles.factorName}>{f.name}</div>
                <div className={styles.factorDesc}>{f.desc}</div>
              </div>
              <div className={styles.factorMetrics}>
                <div className={styles.factorValue}>{f.value}</div>
                <span className={styles.factorWeight}>{f.weight}</span>
              </div>
            </div>
            <div className={styles.progressBarTrack}>
              <div className={styles.progressBarFill} style={{ width: `${f.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
