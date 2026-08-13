import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { AuthorityLayout } from '../../components/layout/AuthorityLayout';
import { ProtectedRoute } from '../../features/auth/ProtectedRoute';
import { LoadingSkeleton } from '../../components/ui/States/LoadingSkeleton';

const Home = lazy(() => import('../../pages/public/Home').then(m => ({ default: m.Home })));
const LiveTraffic = lazy(() => import('../../pages/public/LiveTraffic').then(m => ({ default: m.LiveTraffic })));
const RoutePlanner = lazy(() => import('../../pages/public/RoutePlanner').then(m => ({ default: m.RoutePlanner })));
const ReportIncident = lazy(() => import('../../pages/public/ReportIncident').then(m => ({ default: m.ReportIncident })));
const SmartParking = lazy(() => import('../../pages/public/SmartParking').then(m => ({ default: m.SmartParking })));
const TrafficAssistant = lazy(() => import('../../pages/public/TrafficAssistant').then(m => ({ default: m.TrafficAssistant })));

const AuthorityLogin = lazy(() => import('../../pages/authority/AuthorityLogin').then(m => ({ default: m.AuthorityLogin })));
const Dashboard = lazy(() => import('../../pages/authority/Dashboard').then(m => ({ default: m.Dashboard })));
const AIMonitoring = lazy(() => import('../../pages/authority/AIMonitoring').then(m => ({ default: m.AIMonitoring })));
const AIPredictions = lazy(() => import('../../pages/authority/AIPredictions').then(m => ({ default: m.AIPredictions })));
const SmartSignals = lazy(() => import('../../pages/authority/SmartSignals').then(m => ({ default: m.SmartSignals })));
const EmergencyControl = lazy(() => import('../../pages/authority/EmergencyControl').then(m => ({ default: m.EmergencyControl })));
const IncidentManagement = lazy(() => import('../../pages/authority/IncidentManagement').then(m => ({ default: m.IncidentManagement })));
const ExplainableAI = lazy(() => import('../../pages/authority/ExplainableAI').then(m => ({ default: m.ExplainableAI })));
const TrafficSimulator = lazy(() => import('../../pages/authority/TrafficSimulator').then(m => ({ default: m.TrafficSimulator })));
const Analytics = lazy(() => import('../../pages/authority/Analytics').then(m => ({ default: m.Analytics })));
const ImpactAnalysis = lazy(() => import('../../pages/authority/ImpactAnalysis').then(m => ({ default: m.ImpactAnalysis })));
const GovernmentData = lazy(() => import('../../pages/authority/GovernmentData').then(m => ({ default: m.GovernmentData })));
const Reports = lazy(() => import('../../pages/authority/Reports').then(m => ({ default: m.Reports })));
const Settings = lazy(() => import('../../pages/authority/Settings').then(m => ({ default: m.Settings })));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<div style={{ padding: 'var(--space-8)' }}><LoadingSkeleton height="300px" /></div>}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: withSuspense(Home) },
      { path: 'live-traffic', element: withSuspense(LiveTraffic) },
      { path: 'route-planner', element: withSuspense(RoutePlanner) },
      { path: 'report-incident', element: withSuspense(ReportIncident) },
      { path: 'smart-parking', element: withSuspense(SmartParking) },
      { path: 'traffic-assistant', element: withSuspense(TrafficAssistant) },
    ],
  },
  {
    path: '/authority/login',
    element: withSuspense(AuthorityLogin),
  },
  {
    path: '/authority',
    element: (
      <ProtectedRoute roles={['TRAFFIC_AUTHORITY', 'ADMIN']}>
        <AuthorityLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: withSuspense(Dashboard) },
      { path: 'monitoring', element: withSuspense(AIMonitoring) },
      { path: 'predictions', element: withSuspense(AIPredictions) },
      { path: 'signals', element: withSuspense(SmartSignals) },
      { path: 'emergency', element: withSuspense(EmergencyControl) },
      { path: 'incidents', element: withSuspense(IncidentManagement) },
      { path: 'explainable-ai', element: withSuspense(ExplainableAI) },
      { path: 'simulator', element: withSuspense(TrafficSimulator) },
      { path: 'analytics', element: withSuspense(Analytics) },
      { path: 'impact', element: withSuspense(ImpactAnalysis) },
      { path: 'environment', element: withSuspense(ImpactAnalysis) },
      { path: 'government-data', element: withSuspense(GovernmentData) },
      { path: 'reports', element: withSuspense(Reports) },
      { path: 'settings', element: withSuspense(Settings) },
    ],
  },
]);
