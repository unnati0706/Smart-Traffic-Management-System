import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Activity, Shield } from 'lucide-react';
import { Button } from '../../ui/Button/Button';
import styles from './PublicHeader.module.css';

export const PublicHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        <Activity className={styles.logoIcon} size={24} />
        <span>SMART TRAFFIC</span>
      </Link>

      <nav className={styles.nav}>
        <NavLink to="/" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          Home
        </NavLink>
        <NavLink to="/live-traffic" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          Live Traffic
        </NavLink>
        <NavLink to="/route-planner" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          Route Planner
        </NavLink>
        <NavLink to="/report-incident" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          Report Incident
        </NavLink>
        <NavLink to="/smart-parking" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          Smart Parking
        </NavLink>
        <NavLink to="/traffic-assistant" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          AI Assistant
        </NavLink>
      </nav>

      <div className={styles.actions}>
        <Link to="/authority/login">
          <Button variant="outline" size="sm">
            <Shield size={16} />
            Authority Portal
          </Button>
        </Link>
      </div>
    </header>
  );
};
