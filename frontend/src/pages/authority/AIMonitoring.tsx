import React, { useState } from 'react';
import { Camera, RefreshCw, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import styles from './AIMonitoring.module.css';

export const AIMonitoring: React.FC = () => {
  const [selectedCam, setSelectedCam] = useState('CAM-102 (MG Road Junction)');
  const [isProcessing, setIsProcessing] = useState(false);

  const boxes = [
    { id: 1, label: 'CAR (98%)', top: '30%', left: '25%', width: '120px', height: '80px', color: '#10b981' },
    { id: 2, label: 'BUS (95%)', top: '45%', left: '50%', width: '160px', height: '110px', color: '#f59e0b' },
    { id: 3, label: 'CAR (99%)', top: '60%', left: '15%', width: '110px', height: '75px', color: '#10b981' },
    { id: 4, label: 'TWO-WHEELER', top: '35%', left: '70%', width: '60px', height: '50px', color: '#a855f7' },
  ];

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-title)', fontWeight: 'bold' }}>AI Computer Vision Feed Monitoring</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            YOLOv8 real-time vehicle classification & queue density extraction gateway.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setIsProcessing(!isProcessing)}>
          <RefreshCw size={14} /> {isProcessing ? 'Processing Batch...' : 'Trigger Pipeline Check'}
        </Button>
      </div>

      <div className={styles.grid}>
        <div className={styles.videoCard}>
          <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', zIndex: 1 }}>
            <Camera size={48} />
            <div style={{ marginTop: '8px', fontWeight: 'bold' }}>LIVE CCTV STREAM --- {selectedCam}</div>
            <div style={{ fontSize: '12px', color: '#10b981' }}>● YOLO OBJECT DETECTION ACTIVE (30 FPS)</div>
          </div>

          <div className={styles.videoOverlay}>
            {boxes.map((box) => (
              <div
                key={box.id}
                className={styles.boundingBox}
                style={{
                  top: box.top,
                  left: box.left,
                  width: box.width,
                  height: box.height,
                  borderColor: box.color,
                  color: box.color,
                }}
              >
                {box.label}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.telemetryPanel}>
          <div className={styles.title}>Real-time Extraction Telemetry</div>

          <div className={styles.statRow}>
            <span>Camera Node ID</span>
            <strong>CAM-102-SOUTH</strong>
          </div>
          <div className={styles.statRow}>
            <span>Detected Vehicles</span>
            <strong style={{ color: 'var(--color-primary)' }}>48 / frame</strong>
          </div>
          <div className={styles.statRow}>
            <span>Passenger Cars</span>
            <span>32</span>
          </div>
          <div className={styles.statRow}>
            <span>Heavy Buses/Trucks</span>
            <span>6</span>
          </div>
          <div className={styles.statRow}>
            <span>Two-Wheelers</span>
            <span>10</span>
          </div>
          <div className={styles.statRow}>
            <span>Estimated Queue</span>
            <strong style={{ color: 'var(--color-status-severe)' }}>95 meters</strong>
          </div>
          <div className={styles.statRow}>
            <span>Lane Occupancy</span>
            <strong style={{ color: 'var(--color-status-heavy)' }}>82%</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
