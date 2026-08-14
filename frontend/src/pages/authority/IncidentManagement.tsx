import React, { useEffect, useState } from 'react';
import { UserCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { Dialog } from '../../components/ui/Dialog/Dialog';
import { Input } from '../../components/ui/Input/Input';
import { incidentsService } from '../../services/api/incidents';
import { Incident } from '../../types';
import styles from './IncidentManagement.module.css';

export const IncidentManagement: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [officerName, setOfficerName] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'VERIFIED' | 'DISPATCHED' | 'HIGH'>('ALL');

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

  const handleResolveIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'RESOLVED' } : i))
    );
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (filter === 'VERIFIED') return inc.status === 'VERIFIED' || inc.status === 'REPORTED';
    if (filter === 'DISPATCHED') return inc.status === 'DISPATCHED';
    if (filter === 'HIGH') return inc.severity === 'HIGH';
    return true;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Incident Response & Dispatch Management</h1>
          <p className={styles.subtitle}>
            Real-time incident verification, severity classification, and traffic police unit assignment.
          </p>
        </div>
      </div>

      <div className={styles.filterBar}>
        <button
          className={`${styles.filterBtn} ${filter === 'ALL' ? styles.filterBtnActive : ''}`}
          onClick={() => setFilter('ALL')}
        >
          All Incidents ({incidents.length})
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'VERIFIED' ? styles.filterBtnActive : ''}`}
          onClick={() => setFilter('VERIFIED')}
        >
          Pending Dispatch ({incidents.filter((i) => i.status === 'VERIFIED' || i.status === 'REPORTED').length})
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'DISPATCHED' ? styles.filterBtnActive : ''}`}
          onClick={() => setFilter('DISPATCHED')}
        >
          Dispatched ({incidents.filter((i) => i.status === 'DISPATCHED').length})
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'HIGH' ? styles.filterBtnActive : ''}`}
          onClick={() => setFilter('HIGH')}
        >
          High Severity ({incidents.filter((i) => i.severity === 'HIGH').length})
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.cell}>Incident Details</th>
              <th className={styles.cell}>Type</th>
              <th className={styles.cell}>Severity</th>
              <th className={styles.cell}>Status</th>
              <th className={styles.cell}>Assigned Officer</th>
              <th className={styles.cellRight}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-secondary)' }}>
                  No incidents match the selected filter.
                </td>
              </tr>
            ) : (
              filteredIncidents.map((inc) => (
                <tr key={inc.id} className={styles.tableRow}>
                  <td className={styles.cell}>
                    <strong>{inc.title}</strong>
                    <div style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)' }}>
                      {inc.address}
                    </div>
                  </td>
                  <td className={styles.cell}>{inc.type}</td>
                  <td className={styles.cell}>
                    <span
                      className={
                        inc.severity === 'HIGH'
                          ? styles.severityHigh
                          : inc.severity === 'MEDIUM'
                          ? styles.severityMedium
                          : styles.severityLow
                      }
                    >
                      {inc.severity}
                    </span>
                  </td>
                  <td className={styles.cell}>
                    <span className={`${styles.badgeStatus} ${styles[`badge${inc.status}`]}`}>
                      {inc.status}
                    </span>
                  </td>
                  <td className={styles.cell}>{inc.assignedOfficer || 'Unassigned'}</td>
                  <td className={styles.cellRight}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                      {inc.status !== 'RESOLVED' && (
                        <>
                          <Button variant="secondary" size="sm" onClick={() => setSelectedIncident(inc)}>
                            <UserCheck size={14} /> Assign Unit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleResolveIncident(inc.id)}>
                            <CheckCircle2 size={14} color="var(--color-status-normal)" /> Resolve
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={!!selectedIncident}
        onOpenChange={(open) => !open && setSelectedIncident(null)}
        title={`Assign Officer --- ${selectedIncident?.title}`}
      >
        {selectedIncident && (
          <div className={styles.modalContent}>
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
