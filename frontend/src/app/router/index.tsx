import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { AuthorityLayout } from '../../components/layout/AuthorityLayout';
import { ProtectedRoute } from '../../features/auth/ProtectedRoute';

import { Home } from '../../pages/public/Home';
import { LiveTraffic } from '../../pages/public/LiveTraffic';
import { RoutePlanner } from '../../pages/public/RoutePlanner';
import { ReportIncident } from '../../pages/public/ReportIncident';
import { SmartParking } from '../../pages/public/SmartParking';
import { TrafficAssistant } from '../../pages/public/TrafficAssistant';

import { AuthorityLogin } from '../../pages/authority/AuthorityLogin';
import { Dashboard } from '../../pages/authority/Dashboard';
import { AIMonitoring } from '../../pages/authority/AIMonitoring';
import { AIPredictions } from '../../pages/authority/AIPredictions';
import { SmartSignals } from '../../pages/authority/SmartSignals';
import { EmergencyControl } from '../../pages/authority/EmergencyControl';
import { IncidentManagement } from '../../pages/authority/IncidentManagement';
import { ExplainableAI } from '../../pages/authority/ExplainableAI';
import { TrafficSimulator } from '../../pages/authority/TrafficSimulator';
import { Analytics } from '../../pages/authority/Analytics';
import { ImpactAnalysis } from '../../pages/authority/ImpactAnalysis';
import { GovernmentData } from '../../pages/authority/GovernmentData';
import { Reports } from '../../pages/authority/Reports';
import { Settings } from '../../pages/authority/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'live-traffic', element: <LiveTraffic /> },
      { path: 'route-planner', element: <RoutePlanner /> },
      { path: 'report-incident', element: <ReportIncident /> },
      { path: 'smart-parking', element: <SmartParking /> },
      { path: 'traffic-assistant', element: <TrafficAssistant /> },
    ],
  },
  {
    path: '/authority/login',
    element: <AuthorityLogin />,
  },
  {
    path: '/authority',
    element: (
      <ProtectedRoute roles={['TRAFFIC_AUTHORITY', 'ADMIN']}>
        <AuthorityLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'monitoring', element: <AIMonitoring /> },
      { path: 'predictions', element: <AIPredictions /> },
      { path: 'signals', element: <SmartSignals /> },
      { path: 'emergency', element: <EmergencyControl /> },
      { path: 'incidents', element: <IncidentManagement /> },
      { path: 'explainable-ai', element: <ExplainableAI /> },
      { path: 'simulator', element: <TrafficSimulator /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'impact', element: <ImpactAnalysis /> },
      { path: 'environment', element: <ImpactAnalysis /> },
      { path: 'government-data', element: <GovernmentData /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);
