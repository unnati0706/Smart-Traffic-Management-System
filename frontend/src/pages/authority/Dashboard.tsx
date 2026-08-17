import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, AlertTriangle, Siren, Sparkles, Check, Play } from 'lucide-react';
import { KPICard } from '../../components/ui/KPICard/KPICard';
import { MapContainer } from '../../components/maps/MapContainer/MapContainer';
import { Button } from '../../components/ui/Button/Button';
import { trafficService } from '../../services/api/traffic';
import { incidentsService } from '../../services/api/incidents';
import { emergencyService } from '../../services/api/emergency';
import { Intersection, Incident, EmergencyVehicle, AIRecommendation } from '../../types';
import styles from './Dashboard.module.css';

const MOCK_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: 'rec-01',
    signalId: 'sig-102',
    intersectionName: 'MG Road Junction',
    currentNorthSouthGreen: 30,
    recommendedNorthSouthGreen: 65,
    currentEastWestGreen: 90,
    recommendedEastWestGreen: 55,
    estimatedDelayReduction: 22.4,
    confidence: 0.94,
    reasoning: ['Computer Vision queue overflow detected on N-S approach', 'Incident #inc-201 clearing'],
    createdAt: new Date().toISOString(),
    status: 'PENDING',
  },
];

export const Dashboard: React.FC = () => {
  const [intersections, setIntersections] = useState<Intersection[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [emergencyVehicles, setEmergencyVehicles] = useState<EmergencyVehicle[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(MOCK_RECOMMENDATIONS);
  const navigate = useNavigate();

  useEffect(() => {
    trafficService.getTrafficMapData().then(setIntersections);
    incidentsService.getActiveIncidents().then(setIncidents);
    emergencyService.getActiveVehicles().then(setEmergencyVehicles);
  }, []);

  const handleApprove = (recId: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, status: 'APPROVED' } : r))
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.kpiRow}>
        <KPICard title="Monitored Intersections" value={intersections.length} unit="online" icon={<Cpu size={20} />} />
        <KPICard title="Active Incidents" value={incidents.length} unit="verified" icon={<AlertTriangle size={20} />} />
        <KPICard title="Green Corridors" value={emergencyVehicles.length} unit="active" icon={<Siren size={20} />} />
        <KPICard title="AI Model Confidence" value="94.2%" unit="avg" icon={<Sparkles size={20} />} />
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.mapCard}>
          <MapContainer
            intersections={intersections}
            incidents={incidents}
            emergencyVehicles={emergencyVehicles}
            zoom={12}
            center={{ lat: 12.9716, lng: 77.5946 }}
          />
        </div>

        <div className={styles.panel}>
          <div className={styles.panelTitle}>Pending AI Signal Timing Recommendations</div>

          {recommendations.map((rec) => (
            <div key={rec.id} className={styles.recItem}>
              <div className={styles.recHeader}>
                <span className={styles.junctionName}>{rec.intersectionName}</span>
                <span style={{ fontSize: '12px', color: 'var(--color-status-normal)', fontWeight: 'bold' }}>
                  -{rec.estimatedDelayReduction}% Delay
                </span>
              </div>

              <div className={styles.recBody}>
                <div>
                  Current: {rec.currentNorthSouthGreen}s N-S / {rec.currentEastWestGreen}s E-W
                </div>
                <div style={{ color: 'var(--color-primary)', fontWeight: 'semibold' }}>
                  Recommended: {rec.recommendedNorthSouthGreen}s N-S / {rec.recommendedEastWestGreen}s E-W
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Confidence: {Math.round(rec.confidence * 100)}% | {rec.reasoning.join('; ')}
                </div>
              </div>

              <div className={styles.recActions}>
                {rec.status === 'APPROVED' ? (
                  <Button variant="secondary" size="sm" disabled>
                    <Check size={14} /> Approved & Applied
                  </Button>
                ) : (
                  <>
                    <Button variant="primary" size="sm" onClick={() => handleApprove(rec.id)}>
                      <Check size={14} /> Approve Timing
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/authority/simulator?intersection=${rec.signalId}`)}
                    >
                      <Play size={14} /> Simulate
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
