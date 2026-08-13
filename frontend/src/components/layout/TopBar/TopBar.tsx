import React, { useState, useEffect } from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '../../ui/Button/Button';
import { useAuth } from '../../../features/auth/AuthContext';
import { socketManager } from '../../../services/websocket/socketManager';
import styles from './TopBar.module.css';

interface TopBarProps {
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title = 'Authority Command Center' }) => {
  const { user, logout } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = socketManager.onStatusChange(setIsConnected);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <header className={styles.topBar}>
      <h1 style={{ fontSize: 'var(--font-size-card)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
        {title}
      </h1>

      <div className={styles.right}>
        <div className={styles.wsIndicator}>
          <span className={`${styles.statusDot} ${isConnected ? styles.connected : styles.disconnected}`} />
          <span>{isConnected ? 'LIVE WS STREAM' : 'SOCKET POLLING'}</span>
        </div>

        <div className={styles.userInfo}>
          <UserIcon size={18} color="var(--color-text-secondary)" />
          <div>
            <div className={styles.userName}>{user?.name || 'TRAFFIC OFFICER'}</div>
            <div className={styles.roleBadge}>{user?.role || 'TRAFFIC_AUTHORITY'}</div>
          </div>
          <Button variant="outline" size="sm" onClick={logout} style={{ marginLeft: 'var(--space-2)' }}>
            <LogOut size={14} /> Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
