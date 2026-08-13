import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicHeader } from './PublicHeader/PublicHeader';
import { Footer } from './Footer/Footer';

export const PublicLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
