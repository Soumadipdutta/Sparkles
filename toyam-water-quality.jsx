import React, { useState, useRef, useMemo } from "react";

/* ---------- Icons ---------- */
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
  download: <><path d="M12 3v13M7 11l5 5 5-5" /><path d="M4 21h16" /></>,
  compare: <><path d="M8 3v18M16 3v18" /><path d="m4 8 4-4 4 4M12 16l4 4 4-4" /></>,
  chevDown: <path d="m6 9 6 6 6-6" />,
  chevUp: <path d="m6 15 6-6 6 6" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
  brain: <path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3.5 3.5 0 0 0 2 6.5 3 3 0 0 0 5.5 1.5V5a3 3 0 0 0-2.5-2Zm6 0a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3.5 3.5 0 0 1-2 6.5 3 3 0 0 1-5.5 1.5V5a3 3 0 0 1 2.5-2Z" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  wind: <><path d="M3 8h11a3 3 0 1 0-2.5-4.7" /><path d="M3 12h15a3 3 0 1 1-2.5 4.7" /><path d="M3 16h8" /></>,
  zap: <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />,
  thermo: <path d="M14 14.76V4a2 2 0 0 0-4 0v10.76a4 4 0 1 0 4 0Z" />,
  droplet: <path d="M12 2.5S5 11 5 15.5a7 7 0 0 0 14 0C19 11 12 2.5 12 2.5Z" />,
  beaker: <path d="M9 2h6M10 2v6.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 8.5V2" />,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-5M12 8h.01" /></>,
  filter: <path d="M4 4h16l-6 8v6l-4 2v-8L4 4Z" />,
  chevLeft: <path d="m15 6-6 6 6 6" />,
  chevRight: <path d="m9 6 6 6-6 6" />,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.5" /></>,
  layers: <><path d="M12 2 2 8l10 6 10-6-10-6Z" /><path d="m2 14 10 6 10-6" /></>,
  check: <path d="m5 13 4 4L19 7" />,
  arrowUp: <path d="M12 19V5M5 12l7-7 7 7" />,
  arrowDown: <path d="M12 5v14M5 12l7 7 7-7" />,
  minus: <path d="M5 12h14" />,
  cylinder: <><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v10c0 1.7 3.1 3 7 3s7-1.3 7-3V5" /></>,
  tubes: <><path d="M8 3v9a3 3 0 0 0 6 0V3" /><path d="M6 3h10" /></>,
  glass: <path d="M8 3h8l-1 15a3 3 0 0 1-6 0L8 3Z" />,
};

/* ---------- shared building blocks ---------- */
const Card = ({ children, style, ...p }) => (
  <div style={{ background: "#fff", border: "1px solid #E7EBF0", borderRadius: 16, boxShadow: "0 1px 2px rgba(16,24,40,0.04)", ...style }} {...p}>{children}</div>
);
const Pill = ({ tone = "ok", children }) => {
  const map = {
    ok: { bg: "#EAF7EE", fg: "#1E8E4E", dot: "#22B15C" },
    warn: { bg: "#FEF4E6", fg: "#B8730B", dot: "#F0A03D" },
    bad: { bg: "#FDECEC", fg: "#C43B3B", dot: "#E5484D" },
    info: { bg: "#EFF6FF", fg: "#2563EB", dot: "#2563EB" },
    purple: { bg: "#F3EEFF", fg: "#6D3FD6", dot: "#8B5CF6" },
  }[tone];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: map.bg, color: map.fg, fontSize: 11.5, fontWeight: 700, padding: "3px 9px", borderRadius: 999, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: map.dot }} />{children}
    </span>
  );
};
const SectionTitle = ({ children, sub, right, icon }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {icon && <Icon path={icon} size={15} color="#2563EB" />}
        <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#1F2937", margin: 0 }}>{children}</h2>
      </div>
      {sub && <p style={{ fontSize: 12.5, color: "#98A2B3", margin: "4px 0 0" }}>{sub}</p>}
    </div>
    {right}
  </div>
);
const Select = ({ value, options, onChange, small }) => (
  <select
    value={value} onChange={(e) => onChange && onChange(e.target.value)}
    style={{
      border: "1px solid #E7EBF0", borderRadius: 9, padding: small ? "7px 26px 7px 10px" : "9px 30px 9px 12px",
      fontSize: small ? 12.5 : 13, color: "#344054", background: "#fff", fontWeight: 500, appearance: "none",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2398A2B3' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", cursor: "pointer",
    }}
  >
    {options.map((o) => <option key={o}>{o}</option>)}
  </select>
);
const iconBtnStyle = { background: "transparent", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex" };
const btnGhost = { display: "flex", alignItems: "center", gap: 7, background: "#fff", border: "1px solid #E7EBF0", color: "#344054", borderRadius: 9, padding: "9px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" };
const btnPrimary = { ...btnGhost, background: "#2563EB", border: "none", color: "#fff" };

/* ---------- Nav / Data ---------- */
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

const PARAMS = [
  { id: "ph", label: "pH", unit: "", icon: icons.beaker, color: "#2F6FED", safeMin: 6.5, safeMax: 8.5, current: 7.2, avg: 7.2, min: 7.0, max: 7.4, trend: "stable", base: 7.2, amp: 0.18 },
  { id: "turbidity", label: "Turbidity", unit: "NTU", icon: icons.droplet, color: "#1FAA6C", safeMin: 0, safeMax: 5, current: 2.1, avg: 2.3, min: 1.7, max: 3.4, trend: "up", base: 2.3, amp: 0.9 },
  { id: "tds", label: "TDS", unit: "ppm", icon: icons.layers, color: "#8B5CF6", safeMin: 0, safeMax: 600, current: 480, avg: 482, min: 455, max: 500, trend: "stable", base: 482, amp: 22 },
  { id: "temperature", label: "Temperature", unit: "°C", icon: icons.thermo, color: "#F0A03D", safeMin: 25, safeMax: 30, current: 27.4, avg: 27.3, min: 26.8, max: 27.9, trend: "stable", base: 27.3, amp: 0.5 },
  { id: "do", label: "Dissolved Oxygen", unit: "mg/L", icon: icons.wind, color: "#06B6D4", safeMin: 5, safeMax: 9, current: 6.8, avg: 6.9, min: 6.3, max: 7.4, trend: "down", base: 6.9, amp: 0.5 },
  { id: "conductivity", label: "Conductivity", unit: "µS/cm", icon: icons.zap, color: "#EC4899", safeMin: 200, safeMax: 800, current: 740, avg: 715, min: 660, max: 760, trend: "up", base: 715, amp: 45 },
];

const CONTAMINANTS = [
  { id: "arsenic", label: "Arsenic", unit: "mg/L", value: "0.006", tone: "ok", status: "Low" },
  { id: "lead", label: "Lead", unit: "mg/L", value: "0.004", tone: "ok", status: "Low" },
  { id: "iron", label: "Iron", unit: "mg/L", value: "0.18", tone: "warn", status: "Monitor" },
  { id: "manganese", label: "Manganese", unit: "mg/L", value: "0.05", tone: "ok", status: "Low" },
  { id: "chromium", label: "Chromium", unit: "mg/L", value: "0.006", tone: "ok", status: "Low" },
];

const SOURCES = ["Borewell #1", "Borewell #2", "Raw Water Inlet", "Storage Tank"];
const SOURCE_DATA = {
  ph: { "Borewell #1": 7.1, "Borewell #2": 7.4, "Raw Water Inlet": 6.8, "Storage Tank": 7.2 },
  turbidity: { "Borewell #1": 2.0, "Borewell #2": 2.8, "Raw Water Inlet": 3.9, "Storage Tank": 2.1 },
  tds: { "Borewell #1": 470, "Borewell #2": 490, "Raw Water Inlet": 520, "Storage Tank": 480 },
  temperature: { "Borewell #1": 27.1, "Borewell #2": 27.6, "Raw Water Inlet": 26.4, "Storage Tank": 27.3 },
  arsenic: { "Borewell #1": 0.005, "Borewell #2": 0.006, "Raw Water Inlet": 0.008, "Storage Tank": 0.006 },
  lead: { "Borewell #1": 0.003, "Borewell #2": 0.004, "Raw Water Inlet": 0.005, "Storage Tank": 0.004 },
  iron: { "Borewell #1": 0.15, "Borewell #2": 0.19, "Raw Water Inlet": 0.26, "Storage Tank": 0.18 },
};
const SOURCE_ROWS = [
  { source: "Borewell #1", ph: 7.1, turb: 2.0, tds: 470, arsenic: 0.005, tone: "ok", status: "Safe" },
  { source: "Borewell #2", ph: 7.4, turb: 2.8, tds: 490, arsenic: 0.006, tone: "ok", status: "Safe" },
  { source: "Raw Water Inlet", ph: 6.8, turb: 3.9, tds: 520, arsenic: 0.008, tone: "warn", status: "Monitor" },
  { source: "Storage Tank", ph: 7.2, turb: 2.1, tds: 480, arsenic: 0.006, tone: "ok", status: "Safe" },
];

const RANGE_CONFIG = {
  "24H": { points: 12, labels: ["12AM", "2AM", "4AM", "6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM", "10PM"] },
  "7D": { points: 7, labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  "30D": { points: 10, labels: ["D1", "D4", "D7", "D10", "D13", "D16", "D19", "D22", "D25", "D28"] },
  "90D": { points: 12, labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"] },
  "Custom": { points: 10, labels: ["D1", "D4", "D7", "D10", "D13", "D16", "D19", "D22", "D25", "D28"] },
};

function genSeries(param, points) {
  const arr = [];
  for (let i = 0; i < points; i++) {
    const wave = Math.sin((i / points) * Math.PI * 2 * 1.3 + param.base) * param.amp * 0.6;
    const wiggle = Math.sin(i * 1.7 + param.amp) * param.amp * 0.25;
    let v = param.base + wave + wiggle;
    if (param.id === "turbidity" || param.id === "conductivity") v += (i / points) * param.amp * 0.8; // slight upward drift
    if (param.id === "do") v -= (i / points) * param.amp * 0.5; // slight downward drift
    arr.push(Math.round(v * 100) / 100);
  }
  return arr;
}

const CORR_PARAMS = ["pH", "Turbidity", "TDS", "Temp", "DO"];
const CORR_MATRIX = [
  [1.0, -0.12, 0.18, 0.04, 0.21],
  [-0.12, 1.0, 0.43, 0.18, -0.31],
  [0.18, 0.43, 1.0, 0.27, -0.15],
  [0.04, 0.18, 0.27, 1.0, -0.08],
  [0.21, -0.31, -0.15, -0.08, 1.0],
];

const WQI_BREAKDOWN = [
  { label: "pH", pct: 92, status: "Excellent", tone: "ok" },
  { label: "Turbidity", pct: 88, status: "Good", tone: "ok" },
  { label: "TDS", pct: 85, status: "Good", tone: "ok" },
  { label: "Temperature", pct: 87, status: "Good", tone: "ok" },
  { label: "Dissolved Oxygen", pct: 83, status: "Good", tone: "ok" },
  { label: "Conductivity", pct: 68, status: "Monitor", tone: "warn" },
];

const HISTORY_ROWS = (() => {
  const rows = [];
  const params = [["pH", "", "ph"], ["Turbidity", "NTU", "turbidity"], ["TDS", "ppm", "tds"], ["Temperature", "°C", "temperature"]];
  const times = ["11:20 AM", "11:15 AM", "10:50 AM", "10:20 AM", "09:55 AM", "09:30 AM", "09:05 AM", "08:40 AM"];
  let day = 18;
  for (let d = 0; d < 5; d++) {
    for (let t = 0; t < 8; t++) {
      const src = SOURCES[(d + t) % SOURCES.length];
      const [label, unit, key] = params[(d + t) % params.length];
      const base = PARAMS.find((p) => p.id === key);
      const val = Math.round((base.base + Math.sin(d + t) * base.amp * 0.4) * 100) / 100;
      const status = val > base.safeMax || val < base.safeMin ? "warn" : "ok";
      rows.push({ ts: `${day - d} May ${times[t]}`, source: src, param: label, value: val, unit, status });
    }
  }
  return rows;
})();

/* ---------- Shared shell ---------- */
function Sidebar({ active, setActive, open, setOpen }) {
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
            <button className="only-mobile" onClick={() => setOpen(false)} style={iconBtnStyle}><Icon path={icons.x} color="#B9C6DC" /></button>
          </div>
        </div>
        <nav style={{ padding: "6px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((item) => {
            const isActive = active === item.key;
            return (
              <button key={item.key} onClick={() => { setActive(item.key); setOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, border: "none",
                background: isActive ? "#2563EB" : "transparent", color: isActive ? "#fff" : "#B9C6DC",
                fontSize: 14, fontWeight: isActive ? 600 : 500, cursor: "pointer", textAlign: "left", width: "100%",
              }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#16233F"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                <Icon path={item.icon} size={17} />{item.label}
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
function TopBar({ setOpen }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: "14px 0", marginBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="only-mobile" onClick={() => setOpen(true)} style={{ ...iconBtnStyle, background: "#fff", border: "1px solid #E7EBF0" }}><Icon path={icons.menu} color="#344054" /></button>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #E7EBF0", borderRadius: 10, padding: "7px 12px", fontSize: 13, color: "#344054", fontWeight: 500 }}>
          <Icon path={icons.pin} size={15} color="#2F6FED" />Village: XYZ
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#667085" }}>Last updated: 11:23 AM<Icon path={icons.refresh} size={14} color="#98A2B3" /></div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#EAF7EE", color: "#1E8E4E", borderRadius: 999, padding: "6px 12px", fontSize: 13, fontWeight: 700 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E" }} />ONLINE
        </div>
      </div>
    </div>
  );
}

/* ---------- CSV export helper ---------- */
function downloadCSV(filename, rows, headers) {
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => `"${r[h] ?? ""}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

/* ---------- 1. Parameter + Time selector ---------- */
function ParameterSelector({ selected, toggle, range, setRange, moreOpen, setMoreOpen }) {
  return (
    <Card style={{ padding: 22 }}>
      <SectionTitle sub="Choose parameters and a time window to drive every analysis below.">Analyze Water Parameters</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        {PARAMS.map((p) => {
          const isSel = selected.includes(p.id);
          return (
            <button key={p.id} onClick={() => toggle(p.id)} style={{
              display: "flex", alignItems: "center", gap: 7, border: "1px solid " + (isSel ? "#2563EB" : "#E7EBF0"),
              background: isSel ? "#2563EB" : "#fff", color: isSel ? "#fff" : "#344054",
              borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              <Icon path={p.icon} size={14} color={isSel ? "#fff" : p.color} />{p.label}
            </button>
          );
        })}
        <button onClick={() => setMoreOpen(!moreOpen)} style={{
          display: "flex", alignItems: "center", gap: 6, border: "1px dashed #C6D3E5", background: "#F9FBFF", color: "#2563EB",
          borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}>
          More Parameters <Icon path={moreOpen ? icons.chevUp : icons.chevDown} size={13} />
        </button>
      </div>
      {moreOpen && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14, paddingTop: 12, borderTop: "1px solid #F0F2F5" }}>
          {CONTAMINANTS.map((c) => {
            const isSel = selected.includes(c.id);
            return (
              <button key={c.id} onClick={() => toggle(c.id)} style={{
                display: "flex", alignItems: "center", gap: 7, border: "1px solid " + (isSel ? "#2563EB" : "#E7EBF0"),
                background: isSel ? "#2563EB" : "#fff", color: isSel ? "#fff" : "#344054",
                borderRadius: 999, padding: "7px 13px", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
              }}>{c.label}</button>
            );
          })}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", paddingTop: 14, borderTop: "1px solid #F0F2F5" }}>
        <span style={{ fontSize: 12.5, color: "#98A2B3", fontWeight: 600 }}>Time Range</span>
        <div style={{ display: "flex", gap: 4, background: "#F5F6F8", borderRadius: 8, padding: 3 }}>
          {Object.keys(RANGE_CONFIG).map((r) => (
            <button key={r} onClick={() => setRange(r)} style={{
              border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 6,
              background: range === r ? "#101828" : "transparent", color: range === r ? "#fff" : "#667085",
            }}>{r}</button>
          ))}
        </div>
        {range === "Custom" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid #E7EBF0", borderRadius: 8, padding: "6px 10px", fontSize: 12.5, color: "#344054" }}>12 May 2025</span>
            <Icon path={icons.arrowRight} size={12} color="#98A2B3" />
            <span style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid #E7EBF0", borderRadius: 8, padding: "6px 10px", fontSize: 12.5, color: "#344054" }}>18 May 2025</span>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ---------- 2. Trend chart ---------- */
function TrendChart({ selected, range }) {
  const [hover, setHover] = useState(null);
  const [hidden, setHidden] = useState([]);
  const cfg = RANGE_CONFIG[range];
  const activeParams = PARAMS.filter((p) => selected.includes(p.id) && !hidden.includes(p.id));
  const allSelectedParams = PARAMS.filter((p) => selected.includes(p.id));

  const w = 760, h = 280, padL = 20, padR = 20, padT = 16, padB = 30;
  const innerW = w - padL - padR, innerH = h - padT - padB;
  const xStep = innerW / (cfg.points - 1);
  const norm = (p, v) => {
    const lo = p.safeMin - (p.safeMax - p.safeMin) * 0.3;
    const hi = p.safeMax + (p.safeMax - p.safeMin) * 0.3;
    return Math.max(0, Math.min(1, (v - lo) / (hi - lo)));
  };
  const y = (nv) => padT + innerH - nv * innerH;

  const series = useMemo(() => allSelectedParams.map((p) => ({ p, values: genSeries(p, cfg.points) })), [selected.join(","), range]);

  return (
    <Card style={{ padding: 22, flex: "1 1 100%" }}>
      <SectionTitle sub="Values are normalized against each parameter's safe range so different units can be compared on one chart.">Water Quality Trend</SectionTitle>
      {allSelectedParams.length === 0 ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#98A2B3", fontSize: 13 }}>Select at least one parameter above to see its trend.</div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
            {allSelectedParams.map((p) => {
              const isHidden = hidden.includes(p.id);
              return (
                <button key={p.id} onClick={() => setHidden((h) => isHidden ? h.filter((x) => x !== p.id) : [...h, p.id])}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", opacity: isHidden ? 0.35 : 1 }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: p.color, display: "inline-block" }} />
                  <span style={{ fontSize: 12, color: "#667085", fontWeight: 600 }}>{p.label} {p.unit && `(${p.unit})`}</span>
                </button>
              );
            })}
          </div>
          <div style={{ position: "relative" }}>
            <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto", display: "block", cursor: "crosshair" }} preserveAspectRatio="xMidYMid meet"
              onMouseLeave={() => setHover(null)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const relX = ((e.clientX - rect.left) / rect.width) * w;
                let idx = Math.round((relX - padL) / xStep);
                idx = Math.max(0, Math.min(cfg.points - 1, idx));
                setHover(idx);
              }}>
              {[0, 0.25, 0.5, 0.75, 1].map((v) => (
                <line key={v} x1={padL} x2={w - padR} y1={y(v)} y2={y(v)} stroke="#F0F2F5" strokeWidth="1" />
              ))}
              <rect x={padL} y={y(0.65)} width={innerW} height={y(0.35) - y(0.65)} fill="#EAF7EE" opacity="0.35" />
              {series.filter((s) => !hidden.includes(s.p.id)).map((s) => (
                <path key={s.p.id} fill="none" stroke={s.p.color} strokeWidth="2.25"
                  d={s.values.map((v, i) => `${i === 0 ? "M" : "L"} ${padL + i * xStep} ${y(norm(s.p, v))}`).join(" ")} />
              ))}
              {series.filter((s) => !hidden.includes(s.p.id)).map((s) => s.values.map((v, i) => (
                <circle key={s.p.id + i} cx={padL + i * xStep} cy={y(norm(s.p, v))} r={hover === i ? 4 : 2.4} fill={s.p.color} />
              )))}
              {hover != null && <line x1={padL + hover * xStep} x2={padL + hover * xStep} y1={padT} y2={h - padB} stroke="#C6D3E5" strokeWidth="1" strokeDasharray="3 3" />}
              {cfg.labels.map((l, i) => (
                <text key={l} x={padL + i * xStep} y={h - 8} fontSize="9.5" fill="#98A2B3" textAnchor="middle">{l}</text>
              ))}
            </svg>
            {hover != null && (
              <div style={{
                position: "absolute", top: 8, left: `${Math.min(78, Math.max(2, (hover / (cfg.points - 1)) * 92))}%`,
                background: "#101828", color: "#fff", borderRadius: 8, padding: "8px 12px", fontSize: 11.5, minWidth: 130, pointerEvents: "none",
              }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{cfg.labels[hover]}</div>
                {series.filter((s) => !hidden.includes(s.p.id)).map((s) => (
                  <div key={s.p.id} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ color: "#B9C6DC" }}>{s.p.label}</span>
                    <span style={{ fontWeight: 700 }}>{s.values[hover]}{s.p.unit && ` ${s.p.unit}`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ fontSize: 11.5, color: "#98A2B3", marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: "#EAF7EE", border: "1px solid #DDEFE1", display: "inline-block" }} />
            shaded band = safe operating range (normalized)
          </div>
        </>
      )}
    </Card>
  );
}

/* ---------- 3. Trend summary ---------- */
function TrendSummary({ selected, range }) {
  const active = PARAMS.filter((p) => selected.includes(p.id));
  if (active.length === 0) return null;
  const mostStable = active.reduce((a, b) => (Math.abs(a.max - a.min) < Math.abs(b.max - b.min) ? a : b));
  const largestVar = active.reduce((a, b) => (Math.abs(a.max - a.min) > Math.abs(b.max - b.min) ? a : b));
  return (
    <Card style={{ padding: 22 }}>
      <SectionTitle>{range} Summary</SectionTitle>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "2 1 260px" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: "#98A2B3", marginBottom: 8 }}>AVERAGE</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {active.map((p) => (
              <div key={p.id} style={{ background: "#F9FAFB", borderRadius: 10, padding: "8px 12px", minWidth: 110 }}>
                <div style={{ fontSize: 11, color: "#98A2B3" }}>{p.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1F2937" }}>{p.avg}{p.unit && ` ${p.unit}`}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: "1 1 160px" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: "#98A2B3", marginBottom: 8 }}>TREND</div>
          <Pill tone="ok">Stable overall</Pill>
        </div>
        <div style={{ flex: "1 1 160px" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: "#98A2B3", marginBottom: 8 }}>LARGEST VARIATION</div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#B8730B" }}>{largestVar.label}</div>
        </div>
        <div style={{ flex: "1 1 160px" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: "#98A2B3", marginBottom: 8 }}>MOST STABLE</div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1E8E4E" }}>{mostStable.label}</div>
        </div>
      </div>
    </Card>
  );
}

/* ---------- 4. Parameter detail cards ---------- */
function Sparkline({ values, color }) {
  const w = 140, h = 34;
  const min = Math.min(...values), max = Math.max(...values);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * h}`);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ParameterDetailCard({ p, expanded, onToggle }) {
  const status = p.current < p.safeMin || p.current > p.safeMax ? "warn" : "ok";
  const spark = genSeries(p, 14);
  const trendIcon = p.trend === "up" ? icons.arrowUp : p.trend === "down" ? icons.arrowDown : icons.minus;
  const trendLabel = p.trend === "up" ? "Rising" : p.trend === "down" ? "Falling" : "Stable";
  return (
    <Card style={{ padding: 18, flex: "1 1 260px", minWidth: 240 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon path={p.icon} size={16} color={p.color} />
          <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1F2937" }}>{p.label}</span>
        </div>
        <Pill tone={status}>{status === "ok" ? "Normal" : "Attention"}</Pill>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: "#101828" }}>{p.current}</span>
        {p.unit && <span style={{ fontSize: 12.5, color: "#98A2B3", fontWeight: 600 }}>{p.unit}</span>}
      </div>
      <div style={{ fontSize: 11.5, color: "#98A2B3", marginBottom: 12 }}>Safe range: {p.safeMin} – {p.safeMax} {p.unit}</div>
      <Sparkline values={spark} color={p.color} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: p.trend === "stable" ? "#667085" : p.trend === "up" ? "#B8730B" : "#2563EB" }}>
          <Icon path={trendIcon} size={12} />{trendLabel}
        </div>
        <button onClick={onToggle} style={{ background: "none", border: "none", color: "#2563EB", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
          {expanded ? "Hide details" : "View Details"} <Icon path={expanded ? icons.chevUp : icons.chevDown} size={12} />
        </button>
      </div>
      {expanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #F0F2F5", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            ["Average", `${p.avg} ${p.unit}`], ["Minimum", `${p.min} ${p.unit}`], ["Maximum", `${p.max} ${p.unit}`],
            ["Std. Deviation", `${(Math.abs(p.max - p.min) / 4).toFixed(2)} ${p.unit}`], ["Last Measurement", "11:20 AM"],
            ["Readings", "192"], ["Anomalies", p.trend === "stable" ? "0" : "2"],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 10.5, color: "#98A2B3" }}>{k}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#344054" }}>{v}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ---------- 5. WQI Breakdown ---------- */
function WQIBreakdown() {
  return (
    <Card style={{ padding: 22 }}>
      <SectionTitle sub="87 isn't just a number — here's what's driving it.">Water Quality Index</SectionTitle>
      <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 40, fontWeight: 800, color: "#101828" }}>87</span>
          <span style={{ fontSize: 15, color: "#98A2B3", fontWeight: 600 }}>/100</span>
        </div>
        <Pill tone="ok">Good</Pill>
      </div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#98A2B3", marginBottom: 10 }}>WQI CONTRIBUTION</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {WQI_BREAKDOWN.map((b) => (
          <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 120, fontSize: 12.5, color: "#344054", fontWeight: 600, flexShrink: 0 }}>{b.label}</span>
            <div style={{ flex: 1, height: 8, background: "#EEF1F5", borderRadius: 999 }}>
              <div style={{ width: `${b.pct}%`, height: "100%", borderRadius: 999, background: b.tone === "ok" ? "#22C55E" : "#F0A03D" }} />
            </div>
            <span style={{ width: 70, fontSize: 12, color: "#667085", flexShrink: 0, textAlign: "right" }}>{b.status}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#98A2B3", marginBottom: 10 }}>WHAT'S AFFECTING THE SCORE?</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          ["pH", "ok", "Strong contribution"], ["Turbidity", "ok", "Strong contribution"],
          ["TDS", "ok", "Good"], ["Conductivity", "warn", "Slightly reducing score"],
        ].map(([label, tone, desc]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: tone === "ok" ? "#22C55E" : "#F0A03D", flexShrink: 0 }} />
            <span style={{ fontWeight: 700, color: "#1F2937" }}>{label}</span>
            <span style={{ color: "#98A2B3" }}>— {desc}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------- 6. Source comparison ---------- */
function SourceComparison({ sectionRef }) {
  const [param, setParam] = useState("pH");
  const keyMap = { pH: "ph", Turbidity: "turbidity", TDS: "tds", Temperature: "temperature", Arsenic: "arsenic", Lead: "lead", Iron: "iron" };
  const key = keyMap[param];
  const data = SOURCE_DATA[key] || {};
  const max = Math.max(...Object.values(data)) * 1.15;

  return (
    <Card style={{ padding: 22 }} ref={sectionRef}>
      <SectionTitle
        right={<Select value={param} onChange={setParam} small options={["pH", "Turbidity", "TDS", "Temperature", "Arsenic", "Lead", "Iron"]} />}
      >
        Source Comparison — {param}
      </SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {SOURCES.map((s) => {
          const v = data[s] ?? 0;
          return (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 130, fontSize: 12.5, color: "#344054", fontWeight: 600, flexShrink: 0 }}>{s}</span>
              <div style={{ flex: 1, height: 16, background: "#F5F6F8", borderRadius: 6, position: "relative" }}>
                <div style={{ width: `${(v / max) * 100}%`, height: "100%", borderRadius: 6, background: "#2563EB" }} />
              </div>
              <span style={{ width: 60, fontSize: 12.5, fontWeight: 700, color: "#1F2937", textAlign: "right", flexShrink: 0 }}>{v}</span>
            </div>
          );
        })}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #EEF1F5" }}>
              {["Source", "pH", "Turbidity", "TDS", "Arsenic", "Status"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 8px", fontSize: 11.5, color: "#98A2B3", fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SOURCE_ROWS.map((r) => (
              <tr key={r.source} style={{ borderBottom: "1px solid #F5F6F8" }}>
                <td style={{ padding: "10px 8px", fontSize: 13, color: "#344054", fontWeight: 600 }}>{r.source}</td>
                <td style={{ padding: "10px 8px", fontSize: 13, color: "#344054" }}>{r.ph}</td>
                <td style={{ padding: "10px 8px", fontSize: 13, color: "#344054" }}>{r.turb}</td>
                <td style={{ padding: "10px 8px", fontSize: 13, color: "#344054" }}>{r.tds}</td>
                <td style={{ padding: "10px 8px", fontSize: 13, color: "#344054" }}>{r.arsenic}</td>
                <td style={{ padding: "10px 8px" }}><Pill tone={r.tone}>{r.status}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ---------- 7. AI Insight banner ---------- */
function AIInsight() {
  return (
    <Card style={{ padding: 22, background: "linear-gradient(135deg,#EFF6FF 0%,#F3EEFF 100%)", border: "1px solid #DCEBFF" }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon path={icons.brain} size={18} color="#7C4DFF" />
        </div>
        <div style={{ flex: "1 1 280px", minWidth: 240 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", color: "#6D3FD6", marginBottom: 6 }}>TOYAM INSIGHT</div>
          <p style={{ fontSize: 13.5, color: "#3B3B57", lineHeight: 1.6, margin: 0 }}>
            Turbidity shows intermittent spikes during the selected period, while pH remains stable. The pattern may indicate temporary changes in source-water conditions and requires verification on-site.
          </p>
        </div>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 10.5, color: "#98A2B3", fontWeight: 700 }}>DETECTED PATTERN</div>
            <Pill tone="warn">Turbidity fluctuation</Pill>
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: "#98A2B3", fontWeight: 700 }}>CONFIDENCE</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#1F2937" }}>82%</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(124,77,255,0.15)", fontSize: 12.5, color: "#3B3B57" }}>
        <strong>Suggested investigation:</strong> Check source conditions and recent rainfall or environmental events near the affected inlet.
      </div>
    </Card>
  );
}

/* ---------- 8. Correlation matrix ---------- */
function correlationColor(v) {
  if (v === 1) return "#101828";
  const a = Math.abs(v);
  if (v > 0) return `rgba(37,99,235,${0.15 + a * 0.65})`;
  return `rgba(229,72,77,${0.15 + a * 0.65})`;
}
function correlationDesc(v) {
  const a = Math.abs(v);
  const strength = a >= 0.5 ? "Strong" : a >= 0.2 ? "Moderate" : "Weak";
  const sign = v > 0.05 ? "positive" : v < -0.05 ? "negative" : "negligible";
  return `${strength} ${sign} relationship`;
}
function CorrelationMatrix() {
  const [open, setOpen] = useState(false);
  const [pair, setPair] = useState(null);
  return (
    <Card style={{ padding: 22 }}>
      <SectionTitle
        icon={icons.grid}
        sub="Correlation indicates how two measurements move together. It does not establish causation."
        right={<button onClick={() => setOpen(!open)} style={btnGhost}>{open ? "Collapse" : "Expand"} <Icon path={open ? icons.chevUp : icons.chevDown} size={13} /></button>}
      >
        Parameter Correlation
      </SectionTitle>
      {open && (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", minWidth: 420 }}>
              <thead>
                <tr>
                  <th style={{ width: 70 }} />
                  {CORR_PARAMS.map((c) => <th key={c} style={{ fontSize: 11, color: "#98A2B3", fontWeight: 700, padding: 6 }}>{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {CORR_MATRIX.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontSize: 11.5, color: "#344054", fontWeight: 700, padding: 6 }}>{CORR_PARAMS[i]}</td>
                    {row.map((v, j) => (
                      <td key={j} style={{ padding: 3 }}>
                        <button onClick={() => setPair({ a: CORR_PARAMS[i], b: CORR_PARAMS[j], v })} style={{
                          width: 52, height: 40, background: correlationColor(v), border: "none", borderRadius: 8, cursor: i === j ? "default" : "pointer",
                          color: Math.abs(v) > 0.5 || v === 1 ? "#fff" : "#1F2937", fontSize: 11.5, fontWeight: 700,
                        }}>{v.toFixed(2)}</button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pair && pair.a !== pair.b && (
            <div style={{ marginTop: 16, background: "#F9FAFB", borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1F2937" }}>{pair.a} ↔ {pair.b}</div>
              <div style={{ fontSize: 12.5, color: "#667085", marginTop: 2 }}>Correlation: {pair.v > 0 ? "+" : ""}{pair.v.toFixed(2)} — {correlationDesc(pair.v)}</div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

/* ---------- 9. Historical data table ---------- */
function HistoricalDataTable() {
  const [search, setSearch] = useState("");
  const [srcFilter, setSrcFilter] = useState("All Sources");
  const [paramFilter, setParamFilter] = useState("All Parameters");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = HISTORY_ROWS.filter((r) => {
    if (search && !(`${r.source} ${r.param}`.toLowerCase().includes(search.toLowerCase()))) return false;
    if (srcFilter !== "All Sources" && r.source !== srcFilter) return false;
    if (paramFilter !== "All Parameters" && r.param !== paramFilter) return false;
    if (statusFilter !== "All Status" && (statusFilter === "Normal" ? r.status !== "ok" : r.status !== "warn")) return false;
    return true;
  });
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <Card style={{ padding: 22 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <SectionTitle>Historical Readings</SectionTitle>
        <button style={btnPrimary} onClick={() => downloadCSV("toyam-historical-readings.csv", filtered.map((r) => ({ Timestamp: r.ts, Source: r.source, Parameter: r.param, Value: r.value, Unit: r.unit, Status: r.status === "ok" ? "Normal" : "Attention" })), ["Timestamp", "Source", "Parameter", "Value", "Unit", "Status"])}>
          <Icon path={icons.download} size={14} /> Export CSV
        </button>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #E7EBF0", borderRadius: 9, padding: "8px 12px", flex: "1 1 200px" }}>
          <Icon path={icons.search} size={14} color="#98A2B3" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search source or parameter..." style={{ border: "none", outline: "none", fontSize: 13, flex: 1, minWidth: 0 }} />
        </div>
        <Select small value={srcFilter} onChange={(v) => { setSrcFilter(v); setPage(1); }} options={["All Sources", ...SOURCES]} />
        <Select small value={paramFilter} onChange={(v) => { setParamFilter(v); setPage(1); }} options={["All Parameters", "pH", "Turbidity", "TDS", "Temperature"]} />
        <Select small value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1); }} options={["All Status", "Normal", "Attention"]} />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #EEF1F5" }}>
              {["Timestamp", "Source", "Parameter", "Value", "Unit", "Status"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 10px", fontSize: 11.5, color: "#98A2B3", fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #F5F6F8" }}>
                <td style={{ padding: "10px", fontSize: 12.5, color: "#667085" }}>{r.ts}</td>
                <td style={{ padding: "10px", fontSize: 13, color: "#344054", fontWeight: 500 }}>{r.source}</td>
                <td style={{ padding: "10px", fontSize: 13, color: "#344054" }}>{r.param}</td>
                <td style={{ padding: "10px", fontSize: 13, color: "#344054", fontWeight: 600 }}>{r.value}</td>
                <td style={{ padding: "10px", fontSize: 12.5, color: "#98A2B3" }}>{r.unit || "—"}</td>
                <td style={{ padding: "10px" }}><Pill tone={r.status}>{r.status === "ok" ? "Normal" : "Attention"}</Pill></td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#98A2B3", fontSize: 13 }}>No matching readings.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", gap: 10 }}>
        <span style={{ fontSize: 12, color: "#98A2B3" }}>Showing {pageRows.length} of {filtered.length} readings</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ ...iconBtnStyle, border: "1px solid #E7EBF0", opacity: page === 1 ? 0.4 : 1 }}><Icon path={icons.chevLeft} size={15} color="#344054" /></button>
          {Array.from({ length: pages }, (_, i) => i + 1).slice(0, 5).map((n) => (
            <button key={n} onClick={() => setPage(n)} style={{
              width: 28, height: 28, borderRadius: 7, border: "1px solid " + (page === n ? "#2563EB" : "#E7EBF0"),
              background: page === n ? "#2563EB" : "#fff", color: page === n ? "#fff" : "#344054", fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>{n}</button>
          ))}
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} style={{ ...iconBtnStyle, border: "1px solid #E7EBF0", opacity: page === pages ? 0.4 : 1 }}><Icon path={icons.chevRight} size={15} color="#344054" /></button>
        </div>
      </div>
    </Card>
  );
}

/* ---------- 10. Data quality ---------- */
function DataQuality() {
  return (
    <Card style={{ padding: 22, flex: "1 1 220px" }}>
      <SectionTitle>Data Quality</SectionTitle>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 30, fontWeight: 800, color: "#101828" }}>96.8%</span>
        <Pill tone="ok">Excellent</Pill>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
        {[["Readings received", "1,248 / 1,289"], ["Missing readings", "41"], ["Sensor uptime", "99.4%"]].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
            <span style={{ color: "#98A2B3" }}>{k}</span><span style={{ color: "#344054", fontWeight: 700 }}>{v}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------- 11. Contaminant summary ---------- */
function ContaminantSummary() {
  return (
    <Card style={{ padding: 22 }}>
      <SectionTitle right={<a href="#" style={{ fontSize: 12.5, color: "#2563EB", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>View Contaminant Analysis <Icon path={icons.arrowRight} size={12} /></a>}>
        Contaminant Status
      </SectionTitle>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {CONTAMINANTS.map((c) => (
          <div key={c.id} style={{ background: "#F9FAFB", borderRadius: 12, padding: 14, flex: "1 1 140px", minWidth: 130 }}>
            <div style={{ fontSize: 12, color: "#667085", fontWeight: 600, marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#101828", marginBottom: 6 }}>{c.value} <span style={{ fontSize: 11, color: "#98A2B3", fontWeight: 600 }}>{c.unit}</span></div>
            <Pill tone={c.tone}>{c.status}</Pill>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------- 12. Visual flow (mini pipeline) ---------- */
const MINI_PIPELINE = [
  { label: "Source", icon: icons.beaker, ok: true },
  { label: "Sediment", icon: icons.droplet, ok: true },
  { label: "Carbon", icon: icons.cylinder, ok: true },
  { label: "UF/RO", icon: icons.tubes, ok: true },
  { label: "UV", icon: icons.thermo, ok: true },
  { label: "Clean Water", icon: icons.glass, ok: true },
];
function VisualFlow() {
  return (
    <Card style={{ padding: 20 }}>
      <SectionTitle>From Source To Safe Water</SectionTitle>
      <div style={{ display: "flex", alignItems: "center", overflowX: "auto", gap: 2, paddingBottom: 4 }}>
        {MINI_PIPELINE.map((s, i) => (
          <React.Fragment key={s.label}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 64 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#EFF6FF", border: "1px solid #DCEBFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon path={s.icon} size={16} color="#2563EB" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#475467" }}>{s.label}</span>
                <Icon path={icons.check} size={10} color="#22C55E" />
              </div>
            </div>
            {i < MINI_PIPELINE.length - 1 && <div style={{ flexShrink: 0, padding: "0 2px", marginBottom: 18 }}><Icon path={icons.arrowRight} size={13} color="#D0D5DD" /></div>}
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
}

/* ---------- 13. Diagnostic summary ---------- */
function DiagnosticSummary() {
  return (
    <Card style={{ padding: 22, background: "#F9FAFB" }}>
      <SectionTitle>Water Quality Diagnostic Summary</SectionTitle>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 140px" }}>
          <div style={{ fontSize: 11, color: "#98A2B3", fontWeight: 700, marginBottom: 6 }}>OVERALL</div>
          <Pill tone="ok">Good</Pill>
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <div style={{ fontSize: 11, color: "#98A2B3", fontWeight: 700, marginBottom: 6 }}>STABLE PARAMETERS</div>
          <div style={{ fontSize: 13, color: "#344054" }}>pH · Temperature · TDS</div>
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <div style={{ fontSize: 11, color: "#98A2B3", fontWeight: 700, marginBottom: 6 }}>PARAMETERS TO MONITOR</div>
          <Pill tone="warn">Turbidity</Pill>
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <div style={{ fontSize: 11, color: "#98A2B3", fontWeight: 700, marginBottom: 6 }}>POTENTIAL CONCERN</div>
          <Pill tone="warn">Conductivity</Pill>
        </div>
      </div>
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #EEF1F5", fontSize: 13, color: "#344054" }}>
        <strong>Recommended action:</strong> Continue routine monitoring and inspect the relevant sensor/source if the trend persists.
      </div>
    </Card>
  );
}

/* ---------- App ---------- */
export default function ToyamWaterQuality() {
  const [active, setActive] = useState("quality");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(["ph", "turbidity", "tds"]);
  const [range, setRange] = useState("7D");
  const [moreOpen, setMoreOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const sourceRef = useRef(null);

  const toggleParam = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const toggleExpand = (id) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  return (
    <div style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif", background: "#F6F7F9", minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; }
        .layout { display: flex; min-height: 100vh; }
        .sidebar { width: 232px; background: #0C1830; display: flex; flex-direction: column; flex-shrink: 0; position: sticky; top: 0; height: 100vh; }
        .main { flex: 1; min-width: 0; padding: 20px clamp(16px, 3vw, 32px) 40px; display: flex; flex-direction: column; gap: 16px; }
        .only-mobile { display: none; }
        .sidebar-scrim { display: none; }
        .page-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
        .head-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .detail-grid { display: flex; gap: 16px; flex-wrap: wrap; }
        .row-2 { display: flex; gap: 16px; flex-wrap: wrap; align-items: stretch; }
        .row-2 > * { flex: 1 1 380px; }

        @media (max-width: 980px) {
          .sidebar { position: fixed; left: -260px; top: 0; z-index: 50; transition: left 0.22s ease; }
          .sidebar-open { left: 0; box-shadow: 8px 0 24px rgba(0,0,0,0.25); }
          .only-mobile { display: flex; }
          .sidebar-scrim { display: block !important; }
        }
        @media (max-width: 640px) {
          .main { padding: 16px 14px 32px; }
        }
      `}</style>

      <div className="layout">
        <Sidebar active={active} setActive={setActive} open={open} setOpen={setOpen} />
        <main className="main">
          <TopBar setOpen={setOpen} />

          <div className="page-head">
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#101828", margin: "8px 0 4px" }}>Water Quality</h1>
              <p style={{ fontSize: 14, color: "#667085", margin: 0 }}>Historical monitoring, comparative analysis and diagnostic insights.</p>
            </div>
            <div className="head-actions">
              <button style={btnGhost} onClick={() => downloadCSV("toyam-water-quality-export.csv", HISTORY_ROWS.map((r) => ({ Timestamp: r.ts, Source: r.source, Parameter: r.param, Value: r.value, Unit: r.unit })), ["Timestamp", "Source", "Parameter", "Value", "Unit"])}>
                <Icon path={icons.download} size={14} /> Export Data
              </button>
              <button style={btnPrimary} onClick={() => sourceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>
                <Icon path={icons.compare} size={14} /> Compare Sources
              </button>
            </div>
          </div>

          <ParameterSelector selected={selected} toggle={toggleParam} range={range} setRange={setRange} moreOpen={moreOpen} setMoreOpen={setMoreOpen} />

          <TrendChart selected={selected} range={range} />

          <TrendSummary selected={selected} range={range} />

          <Card style={{ padding: 22 }}>
            <SectionTitle sub="Expand any card for full statistics on that parameter.">Parameter Details</SectionTitle>
            <div className="detail-grid">
              {PARAMS.map((p) => (
                <ParameterDetailCard key={p.id} p={p} expanded={!!expanded[p.id]} onToggle={() => toggleExpand(p.id)} />
              ))}
            </div>
          </Card>

          <WQIBreakdown />

          <SourceComparison sectionRef={sourceRef} />

          <AIInsight />

          <ContaminantSummary />

          <div className="row-2">
            <HistoricalDataTable />
            <DataQuality />
          </div>

          <CorrelationMatrix />

          <VisualFlow />

          <DiagnosticSummary />

          <div style={{ textAlign: "center", fontSize: 12, color: "#98A2B3", marginTop: 8 }}>
            <Icon path={icons.shield} size={12} color="#98A2B3" style={{ marginRight: 5, verticalAlign: "-2px" }} />
            Toyam is committed to providing safe water and creating healthier communities through technology and awareness.
          </div>
        </main>
      </div>
    </div>
  );
}
