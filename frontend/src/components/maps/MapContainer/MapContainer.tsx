import React, { useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { ENV } from '../../../config/env';
import { Intersection, Incident, EmergencyVehicle, LatLng } from '../../../types';
import styles from './MapContainer.module.css';

// Fix Leaflet default marker icon path issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createIntersectionIcon = (status: string): L.DivIcon => {
  const colorMap: Record<string, string> = {
    NORMAL: '#10b981',
    MODERATE: '#f59e0b',
    HEAVY: '#f97316',
    SEVERE: '#ef4444',
    EMERGENCY: '#ec4899',
    INCIDENT: '#a855f7',
  };

  const bg = colorMap[status] || '#10b981';

  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="
      width: 24px;
      height: 24px;
      background-color: ${bg};
      border: 2px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: bold;
      font-size: 10px;
    ">I</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const createIncidentIcon = (): L.DivIcon => {
  return L.divIcon({
    className: 'custom-incident-marker',
    html: `<div style="
      width: 26px;
      height: 26px;
      background-color: #a855f7;
      border: 2px solid #ffffff;
      border-radius: 4px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: bold;
      font-size: 12px;
    ">!</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

const createEmergencyIcon = (): L.DivIcon => {
  return L.divIcon({
    className: 'custom-emergency-marker',
    html: `<div style="
      width: 28px;
      height: 28px;
      background-color: #ec4899;
      border: 2px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 12px #ec4899;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: bold;
      font-size: 13px;
    ">🚑</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

interface MapContainerComponentProps {
  center?: LatLng;
  zoom?: number;
  intersections?: Intersection[];
  incidents?: Incident[];
  emergencyVehicles?: EmergencyVehicle[];
  routes?: LatLng[][];
  onSelectIntersection?: (intersection: Intersection) => void;
  onSelectIncident?: (incident: Incident) => void;
}

export const MapContainer: React.FC<MapContainerComponentProps> = ({
  center = { lat: 12.9716, lng: 77.5946 },
  zoom = 13,
  intersections = [],
  incidents = [],
  emergencyVehicles = [],
  routes = [],
  onSelectIntersection,
  onSelectIncident,
}) => {
  const [showTraffic, setShowTraffic] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showEmergency, setShowEmergency] = useState(true);

  return (
    <div className={styles.mapWrapper}>
      <div className={styles.mapControlPanel}>
        <button
          className={`${styles.layerToggle} ${showTraffic ? styles.layerToggleActive : ''}`}
          onClick={() => setShowTraffic(!showTraffic)}
        >
          Signals ({intersections.length})
        </button>
        <button
          className={`${styles.layerToggle} ${showIncidents ? styles.layerToggleActive : ''}`}
          onClick={() => setShowIncidents(!showIncidents)}
        >
          Incidents ({incidents.length})
        </button>
        <button
          className={`${styles.layerToggle} ${showEmergency ? styles.layerToggleActive : ''}`}
          onClick={() => setShowEmergency(!showEmergency)}
        >
          Emergency ({emergencyVehicles.length})
        </button>
      </div>

      <LeafletMap center={[center.lat, center.lng]} zoom={zoom} scrollWheelZoom={true}>
        <TileLayer
          attribution={ENV.MAP_ATTRIBUTION}
          url={ENV.MAP_TILE_URL}
        />

        {routes.map((route, idx) => (
          <Polyline
            key={`route-${idx}`}
            positions={route.map((p) => [p.lat, p.lng])}
            pathOptions={{
              color: idx === 0 ? '#2563eb' : '#6b7280',
              weight: idx === 0 ? 5 : 3,
              dashArray: idx === 0 ? undefined : '5, 10',
            }}
          />
        ))}

        {showTraffic &&
          intersections.map((int) => (
            <Marker
              key={int.id}
              position={[int.location.lat, int.location.lng]}
              icon={createIntersectionIcon(int.status)}
              eventHandlers={{
                click: () => onSelectIntersection && onSelectIntersection(int),
              }}
            >
              <Popup>
                <div style={{ color: '#111827' }}>
                  <strong>{int.name}</strong>
                  <br />
                  State: <b>{int.status}</b>
                  <br />
                  Vehicles: {int.vehicleCount} | Speed: {int.averageSpeed} km/h
                </div>
              </Popup>
            </Marker>
          ))}

        {showIncidents &&
          incidents.map((inc) => (
            <Marker
              key={inc.id}
              position={[inc.location.lat, inc.location.lng]}
              icon={createIncidentIcon()}
              eventHandlers={{
                click: () => onSelectIncident && onSelectIncident(inc),
              }}
            >
              <Popup>
                <div style={{ color: '#111827' }}>
                  <strong>{inc.title}</strong>
                  <br />
                  Type: {inc.type} | Severity: {inc.severity}
                </div>
              </Popup>
            </Marker>
          ))}

        {showEmergency &&
          emergencyVehicles.map((em) => (
            <Marker
              key={em.id}
              position={[em.currentLocation.lat, em.currentLocation.lng]}
              icon={createEmergencyIcon()}
            >
              <Popup>
                <div style={{ color: '#111827' }}>
                  <strong>{em.code} ({em.type})</strong>
                  <br />
                  Destination: {em.destinationName}
                  <br />
                  ETA: <b>{em.etaOptimized} mins</b> (Saved {em.timeSaved} mins)
                </div>
              </Popup>
            </Marker>
          ))}
      </LeafletMap>
    </div>
  );
};
