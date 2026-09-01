import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import { fetchDashboardData, fetchSettingsData, updateSettingsData } from "./services/api";

function App() {
  const [dashboard, setDashboard] = useState(null);
  const [settings, setSettings] = useState(null);
  const [lastUpdatedTime, setLastUpdatedTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const handleRefreshAll = async () => {
    try {
      const [dashData, settsData] = await Promise.all([fetchDashboardData(), fetchSettingsData()]);
      setDashboard(dashData);
      setSettings(settsData);
      setLastUpdatedTime(new Date());
      setLoading(false);
    } catch (err) {
      console.error("Refresh error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRefreshAll();
  }, []);

  useEffect(() => {
    const refreshText = String(settings?.display_preferences?.refresh_interval || "1 Minute");
    let intervalMs = 60000;
    if (refreshText.includes("15")) intervalMs = 15 * 60000;
    else if (refreshText.includes("5")) intervalMs = 5 * 60000;
    else intervalMs = 60000;

    const timer = setInterval(() => {
      handleRefreshAll();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [settings?.display_preferences?.refresh_interval]);

  useEffect(() => {
    const themeSetting = settings?.display_preferences?.theme || "Light";
    const isDark = themeSetting === "Dark" || (themeSetting === "System" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.body.style.backgroundColor = isDark ? "#0B0F19" : "#F6F7F9";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }, [settings?.display_preferences?.theme]);

  const handleUpdateSettings = async (fieldGroup, updatedObj) => {
    try {
      const payload = { [fieldGroup]: updatedObj };
      const newSettings = await updateSettingsData(payload);
      setSettings(newSettings);
      return newSettings;
    } catch (err) {
      console.error("Failed to update settings:", err);
      throw err;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              dashboard={dashboard}
              settings={settings}
              lastUpdatedTime={lastUpdatedTime}
              onRefresh={handleRefreshAll}
            />
          }
        />
        <Route
          path="/settings"
          element={
            <Settings
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              lastUpdatedTime={lastUpdatedTime}
              onRefresh={handleRefreshAll}
            />
          }
        />
        <Route
          path="/reports"
          element={
            <Reports
              settings={settings}
              lastUpdatedTime={lastUpdatedTime}
              onRefresh={handleRefreshAll}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;