import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Navigation,
  Activity,
  Cpu,
  Siren,
  FileText,
  BarChart3,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { MapContainer } from '../../components/maps/MapContainer/MapContainer';
import { KPICard } from '../../components/ui/KPICard/KPICard';
import { trafficService } from '../../services/api/traffic';
import { Intersection } from '../../types';
import styles from './Home.module.css';

export const Home: React.FC = () => {
  const [intersections, setIntersections] = useState<Intersection[]>([]);

  useEffect(() => {
    trafficService.getTrafficMapData().then(setIntersections);
  }, []);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badgeTag}>
            <Activity size={16} /> SIH 2026 Smart Traffic Decision Platform
          </div>
          <h1 className={styles.heroTitle}>
            Real-Time AI Traffic Optimization & Congestion Intelligence
          </h1>
          <p className={styles.heroSubtitle}>
            Transforming urban mobility through adaptive signal timing, computer-vision flow tracking,
            and emergency green corridors.
          </p>
          <div className={styles.heroActions}>
            <Link to="/live-traffic">
              <Button variant="primary" size="lg">
                View Live Traffic Map <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/route-planner">
              <Button variant="outline" size="lg">
                Plan Smart Route
              </Button>
            </Link>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <MapContainer
            intersections={intersections}
            zoom={12}
            center={{ lat: 12.9716, lng: 77.5946 }}
          />
        </div>
      </section>

      {/* Live Operational Metrics Summary */}
      <section className={styles.section}>
        <div className={styles.grid4}>
          <KPICard title="City Flow Efficiency" value="78.4%" unit="avg" icon={<Activity size={20} />} />
          <KPICard title="Monitored Signals" value={intersections.length} unit="active" icon={<Cpu size={20} />} />
          <KPICard title="Active Corridors" value="1" unit="ambulance" icon={<Siren size={20} />} />
          <KPICard title="Avg Travel Time Saved" value="18.5" unit="mins" icon={<CheckCircle2 size={20} />} />
        </div>
      </section>

      {/* Core Loop / Pipeline Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Seven-Step Traffic Optimization Loop</h2>
        <p className={styles.sectionSubtitle}>
          From camera feed to adaptive signal override and citizen route advisories.
        </p>

        <div className={styles.grid3}>
          <div className={styles.workflowStep}>
            <div className={styles.stepNumber}>1</div>
            <div>
              <strong>DETECT</strong>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Computer vision models extract vehicle density and queue length.
              </p>
            </div>
          </div>

          <div className={styles.workflowStep}>
            <div className={styles.stepNumber}>2</div>
            <div>
              <strong>ANALYZE</strong>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Calculate lane occupancy and intersection congestion states.
              </p>
            </div>
          </div>

          <div className={styles.workflowStep}>
            <div className={styles.stepNumber}>3</div>
            <div>
              <strong>PREDICT</strong>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Forecast 15 to 60 minute congestion build-up points.
              </p>
            </div>
          </div>

          <div className={styles.workflowStep}>
            <div className={styles.stepNumber}>4</div>
            <div>
              <strong>EXPLAIN</strong>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Display evidence-backed causal factors for delays.
              </p>
            </div>
          </div>

          <div className={styles.workflowStep}>
            <div className={styles.stepNumber}>5</div>
            <div>
              <strong>RECOMMEND</strong>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                AI generates optimized signal timings per corridor.
              </p>
            </div>
          </div>

          <div className={styles.workflowStep}>
            <div className={styles.stepNumber}>6</div>
            <div>
              <strong>SIMULATE</strong>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Test recommendations safely in digital twin simulation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Platform Capabilities</h2>
        <div className={styles.grid3} style={{ marginTop: 'var(--space-6)' }}>
          <div className={styles.card}>
            <Navigation className={styles.cardIcon} size={28} />
            <h3 className={styles.cardTitle}>Dynamic Route Planning</h3>
            <p className={styles.cardText}>
              Avoid bottlenecks with real-time routing recommendations backed by signal timing awareness.
            </p>
          </div>

          <div className={styles.card}>
            <Siren className={styles.cardIcon} size={28} />
            <h3 className={styles.cardTitle}>Emergency Green Corridors</h3>
            <p className={styles.cardText}>
              Pre-emptively clear green corridors for emergency vehicles to save vital minutes.
            </p>
          </div>

          <div className={styles.card}>
            <FileText className={styles.cardIcon} size={28} />
            <h3 className={styles.cardTitle}>Citizen Incident Reporting</h3>
            <p className={styles.cardText}>
              Submit geotagged incident reports with photo uploads to alert authority command teams.
            </p>
          </div>
        </div>
      </section>

      {/* Before / After Comparison Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Before vs. After Optimization</h2>
        <div className={styles.beforeAfterGrid} style={{ marginTop: 'var(--space-6)' }}>
          <div className={styles.beforeBox}>
            <span style={{ color: 'var(--color-status-severe)', fontWeight: 'bold' }}>
              TRADITIONAL FIXED TIMING
            </span>
            <ul style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-secondary)', paddingLeft: '20px' }}>
              <li>Fixed 60s/60s cycle despite zero traffic on cross streets</li>
              <li>Emergency vehicles trapped in gridlock queue</li>
              <li>High vehicle idling, increased fuel consumption & emissions</li>
            </ul>
          </div>

          <div className={styles.afterBox}>
            <span style={{ color: 'var(--color-status-normal)', fontWeight: 'bold' }}>
              AI ADAPTIVE SIGNAL CONTROL
            </span>
            <ul style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-secondary)', paddingLeft: '20px' }}>
              <li>Dynamic green time allocation based on live vehicle queue</li>
              <li>Automated green waves for approaching ambulances</li>
              <li>Up to 24% reduction in average queue delay</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
