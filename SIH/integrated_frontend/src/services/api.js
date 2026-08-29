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
