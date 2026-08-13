import React from 'react';
import { HelpCircle, CheckCircle, Database } from 'lucide-react';

export const ExplainableAI: React.FC = () => {
  const factors = [
    { name: 'Computer Vision Vehicles/Min', value: '380 veh/min', weight: '45% Impact', desc: 'Direct camera queue count on N-S approach exceeded baseline threshold.' },
    { name: 'Upstream Delay Propagation', value: '+14 mins', weight: '30% Impact', desc: 'Downstream MG Road flyover bottleneck spilling back into junction.' },
    { name: 'Active Incident Priority', value: '#inc-201', weight: '25% Impact', desc: 'Accident blocking 2 inbound lanes required green extension for detour flow.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-title)', fontWeight: 'bold' }}>Explainable AI Decision Audit</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Transparent evidence breakdown for signal timing optimization at MG Road Junction.
        </p>
      </div>

      <div style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ fontSize: 'var(--font-size-label)', fontWeight: 'bold', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
          Causal Decision Factors (Evidence Breakdown)
        </div>

        {factors.map((f, i) => (
          <div key={i} style={{ backgroundColor: 'var(--color-bg-surface-hover)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-sm)', padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: 'var(--font-size-card)', color: 'var(--color-text-primary)' }}>{f.name}</strong>
              <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{f.desc}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 'var(--font-size-card)', fontWeight: 'bold', color: 'var(--color-primary)' }}>{f.value}</div>
              <span style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-status-normal)' }}>{f.weight}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
