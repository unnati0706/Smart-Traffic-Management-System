import React, { useState } from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { Settings as SettingsIcon, Shield, Check, Link2, Key } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import styles from './Settings.module.css';

export const Settings: React.FC = () => {
  const [saveMessage, setSaveMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage(true);
    setTimeout(() => setSaveMessage(false), 2500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Command Center System Settings</h1>
        <p className={styles.subtitle}>
          Role-aware system parameters, notification webhooks, and security access controls.
        </p>
      </div>

      <RadixTabs.Root defaultValue="general">
        <RadixTabs.List className={styles.tabList}>
          <RadixTabs.Trigger value="general" className={styles.tabTrigger}>
            General Parameters
          </RadixTabs.Trigger>
          <RadixTabs.Trigger value="webhooks" className={styles.tabTrigger}>
            Integrations & Webhooks
          </RadixTabs.Trigger>
          <RadixTabs.Trigger value="roles" className={styles.tabTrigger}>
            Role Access Control
          </RadixTabs.Trigger>
        </RadixTabs.List>

        <RadixTabs.Content value="general" className={styles.tabContent}>
          <form onSubmit={handleSave} className={styles.card}>
            <Input label="System Station Name" defaultValue="Central Command Control Unit - Zone 1" />
            <Input label="Default Signal Cycle Length (Seconds)" type="number" defaultValue="90" />
            <Input label="Emergency Green Wave Priority Threshold" type="number" defaultValue="95" />
            <Input label="CV Video Telemetry Ingest URL" defaultValue="rtsp://stream.traffic.gov/live/cam_zone1" />

            <Button type="submit" variant="primary">
              <SettingsIcon size={16} /> Save Configuration
            </Button>

            {saveMessage && (
              <span className={styles.successBadge}>
                <Check size={16} /> Settings saved successfully to production environment!
              </span>
            )}
          </form>
        </RadixTabs.Content>

        <RadixTabs.Content value="webhooks" className={styles.tabContent}>
          <div className={styles.card}>
            <div className={styles.webhookRow}>
              <div>
                <strong style={{ color: 'var(--color-text-primary)' }}>Police Control Dispatch Webhook</strong>
                <div style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)' }}>
                  Status: Active (Encrypted Connection TLS 1.3)
                </div>
              </div>
              <span className={styles.statusConnected}>CONNECTED</span>
            </div>

            <div className={styles.webhookRow}>
              <div>
                <strong style={{ color: 'var(--color-text-primary)' }}>Hospital Emergency Gateway API</strong>
                <div style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)' }}>
                  Status: Active (Token Authenticated)
                </div>
              </div>
              <span className={styles.statusConnected}>CONNECTED</span>
            </div>

            <div className={styles.webhookRow}>
              <div>
                <strong style={{ color: 'var(--color-text-primary)' }}>Civic Citizen Alert Push Network</strong>
                <div style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)' }}>
                  Status: Active (Firebase Cloud Messaging)
                </div>
              </div>
              <span className={styles.statusConnected}>CONNECTED</span>
            </div>
          </div>
        </RadixTabs.Content>

        <RadixTabs.Content value="roles" className={styles.tabContent}>
          <div className={styles.card}>
            <div style={{ fontSize: 'var(--font-size-card)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              Active RBAC Role Definitions
            </div>

            <div className={styles.roleList}>
              <div className={styles.roleItem}>
                <div>
                  <strong style={{ color: 'var(--color-text-primary)' }}>TRAFFIC_AUTHORITY</strong>
                  <div style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)' }}>
                    Full signal override, green wave dispatch, incident management & AI parameters access.
                  </div>
                </div>
                <span style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-primary)', fontWeight: 'bold' }}>ACTIVE</span>
              </div>

              <div className={styles.roleItem}>
                <div>
                  <strong style={{ color: 'var(--color-text-primary)' }}>ADMIN</strong>
                  <div style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)' }}>
                    System configuration, API key generation, user audit logs & infrastructure settings.
                  </div>
                </div>
                <span style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-primary)', fontWeight: 'bold' }}>ACTIVE</span>
              </div>

              <div className={styles.roleItem}>
                <div>
                  <strong style={{ color: 'var(--color-text-primary)' }}>CITIZEN</strong>
                  <div style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)' }}>
                    Public live map, route planning, incident report submission & parking space availability.
                  </div>
                </div>
                <span style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>PUBLIC</span>
              </div>
            </div>
          </div>
        </RadixTabs.Content>
      </RadixTabs.Root>
    </div>
  );
};
