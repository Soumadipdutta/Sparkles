import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStatewideOverviewData, downloadReportFile } from "../services/api";

const c = {
  bg: "#0a0e14",
  panel: "#0f1520",
  panel2: "#0c111a",
  border: "#1c2634",
  borderRed: "#5a1f28",
  text: "#e8edf4",
  sub: "#7d8ba0",
  mint: "#4de8c4",
  cyan: "#3fd0e8",
  blue: "#4fa8e0",
  amber: "#f0b45a",
  red: "#ff6b5e",
  redBg: "#3a1218",
  redBg2: "#2a1015",
};

const DEFAULT_DISTRICT_LABELS = [
  { label: "PALAMU BELT", x: 22, y: 42 },
  { label: "BOKARO BASIN", x: 44, y: 36 },
  { label: "RANCHI VALLEY", x: 35, y: 64 },
  { label: "DHANBAD COAL BELT", x: 64, y: 52 },
  { label: "E. SINGHBHUM", x: 72, y: 78 },
];

function TopBar({ activeTab = "Statewide Overview" }) {
  const navigate = useNavigate();
  const tabs = [
    { label: "Statewide Overview", path: "/statewide-overview" },
    { label: "Plant Telemetry", path: "/plant-telemetry" },
    { label: "Analytics & Reports", path: "/analytics-and-reports" },
    { label: "Critical Alerts & Incident Response", path: "/critical-alerts" },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 24px",
        borderBottom: `1px solid ${c.border}`,
        flexWrap: "wrap",
        gap: 12,
        background: c.panel,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: "linear-gradient(135deg,#1a2c3a,#0d1620)",
            border: `1px solid ${c.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: c.cyan,
            fontSize: 16,
            cursor: "pointer",
          }}
          onClick={() => navigate("/statewide-overview")}
        >
          ◆
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: 19,
                letterSpacing: 1,
                color: c.text,
                cursor: "pointer",
              }}
              onClick={() => navigate("/statewide-overview")}
            >
              TOYAM
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                background: "#122028",
                color: c.cyan,
                border: `1px solid #1e3a45`,
                borderRadius: 4,
                padding: "2px 6px",
              }}
            >
              JH-DW&SD
            </span>
          </div>
          <div style={{ fontSize: 11.5, color: c.sub, marginTop: 2 }}>
            Statewide Water Quality & Purification Command Portal — Govt of Jharkhand
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <StatusPill dot={c.mint} text="42/45 PLANTS ONLINE" />
        <StatusPill dot={c.cyan} text="LIVE TELEMETRY ACTIVE" />
      </div>

      <nav style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button
            key={t.label}
            onClick={() => navigate(t.path)}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11.5,
              padding: "10px 14px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              background: activeTab === t.label ? c.cyan : "transparent",
              color: activeTab === t.label ? "#04222a" : c.sub,
              fontWeight: activeTab === t.label ? 700 : 500,
              lineHeight: 1.3,
              maxWidth: 120,
              textAlign: "left",
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function StatusPill({ dot, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10.5,
        color: c.sub,
        background: c.panel2,
        border: `1px solid ${c.border}`,
        borderRadius: 5,
        padding: "5px 9px",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: dot,
          boxShadow: `0 0 6px ${dot}`,
        }}
      />
      {text}
    </div>
  );
}

function Badge({ children, tone = "mint" }) {
  const map = {
    mint: { bg: "#0e2620", fg: c.mint, bd: "#1c3d34" },
    cyan: { bg: "#0c2530", fg: c.cyan, bd: "#1a3a45" },
    amber: { bg: "#2c220f", fg: c.amber, bd: "#4a3a1a" },
    red: { bg: c.redBg, fg: c.red, bd: c.borderRed },
  };
  const s = map[tone] || map.mint;
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10.5,
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: 4,
        background: s.bg,
        color: s.fg,
        border: `1px solid ${s.bd}`,
        letterSpacing: 0.4,
      }}
    >
      {children}
    </span>
  );
}

function KpiCard({ title, val, unit, sub, tone = "cyan", badgeText }) {
  return (
    <div style={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 8, padding: 16, flex: 1, minWidth: 180 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 10.5, color: c.sub, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.4 }}>{title}</span>
        {badgeText && <Badge tone={tone}>{badgeText}</Badge>}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: c.text, fontFamily: "'JetBrains Mono', monospace" }}>{val}</span>
        {unit && <span style={{ fontSize: 12, color: c.sub, fontFamily: "'JetBrains Mono', monospace" }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 11, color: c.sub, marginTop: 6, fontFamily: "'JetBrains Mono', monospace" }}>{sub}</div>}
    </div>
  );
}

function RichContaminantCard({ name, ceiling, val, unit, axisMax, note, icon, tone, active, onClick }) {
  const pct = Math.min(100, (val / axisMax) * 100);
  const ceilingPct = Math.min(95, (ceiling / axisMax) * 100);

  const toneColor = tone === "red" ? c.red : tone === "amber" ? c.amber : tone === "cyan" ? c.cyan : c.mint;
  const iconSymbol = icon === "warning" ? "⚠️" : icon === "wrench" ? "🔧" : icon === "info" ? "ⓘ" : "✓";

  return (
    <div
      onClick={onClick}
      style={{
        background: active ? "#0c2530" : c.panel,
        border: `1px solid ${active ? c.cyan : c.border}`,
        borderRadius: 8,
        padding: 16,
        flex: "1 1 200px",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: c.text, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.5 }}>
        {name}
      </div>
      <div style={{ fontSize: 10.5, color: c.sub, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
        Ceiling: {ceiling.toFixed(3)} {unit}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "10px 0 6px" }}>
        <span style={{ fontSize: 24, fontWeight: 700, color: toneColor, fontFamily: "'JetBrains Mono', monospace" }}>
          {val.toFixed(3)}
        </span>
        <span style={{ fontSize: 12, color: c.sub, fontFamily: "'JetBrains Mono', monospace" }}>{unit}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: toneColor, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
        <span>{iconSymbol}</span>
        <span>{note}</span>
      </div>

      {/* Visual Meter Bar with Permissible Ceiling Marker Tick */}
      <div style={{ position: "relative", height: 8, background: c.panel2, borderRadius: 4, border: `1px solid ${c.border}`, overflow: "hidden", marginBottom: 6 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: toneColor, borderRadius: 4 }} />
        <div style={{ position: "absolute", left: `${ceilingPct}%`, top: 0, bottom: 0, width: 2, background: "#ffdad6", boxShadow: "0 0 4px #ffdad6" }} />
      </div>

      {/* Axis Scale Labels */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: c.sub, fontFamily: "'JetBrains Mono', monospace" }}>
        <span>0.000</span>
        <span style={{ color: "#ffdad6", fontWeight: 600 }}>Max Safe: {ceiling.toFixed(3)}</span>
        <span>{axisMax.toFixed(3)}</span>
      </div>
    </div>
  );
}

export default function StatewideOverview() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [standard, setStandard] = useState("BIS"); // "BIS" or "WHO"
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedMetalFilter, setSelectedMetalFilter] = useState("all"); // "all", "pb", "as", "fe", "cr", "f"
  const [priorityOnly, setPriorityOnly] = useState(false);
  const [sortBy, setSortBy] = useState("severity"); // "severity", "id", "name", "district", "score"
  const [search, setSearch] = useState("");
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchStatewideOverviewData()
      .then((res) => {
        setData(res);
        if (res?.plants && res.plants.length > 0) {
          setSelectedPlant(res.plants[0]);
        }
      })
      .catch((err) => console.error("Error loading statewide data:", err));
  }, []);

  const kpis = useMemo(() => {
    const rawKpis = data?.kpis || [];
    const complianceVal = rawKpis.find((k) => k.key === "compliance" || k.label?.includes("Compliance"))?.value || "94.2";
    const waterVal = rawKpis.find((k) => k.key === "water" || k.label?.includes("Water"))?.value || "1,482,900";
    const unitsVal = rawKpis.find((k) => k.key === "units" || k.label?.includes("Units"))?.value || "42/45";
    const popVal = rawKpis.find((k) => k.key === "population" || k.label?.includes("Population"))?.value || "384,200";
    const incVal = rawKpis.find((k) => k.key === "incursions" || k.label?.includes("Incursions"))?.value || "18";

    return [
      { title: "CLEAN WATER DISPENSED", val: waterVal, unit: "L", sub: "+8.4% vs 30d baseline", tone: "mint", badge: "DAILY TOTAL" },
      { title: "PURIFICATION UNITS", val: unitsVal, unit: "ONLINE", sub: "3 Units in Scheduled Maintenance", tone: "cyan", badge: "FLEET STATUS" },
      { title: "POPULATION PROTECTED", val: popVal, unit: "SOULS", sub: "14 Mining & Rural Districts", tone: "mint", badge: "BENEFICIARIES" },
      { title: "OVERALL COMPLIANCE", val: `${complianceVal}%`, unit: standard === "WHO" ? "WHO INDEX" : "BIS INDEX", sub: standard === "WHO" ? "WHO International Compliant" : "BIS IS 10500 Compliant (>95% Threshold)", tone: "cyan", badge: standard === "WHO" ? "WHO STANDARD" : "BIS 10500" },
      { title: "INCURSIONS BLOCKED", val: incVal, unit: "EVENTS", sub: "Pneumatic Auto-Cutoff Solenoids Engaged", tone: "red", badge: "SAFETY ENGAGED" },
    ];
  }, [data, standard]);

  const statusCounts = useMemo(() => {
    return data?.status_counts || { all: 45, normal: 40, alert: 2, cutoff: 3 };
  }, [data]);

  const plantsList = useMemo(() => {
    if (data?.plants && data.plants.length > 0) return data.plants;
    const districts = ["Dhanbad", "Bokaro", "Ramgarh", "East Singhbhum", "West Singhbhum", "Ranchi", "Palamu", "Hazaribagh", "Giridih", "Deoghar", "Dumka", "Koderma", "Chatra", "Latehar"];
    return Array.from({ length: 45 }, (_, i) => ({
      id: `JH-${["DHN","ESB","BOK","RMG","HZB","PAL","RNC","WSB","GRD","DGH","DMK","KDR","CTR","LTH"][i % 14]}-${String(i + 1).padStart(2, "0")}`,
      name: `Purification Unit #${i + 1}`,
      district: `${districts[i % 14]} District`,
      status: i === 0 || i === 5 ? "cutoff" : i === 1 || i === 6 ? "alert" : "normal",
      statusLabel: i === 0 || i === 5 ? "CRITICAL CUTOFF" : i === 1 || i === 6 ? "WARNING ALERT" : "OPERATIONAL ONLINE",
      metalMonitored: i % 5 === 0 ? "pb" : i % 5 === 1 ? "as" : i % 5 === 2 ? "fe" : i % 5 === 3 ? "cr" : "f",
      pos: { x: 12 + (i % 9) * 9.5, y: 18 + Math.floor(i / 9) * 16 },
      spotlight: { pb: i === 0 ? "0.042 ppm" : "<0.001 ppm", ph: i === 0 ? "5.8 pH" : "7.2 pH", tds: i === 0 ? "680 ppm" : "220 ppm", solenoid_shutoff_active: i === 0 }
    }));
  }, [data]);

  const priorityCount = useMemo(() => {
    return plantsList.filter((p) => p.status === "cutoff" || p.status === "alert" || p.isPriority).length;
  }, [plantsList]);

  const spotlightMetalInfo = useMemo(() => {
    if (!selectedPlant) return { label: "LEAD (PB)", val: "<0.001 ppm", isElevated: false };

    const plantSpot = selectedPlant.spotlight || {};

    if (selectedMetalFilter === "f") {
      const val = plantSpot.f || (selectedPlant.district?.includes("Palamu") || selectedPlant.metalMonitored === "f" ? "1.120 ppm" : "0.820 ppm");
      return { label: "FLUORIDE (F-)", val, isElevated: val.includes("1.120") || parseFloat(val) > 1.0 };
    }
    if (selectedMetalFilter === "as") {
      const val = plantSpot.as || (selectedPlant.status === "cutoff" ? "0.018 ppm" : "0.004 ppm");
      return { label: "ARSENIC (AS)", val, isElevated: parseFloat(val) > 0.010 };
    }
    if (selectedMetalFilter === "cr") {
      const val = plantSpot.cr || (selectedPlant.district?.includes("Bokaro") ? "0.065 ppm" : "0.012 ppm");
      return { label: "CHROMIUM (CR+6)", val, isElevated: parseFloat(val) > 0.050 };
    }
    if (selectedMetalFilter === "fe") {
      const val = plantSpot.fe || (selectedPlant.status === "alert" ? "0.480 ppm" : "0.340 ppm");
      return { label: "IRON (FE)", val, isElevated: parseFloat(val) > 0.300 };
    }

    // Default case ("all" or "pb"):
    const val = plantSpot.pb || (selectedPlant.status === "cutoff" ? "0.042 ppm" : "<0.001 ppm");
    return { label: "LEAD (PB)", val, isElevated: selectedPlant.status === "cutoff" || (val !== "<0.001 ppm" && parseFloat(val) > 0.010) };
  }, [selectedPlant, selectedMetalFilter]);

  // Filtering & Sorting Pipeline
  const filteredPlants = useMemo(() => {
    let list = plantsList.filter((p) => {
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchDistrict = selectedDistrict === "All" || (p.district || "").toLowerCase().includes(selectedDistrict.toLowerCase());
      const matchSearch = !search.trim() || (p.name || "").toLowerCase().includes(search.toLowerCase()) || (p.id || "").toLowerCase().includes(search.toLowerCase()) || (p.district || "").toLowerCase().includes(search.toLowerCase());
      
      let matchPriority = true;
      if (priorityOnly) {
        matchPriority = p.status === "cutoff" || p.status === "alert" || p.isPriority || p.spotlight?.solenoid_shutoff_active;
      }

      let matchMetal = true;
      if (selectedMetalFilter !== "all") {
        if (selectedMetalFilter === "pb") matchMetal = p.status === "cutoff" || p.metalMonitored === "pb" || (p.spotlight?.pb && p.spotlight.pb !== "<0.001 ppm");
        else if (selectedMetalFilter === "as") matchMetal = p.metalMonitored === "as" || p.district?.includes("Palamu") || p.district?.includes("Garhwa");
        else if (selectedMetalFilter === "fe") matchMetal = p.metalMonitored === "fe" || p.district?.includes("Singhbhum") || p.status === "alert";
        else if (selectedMetalFilter === "cr") matchMetal = p.metalMonitored === "cr" || p.district?.includes("Bokaro");
        else if (selectedMetalFilter === "f") matchMetal = p.metalMonitored === "f" || p.district?.includes("Palamu");
      }

      return matchStatus && matchDistrict && matchSearch && matchMetal && matchPriority;
    });

    return list.sort((a, b) => {
      if (sortBy === "severity") {
        const weight = { cutoff: 3, alert: 2, normal: 1 };
        return (weight[b.status] || 0) - (weight[a.status] || 0);
      }
      if (sortBy === "id") return (a.id || "").localeCompare(b.id || "");
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "district") return (a.district || "").localeCompare(b.district || "");
      if (sortBy === "score") {
        const scoreA = a.status === "cutoff" ? 60 : a.status === "alert" ? 82 : 94.2;
        const scoreB = b.status === "cutoff" ? 60 : b.status === "alert" ? 82 : 94.2;
        return scoreB - scoreA;
      }
      return 0;
    });
  }, [plantsList, statusFilter, selectedDistrict, selectedMetalFilter, priorityOnly, search, sortBy]);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const blob = await downloadReportFile({ reportType: "Statewide Water Quality Summary" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Statewide_Overview_Report_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("PDF Download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  const contaminantsData = [
    { key: "as", name: "ARSENIC (AS)", ceiling: 0.010, val: 0.004, unit: "ppm", axisMax: 0.015, note: "Safe parameters", icon: "check", tone: "mint" },
    { key: "cr", name: "CHROMIUM (CR+6)", ceiling: 0.050, val: 0.012, unit: "ppm", axisMax: 0.070, note: "Trace levels only", icon: "check", tone: "mint" },
    { key: "f", name: "FLUORIDE (F-)", ceiling: 1.000, val: 0.820, unit: "ppm", axisMax: 1.250, note: "Elevated in Palamu belt", icon: "info", tone: "cyan" },
    { key: "fe", name: "IRON (FE)", ceiling: 0.300, val: 0.340, unit: "ppm", axisMax: 0.500, note: "Filtration backwash req.", icon: "wrench", tone: "amber" },
    { key: "pb", name: "LEAD (PB)", ceiling: 0.010, val: 0.018, unit: "ppm", axisMax: 0.025, note: "+80% above safe limit", icon: "warning", tone: "red" },
  ];

  return (
    <div style={{ background: c.bg, minHeight: "100vh", color: c.text, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
      />
      <TopBar activeTab="Statewide Overview" />

      {/* Header Panel */}
      <div style={{ padding: "20px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
              <Badge tone="cyan">STATEWIDE SCADA NETWORK</Badge>
              <Badge tone="mint">45 TELEMETRY NODES ACTIVE</Badge>
              <span style={{ fontSize: 11, color: c.sub, fontFamily: "'JetBrains Mono', monospace" }}>Sync Interval: 1 Min</span>
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, margin: "0 0 6px", color: c.text }}>
              Statewide Water Quality & Purification Command Portal
            </h1>
            <div style={{ color: c.sub, fontSize: 13 }}>
              Government of Jharkhand • Drinking Water & Sanitation Department • Central SCADA Matrix
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", background: c.panel2, border: `1px solid ${c.border}`, borderRadius: 6, padding: 3 }}>
              <button
                onClick={() => setStandard("BIS")}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "6px 12px",
                  borderRadius: 4,
                  border: "none",
                  cursor: "pointer",
                  background: standard === "BIS" ? c.cyan : "transparent",
                  color: standard === "BIS" ? "#04222a" : c.sub,
                }}
              >
                BIS IS 10500:2012
              </button>
              <button
                onClick={() => setStandard("WHO")}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "6px 12px",
                  borderRadius: 4,
                  border: "none",
                  cursor: "pointer",
                  background: standard === "WHO" ? c.cyan : "transparent",
                  color: standard === "WHO" ? "#04222a" : c.sub,
                }}
              >
                WHO STANDARD
              </button>
            </div>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11.5,
                fontWeight: 700,
                padding: "8px 16px",
                borderRadius: 6,
                background: c.panel,
                color: c.text,
                border: `1px solid ${c.border}`,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>⬇</span>
              <span>{downloading ? "GENERATING PDF..." : "DOWNLOAD EXECUTIVE REPORT (PDF)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ padding: "20px 24px 0" }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {kpis.map((k) => (
            <KpiCard key={k.title} title={k.title} val={k.val} unit={k.unit} sub={k.sub} tone={k.tone} badgeText={k.badge} />
          ))}
        </div>
      </div>

      {/* Rich Heavy Metal & Critical Contaminant Concentrations Section */}
      <div style={{ padding: "20px 24px 0" }}>
        <div style={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 8, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16, color: c.cyan }}>📊</span>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: c.text, margin: 0 }}>
                  Heavy Metal & Critical Contaminant Concentrations vs BIS IS 10500
                </h3>
              </div>
              <div style={{ fontSize: 11.5, color: c.sub, marginTop: 3 }}>
                Average district-level spectral absorption analysis across active sampling probes
              </div>
            </div>

            <div style={{ display: "flex", gap: 16, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: c.cyan }}>
                <span style={{ width: 12, height: 4, borderRadius: 2, background: c.cyan }} /> Recorded Average
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#ffdad6" }}>
                <span style={{ width: 12, height: 4, borderRadius: 2, background: "#ffdad6" }} /> Permissible Ceiling
              </span>
              {selectedMetalFilter !== "all" && (
                <button
                  onClick={() => setSelectedMetalFilter("all")}
                  style={{
                    background: "transparent",
                    border: `1px solid ${c.cyan}`,
                    color: c.cyan,
                    borderRadius: 4,
                    padding: "3px 8px",
                    fontSize: 10.5,
                    cursor: "pointer",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  RESET PROBES FILTER
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {contaminantsData.map((item) => (
              <RichContaminantCard
                key={item.key}
                name={item.name}
                ceiling={item.ceiling}
                val={item.val}
                unit={item.unit}
                axisMax={item.axisMax}
                note={item.note}
                icon={item.icon}
                tone={item.tone}
                active={selectedMetalFilter === item.key}
                onClick={() => setSelectedMetalFilter(selectedMetalFilter === item.key ? "all" : item.key)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Filter Control Bar */}
      <div style={{ padding: "20px 24px 0" }}>
        <div style={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 8, padding: 14, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            {/* District Filter Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10.5, color: c.sub, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>DISTRICT:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                style={{
                  background: c.panel2,
                  color: c.text,
                  border: `1px solid ${c.border}`,
                  borderRadius: 6,
                  padding: "5px 10px",
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  outline: "none",
                }}
              >
                <option value="All">All 14 Districts ({statusCounts.all})</option>
                <option value="Dhanbad">Dhanbad Mining Belt</option>
                <option value="Bokaro">Bokaro Industrial Zone</option>
                <option value="Ramgarh">Ramgarh Sector</option>
                <option value="Singhbhum">East & West Singhbhum</option>
                <option value="Ranchi">Ranchi Valley</option>
                <option value="Palamu">Palamu Basin</option>
              </select>
            </div>

            {/* Priority Probes Toggle Button */}
            <button
              onClick={() => setPriorityOnly(!priorityOnly)}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                padding: "6px 12px",
                borderRadius: 6,
                border: `1px solid ${priorityOnly ? c.amber : c.border}`,
                cursor: "pointer",
                background: priorityOnly ? "#2c220f" : c.panel2,
                color: priorityOnly ? c.amber : c.sub,
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease",
              }}
            >
              <span>⚡ PRIORITY PROBES ONLY</span>
              <span
                style={{
                  fontSize: 10,
                  background: priorityOnly ? "rgba(240, 180, 90, 0.2)" : "#1c2634",
                  padding: "1px 6px",
                  borderRadius: 4,
                  color: priorityOnly ? c.amber : c.sub,
                }}
              >
                {priorityCount}
              </span>
            </button>

            {/* Status Filter Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10.5, color: c.sub, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>STATUS:</span>
              <div style={{ display: "flex", background: c.panel2, border: `1px solid ${c.border}`, borderRadius: 6, padding: 2 }}>
                {[
                  { key: "all", label: "ALL", count: statusCounts.all },
                  { key: "normal", label: "SAFE", count: statusCounts.normal },
                  { key: "alert", label: "WARNING", count: statusCounts.alert },
                  { key: "cutoff", label: "CRITICAL", count: statusCounts.cutoff },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setStatusFilter(t.key)}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 9px",
                      borderRadius: 4,
                      border: "none",
                      cursor: "pointer",
                      background: statusFilter === t.key ? c.cyan : "transparent",
                      color: statusFilter === t.key ? "#04222a" : c.sub,
                    }}
                  >
                    {t.label} ({t.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Canvas Section */}
      <div style={{ padding: "20px 24px 0" }}>
        <div style={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 8, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk', sans-serif" }}>JHARKHAND TELEMETRY MATRIX — GEOGRAPHIC IOT CANVAS</div>
              <div style={{ fontSize: 11.5, color: c.sub, marginTop: 2 }}>
                Showing {filteredPlants.length} active SCADA probe nodes {selectedMetalFilter !== "all" ? `(Filtered by ${selectedMetalFilter.toUpperCase()} Probe Surveillance)` : ""}
              </div>
            </div>
            <Badge tone="mint">{filteredPlants.length} / 45 PROBES VISIBLE</Badge>
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              height: 480,
              background: "#060d17",
              borderRadius: 8,
              border: `1px solid ${c.border}`,
              overflow: "hidden",
            }}
          >
            {/* Prominent & Classy Background Watermark Text */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 32,
                fontWeight: 700,
                color: "rgba(63, 208, 232, 0.14)",
                textShadow: "0 0 14px rgba(63, 208, 232, 0.1)",
                letterSpacing: 6,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              JHARKHAND TELEMETRY MATRIX
            </div>

            {/* SVG State Boundary Outline */}
            <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              <path d="M 40,60 Q 250,30 480,80 T 920,60 L 960,400 Q 600,450 250,420 Z" fill="rgba(12,37,48,0.15)" stroke="rgba(63,208,232,0.14)" strokeWidth="1.5" />
            </svg>

            {/* District Labels */}
            {DEFAULT_DISTRICT_LABELS.map((d) => (
              <div
                key={d.label}
                style={{
                  position: "absolute",
                  left: `${d.x}%`,
                  top: `${d.y}%`,
                  transform: "translate(-50%, -50%)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "rgba(125,139,160,0.55)",
                  letterSpacing: 1.5,
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {d.label}
              </div>
            ))}

            {/* Render Actual Functional Plant Probe Nodes */}
            {filteredPlants.map((p, idx) => {
              const xPos = p.pos?.x ?? (10 + (idx % 9) * 9.5);
              const yPos = p.pos?.y ?? (18 + Math.floor(idx / 9) * 16);
              const isSelected = selectedPlant?.id === p.id;
              const isCutoff = p.status === "cutoff";
              const isAlert = p.status === "alert";

              const dotColor = isCutoff ? c.red : isAlert ? c.amber : c.mint;

              return (
                <div
                  key={p.id || idx}
                  onClick={() => setSelectedPlant(p)}
                  style={{
                    position: "absolute",
                    left: `${xPos}%`,
                    top: `${yPos}%`,
                    transform: "translate(-50%, -50%)",
                    cursor: "pointer",
                    zIndex: isSelected ? 20 : 5,
                  }}
                >
                  <div
                    style={{
                      width: isSelected ? 16 : 10,
                      height: isSelected ? 16 : 10,
                      borderRadius: "50%",
                      background: dotColor,
                      boxShadow: `0 0 ${isSelected ? 14 : 8}px ${dotColor}`,
                      border: "2px solid #0a0e14",
                      transition: "transform 0.15s ease",
                    }}
                  />
                  <div
                    style={{
                      fontSize: 9,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      color: isSelected ? c.cyan : c.sub,
                      marginTop: 2,
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    }}
                  >
                    {p.id}
                  </div>
                </div>
              );
            })}

            {/* Node Classification Box (Top Right Legend) */}
            <div
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                background: "rgba(12,17,26,0.92)",
                border: `1px solid ${c.border}`,
                borderRadius: 6,
                padding: "10px 14px",
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                zIndex: 10,
              }}
            >
              <div style={{ color: c.sub, fontWeight: 700, fontSize: 10, marginBottom: 8, letterSpacing: 0.5 }}>NODE CLASSIFICATION</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: c.mint, marginBottom: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.mint, boxShadow: `0 0 6px ${c.mint}` }} />
                Safe Potability ({statusCounts.normal || 40})
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: c.amber, marginBottom: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.amber, boxShadow: `0 0 6px ${c.amber}` }} />
                Warning / Heavy TDS ({statusCounts.alert || 2})
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: c.red }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.red, boxShadow: `0 0 6px ${c.red}` }} />
                Critical Contamination ({statusCounts.cutoff || 3})
              </div>
            </div>

            {/* Telemetry Probe Spotlight Card (Bottom Left Card) */}
            {selectedPlant && (
              <div
                style={{
                  position: "absolute",
                  bottom: 14,
                  left: 14,
                  background: "rgba(15,21,32,0.95)",
                  border: `1px solid ${c.border}`,
                  borderRadius: 8,
                  padding: 14,
                  minWidth: 280,
                  zIndex: 10,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 9.5, color: c.sub, fontFamily: "'JetBrains Mono', monospace" }}>TELEMETRY PROBE SPOTLIGHT</span>
                  <Badge tone={selectedPlant.status === "cutoff" ? "red" : "mint"}>
                    {selectedPlant.statusLabel || "RO ACTIVE"}
                  </Badge>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}>{selectedPlant.name}</div>
                <div style={{ fontSize: 11, color: c.cyan, fontFamily: "'JetBrains Mono', monospace", marginBottom: 10 }}>{selectedPlant.district}</div>
                
                <div style={{ display: "flex", gap: 14, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
                  <div>
                    <div style={{ color: c.sub, fontSize: 9 }}>{spotlightMetalInfo.label}</div>
                    <div style={{ fontWeight: 700, color: spotlightMetalInfo.isElevated ? c.red : c.text }}>{spotlightMetalInfo.val}</div>
                  </div>
                  <div>
                    <div style={{ color: c.sub, fontSize: 9 }}>PH LEVEL</div>
                    <div style={{ fontWeight: 700, color: c.text }}>{selectedPlant.spotlight?.ph || "7.1 pH"}</div>
                  </div>
                  <div>
                    <div style={{ color: c.sub, fontSize: 9 }}>TDS INFLOW</div>
                    <div style={{ fontWeight: 700, color: c.text }}>{selectedPlant.spotlight?.tds || "220 ppm"}</div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: `1px solid ${c.border}`, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
                  <span style={{ color: selectedPlant.status === "cutoff" ? c.red : c.mint }}>
                    ● {selectedPlant.status === "cutoff" ? "Solenoid Shutoff Active" : "Solenoid Valve Normal"}
                  </span>
                  <span style={{ color: c.sub }}>SCADA CH: 02</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 45-Plant Fleet Table with Sorting Controls */}
      <div style={{ padding: "20px 24px 32px" }}>
        <div style={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 8, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk', sans-serif" }}>STATEWIDE PURIFICATION FLEET ROSTER ({filteredPlants.length} UNITS)</div>
              <div style={{ fontSize: 11.5, color: c.sub, marginTop: 2 }}>Real-time telemetry, location & operating status across all districts</div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              {/* Sort By Dropdown */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10.5, color: c.sub, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>SORT BY:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    background: c.panel2,
                    color: c.cyan,
                    border: `1px solid ${c.border}`,
                    borderRadius: 6,
                    padding: "6px 10px",
                    fontSize: 12,
                    fontFamily: "'JetBrains Mono', monospace",
                    outline: "none",
                  }}
                >
                  <option value="severity">Severity / Status (Critical First)</option>
                  <option value="id">Plant Node ID (A-Z)</option>
                  <option value="name">Plant Name (A-Z)</option>
                  <option value="district">District (A-Z)</option>
                  <option value="score">Water Safety Score (Highest First)</option>
                </select>
              </div>

              {/* Search Bar */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search plant ID, name, district..."
                style={{
                  background: c.panel2,
                  border: `1px solid ${c.border}`,
                  borderRadius: 6,
                  padding: "6px 14px",
                  color: c.text,
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  width: 220,
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${c.border}`, color: c.sub, textAlign: "left" }}>
                  <th style={{ padding: "10px 12px" }}>PLANT NODE ID</th>
                  <th style={{ padding: "10px 12px" }}>PLANT NAME</th>
                  <th style={{ padding: "10px 12px" }}>DISTRICT</th>
                  <th style={{ padding: "10px 12px" }}>STATUS</th>
                  <th style={{ padding: "10px 12px" }}>WATER SAFETY</th>
                  <th style={{ padding: "10px 12px" }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlants.map((p) => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${c.border}` }}>
                    <td style={{ padding: "10px 12px", color: c.cyan, fontWeight: 700 }}>{p.id}</td>
                    <td style={{ padding: "10px 12px", color: c.text, fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: "10px 12px", color: c.sub }}>{p.district}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <Badge tone={p.status === "cutoff" ? "red" : p.status === "alert" ? "amber" : "mint"}>
                        {p.statusLabel || (p.status === "cutoff" ? "CUTOFF" : "ONLINE")}
                      </Badge>
                    </td>
                    <td style={{ padding: "10px 12px", color: p.status === "cutoff" ? c.red : c.mint }}>
                      {p.status === "cutoff" ? "60.0 / 100" : "94.2 / 100"}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <button
                        onClick={() => navigate("/plant-telemetry")}
                        style={{
                          background: c.panel2,
                          border: `1px solid ${c.border}`,
                          color: c.cyan,
                          borderRadius: 4,
                          padding: "4px 8px",
                          fontSize: 10.5,
                          cursor: "pointer",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        TELEMETRY ➔
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: `1px solid ${c.border}`,
          padding: "14px 24px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10.5,
          color: c.sub,
        }}
      >
        <span>TOYAM SCADA Engine v3.4.1</span>
        <span>Jharkhand Drinking Water and Sanitation Department</span>
        <span style={{ color: c.mint }}>● Data Integrity Verified</span>
        <span>CENTRAL DISPATCH: 1800-345-6789 • ENCRYPTED TELEMETRY STREAM</span>
      </div>
    </div>
  );
}
