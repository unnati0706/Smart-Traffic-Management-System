import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <span className={styles.text}>
          © 2026 Smart Traffic Management System --- Decision Support Platform
        </span>
        <div className={styles.links}>
          <span>SIH 2026 Prototype</span>
          <span>•</span>
          <span>OpenStreetMap & Leaflet Powered</span>
        </div>
      </div>
    </footer>
  );
};
