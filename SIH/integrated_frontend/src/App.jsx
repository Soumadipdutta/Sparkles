import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import StatewideOverview from "./pages/StatewideOverview";
import PlantTelemetry from "./pages/PlantTelemetry";
import ReportsAndAnalytics from "./pages/ReportsAndAnalytics";
import CriticalAlerts from "./pages/CriticalAlerts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/statewide-overview" replace />} />
        
        {/* Core Pages with Self-Explanatory Names */}
        <Route path="/statewide-overview" element={<StatewideOverview />} />
        <Route path="/plant-telemetry" element={<PlantTelemetry />} />
        <Route path="/analytics-and-reports" element={<ReportsAndAnalytics />} />
        <Route path="/critical-alerts" element={<CriticalAlerts />} />

        {/* Legacy Route Aliases */}
        <Route path="/dashboard" element={<Navigate to="/plant-telemetry" replace />} />
        <Route path="/settings" element={<Navigate to="/critical-alerts" replace />} />
        <Route path="/reports" element={<Navigate to="/analytics-and-reports" replace />} />
      </Routes>
    </Router>
  );
}

export default App;