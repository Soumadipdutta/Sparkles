import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ToyamDashboard from './toyam-dashboard.jsx'
import ToyamSettings from './toyam-settings.jsx'
import ToyamReports from './toyam-reports.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToyamReports />
  </StrictMode>,
)
