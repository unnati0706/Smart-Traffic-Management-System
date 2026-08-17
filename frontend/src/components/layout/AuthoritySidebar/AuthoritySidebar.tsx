import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  TrendingUp,
  Cpu,
  Siren,
  AlertTriangle,
  HelpCircle,
  PlaySquare,
  BarChart3,
  PieChart,
  Leaf,
  Database,
  FileSpreadsheet,
  Settings,
  Shield,
} from 'lucide-react';
import styles from './AuthoritySidebar.module.css';

export const AuthoritySidebar: React.FC = () => {
  const mainNav = [
    { to: '/authority/dashboard', label: 'Command Center', icon: LayoutDashboard },
    { to: '/authority/monitoring', label: 'AI Monitoring', icon: Video },
    { to: '/authority/predictions', label: 'AI Predictions', icon: TrendingUp },
    { to: '/authority/signals', label: 'Smart Signals', icon: Cpu },
    { to: '/authority/emergency', label: 'Emergency Control', icon: Siren },
    { to: '/authority/incidents', label: 'Incident Mgmt', icon: AlertTriangle },
  ];

  const analysisNav = [
    { to: '/authority/explainable-ai', label: 'Explainable AI', icon: HelpCircle },
    { to: '/authority/simulator', label: 'Traffic Simulator', icon: PlaySquare },
    { to: '/authority/analytics', label: 'Analytics Suite', icon: BarChart3 },
    { to: '/authority/impact', label: 'Impact Scorecard', icon: PieChart },
    { to: '/authority/environment', label: 'Environment', icon: Leaf },
  ];

  const adminNav = [
    { to: '/authority/government-data', label: 'Government Data', icon: Database },
    { to: '/authority/reports', label: 'Report Generator', icon: FileSpreadsheet },
    { to: '/authority/settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Shield className={styles.brandIcon} size={24} />
        <span>COMMAND CTRL</span>
      </div>

      <div className={styles.alertNotice}>
        <AlertTriangle size={16} />
        <span>1 Severe Bottleneck Active</span>
      </div>

      <nav className={styles.nav}>
        <div className={styles.sectionHeader}>Operations</div>
        {mainNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className={styles.sectionHeader}>Intelligence</div>
        {analysisNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className={styles.sectionHeader}>Administration</div>
        {adminNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
