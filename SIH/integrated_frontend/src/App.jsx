import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import { fetchDashboardData, fetchSettingsData, updateSettingsData } from "./services/api";

function App() {
  const [dashboard, setDashboard] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDashboardData(), fetchSettingsData()])
      .then(([dashData, settsData]) => {
        setDashboard(dashData);
        setSettings(settsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Initialization error:", err);
        setLoading(false);
      });
  }, []);

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
        <Route path="/dashboard" element={<Dashboard dashboard={dashboard} settings={settings} />} />
        <Route path="/settings" element={<Settings settings={settings} onUpdateSettings={handleUpdateSettings} />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}

export default App;