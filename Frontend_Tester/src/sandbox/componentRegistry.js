import PlantTelemetryCandidate from '../test_components/PlantTelemetryCandidate';
import ToyamAlertsUpdated from '../test_components/ToyamAlertsUpdated';
import ToyamAnalyticsCandidate from '../test_components/ToyamAnalyticsCandidate';
import AnalyticsReports from '../test_components/toyam_analytics_and_reports_updated';
import StatewideOverviewPreview from '../test_components/StatewideOverviewPreview';
import PlantTelemetryPreview from '../test_components/PlantTelemetryPreview';
import CriticalAlertsPreview from '../test_components/CriticalAlertsPreview';
import ToyamDashboard from '../test_components/toyam-dashboard';
import ToyamReports from '../test_components/toyam-reports';
import ToyamSettings from '../test_components/toyam-settings';

/**
 * Component Registry for the Frontend Sandbox & Workbench
 * 
 * TO ADD A NEW .JSX FRONTEND CANDIDATE TO TEST:
 * 1. Place your .jsx file inside `src/test_components/`
 * 2. Import it above
 * 3. Add an entry object to the array below!
 */
export const registeredComponents = [
  {
    id: 'plant-telemetry-candidate',
    title: 'Plant Telemetry (plant-telemetry.jsx)',
    category: 'Telemetry & Operational',
    version: 'v3.0 Updated',
    description: 'Updated standalone plant telemetry page with real-time SCADA telemetry, water safety metrics & charts.',
    component: PlantTelemetryCandidate,
    badge: 'NEW Candidate'
  },
  {
    id: 'toyam-alerts-updated-candidate',
    title: 'Critical Alerts (toyam_alerts_updated.jsx)',
    category: 'Alerts & Incident Response',
    version: 'v3.0 Updated',
    description: 'Updated Critical Alerts & Incident Response dashboard with active alert dispatch, dispatch status & logistics.',
    component: ToyamAlertsUpdated,
    badge: 'NEW Candidate'
  },
  {
    id: 'plant-telemetry-preview',
    title: 'Plant Telemetry (Integrated SIH)',
    category: 'Telemetry & Operational',
    version: 'v2.0',
    description: 'Live plant water safety score, contaminant monitoring, purification pipeline telemetry & alerts.',
    component: PlantTelemetryPreview,
    badge: 'Live Integrated'
  },
  {
    id: 'critical-alerts-preview',
    title: 'Critical Alerts & Settings (Integrated SIH)',
    category: 'Alerts & Administration',
    version: 'v2.0',
    description: 'System threshold configuration, critical alert toggles, user profile, and system backup management.',
    component: CriticalAlertsPreview,
    badge: 'Live Integrated'
  },
  {
    id: 'statewide-overview-preview',
    title: 'Statewide Overview Preview',
    category: 'Dashboards',
    version: 'v1.0',
    description: 'Self-contained preview build of the Statewide Overview dashboard.',
    component: StatewideOverviewPreview,
    badge: 'Candidate'
  },
  {
    id: 'toyam-analytics-candidate-v2',
    title: 'Toyam Analytics & Quality Logs (V2)',
    category: 'Analytics & Reports',
    version: 'v2.0',
    description: 'Compliance analytics, CSV/XLSX/JSON/PDF exports, audit certificate generator & live charts.',
    component: ToyamAnalyticsCandidate,
    badge: 'Latest Candidate'
  },
  {
    id: 'analytics-reports-v1',
    title: 'Analytics & Reports (Updated)',
    category: 'Dashboards',
    version: 'v1.0',
    description: 'Analytics, report logs, export options, and historical water metrics chart.',
    component: AnalyticsReports,
    badge: 'Candidate'
  },
  {
    id: 'toyam-dashboard-v1',
    title: 'Toyam Dashboard Candidate',
    category: 'Dashboards',
    version: 'v1.2',
    description: 'Full-featured dashboard prototype with metrics, water quality cards, and alerts.',
    component: ToyamDashboard,
    badge: 'Candidate'
  },
  {
    id: 'toyam-reports-v1',
    title: 'Toyam Reports Candidate',
    category: 'Reports & Analytics',
    version: 'v1.0',
    description: 'Analytics, report logs, export options, and historical water metrics.',
    component: ToyamReports,
    badge: 'Candidate'
  },
  {
    id: 'toyam-settings-v1',
    title: 'Toyam Settings Candidate',
    category: 'Settings & Admin',
    version: 'v1.1',
    description: 'Settings & configuration panel prototype with preference toggles.',
    component: ToyamSettings,
    badge: 'Candidate'
  }
];
