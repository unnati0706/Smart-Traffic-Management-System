import React, { useEffect, useState } from 'react';
import { AlertTriangle, UserCheck, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { Dialog } from '../../components/ui/Dialog/Dialog';
import { Input } from '../../components/ui/Input/Input';
import { incidentsService } from '../../services/api/incidents';
import { Incident } from '../../types';

export const IncidentManagement: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [officerName, setOfficerName] = useState('');

  useEffect(() => {
    incidentsService.getActiveIncidents().then(setIncidents);
  }, []);

  const handleAssignOfficer = () => {
    if (!selectedIncident || !officerName) return;
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === selectedIncident.id
          ? { ...i, status: 'DISPATCHED', assignedOfficer: officerName }
          : i
      )
    );
    setSelectedIncident(null);
    setOfficerName('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-title)', fontWeight: 'bold' }}>Incident Response & Dispatch Management</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Real-time incident verification, severity classification, and traffic police unit assignment.
        </p>
      </div>

      <div style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-surface-hover)', borderBottom: '1px solid var(--color-border)', fontSize: 'var(--font-size-label)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              <th style={{ padding: 'var(--space-4)' }}>Incident Details</th>
              <th style={{ padding: 'var(--space-4)' }}>Type</th>
              <th style={{ padding: 'var(--space-4)' }}>Severity</th>
              <th style={{ padding: 'var(--space-4)' }}>Status</th>
              <th style={{ padding: 'var(--space-4)' }}>Assigned Officer</th>
              <th style={{ padding: 'var(--space-4)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc) => (
              <tr key={inc.id} style={{ borderBottom: '1px solid var(--color-border-subtle)', fontSize: 'var(--font-size-table)' }}>
                <td style={{ padding: 'var(--space-4)' }}>
                  <strong>{inc.title}</strong>
                  <div style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)' }}>{inc.address}</div>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>{inc.type}</td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <span style={{ color: inc.severity === 'HIGH' ? 'var(--color-status-severe)' : 'var(--color-status-moderate)', fontWeight: 'bold' }}>
                    {inc.severity}
                  </span>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>{inc.status}</td>
                <td style={{ padding: 'var(--space-4)' }}>{inc.assignedOfficer || 'Unassigned'}</td>
                <td style={{ padding: 'var(--space-4)', textAlign: 'right' }}>
                  <Button variant="secondary" size="sm" onClick={() => setSelectedIncident(inc)}>
                    <UserCheck size={14} /> Assign Unit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        open={!!selectedIncident}
        onOpenChange={(open) => !open && setSelectedIncident(null)}
        title={`Assign Officer --- ${selectedIncident?.title}`}
      >
        {selectedIncident && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input
              label="Traffic Officer Name & Badge Number"
              placeholder="e.g. Officer K. Sharma (#4402)"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
            />
            <Button variant="primary" onClick={handleAssignOfficer}>
              Dispatch Traffic Unit
            </Button>
          </div>
        )}
      </Dialog>
    </div>
  );
};
