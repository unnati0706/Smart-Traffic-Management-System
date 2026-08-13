import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthoritySidebar } from './AuthoritySidebar/AuthoritySidebar';
import { TopBar } from './TopBar/TopBar';

export const AuthorityLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-app)' }}>
      <AuthoritySidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        <TopBar />
        <main style={{ flex: 1, padding: 'var(--space-6)', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
