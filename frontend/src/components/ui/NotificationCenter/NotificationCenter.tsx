import React, { useState, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Bell, Siren, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { socketManager } from '../../../services/websocket/socketManager';
import styles from './NotificationCenter.module.css';

interface NotificationItem {
  id: string;
  type: 'INCIDENT' | 'EMERGENCY' | 'ALERT';
  title: string;
  message: string;
  timestamp: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'EMERGENCY',
    title: 'Emergency Green Corridor Priority',
    message: 'Ambulance AMB-8801 cleared via Central Avenue Signal #sig-101',
    timestamp: '2m ago',
  },
  {
    id: 'notif-2',
    type: 'INCIDENT',
    title: 'New Citizen Incident Verification',
    message: 'Two-vehicle collision reported on MG Road Junction (#inc-201)',
    timestamp: '15m ago',
  },
];

export const NotificationCenter: React.FC = () => {
  const [items, setItems] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState<number>(INITIAL_NOTIFICATIONS.length);

  useEffect(() => {
    // Subscribe to realtime alerts
    const unsubIncident = socketManager.subscribe('incident.created', (data) => {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: 'INCIDENT',
        title: 'New Incident Reported',
        message: data.title || 'Road obstruction reported by citizen feed',
        timestamp: 'Just now',
      };
      setItems((prev) => [newNotif, ...prev]);
      setUnreadCount((c) => c + 1);
    });

    const unsubEmergency = socketManager.subscribe('emergency.vehicle.updated', (data) => {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: 'EMERGENCY',
        title: 'Green Corridor Dispatch',
        message: `Emergency vehicle ${data.code || ''} approaching corridor`,
        timestamp: 'Just now',
      };
      setItems((prev) => [newNotif, ...prev]);
      setUnreadCount((c) => c + 1);
    });

    return () => {
      unsubIncident();
      unsubEmergency();
    };
  }, []);

  return (
    <Popover.Root onOpenChange={(open) => open && setUnreadCount(0)}>
      <Popover.Trigger asChild>
        <button className={styles.triggerBtn} aria-label="Notifications">
          <Bell size={18} />
          {unreadCount > 0 && <span className={styles.unreadBadge} />}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.popoverContent} sideOffset={8}>
          <div className={styles.title}>
            <span>Command Live Alerts</span>
            <span>{items.length} Total</span>
          </div>

          <div className={styles.list}>
            {items.map((item) => (
              <div key={item.id} className={styles.item}>
                {item.type === 'EMERGENCY' ? (
                  <Siren size={18} color="var(--color-status-emergency)" />
                ) : item.type === 'INCIDENT' ? (
                  <AlertTriangle size={18} color="var(--color-status-severe)" />
                ) : (
                  <CheckCircle2 size={18} color="var(--color-primary)" />
                )}
                <div>
                  <div className={styles.itemTitle}>{item.title}</div>
                  <div className={styles.itemText}>{item.message}</div>
                  <div className={styles.itemTime}>{item.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
