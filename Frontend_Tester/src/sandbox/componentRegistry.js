import StatewideOverviewPreview from '../test_components/StatewideOverviewPreview';
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
    id: 'statewide-overview-preview',
    title: 'Statewide Overview Preview',
    category: 'Dashboards',
    version: 'v1.0',
    description: 'Self-contained preview build of the Statewide Overview dashboard.',
    component: StatewideOverviewPreview,
    badge: 'New Candidate'
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

