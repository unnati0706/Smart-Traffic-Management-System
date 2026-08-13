import React, { useState } from 'react';
import { Navigation, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { MapContainer } from '../../components/maps/MapContainer/MapContainer';
import { TrafficStatusBadge } from '../../components/ui/TrafficStatusBadge/TrafficStatusBadge';
import { routesService } from '../../services/api/routes';
import { PlannedRoute, LatLng } from '../../types';
import styles from './RoutePlanner.module.css';

export const RoutePlanner: React.FC = () => {
  const [originText, setOriginText] = useState('Central Station, Downtown');
  const [destinationText, setDestinationText] = useState('Tech Park Phase 2');
  const [isPlanning, setIsPlanning] = useState(false);
  const [routes, setRoutes] = useState<PlannedRoute[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const handlePlanRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPlanning(true);

    const origin: LatLng = { lat: 12.9716, lng: 77.5946 };
    const destination: LatLng = { lat: 12.9850, lng: 77.6300 };

    try {
      const planned = await routesService.planRoute(origin, destination);
      setRoutes(planned);
      if (planned.length > 0) {
        setSelectedRouteId(planned[0].id);
      }
    } finally {
      setIsPlanning(false);
    }
  };

  const routeGeometries = routes.map((r) => r.geometry);

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <h1 className={styles.title}>AI Route Planner</h1>

        <form onSubmit={handlePlanRoute} className={styles.form}>
          <Input
            label="Origin"
            placeholder="Enter starting location"
            value={originText}
            onChange={(e) => setOriginText(e.target.value)}
          />
          <Input
            label="Destination"
            placeholder="Enter destination"
            value={destinationText}
            onChange={(e) => setDestinationText(e.target.value)}
          />

          <Button type="submit" variant="primary" disabled={isPlanning}>
            <Navigation size={18} />
            {isPlanning ? 'Calculating Signal-Aware Routes...' : 'Calculate Routes'}
          </Button>
        </form>

        {routes.length > 0 && (
          <div className={styles.routeList}>
            <h2 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
              Suggested Route Options ({routes.length})
            </h2>

            {routes.map((route) => (
              <div
                key={route.id}
                className={`${styles.routeCard} ${
                  selectedRouteId === route.id ? styles.routeCardActive : ''
                }`}
                onClick={() => setSelectedRouteId(route.id)}
              >
                {route.isRecommended && (
                  <div className={styles.recommendedTag}>
                    <CheckCircle2 size={14} /> AI Recommended Option
                  </div>
                )}
                <div className={styles.routeName}>{route.name}</div>

                <div className={styles.metaRow}>
                  <span>
                    <Clock size={14} /> {route.etaMinutes} mins
                  </span>
                  <span>{route.distanceKm} km</span>
                  <TrafficStatusBadge status={route.overallState} showIcon={false} />
                </div>

                {route.recommendationReason && (
                  <div className={styles.reasoning}>{route.recommendationReason}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.mapArea}>
        <MapContainer routes={routeGeometries} center={{ lat: 12.9780, lng: 77.6120 }} zoom={13} />
      </div>
    </div>
  );
};
