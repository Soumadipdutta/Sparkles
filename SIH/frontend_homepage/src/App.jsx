import { useEffect, useState } from "react";
import ToyamDashboard from "../toyam-dashboard.jsx";

function App() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/dashboard")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        console.log("Dashboard API data:", data);
        setDashboard(data);
      })
      .catch((error) => {
        console.error("Dashboard API error:", error);
        setError(error.message);
      });
  }, []);

  if (error) {
    return <div>API Error: {error}</div>;
  }

  if (!dashboard) {
    return <div>Loading dashboard data...</div>;
  }

  return <ToyamDashboard dashboard={dashboard} />;
}

export default App;