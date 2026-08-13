import React, { useState } from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { Settings as SettingsIcon, Bell, Shield, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';

export const Settings: React.FC = () => {
  const [saveMessage, setSaveMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage(true);
    setTimeout(() => setSaveMessage(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '800px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-title)', fontWeight: 'bold' }}>Command Center System Settings</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Role-aware system parameters, notification webhooks, and security access controls.
        </p>
      </div>

      <RadixTabs.Root defaultValue="general">
        <RadixTabs.List style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', gap: 'var(--space-2)' }}>
          <RadixTabs.Trigger
            value="general"
            style={{ padding: 'var(--space-3) var(--space-4)', background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', borderBottom: '2px solid transparent' }}
          >
            General Parameters
          </RadixTabs.Trigger>
          <RadixTabs.Trigger
            value="webhooks"
            style={{ padding: 'var(--space-3) var(--space-4)', background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', borderBottom: '2px solid transparent' }}
          >
            Integrations & Webhooks
          </RadixTabs.Trigger>
          <RadixTabs.Trigger
            value="roles"
            style={{ padding: 'var(--space-3) var(--space-4)', background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', borderBottom: '2px solid transparent' }}
          >
            Role Access Control
          </RadixTabs.Trigger>
        </RadixTabs.List>

        <RadixTabs.Content value="general" style={{ paddingTop: 'var(--space-6)' }}>
          <form onSubmit={handleSave} style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input label="System Station Name" defaultValue="Central Command Control Unit - Zone 1" />
            <Input label="Default Signal Cycle Length (Seconds)" type="number" defaultValue="90" />
            <Input label="Emergency Green Wave Priority Threshold" type="number" defaultValue="95" />

            <Button type="submit" variant="primary">
              <SettingsIcon size={16} /> Save Configuration
            </Button>

            {saveMessage && (
              <span style={{ color: 'var(--color-status-normal)', fontWeight: 'bold', fontSize: 'var(--font-size-table)' }}>
                ✓ Settings saved successfully!
              </span>
            )}
          </form>
        </RadixTabs.Content>

        <RadixTabs.Content value="webhooks" style={{ paddingTop: 'var(--space-6)' }}>
          <div style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Police Control Dispatch Webhook</strong>
                <div style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)' }}>Status: Active (Encrypted Connection)</div>
              </div>
              <span style={{ color: 'var(--color-status-normal)', fontWeight: 'bold' }}>CONNECTED</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Hospital Emergency Gateway API</strong>
                <div style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)' }}>Status: Active (Token Authenticated)</div>
              </div>
              <span style={{ color: 'var(--color-status-normal)', fontWeight: 'bold' }}>CONNECTED</span>
            </div>
          </div>
        </RadixTabs.Content>

        <RadixTabs.Content value="roles" style={{ paddingTop: 'var(--space-6)' }}>
          <div style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)', padding: 'var(--space-6)' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Active Roles: <strong>CITIZEN</strong>, <strong>TRAFFIC_AUTHORITY</strong>, <strong>ADMIN</strong>.
            </p>
          </div>
        </RadixTabs.Content>
      </RadixTabs.Root>
    </div>
  );
};
