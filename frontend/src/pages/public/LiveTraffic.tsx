import React, { useState, useEffect } from 'react';
import { MapContainer } from '../../components/maps/MapContainer/MapContainer';
import { IntersectionDrawer } from '../../components/maps/IntersectionDrawer/IntersectionDrawer';
import { Input } from '../../components/ui/Input/Input';
import { trafficService } from '../../services/api/traffic';
import { incidentsService } from '../../services/api/incidents';
import { emergencyService } from '../../services/api/emergency';
import { socketManager } from '../../services/websocket/socketManager';
import { Intersection, Incident, EmergencyVehicle, TrafficState } from '../../types';
import styles from './LiveTraffic.module.css';

export const LiveTraffic: React.FC = () => {
  const [intersections, setIntersections] = useState<Intersection[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [emergencyVehicles, setEmergencyVehicles] = useState<EmergencyVehicle[]>([]);
  const [selectedIntersection, setSelectedIntersection] = useState<Intersection | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    // Fetch initial data
    trafficService.getTrafficMapData().then(setIntersections);
    incidentsService.getActiveIncidents().then(setIncidents);
    emergencyService.getActiveVehicles().then(setEmergencyVehicles);

    // Subscribe to realtime traffic updates
    const unsubscribe = socketManager.subscribe('traffic.updated', (data: Intersection) => {
      setIntersections((prev) =>
        prev.map((item) => (item.id === data.id ? { ...item, ...data } : item))
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredIntersections = intersections.filter((int) => {
    const matchesSearch = int.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatusFilter === 'ALL' || int.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filterOptions: { label: string; value: string }[] = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Normal Flow', value: 'NORMAL' },
    { label: 'Moderate', value: 'MODERATE' },
    { label: 'Heavy Delay', value: 'HEAVY' },
    { label: 'Severe', value: 'SEVERE' },
    { label: 'Emergency', value: 'EMERGENCY' },
  ];

  return (
    <div className={styles.layout}>
      <div className={styles.topBar}>
        <div className={styles.searchBox}>
          <Input
            placeholder="Search junction or road..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              className={`${styles.filterChip} ${
                selectedStatusFilter === opt.value ? styles.filterChipActive : ''
              }`}
              onClick={() => setSelectedStatusFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.mapViewport}>
        <MapContainer
          intersections={filteredIntersections}
          incidents={incidents}
          emergencyVehicles={emergencyVehicles}
          onSelectIntersection={(int) => setSelectedIntersection(int)}
        />
      </div>

      <IntersectionDrawer
        intersection={selectedIntersection}
        onClose={() => setSelectedIntersection(null)}
      />
    </div>
  );
};
