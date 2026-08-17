# Smart Traffic Management System - Frontend

A state-of-the-art, real-time AI-powered urban traffic monitoring and signal optimization command center dashboard built with React 19, TypeScript, Vite, and CSS Modules.

---

## 🚀 Architecture & 30-Phase Implementation Summary

The frontend application is structured across 30 implementation phases:

### **Phases 1 - 5: Base Engine & Design System Core**
- Vite + React + TypeScript setup with Oxlint configuration.
- Global design system design tokens (`tokens.css`, `reset.css`, `global.css`).
- Custom CSS design system with HSL color palettes, dark glassmorphism, and responsive typography scale.

### **Phases 6 - 10: Routing & Public / Authority Interfaces**
- React Router v7 layout routing with public navigation (`PublicLayout`) and protected authority layout (`AuthorityLayout`).
- Public Portal pages (`Home`, `LiveTraffic`, `RoutePlanner`, `ReportIncident`, `SmartParking`, `TrafficAssistant`).
- Authority Command Center pages (`Dashboard`, `AIMonitoring`, `AIPredictions`, `SmartSignals`, `EmergencyControl`, `IncidentManagement`, `ExplainableAI`, `TrafficSimulator`, `Analytics`, `ImpactAnalysis`, `GovernmentData`, `Reports`, `Settings`).
- Core UI component suite (`Button`, `Input`, `Dialog`, `Drawer`, `KPICard`, `TrafficStatusBadge`, `MapContainer`, `PredictionChart`).

### **Phases 11 - 15: Advanced UI & Testing Infrastructure**
- Reusable `DataTable` with multi-column sorting and filtering.
- Header `NotificationCenter` with real-time alert badges.
- Vitest unit testing framework with JSDOM environment.
- Role-based Access Control (`ProtectedRoute` and `AuthContext`).

### **Phases 16 - 20: Complete CSS Module Systems & API Layer**
- Individual CSS Modules for all Authority pages (`Dashboard.module.css`, `AIMonitoring.module.css`, `AIPredictions.module.css`, `SmartSignals.module.css`, etc.).
- Complete REST API integration services (`auth.ts`, `dashboard.ts`, `monitoring.ts`, `predictions.ts`, `signals.ts`, `incidents.ts`, `emergency.ts`, `routes.ts`, `traffic.ts`, `assistant.ts`).

### **Phases 21 - 25: Authority Control Systems & Reporting**
- **Phase 21**: Emergency Control green wave corridor overrides (`EmergencyControl.module.css` & `EmergencyControl.tsx`).
- **Phase 22**: Incident Response & Officer Dispatch System (`IncidentManagement.module.css` & `IncidentManagement.tsx`).
- **Phase 23**: Explainable AI evidence audit & Digital Twin Traffic Simulator (`ExplainableAI.module.css`, `TrafficSimulator.module.css`).
- **Phase 24**: Analytics Suite, Civic Impact Scorecard, Government Data Integrations, and Executive Report Generator.
- **Phase 25**: Command Center System Settings (`Settings.module.css`, `Settings.tsx`) with Radix UI tabs.

### **Phases 26 - 30: Real-time Telemetry, Optimization & Production Readiness**
- **Phase 26**: Vitest unit & integration test suite (`emergency.spec.tsx`, `incidents.spec.tsx`, `signals.spec.ts`).
- **Phase 27**: Real-time WebSocket connection integration (`socketManager.ts`) for live signal updates and alerts.
- **Phase 28**: React `ErrorBoundary` fallback UI and accessibility (a11y) polish.
- **Phase 29**: Vite production bundle manual chunking (`manualChunks` for React, Recharts, Leaflet, Radix UI, Lucide icons).
- **Phase 30**: End-to-end smoke test suite (`smokeTest.spec.ts`), complete production build verification (`npm run build`), and deployment readiness.

---

## 🛠️ Getting Started & Available Commands

### Development Server
```bash
npm run dev
```

### Typecheck & Compile
```bash
npx tsc -b
```

### Unit Tests
```bash
npx vitest run
```

### Production Build
```bash
npm run build
```

---

## 📁 Directory Structure

```
frontend/
├── src/
│   ├── app/router/         # Router definitions & Lazy loading
│   ├── assets/             # Images & static SVG assets
│   ├── components/
│   │   ├── charts/         # Recharts prediction charts
│   │   ├── layout/         # PublicHeader, AuthoritySidebar, TopBar, Footer
│   │   ├── maps/           # Leaflet interactive map containers
│   │   └── ui/             # Button, Input, Dialog, Drawer, KPICard, DataTable, ErrorBoundary
│   ├── config/             # Environment parameters & API URLs
│   ├── features/auth/      # AuthContext & ProtectedRoute
│   ├── pages/
│   │   ├── authority/      # 12 Authority Command Center views
│   │   └── public/         # 6 Public Commuter Portal views
│   ├── services/
│   │   ├── api/            # REST API client & service modules
│   │   └── websocket/      # Socket.io gateway manager
│   ├── styles/             # Global tokens, reset, typography
│   ├── test/               # Vitest test suites & E2E smoke tests
│   └── types/              # TypeScript models & interfaces
├── package.json
└── vite.config.ts
```
