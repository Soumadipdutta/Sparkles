import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchReportsSummary,
  fetchReportsContaminants,
  fetchReportsTrends,
  fetchReportsHeatmap,
  fetchRecentReports,
  downloadReportFile,
} from "../services/api";

function formatDateTime(dateInput, dateFormat = "DD-MM-YYYY", timeFormat = "12-Hour (AM/PM)") {
  let d = new Date();
  if (dateInput) {
    if (typeof dateInput === "string") {
      const parsed = new Date(dateInput);
      if (!isNaN(parsed.getTime())) d = parsed;
    } else if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
      d = dateInput;
    }
  }

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  let formattedDate = `${day}-${month}-${year}`;

  const fmt = String(dateFormat || "").toUpperCase();
  if (fmt.startsWith("YYYY") || fmt.includes("YYYY-MM") || fmt.includes("YYYY/MM")) {
    formattedDate = `${year}-${month}-${day}`;
  } else if (fmt.startsWith("MM") || fmt.includes("MM-DD") || fmt.includes("MM/DD")) {
    formattedDate = `${month}-${day}-${year}`;
  } else if (fmt.includes("MMM")) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    formattedDate = `${day} ${monthNames[d.getMonth()]} ${year}`;
  } else {
    formattedDate = `${day}-${month}-${year}`;
  }

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  let formattedTime = "";

  if (timeFormat && timeFormat.includes("24-Hour")) {
    formattedTime = `${String(hours).padStart(2, "0")}:${minutes}`;
  } else {
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    formattedTime = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  }

  return `${formattedDate}, ${formattedTime}`;
}

/* ---------- Icons (inline, no deps) ---------- */
const Icon = ({ path, size = 18, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    {path}
  </svg>
);

const icons = {
  home: <path d="M3 11.5 12 4l9 7.5M5 10v10h14V10" />,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  flask: <path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3.5L14 9V3" />,
  drop: <path d="M12 2.5S5 11 5 15.5a7 7 0 0 0 14 0C19 11 12 2.5 12 2.5Z" />,
  bell: <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 21a2 2 0 0 0 4 0" />,
  shield: <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />,
  file: <><path d="M6 2h9l5 5v15H6z" /><path d="M15 2v5h5" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 0 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.1.35.35.66.68.9.3.24.68.38 1.07.38H21a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z" /></>,
  pin: <><path d="M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.2" /></>,
  refresh: <><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  calendar: <><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M3 9.5h18M8 2.5v4M16 2.5v4" /></>,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUp: <path d="M12 19V5M5 12l7-7 7 7" />,
  arrowDown: <path d="M12 5v14M5 12l7 7 7-7" />,
  fileText: <><path d="M6 2h9l5 5v15H6z" /><path d="M15 2v5h5" /><path d="M9 13h6M9 17h6" /></>,
  flaskFill: <path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3.5L14 9V3" />,
  warning: <><path d="M10.3 3.9 2 18h20L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>,
  download: <><path d="M12 3v13M7 11l5 5 5-5" /><path d="M4 21h16" /></>,
  share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 10.5 6.8-3.9M8.6 13.5l6.8 3.9" /></>,
  info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-5M12 8h.01" /></>,
  brain: <path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3.5 3.5 0 0 0 2 6.5 3 3 0 0 0 5.5 1.5V5a3 3 0 0 0-2.5-2Zm6 0a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3.5 3.5 0 0 1-2 6.5 3 3 0 0 1-5.5 1.5V5a3 3 0 0 1 2.5-2Z" />,
  redPage: <><path d="M6 2h9l5 5v15H6z" /><path d="M15 2v5h5" /></>,
};

/* ---------- Small building blocks with Dark Mode ---------- */
const Card = ({ children, isDark = false, style, ...p }) => (
  <div style={{
    background: isDark ? "#131B2E" : "#fff",
    border: isDark ? "1px solid #1E2D4A" : "1px solid #E7EBF0",
    borderRadius: 16,
    boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 1px 2px rgba(16,24,40,0.04)",
    color: isDark ? "#F8FAFC" : "#101828",
    ...style,
  }} {...p}>
    {children}
  </div>
);

const Pill = ({ tone = "ok", isDark = false, children }) => {
  const map = isDark ? {
    ok: { bg: "#064E3B", fg: "#34D399", dot: "#10B981" },
    warn: { bg: "#78350F", fg: "#FBBF24", dot: "#F59E0B" },
    bad: { bg: "#7F1D1D", fg: "#FCA5A5", dot: "#EF4444" },
  }[tone] : {
    ok: { bg: "#EAF7EE", fg: "#1E8E4E", dot: "#22B15C" },
    warn: { bg: "#FEF4E6", fg: "#B8730B", dot: "#F0A03D" },
    bad: { bg: "#FDECEC", fg: "#C43B3B", dot: "#E5484D" },
  }[tone] || { bg: "#EAF7EE", fg: "#1E8E4E", dot: "#22B15C" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: map.bg, color: map.fg, fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 999 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: map.dot }} />
      {children}
    </span>
  );
};

const SectionTitle = ({ children, isDark = false, right }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
    <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: isDark ? "#94A3B8" : "#1F2937", margin: 0 }}>{children}</h2>
    {right}
  </div>
);

const FieldLabel = ({ children, isDark = false }) => (
  <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "#94A3B8" : "#667085", marginBottom: 6, display: "block" }}>{children}</label>
);

const iconBtnStyle = { background: "transparent", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex" };

/* ---------- Sidebar & TopBar ---------- */
const NAV = [
  { key: "dashboard", label: "Dashboard", icon: icons.home },
  { key: "quality", label: "Water Quality", icon: icons.chart },
  { key: "contaminants", label: "Contaminants", icon: icons.flask },
  { key: "purification", label: "Purification", icon: icons.drop },
  { key: "alerts", label: "Alerts", icon: icons.bell },
  { key: "awareness", label: "Awareness", icon: icons.shield },
  { key: "reports", label: "Reports", icon: icons.file },
  { key: "settings", label: "Settings", icon: icons.gear },
];

function Sidebar({ active, setActive, open, setOpen }) {
  const navigate = useNavigate();

  return (
    <>
      {open && <div onClick={() => setOpen(false)} className="sidebar-scrim" style={{ position: "fixed", inset: 0, background: "rgba(10,15,25,0.45)", zIndex: 40 }} />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div style={{ padding: "22px 20px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: 21, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>TOYAM</span>
              <div style={{ fontSize: 11, color: "#7C93B8", marginTop: 2 }}>Smart Water · Safe Future</div>
            </div>
            <button className="only-mobile" onClick={() => setOpen(false)} style={iconBtnStyle}>
              <Icon path={icons.x} color="#B9C6DC" />
            </button>
          </div>
        </div>
        <nav style={{ padding: "6px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActive(item.key);
                  setOpen(false);
                  if (item.key === "dashboard") navigate("/dashboard");
                  else if (item.key === "settings") navigate("/settings");
                  else if (item.key === "reports") navigate("/reports");
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, border: "none",
                  background: isActive ? "#2563EB" : "transparent", color: isActive ? "#fff" : "#B9C6DC",
                  fontSize: 14, fontWeight: isActive ? 600 : 500, cursor: "pointer", textAlign: "left", width: "100%",
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#16233F"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon path={item.icon} size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto", padding: 16 }}>
          <div style={{ background: "#16233F", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12, color: "#8FA2C2", marginBottom: 8 }}>System Status</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
              <span style={{ fontSize: 13, color: "#E5EAF3", fontWeight: 600 }}>All Systems Operational</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function TopBar({ setOpen, isDark = false, settings, lastUpdatedTime, onRefresh }) {
  const village = settings?.system_info?.village || "XYZ";
  const formattedDateTime = formatDateTime(lastUpdatedTime || new Date(), settings?.display_preferences?.date_format, settings?.display_preferences?.time_format);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: "14px 0", marginBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="only-mobile" onClick={() => setOpen(true)} style={{ ...iconBtnStyle, background: isDark ? "#131B2E" : "#fff", border: isDark ? "1px solid #1E2D4A" : "1px solid #E7EBF0" }}>
          <Icon path={icons.menu} color={isDark ? "#94A3B8" : "#344054"} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: isDark ? "#131B2E" : "#fff", border: isDark ? "1px solid #1E2D4A" : "1px solid #E7EBF0", borderRadius: 10, padding: "7px 12px", fontSize: 13, color: isDark ? "#F8FAFC" : "#344054", fontWeight: 500 }}>
          <Icon path={icons.pin} size={15} color="#2F6FED" />
          Village: {village}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: isDark ? "#94A3B8" : "#667085" }}>
          Last updated: {formattedDateTime}
          <button onClick={onRefresh} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 2, display: "flex" }} title="Refresh now">
            <Icon path={icons.refresh} size={14} color="#98A2B3" />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: isDark ? "#064E3B" : "#EAF7EE", color: isDark ? "#34D399" : "#1E8E4E", borderRadius: 999, padding: "6px 12px", fontSize: 13, fontWeight: 700 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E" }} />
          ONLINE
        </div>
      </div>
    </div>
  );
}

/* ---------- Chart Component ---------- */
function TrendChart({ trends = {}, isDark = false }) {
  const ph = trends?.pH || [];
  const turbidity = trends?.turbidity || [];
  const tds = trends?.tds || [];
  const temperature = trends?.temperature || [];

  const points = ph.map((item, i) => ({
    time: item.time,
    ph: item.value,
    turb: turbidity[i]?.value ?? 0,
    tds: tds[i]?.value ?? 0,
    temp: temperature[i]?.value ?? 0,
  }));

  if (points.length === 0) {
    return null;
  }

  const w = 720;
  const h = 240;
  const padL = 34;
  const padR = 34;
  const padT = 12;
  const padB = 26;

  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const xStep = points.length > 1 ? innerW / (points.length - 1) : innerW;
  const scaleLeft = (v) => padT + innerH - (v / 10) * innerH;
  const scaleRight = (v) => padT + innerH - (v / 800) * innerH;
  const scaleTemp = (v) => padT + innerH - ((v || 0) / 50) * innerH;

  const path = (getter) => points.map((p, i) => `${i === 0 ? "M" : "L"} ${padL + i * xStep} ${getter(p)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto", display: "block" }} preserveAspectRatio="xMidYMid meet">
      {[0, 2, 4, 6, 8, 10].map((v) => (
        <line key={v} x1={padL} x2={w - padR} y1={scaleLeft(v)} y2={scaleLeft(v)} stroke={isDark ? "#1E2D4A" : "#EEF1F5"} strokeWidth="1" />
      ))}
      {[0, 2, 4, 6, 8, 10].map((v) => (
        <text key={v} x={padL - 8} y={scaleLeft(v) + 3} fontSize="9.5" fill={isDark ? "#64748B" : "#98A2B3"} textAnchor="end">{v}</text>
      ))}
      {[0, 200, 400, 600, 800].map((v) => (
        <text key={v} x={w - padR + 8} y={scaleRight(v) + 3} fontSize="9.5" fill={isDark ? "#64748B" : "#98A2B3"} textAnchor="start">{v}</text>
      ))}
      <path d={path((p) => scaleLeft(p.ph))} fill="none" stroke="#2F6FED" strokeWidth="2" />
      <path d={path((p) => scaleLeft(p.turb))} fill="none" stroke="#1FAA6C" strokeWidth="2" />
      <path d={path((p) => scaleRight(p.tds))} fill="none" stroke="#8B5CF6" strokeWidth="2" />
      <path d={path((p) => scaleTemp(p.temp))} fill="none" stroke="#F0A03D" strokeWidth="2" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={padL + i * xStep} cy={scaleLeft(p.ph)} r="2.6" fill="#2F6FED" />
          <circle cx={padL + i * xStep} cy={scaleLeft(p.turb)} r="2.6" fill="#1FAA6C" />
          <circle cx={padL + i * xStep} cy={scaleRight(p.tds)} r="2.6" fill="#8B5CF6" />
          <circle cx={padL + i * xStep} cy={scaleTemp(p.temp)} r="2.6" fill="#F0A03D" />
          <text x={padL + i * xStep} y={h - 6} fontSize="9.5" fill={isDark ? "#64748B" : "#98A2B3"} textAnchor="middle">{p.time}</text>
        </g>
      ))}
    </svg>
  );
}

/* ---------- Section Components ---------- */
function Select({ value, options, onChange, isDark = false, style }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      style={{
        width: "100%",
        border: isDark ? "1px solid #334155" : "1px solid #E7EBF0",
        borderRadius: 9,
        padding: "9px 12px",
        fontSize: 13.5,
        color: isDark ? "#F8FAFC" : "#344054",
        background: isDark ? "#0F172A" : "#fff",
        cursor: "pointer",
        outline: "none",
        ...style,
      }}
    >
      {options.map((option) => (
        <option key={option} value={option} style={{ background: isDark ? "#0F172A" : "#fff", color: isDark ? "#F8FAFC" : "#344054" }}>
          {option}
        </option>
      ))}
    </select>
  );
}

function ReportFilters({ onGenerate, isDark = false }) {
  const [reportType, setReportType] = useState("Water Quality Summary");
  const [timeRange, setTimeRange] = useState("Last 7 Days");
  const [startDate, setStartDate] = useState("2026-08-24");
  const [endDate, setEndDate] = useState("2026-08-30");
  const [dataSource, setDataSource] = useState("All Sources");

  const handleGenerate = () => {
    onGenerate?.({
      reportType,
      timeRange,
      startDate,
      endDate,
      dataSource,
    });
  };

  return (
    <Card isDark={isDark} style={{ padding: 18 }}>
      <div className="filters-row">
        <div style={{ minWidth: 160, flex: "1 1 160px" }}>
          <FieldLabel isDark={isDark}>Report Type</FieldLabel>
          <Select
            isDark={isDark}
            value={reportType}
            options={[
              "Water Quality Summary",
              "Contaminant Analysis",
              "System Performance",
              "Compliance Report",
            ]}
            onChange={setReportType}
          />
        </div>

        <div style={{ minWidth: 140, flex: "1 1 140px" }}>
          <FieldLabel isDark={isDark}>Time Range</FieldLabel>
          <Select
            isDark={isDark}
            value={timeRange}
            options={["Last 7 Days", "Last 30 Days", "Custom"]}
            onChange={setTimeRange}
          />
        </div>

        <div style={{ minWidth: 140, flex: "1 1 140px" }}>
          <FieldLabel isDark={isDark}>Start Date</FieldLabel>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              width: "100%",
              border: isDark ? "1px solid #334155" : "1px solid #E7EBF0",
              borderRadius: 9,
              padding: "9px 12px",
              fontSize: 13.5,
              color: isDark ? "#F8FAFC" : "#344054",
              background: isDark ? "#0F172A" : "#fff",
              colorScheme: isDark ? "dark" : "light",
            }}
          />
        </div>

        <div style={{ minWidth: 140, flex: "1 1 140px" }}>
          <FieldLabel isDark={isDark}>End Date</FieldLabel>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              width: "100%",
              border: isDark ? "1px solid #334155" : "1px solid #E7EBF0",
              borderRadius: 9,
              padding: "9px 12px",
              fontSize: 13.5,
              color: isDark ? "#F8FAFC" : "#344054",
              background: isDark ? "#0F172A" : "#fff",
              colorScheme: isDark ? "dark" : "light",
            }}
          />
        </div>

        <div style={{ minWidth: 140, flex: "1 1 140px" }}>
          <FieldLabel isDark={isDark}>Data Source</FieldLabel>
          <Select
            isDark={isDark}
            value={dataSource}
            options={[
              "All Sources",
              "Primary Sensor",
              "Backup Sensor",
            ]}
            onChange={setDataSource}
          />
        </div>

        <div style={{ flex: "0 0 auto", alignSelf: "flex-end" }}>
          <button
            onClick={handleGenerate}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#2563EB",
              color: "#fff",
              border: "none",
              borderRadius: 9,
              padding: "10px 18px",
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <Icon path={icons.fileText} size={15} />
            Generate Report
          </button>
        </div>
      </div>
    </Card>
  );
}

function KpiCard({ k, isDark = false }) {
  return (
    <Card isDark={isDark} style={{ padding: 20, flex: "1 1 240px", minWidth: 220 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon path={k.icon} size={20} color={k.fg} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, color: isDark ? "#94A3B8" : "#667085", fontWeight: 600, marginBottom: 6 }}>{k.label}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: isDark ? "#F8FAFC" : "#101828" }}>{k.value}</span>
            {k.unit && <span style={{ fontSize: 13, color: isDark ? "#64748B" : "#98A2B3", fontWeight: 600 }}>{k.unit}</span>}
          </div>
          {k.subTone ? (
            <div style={{ marginTop: 6 }}><Pill tone={k.subTone} isDark={isDark}>{k.sub}</Pill></div>
          ) : (
            <div style={{ fontSize: 12.5, color: isDark ? "#64748B" : "#98A2B3", marginTop: 4 }}>{k.sub}</div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, marginTop: 8, color: k.up ? "#1E8E4E" : "#C43B3B" }}>
            <Icon path={k.up ? icons.arrowUp : icons.arrowDown} size={12} />
            {k.delta}
          </div>
        </div>
      </div>
    </Card>
  );
}

function WaterQualityOverview({ trends = {}, isDark = false }) {
  const [range, setRange] = useState("24H");

  const activeSeries = range === "24H" ? (trends?.last_24h || trends)
    : range === "7D" ? trends?.last_7d
    : range === "30D" ? trends?.last_30d
    : trends?.custom;

  const hasPoints = (activeSeries?.pH && activeSeries.pH.length > 0) || (activeSeries?.points && activeSeries.points.length > 0);

  return (
    <Card isDark={isDark} style={{ padding: 22, flex: "2 1 460px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <SectionTitle isDark={isDark}>Water Quality Overview</SectionTitle>
        <div style={{ display: "flex", gap: 4, background: isDark ? "#0F172A" : "#F5F6F8", borderRadius: 8, padding: 3 }}>
          {["24H", "7D", "30D", "Custom"].map((r) => (
            <button key={r} onClick={() => setRange(r)} style={{
              border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 6,
              background: range === r ? (isDark ? "#2563EB" : "#101828") : "transparent", color: range === r ? "#fff" : (isDark ? "#94A3B8" : "#667085"),
            }}>{r}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, fontSize: 12, color: isDark ? "#94A3B8" : "#667085", margin: "6px 0 10px", flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><i style={{ width: 8, height: 8, borderRadius: "50%", background: "#2F6FED", display: "inline-block" }} />pH</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><i style={{ width: 8, height: 8, borderRadius: "50%", background: "#1FAA6C", display: "inline-block" }} />Turbidity (NTU)</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><i style={{ width: 8, height: 8, borderRadius: "50%", background: "#8B5CF6", display: "inline-block" }} />TDS (ppm)</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><i style={{ width: 8, height: 8, borderRadius: "50%", background: "#F0A03D", display: "inline-block" }} />Temperature (°C)</span>
      </div>

      {hasPoints ? (
        <TrendChart trends={activeSeries} isDark={isDark} />
      ) : (
        <div style={{ height: 240, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: isDark ? "#64748B" : "#98A2B3", fontSize: 13, textAlign: "center", padding: 20 }}>
          <Icon path={icons.info} size={24} color={isDark ? "#64748B" : "#98A2B3"} style={{ marginBottom: 8 }} />
          <span>No trend data available for {range}.</span>
          <span style={{ fontSize: 12, marginTop: 4, opacity: 0.8 }}>Insufficient historical readings recorded. Graph will automatically plot as soon as data is logged.</span>
        </div>
      )}

      <div style={{ marginTop: 14, background: isDark ? "#1E293B" : "#EFF6FF", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <Icon path={icons.brain} size={15} color="#2563EB" />
        <span style={{ fontSize: 12.5, color: isDark ? "#94A3B8" : "#3B5A8A", flex: 1 }}>
          <strong style={{ color: isDark ? "#E2E8F0" : "#1D3A6B" }}>AI Insight:</strong> Water quality has remained stable over the last 7 days.
        </span>
        <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "#2563EB", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
          View details <Icon path={icons.arrowRight} size={12} />
        </a>
      </div>
    </Card>
  );
}

function ContaminantSummary({ contaminants = [], isDark = false }) {

  return (
    <Card isDark={isDark} style={{ padding: 22, flex: "1 1 380px", overflow: "hidden" }}>
      <SectionTitle
        isDark={isDark}
        right={<a href="#" style={{ fontSize: 12.5, color: "#2563EB", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>View full analysis <Icon path={icons.arrowRight} size={12} /></a>}
      >
        Contaminant Summary (Last 7 Days)
      </SectionTitle>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 460 }}>
          <thead>
            <tr style={{ borderBottom: isDark ? "1px solid #1E2D4A" : "1px solid #EEF1F5" }}>
              {["Parameter", "Average", "Max", "Reference", "Status"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 8px", fontSize: 11.5, color: isDark ? "#64748B" : "#98A2B3", fontWeight: 700, letterSpacing: "0.03em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contaminants.map((c) => (
              <tr key={c.parameter} style={{ borderBottom: isDark ? "1px solid #1E293B" : "1px solid #F5F6F8" }}>
                <td style={{ padding: "11px 8px", fontSize: 13, color: isDark ? "#E2E8F0" : "#344054", fontWeight: 600 }}>
                  {c.parameter}
                </td>
                <td style={{ padding: "11px 8px", fontSize: 13, color: isDark ? "#CBD5E1" : "#344054" }}>
                  {c.value}
                </td>
                <td style={{ padding: "11px 8px", fontSize: 13, color: isDark ? "#94A3B8" : "#344054" }}>
                  --
                </td>
                <td style={{ padding: "11px 8px", fontSize: 13, color: isDark ? "#CBD5E1" : "#344054" }}>
                  {c.safe_limit}
                </td>
                <td style={{ padding: "11px 8px" }}>
                  <Pill tone={c.status === "Safe" ? "ok" : "warn"} isDark={isDark}>
                    {c.status}
                  </Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function TemporalHeatmap({ heatmap = [], isDark = false }) {
  return (
    <Card isDark={isDark} style={{ padding: 22, flex: "2 1 460px" }}>
      <SectionTitle isDark={isDark}>
        Temporal Water Quality Heatmap
      </SectionTitle>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
        {heatmap.length === 0 ? (
          <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: isDark ? "#64748B" : "#98A2B3", fontSize: 13 }}>
            No heatmap data available
          </div>
        ) : (
          heatmap.map((item) => {
            const total = item.safe + item.warning + item.critical;
            const safePercentage = total > 0 ? (item.safe / total) * 100 : 0;
            const warningPercentage = total > 0 ? (item.warning / total) * 100 : 0;
            const criticalPercentage = total > 0 ? (item.critical / total) * 100 : 0;

            return (
              <div key={item.date}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 12, color: isDark ? "#94A3B8" : "#667085" }}>
                  <span>
                    {new Date(item.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </span>
                  <span>{total} tests</span>
                </div>

                <div style={{ height: 22, width: "100%", display: "flex", borderRadius: 6, overflow: "hidden", background: isDark ? "#1E293B" : "#F2F4F7" }}>
                  {safePercentage > 0 && <div style={{ width: `${safePercentage}%`, background: "#22C55E" }} />}
                  {warningPercentage > 0 && <div style={{ width: `${warningPercentage}%`, background: "#F59E0B" }} />}
                  {criticalPercentage > 0 && <div style={{ width: `${criticalPercentage}%`, background: "#EF4444" }} />}
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 4, fontSize: 11, color: isDark ? "#64748B" : "#98A2B3" }}>
                  <span>Safe: {item.safe}</span>
                  <span>Warning: {item.warning}</span>
                  <span>Critical: {item.critical}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 18, fontSize: 11.5, color: isDark ? "#94A3B8" : "#667085" }}>
        <span>
          <i style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", display: "inline-block", marginRight: 5 }} />
          Safe
        </span>
        <span>
          <i style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B", display: "inline-block", marginRight: 5 }} />
          Warning
        </span>
        <span>
          <i style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", display: "inline-block", marginRight: 5 }} />
          Critical
        </span>
      </div>
    </Card>
  );
}

function RecentReports({ reports = [], onDownload, isDark = false }) {
  return (
    <Card isDark={isDark} style={{ padding: 22, flex: "1 1 300px", display: "flex", flexDirection: "column" }}>
      <SectionTitle isDark={isDark}>Recent Reports</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {reports.map((r) => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 4px", borderBottom: isDark ? "1px solid #1E293B" : "1px solid #F5F6F8" }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: isDark ? "#1E293B" : "#F5F6F8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon path={icons.redPage} size={16} color="#EF4444" />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: isDark ? "#F8FAFC" : "#1F2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {r.name}
              </div>
              <div style={{ fontSize: 12, color: isDark ? "#64748B" : "#98A2B3" }}>{r.date}</div>
            </div>
            <div style={{ fontSize: 11.5, color: isDark ? "#64748B" : "#98A2B3", textAlign: "right", flexShrink: 0 }}>
              {r.type}
            </div>
            <button
              onClick={() => onDownload?.({ reportType: r.name })}
              style={{ border: isDark ? "1px solid #334155" : "1px solid #E7EBF0", background: isDark ? "#0F172A" : "#fff", borderRadius: 7, padding: 7, cursor: "pointer", display: "flex", flexShrink: 0 }}
            >
              <Icon path={icons.download} size={14} color="#2563EB" />
            </button>
          </div>
        ))}

        {reports.length === 0 && (
          <div style={{ padding: "25px 10px", textAlign: "center", color: isDark ? "#64748B" : "#98A2B3", fontSize: 13 }}>
            No recent reports available.
          </div>
        )}
      </div>

      <div style={{ marginTop: "auto", paddingTop: 16, textAlign: "right" }}>
        <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "#2563EB", fontWeight: 700, textDecoration: "none" }}>
          View all reports <Icon path={icons.arrowRight} size={13} />
        </a>
      </div>
    </Card>
  );
}

function ShareReport({ isDark = false }) {
  return (
    <Card isDark={isDark} style={{ padding: 22, flex: "1 1 260px" }}>
      <SectionTitle isDark={isDark} right={<Icon path={icons.share} size={15} color={isDark ? "#64748B" : "#98A2B3"} />}>Share Report</SectionTitle>
      <p style={{ fontSize: 12.5, color: isDark ? "#94A3B8" : "#667085", margin: "0 0 12px" }}>Share the selected report with others.</p>
      <div className="share-row">
        <input placeholder="Enter email address" style={{
          flex: "1 1 160px", border: isDark ? "1px solid #334155" : "1px solid #E7EBF0", borderRadius: 9, padding: "9px 12px", fontSize: 13, color: isDark ? "#F8FAFC" : "#344054", background: isDark ? "#0F172A" : "#fff", minWidth: 0,
        }} />
        <Select isDark={isDark} value="View Only" options={["View Only", "Can Download", "Can Edit"]} style={{ width: 130, flex: "0 0 130px" }} />
        <button style={{ background: "#2563EB", color: "#fff", border: "none", borderRadius: 9, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
          Share
        </button>
      </div>
    </Card>
  );
}

function AutomatedReports({ isDark = false }) {
  const items = [
    { title: "Weekly Report", desc: "Every Monday at 09:00 AM", on: true },
    { title: "Monthly Report", desc: "1st of every month at 09:00 AM", on: true },
  ];
  return (
    <Card isDark={isDark} style={{ padding: 22, flex: "1 1 260px", display: "flex", flexDirection: "column" }}>
      <SectionTitle isDark={isDark}>Automated Reports</SectionTitle>
      <p style={{ fontSize: 12.5, color: isDark ? "#94A3B8" : "#667085", margin: "0 0 14px" }}>Schedule and receive reports automatically.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((it) => (
          <div key={it.title} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: isDark ? "#F8FAFC" : "#1F2937" }}>{it.title}</div>
              <div style={{ fontSize: 12, color: isDark ? "#64748B" : "#98A2B3" }}>{it.desc}</div>
            </div>
            <span style={{
              display: "inline-flex", alignItems: "center", width: 40, height: 22, borderRadius: 999,
              background: it.on ? "#2563EB" : (isDark ? "#334155" : "#E4E7EC"), padding: 2, flexShrink: 0,
            }}>
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", transform: it.on ? "translateX(18px)" : "translateX(0)", boxShadow: "0 1px 2px rgba(0,0,0,0.15)" }} />
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "auto", paddingTop: 18, textAlign: "right" }}>
        <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "#2563EB", fontWeight: 700, textDecoration: "none" }}>
          <Icon path={icons.calendar} size={13} /> Manage schedules
        </a>
      </div>
    </Card>
  );
}


/* ---------- Main Component ---------- */
export default function Reports({ settings, lastUpdatedTime: propLastUpdatedTime, onRefresh: propOnRefresh }) {

  const [active, setActive] = useState("reports");
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState(null);
  const [contaminants, setContaminants] = useState([]);
  const [trends, setTrends] = useState({});
  const [heatmap, setHeatmap] = useState([]);
  const [recentReports, setRecentReports] = useState([]);

  const themeSetting = settings?.display_preferences?.theme || "Light";
  const isDark = themeSetting === "Dark" || (themeSetting === "System" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    const loadAllReportData = async () => {
      try {
        const sumRes = await fetchReportsSummary().catch((err) => (console.error(err), null));
        if (sumRes?.data) setSummary(sumRes.data);

        const contRes = await fetchReportsContaminants().catch((err) => (console.error(err), null));
        if (contRes?.data) setContaminants(contRes.data);

        const trendRes = await fetchReportsTrends().catch((err) => (console.error(err), null));
        if (trendRes?.data) setTrends(trendRes.data);

        const heatRes = await fetchReportsHeatmap().catch((err) => (console.error(err), null));
        if (heatRes?.data) setHeatmap(heatRes.data);

        const recRes = await fetchRecentReports().catch((err) => (console.error(err), null));
        if (recRes?.data) setRecentReports(recRes.data);
      } catch (error) {
        console.error("Failed to load report data:", error);
      }
    };

    loadAllReportData();
  }, []);

  const downloadReport = async (filters) => {
    try {
      const blob = await downloadReportFile(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "toyam_water_quality_report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleGenerateReport = async (filters) => {
    console.log("Generating report with filters:", filters);
    await downloadReport(filters);
  };

  const kpis = [
    {
      label: "Overall Water Safety Score",
      value: summary?.overall_water_safety_score ?? "--",
      unit: "/100",
      sub: summary?.safety_status ?? "Safe",
      subTone: summary?.safety_status === "Safe" ? "ok" : "warn",
      delta: summary?.safety_delta ?? "3 points from previous period",
      up: true,
      icon: icons.shield,
      bg: isDark ? "#064E3B" : "#EAF7EE",
      fg: isDark ? "#34D399" : "#22C55E",
    },
    {
      label: "Tests Conducted",
      value: summary?.tests_conducted ?? "--",
      sub: "Across all parameters",
      delta: "12% from previous period",
      up: true,
      icon: icons.flaskFill,
      bg: isDark ? "#1E3A8A" : "#EFF6FF",
      fg: isDark ? "#60A5FA" : "#2563EB",
    },
    {
      label: "Alerts Triggered",
      value: summary?.alerts_triggered ?? "--",
      sub: summary?.alerts_breakdown ?? "1 Warning, 2 Info",
      delta: "33% from previous period",
      up: false,
      icon: icons.warning,
      bg: isDark ? "#78350F" : "#FEF4E6",
      fg: isDark ? "#FBBF24" : "#E08A2E",
    },
    {
      label: "Data Uptime",
      value: summary?.data_uptime ?? "--",
      unit: "%",
      sub: summary?.uptime_status ?? (summary?.data_uptime >= 99.0 ? "Excellent" : summary?.data_uptime >= 95.0 ? "Degraded" : "Offline"),
      subTone: summary?.uptime_tone ?? (summary?.data_uptime >= 99.0 ? "ok" : summary?.data_uptime >= 95.0 ? "warn" : "bad"),
      delta: summary?.uptime_delta ?? (summary?.data_uptime >= 99.0 ? "0.4% from previous period" : "Outage detected"),
      up: summary?.is_online !== false && (summary?.data_uptime >= 99.0),
      icon: icons.drop,
      bg: (summary?.is_online === false || (summary?.data_uptime && summary.data_uptime < 95.0))
        ? (isDark ? "#7F1D1D" : "#FDECEC")
        : (isDark ? "#3B0764" : "#F3EEFF"),
      fg: (summary?.is_online === false || (summary?.data_uptime && summary.data_uptime < 95.0))
        ? (isDark ? "#FCA5A5" : "#C43B3B")
        : (isDark ? "#C084FC" : "#7C4DFF"),
    },

  ];

  return (
    <div style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif", background: isDark ? "#0B0F19" : "#F6F7F9", color: isDark ? "#F8FAFC" : "#101828", minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; }
        .layout { display: flex; min-height: 100vh; }
        .sidebar { width: 232px; background: #0C1830; display: flex; flex-direction: column; flex-shrink: 0; position: sticky; top: 0; height: 100vh; }
        .main { flex: 1; min-width: 0; padding: 20px clamp(16px, 3vw, 32px) 40px; }
        .only-mobile { display: none; }
        .sidebar-scrim { display: none; }
        .page-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
        .filters-row { display: flex; gap: 14px; flex-wrap: wrap; align-items: flex-end; }
        .kpi-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
        .mid-row { display: flex; gap: 16px; flex-wrap: wrap; align-items: stretch; margin-bottom: 16px; }
        .bottom-row { display: flex; gap: 16px; flex-wrap: wrap; }
        .share-row { display: flex; gap: 10px; flex-wrap: wrap; }

        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: ${isDark ? "invert(1)" : "none"};
          cursor: pointer;
        }

        @media (max-width: 980px) {

          .sidebar { position: fixed; left: -260px; top: 0; z-index: 50; transition: left 0.22s ease; }
          .sidebar-open { left: 0; box-shadow: 8px 0 24px rgba(0,0,0,0.25); }
          .only-mobile { display: flex; }
          .sidebar-scrim { display: block !important; }
        }
        @media (max-width: 640px) {
          .main { padding: 16px 14px 32px; }
          .share-row { flex-direction: column; }
          .share-row > * { width: 100%; }
        }
      `}</style>

      <div className="layout">
        <Sidebar active={active} setActive={setActive} open={open} setOpen={setOpen} />

        <main className="main">
          <TopBar setOpen={setOpen} isDark={isDark} settings={settings} lastUpdatedTime={propLastUpdatedTime} onRefresh={propOnRefresh} />


          <div className="page-head">
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: isDark ? "#F8FAFC" : "#101828", margin: "8px 0 4px" }}>Reports</h1>
              <p style={{ fontSize: 14, color: isDark ? "#94A3B8" : "#667085", margin: 0 }}>View, download and share water quality reports and analytics.</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => downloadReport()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#2563EB",
                  border: "none",
                  color: "#fff",
                  borderRadius: 10,
                  padding: "10px 16px",
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Icon path={icons.download} size={15} />
                Generate Report
              </button>

              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: isDark ? "#131B2E" : "#fff",
                  border: isDark ? "1px solid #1E2D4A" : "1px solid #E7EBF0",
                  color: "#2563EB",
                  borderRadius: 10,
                  padding: "10px 16px",
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Icon path={icons.calendar} size={15} />
                Schedule Report
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <ReportFilters onGenerate={handleGenerateReport} isDark={isDark} />
          </div>

          <div className="kpi-row">
            {kpis.map((k) => <KpiCard key={k.label} k={k} isDark={isDark} />)}
          </div>

          <div className="mid-row">
            <WaterQualityOverview trends={trends} isDark={isDark} />
            <ContaminantSummary contaminants={contaminants} isDark={isDark} />
          </div>

          <div className="mid-row">
            <TemporalHeatmap heatmap={heatmap} isDark={isDark} />
            <RecentReports reports={recentReports} onDownload={downloadReport} isDark={isDark} />
          </div>

          <div className="bottom-row">
            <ShareReport isDark={isDark} />
            <AutomatedReports isDark={isDark} />
          </div>

          <div style={{ textAlign: "center", fontSize: 12, color: isDark ? "#64748B" : "#98A2B3", marginTop: 24 }}>
            <Icon path={icons.shield} size={12} color={isDark ? "#64748B" : "#98A2B3"} style={{ marginRight: 5, verticalAlign: "-2px" }} />
            Toyam is committed to providing safe water and creating healthier communities through technology and awareness.
          </div>
        </main>
      </div>
    </div>
  );
}
