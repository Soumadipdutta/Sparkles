const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function fetchDashboardData() {
  const response = await fetch(`${API_BASE_URL}/dashboard`);
  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }
  return await response.json();
}

export async function fetchSettingsData() {
  const response = await fetch(`${API_BASE_URL}/settings`);
  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }
  return await response.json();
}

export async function updateSettingsData(payload) {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }
  return await response.json();
}

export async function triggerSystemBackup() {
  const response = await fetch(`${API_BASE_URL}/settings/backup`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }
  return await response.json();
}

export async function fetchReportsSummary() {
  const response = await fetch(`${API_BASE_URL}/reports/summary`);
  if (!response.ok) throw new Error(`API returned ${response.status}`);
  return await response.json();
}

export async function fetchReportsContaminants() {
  const response = await fetch(`${API_BASE_URL}/reports/contaminants`);
  if (!response.ok) throw new Error(`API returned ${response.status}`);
  return await response.json();
}

export async function fetchReportsTrends() {
  const response = await fetch(`${API_BASE_URL}/reports/trends`);
  if (!response.ok) throw new Error(`API returned ${response.status}`);
  return await response.json();
}

export async function fetchReportsHeatmap() {
  const response = await fetch(`${API_BASE_URL}/reports/heatmap`);
  if (!response.ok) throw new Error(`API returned ${response.status}`);
  return await response.json();
}

export async function fetchRecentReports() {
  const response = await fetch(`${API_BASE_URL}/reports/recent`);
  if (!response.ok) throw new Error(`API returned ${response.status}`);
  return await response.json();
}

export async function downloadReportFile(filters = {}) {
  const params = new URLSearchParams({
    report_type: filters?.reportType || "Water Quality Summary",
    time_range: filters?.timeRange || "Last 7 Days",
    start_date: filters?.startDate || "2026-08-24",
    end_date: filters?.endDate || "2026-08-30",
    data_source: filters?.dataSource || "All Sources",
  });

  const response = await fetch(`${API_BASE_URL}/reports/download?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to download report");
  }
  return await response.blob();
}

