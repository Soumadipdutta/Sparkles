import React, { useState, useMemo } from "react";

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
  shieldWarn: <><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" /><path d="M12 8v4M12 15h.01" /></>,
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
  chevLeft: <path d="m15 6-6 6 6 6" />,
  chevRight: <path d="m9 6 6 6-6 6" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
  brain: <path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3.5 3.5 0 0 0 2 6.5 3 3 0 0 0 5.5 1.5V5a3 3 0 0 0-2.5-2Zm6 0a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3.5 3.5 0 0 1-2 6.5 3 3 0 0 1-5.5 1.5V5a3 3 0 0 1 2.5-2Z" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUp: <path d="M12 19V5M5 12l7-7 7 7" />,
  arrowDown: <path d="M12 5v14M5 12l7 7 7-7" />,
  minus: <path d="M5 12h14" />,
  check: <path d="m5 13 4 4L19 7" />,
  info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-5M12 8h.01" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></>,
  map: <><path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3Z" /><path d="M9 3v15M15 6v15" /></>,
  radar: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><path d="M12 3v9l6 3" /></>,
  cylinder: <><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v10c0 1.7 3.1 3 7 3s7-1.3 7-3V5" /></>,
  tubes: <><path d="M8 3v9a3 3 0 0 0 6 0V3" /><path d="M6 3h10" /></>,
  glass: <path d="M8 3h8l-1 15a3 3 0 0 1-6 0L8 3Z" />,
  beaker: <path d="M9 2h6M10 2v6.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 8.5V2" />,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.5" /></>,
  layers: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
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
  <select value={value} onChange={(e) => onChange && onChange(e.target.value)} style={{
    border: "1px solid #E7EBF0", borderRadius: 9, padding: small ? "7px 26px 7px 10px" : "9px 30px 9px 12px",
    fontSize: small ? 12.5 : 13, color: "#344054", background: "#fff", fontWeight: 500, appearance: "none",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2398A2B3' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", cursor: "pointer",
  }}>
    {options.map((o) => <option key={o}>{o}</option>)}
  </select>
);
const iconBtnStyle = { background: "transparent", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex" };
const btnGhost = { display: "flex", alignItems: "center", gap: 7, background: "#fff", border: "1px solid #E7EBF0", color: "#344054", borderRadius: 9, padding: "9px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" };
const btnPrimary = { ...btnGhost, background: "#2563EB", border: "none", color: "#fff" };
const TONE_HEX = { ok: "#22C55E", warn: "#F0A03D", bad: "#E5484D" };

/* ---------- Nav ---------- */
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

/* ---------- Data: thresholds configurable, status derived ---------- */
const THRESHOLDS = {
  arsenic: { safeMax: 0.010, monitorMax: 0.020 },
  lead: { safeMax: 0.010, monitorMax: 0.020 },
  iron: { safeMax: 0.30, monitorMax: 1.00 },
  manganese: { safeMax: 0.10, monitorMax: 0.30 },
  chromium: { safeMax: 0.050, monitorMax: 0.10 },
  nitrate: { safeMax: 45, monitorMax: 60 },
  fluoride: { safeMax: 1.5, monitorMax: 2.0 },
  copper: { safeMax: 1.0, monitorMax: 2.0 },
  zinc: { safeMax: 5.0, monitorMax: 8.0 },
  cadmium: { safeMax: 0.003, monitorMax: 0.006 },
};
function getContaminantStatus(id, value) {
  const t = THRESHOLDS[id];
  if (!t) return "ok";
  if (value > t.monitorMax) return "bad";
  if (value > t.safeMax) return "warn";
  return "ok";
}
function calculateSeverity(id, value) {
  const t = THRESHOLDS[id];
  return t ? value / t.safeMax : 0;
}

const RAW_CONTAMINANTS = [
  { id: "arsenic", name: "Arsenic", symbol: "As", concentration: 0.006, unit: "mg/L", source: "Borewell #1", trend: "stable", changePct: -1.2,
    why: "Arsenic can occur naturally in groundwater and can also enter water from certain human activities. Long-term exposure to elevated concentrations is associated with increased health risk, which is why regular monitoring is important." },
  { id: "lead", name: "Lead", symbol: "Pb", concentration: 0.004, unit: "mg/L", source: "Borewell #1", trend: "stable", changePct: 0.4,
    why: "Lead can enter water through certain plumbing materials and other sources. Elevated exposure is a water-quality concern and should be investigated if concentrations rise." },
  { id: "iron", name: "Iron", symbol: "Fe", concentration: 0.18, unit: "mg/L", source: "Borewell #2", trend: "up", changePct: 8.1,
    why: "Elevated iron can affect taste, color and water-system performance. Its presence can also provide useful information about source-water conditions." },
  { id: "manganese", name: "Manganese", symbol: "Mn", concentration: 0.05, unit: "mg/L", source: "Raw Water Inlet", trend: "up", changePct: 4.6,
    why: "Manganese is a naturally occurring element that may occur in groundwater. Elevated concentrations can affect taste and appearance and warrant continued monitoring." },
  { id: "chromium", name: "Chromium", symbol: "Cr", concentration: 0.006, unit: "mg/L", source: "Storage Tank", trend: "down", changePct: -3.0,
    why: "Chromium is an environmental contaminant whose significance depends on concentration and chemical form. Monitoring helps confirm it remains within reference values." },
  { id: "nitrate", name: "Nitrate", symbol: "NO₃", concentration: 12, unit: "mg/L", source: "Raw Water Inlet", trend: "stable", changePct: 0.8,
    why: "Nitrate can enter groundwater from agricultural runoff and other sources. Elevated levels are a recognized water-quality concern, particularly for infants." },
  { id: "fluoride", name: "Fluoride", symbol: "F", concentration: 0.8, unit: "mg/L", source: "Borewell #2", trend: "stable", changePct: -0.5,
    why: "Fluoride can occur naturally in groundwater. Both low and high concentrations relative to recommended ranges can be relevant to dental and skeletal health over time." },
  { id: "copper", name: "Copper", symbol: "Cu", concentration: 0.22, unit: "mg/L", source: "Storage Tank", trend: "stable", changePct: 1.1,
    why: "Copper commonly enters water through plumbing corrosion. Elevated concentrations can affect taste and, over time, are a water-quality factor worth tracking." },
  { id: "zinc", name: "Zinc", symbol: "Zn", concentration: 1.4, unit: "mg/L", source: "Borewell #1", trend: "stable", changePct: 0.2,
    why: "Zinc is often associated with plumbing materials and industrial sources. It is generally lower-priority but is tracked as part of a complete contaminant profile." },
  { id: "cadmium", name: "Cadmium", symbol: "Cd", concentration: 0.0009, unit: "mg/L", source: "Borewell #2", trend: "stable", changePct: -2.1,
    why: "Cadmium is a trace contaminant that can originate from industrial or environmental sources. It is monitored closely because reference values are set conservatively low." },
].map((c) => ({
  ...c,
  status: getContaminantStatus(c.id, c.concentration),
  reference: THRESHOLDS[c.id].safeMax,
  monitorLimit: THRESHOLDS[c.id].monitorMax,
  severity: calculateSeverity(c.id, c.concentration),
  avg: Math.round(c.concentration * 0.97 * 1000) / 1000,
  min: Math.round(c.concentration * 0.8 * 1000) / 1000,
  max: Math.round(c.concentration * 1.25 * 1000) / 1000,
}));

const STATUS_LABEL = { ok: "Low", warn: "Monitor", bad: "Critical" };

const SOURCES = ["Borewell #1", "Borewell #2", "Raw Water Inlet", "Storage Tank"];
const SOURCE_FLOW = [
  { label: "Borewell #1", status: "ok", note: "Within reference values" },
  { label: "Raw Water Inlet", status: "warn", note: "Manganese & Nitrate — potential source requiring investigation" },
  { label: "Storage Tank", status: "ok", note: "Within reference values" },
  { label: "Clean Water", status: "ok", note: "Treated output" },
];

const EVENTS = [
  { date: "18 May 2026", tone: "warn", title: "Elevated Iron", source: "Borewell #2", peak: "0.32 mg/L", duration: "2h 14m", status: "Resolved" },
  { date: "14 May 2026", tone: "ok", title: "Arsenic Normalized", source: "Borewell #1", peak: "was 0.013 → now 0.007 mg/L", duration: "—", status: "Resolved" },
  { date: "09 May 2026", tone: "warn", title: "Manganese Trending Up", source: "Raw Water Inlet", peak: "0.06 mg/L", duration: "Ongoing", status: "Monitoring" },
  { date: "02 May 2026", tone: "bad", title: "Turbidity-linked Metal Spike", source: "Raw Water Inlet", peak: "0.021 mg/L Arsenic", duration: "4h 40m", status: "Resolved" },
];

const RADAR_AXES = ["arsenic", "lead", "iron", "manganese", "chromium", "nitrate"];
const RADAR_BY_SOURCE = {
  "Borewell #1": { arsenic: 0.006, lead: 0.004, iron: 0.10, manganese: 0.03, chromium: 0.005, nitrate: 9 },
  "Borewell #2": { arsenic: 0.007, lead: 0.005, iron: 0.19, manganese: 0.04, chromium: 0.006, nitrate: 11 },
  "Raw Water Inlet": { arsenic: 0.008, lead: 0.005, iron: 0.24, manganese: 0.06, chromium: 0.007, nitrate: 14 },
  "Storage Tank": { arsenic: 0.006, lead: 0.004, iron: 0.15, manganese: 0.03, chromium: 0.006, nitrate: 10 },
};

const TREATMENT = [
  { contaminant: "Arsenic", relevant: "Treatment depends on chemistry", status: "Review" },
  { contaminant: "Lead", relevant: "Source/plumbing review + appropriate treatment", status: "Review" },
  { contaminant: "Iron", relevant: "Filtration / oxidation depending on conditions", status: "Available" },
  { contaminant: "Manganese", relevant: "Treatment depends on concentration/chemistry", status: "Review" },
  { contaminant: "Chromium", relevant: "Treatment depends on chromium form", status: "Review" },
];

const KNOW_YOUR = [
  { name: "Arsenic", desc: "Naturally occurring element that can be present in groundwater." },
  { name: "Lead", desc: "Can enter water from certain plumbing and environmental sources." },
  { name: "Iron", desc: "Common groundwater constituent that can affect appearance, taste and infrastructure." },
  { name: "Manganese", desc: "Naturally occurring element that may occur in groundwater." },
  { name: "Chromium", desc: "Environmental contaminant whose significance depends on concentration and chemical form." },
];

const RANGE_CONFIG = {
  "24H": { points: 12, labels: ["12AM", "2AM", "4AM", "6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM", "10PM"] },
  "7D": { points: 7, labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  "30D": { points: 10, labels: ["D1", "D4", "D7", "D10", "D13", "D16", "D19", "D22", "D25", "D28"] },
  "90D": { points: 12, labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"] },
};
function genSeries(c, points) {
  const arr = [];
  for (let i = 0; i < points; i++) {
    const wave = Math.sin((i / points) * Math.PI * 2 * 1.2 + c.concentration * 10) * c.concentration * 0.25;
    const drift = c.trend === "up" ? (i / points) * c.concentration * 0.5 : c.trend === "down" ? -(i / points) * c.concentration * 0.35 : 0;
    arr.push(Math.max(0, Math.round((c.concentration + wave + drift) * 10000) / 10000));
  }
  return arr;
}

const LOG_ROWS = (() => {
  const rows = [];
  const times = ["11:20 AM", "11:18 AM", "11:15 AM", "10:50 AM", "10:20 AM", "09:55 AM", "09:30 AM", "09:05 AM"];
  let day = 18;
  for (let d = 0; d < 5; d++) {
    for (let t = 0; t < 8; t++) {
      const c = RAW_CONTAMINANTS[(d + t) % RAW_CONTAMINANTS.length];
      const src = SOURCES[(d + t) % SOURCES.length];
      const val = Math.round((c.concentration + Math.sin(d + t) * c.concentration * 0.15) * 10000) / 10000;
      rows.push({ ts: `${day - d} May ${times[t]}`, source: src, contaminant: c.name, value: val, unit: c.unit, reference: c.reference, status: getContaminantStatus(c.id, val) });
    }
  }
  return rows;
})();

function downloadCSV(filename, rows, headers) {
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => `"${r[h] ?? ""}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

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

/* ---------- 1. Overview ---------- */
function ContaminationOverview({ counts }) {
  const total = RAW_CONTAMINANTS.length;
  const overall = counts.bad > 0 ? "bad" : counts.warn > 0 ? "warn" : "ok";
  const overallLabel = counts.bad > 0 ? "ELEVATED" : counts.warn > 0 ? "MODERATE" : "LOW";
  return (
    <Card style={{ padding: 22 }}>
      <SectionTitle sub={`${counts.warn + counts.bad} / ${total} monitored contaminants currently require attention.`}>Contamination Overview</SectionTitle>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", display: "flex", alignItems: "center", gap: 14, background: "#F9FAFB", borderRadius: 12, padding: 16 }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: TONE_HEX[overall] + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon path={icons.shield} size={20} color={TONE_HEX[overall]} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#98A2B3", fontWeight: 700 }}>OVERALL CONTAMINATION STATUS</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TONE_HEX[overall] }}>{overallLabel}</div>
          </div>
        </div>
        {[
          ["Normal", counts.ok, "ok"], ["Monitor", counts.warn, "warn"], ["Critical", counts.bad, "bad"],
        ].map(([label, val, tone]) => (
          <div key={label} style={{ flex: "1 1 140px", background: "#F9FAFB", borderRadius: 12, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: TONE_HEX[tone] }}>{val}</div>
            <Pill tone={tone}>{label}</Pill>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------- 2. Contaminant grid ---------- */
function ContaminantCard({ c, onOpen }) {
  const trendIcon = c.trend === "up" ? icons.arrowUp : c.trend === "down" ? icons.arrowDown : icons.minus;
  return (
    <button onClick={() => onOpen(c)} style={{
      textAlign: "left", background: "#fff", border: "1px solid #E7EBF0", borderRadius: 14, padding: 16, cursor: "pointer",
      flex: "1 1 190px", minWidth: 180, display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: "#F5F6F8", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800, color: "#475467",
        }}>{c.symbol}</div>
        <Pill tone={c.status}>{STATUS_LABEL[c.status]}</Pill>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>{c.name}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 2 }}>
          <span style={{ fontSize: 19, fontWeight: 800, color: "#101828" }}>{c.concentration}</span>
          <span style={{ fontSize: 11, color: "#98A2B3", fontWeight: 600 }}>{c.unit}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "#98A2B3" }}>
        <span>Ref: {c.reference} {c.unit}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 3, color: c.trend === "up" ? "#B8730B" : c.trend === "down" ? "#2563EB" : "#98A2B3" }}>
          <Icon path={trendIcon} size={11} />{Math.abs(c.changePct)}%
        </span>
      </div>
      <div style={{ fontSize: 10.5, color: "#B0B8C4", display: "flex", alignItems: "center", gap: 4 }}>
        <Icon path={icons.clock} size={10} /> Last measured 11:20 AM
      </div>
    </button>
  );
}
function ContaminantGrid({ onOpen }) {
  return (
    <Card style={{ padding: 22 }}>
      <SectionTitle sub="Click any contaminant for a detailed trend, statistics, and explanation.">Monitored Contaminants</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {RAW_CONTAMINANTS.map((c) => <ContaminantCard key={c.id} c={c} onOpen={onOpen} />)}
      </div>
    </Card>
  );
}

/* ---------- 3. Severity gauge ---------- */
function SeverityGauge({ c }) {
  const t = THRESHOLDS[c.id];
  const scaleMax = t.monitorMax * 1.4;
  const pos = Math.min(100, (c.concentration / scaleMax) * 100);
  const safePct = (t.safeMax / scaleMax) * 100;
  const monitorPct = (t.monitorMax / scaleMax) * 100;
  return (
    <div>
      <div style={{ position: "relative", height: 10, borderRadius: 999, overflow: "hidden", display: "flex" }}>
        <div style={{ width: `${safePct}%`, background: "#22C55E" }} />
        <div style={{ width: `${monitorPct - safePct}%`, background: "#F0A03D" }} />
        <div style={{ width: `${100 - monitorPct}%`, background: "#E5484D" }} />
      </div>
      <div style={{ position: "relative", height: 18 }}>
        <div style={{ position: "absolute", left: `calc(${pos}% - 5px)`, top: -22 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#101828", border: "2px solid #fff", boxShadow: "0 0 0 1px #101828" }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#98A2B3", marginTop: 2 }}>
        <span>Safe</span><span>Reference</span><span>High concern</span>
      </div>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: "#1F2937", marginTop: 4 }}>{c.concentration} {c.unit}</div>
    </div>
  );
}

/* ---------- 4. Detail drawer ---------- */
function ContaminantDrawer({ c, onClose }) {
  if (!c) return null;
  const spark = genSeries(c, 14);
  const min = Math.min(...spark), max = Math.max(...spark);
  const w = 260, h = 60;
  const pts = spark.map((v, i) => `${(i / (spark.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * h}`);
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(10,15,25,0.35)", zIndex: 60 }} />
      <div style={{
        position: "fixed", top: 0, right: 0, height: "100vh", width: "min(420px, 100vw)", background: "#fff", zIndex: 61,
        boxShadow: "-8px 0 30px rgba(0,0,0,0.15)", overflowY: "auto", padding: 24,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F5F6F8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#475467" }}>{c.symbol}</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#101828" }}>{c.name}</div>
              <Pill tone={c.status}>{STATUS_LABEL[c.status]}</Pill>
            </div>
          </div>
          <button onClick={onClose} style={iconBtnStyle}><Icon path={icons.x} size={18} color="#667085" /></button>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 30, fontWeight: 800, color: "#101828" }}>{c.concentration}</span>
          <span style={{ fontSize: 13, color: "#98A2B3", fontWeight: 600 }}>{c.unit}</span>
        </div>
        <div style={{ fontSize: 12.5, color: "#667085", marginBottom: 18 }}>Reference: {c.reference} {c.unit} · {c.status === "ok" ? "within configured reference value" : c.status === "warn" ? "approaching configured limit" : "above configured limit"}</div>

        <div style={{ fontSize: 11, fontWeight: 700, color: "#98A2B3", marginBottom: 8 }}>SEVERITY</div>
        <div style={{ marginBottom: 20 }}><SeverityGauge c={c} /></div>

        <div style={{ fontSize: 11, fontWeight: 700, color: "#98A2B3", marginBottom: 8 }}>30-DAY TREND</div>
        <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} style={{ marginBottom: 18 }}>
          <polyline points={pts.join(" ")} fill="none" stroke={c.status === "ok" ? "#22C55E" : c.status === "warn" ? "#F0A03D" : "#E5484D"} strokeWidth="2" />
        </svg>

        <div style={{ fontSize: 11, fontWeight: 700, color: "#98A2B3", marginBottom: 8 }}>STATISTICS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[["Average", `${c.avg} ${c.unit}`], ["Minimum", `${c.min} ${c.unit}`], ["Maximum", `${c.max} ${c.unit}`], ["Source", c.source]].map(([k, v]) => (
            <div key={k}><div style={{ fontSize: 10.5, color: "#98A2B3" }}>{k}</div><div style={{ fontSize: 13, fontWeight: 700, color: "#344054" }}>{v}</div></div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", background: "#F9FAFB", borderRadius: 10, padding: 12, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10.5, color: "#98A2B3" }}>Last detected</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#344054" }}>Today, 11:20 AM</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10.5, color: "#98A2B3" }}>Change</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: c.changePct < 0 ? "#1E8E4E" : "#B8730B" }}>
              {c.changePct < 0 ? "↓" : "↑"} {Math.abs(c.changePct)}% from previous reading
            </div>
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: "#98A2B3", marginBottom: 8 }}>WHY MONITOR THIS?</div>
        <p style={{ fontSize: 12.5, color: "#475467", lineHeight: 1.6, margin: "0 0 20px" }}>{c.why}</p>

        <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#2563EB", fontWeight: 700, textDecoration: "none" }}>
          View Treatment Options <Icon path={icons.arrowRight} size={12} />
        </a>
      </div>
    </>
  );
}

/* ---------- 5. Source contamination map ---------- */
function SourceMap() {
  return (
    <Card style={{ padding: 22 }}>
      <SectionTitle icon={icons.map} sub="Sources are grouped by flow. Highlighted stages indicate a potential source requiring investigation — not a confirmed cause.">Where Is Contamination Detected?</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        {SOURCE_FLOW.map((s, i) => (
          <React.Fragment key={s.label}>
            <div style={{
              display: "flex", alignItems: "center", gap: 12, width: "100%", maxWidth: 380,
              background: s.status === "warn" ? "#FEF9F0" : "#F9FAFB", border: "1px solid " + (s.status === "warn" ? "#F5DFAE" : "#EEF1F5"),
              borderRadius: 12, padding: "12px 16px",
            }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: TONE_HEX[s.status] + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon path={i === SOURCE_FLOW.length - 1 ? icons.glass : icons.cylinder} size={16} color={TONE_HEX[s.status]} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1F2937" }}>{s.label}</span>
                  <Pill tone={s.status}>{s.status === "ok" ? "Safe" : "Monitor"}</Pill>
                </div>
                <div style={{ fontSize: 11.5, color: "#98A2B3", marginTop: 2 }}>{s.note}</div>
              </div>
            </div>
            {i < SOURCE_FLOW.length - 1 && <Icon path={icons.arrowDown} size={16} color="#D0D5DD" />}
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
}

/* ---------- 6. Distribution donut ---------- */
function Donut({ data, total }) {
  const size = 140, r = 50, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EEF1F5" strokeWidth="15" />
      {data.map((d, i) => {
        if (d.pct === 0) return null;
        const len = (d.pct / 100) * circ;
        const rotate = (acc / 100) * 360 - 90;
        acc += d.pct;
        return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth="15" strokeDasharray={`${len} ${circ - len}`} transform={`rotate(${rotate} ${cx} ${cy})`} />;
      })}
      <text x={cx} y={cy - 3} textAnchor="middle" fontSize="22" fontWeight="800" fill="#101828">{total}</text>
      <text x={cx} y={cy + 15} textAnchor="middle" fontSize="10" fill="#98A2B3" fontWeight="600">Monitored</text>
    </svg>
  );
}
function ContaminantDistribution({ counts }) {
  const total = RAW_CONTAMINANTS.length;
  const data = [
    { label: "Normal", pct: Math.round((counts.ok / total) * 100), color: "#22C55E" },
    { label: "Monitor", pct: Math.round((counts.warn / total) * 100), color: "#F0A03D" },
    { label: "Critical", pct: Math.round((counts.bad / total) * 100), color: "#E5484D" },
  ];
  return (
    <Card style={{ padding: 22, flex: "1 1 300px" }}>
      <SectionTitle>Contaminant Distribution</SectionTitle>
      <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        <Donut data={data} total={total} />
        <div style={{ flex: 1, minWidth: 140, display: "flex", flexDirection: "column", gap: 10 }}>
          {data.map((d) => (
            <div key={d.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, color: "#344054", fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: d.color }} />{d.label}
              </span>
              <span style={{ color: "#667085" }}>{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ---------- 7. Priority contaminants ---------- */
function PriorityContaminants() {
  const ranked = [...RAW_CONTAMINANTS].sort((a, b) => b.severity - a.severity).slice(0, 5);
  return (
    <Card style={{ padding: 22, flex: "1 1 340px" }}>
      <SectionTitle sub="Ranked by concentration relative to configured reference values.">Priority Contaminants</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {ranked.map((c, i) => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 4px", borderBottom: i < ranked.length - 1 ? "1px solid #F5F6F8" : "none" }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#C6D0DD", width: 22 }}>{String(i + 1).padStart(2, "0")}</span>
            <div style={{
              width: 30, height: 30, borderRadius: 8, background: "#F5F6F8", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, color: "#475467", flexShrink: 0,
            }}>{c.symbol}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>{c.name}</div>
              <div style={{ fontSize: 11.5, color: "#98A2B3" }}>{c.concentration} {c.unit}</div>
            </div>
            <Pill tone={c.status}>{STATUS_LABEL[c.status]}</Pill>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------- 8. Contamination trend ---------- */
function ContaminationTrend() {
  const [sel, setSel] = useState(["iron", "manganese"]);
  const [range, setRange] = useState("7D");
  const cfg = RANGE_CONFIG[range];
  const active = RAW_CONTAMINANTS.filter((c) => sel.includes(c.id));
  const w = 720, h = 240, padL = 20, padR = 20, padT = 16, padB = 26;
  const innerW = w - padL - padR, innerH = h - padT - padB;
  const xStep = innerW / (cfg.points - 1);
  const maxVal = Math.max(...active.map((c) => Math.max(c.monitorLimit, ...genSeries(c, cfg.points))), 0.01) * 1.1;
  const y = (v) => padT + innerH - (v / maxVal) * innerH;

  return (
    <Card style={{ padding: 22 }}>
      <SectionTitle sub="Focused only on contaminants — with reference threshold lines.">Contamination Trend</SectionTitle>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {RAW_CONTAMINANTS.slice(0, 7).map((c) => {
            const isSel = sel.includes(c.id);
            return (
              <button key={c.id} onClick={() => setSel((s) => s.includes(c.id) ? s.filter((x) => x !== c.id) : [...s, c.id])} style={{
                border: "1px solid " + (isSel ? "#2563EB" : "#E7EBF0"), background: isSel ? "#2563EB" : "#fff", color: isSel ? "#fff" : "#344054",
                borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>{c.name}</button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 4, background: "#F5F6F8", borderRadius: 8, padding: 3, height: "fit-content" }}>
          {Object.keys(RANGE_CONFIG).map((r) => (
            <button key={r} onClick={() => setRange(r)} style={{
              border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 6,
              background: range === r ? "#101828" : "transparent", color: range === r ? "#fff" : "#667085",
            }}>{r}</button>
          ))}
        </div>
      </div>
      {active.length === 0 ? (
        <div style={{ padding: "30px 0", textAlign: "center", color: "#98A2B3", fontSize: 13 }}>Select a contaminant to view its trend.</div>
      ) : (
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto" }}>
          {[0, 0.25, 0.5, 0.75, 1].map((f) => <line key={f} x1={padL} x2={w - padR} y1={padT + f * innerH} y2={padT + f * innerH} stroke="#F0F2F5" strokeWidth="1" />)}
          {active.map((c) => (
            <line key={c.id + "lim"} x1={padL} x2={w - padR} y1={y(c.reference)} y2={y(c.reference)} stroke={c.status === "ok" ? "#22C55E" : c.status === "warn" ? "#F0A03D" : "#E5484D"} strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
          ))}
          {active.map((c) => {
            const vals = genSeries(c, cfg.points);
            const color = c.status === "ok" ? "#22C55E" : c.status === "warn" ? "#F0A03D" : "#E5484D";
            return <path key={c.id} d={vals.map((v, i) => `${i === 0 ? "M" : "L"} ${padL + i * xStep} ${y(v)}`).join(" ")} fill="none" stroke={color} strokeWidth="2.25" />;
          })}
          {cfg.labels.map((l, i) => <text key={l} x={padL + i * xStep} y={h - 6} fontSize="9.5" fill="#98A2B3" textAnchor="middle">{l}</text>)}
        </svg>
      )}
      <div style={{ fontSize: 11, color: "#98A2B3", marginTop: 6 }}>Dashed lines = configured reference threshold for each selected contaminant.</div>
    </Card>
  );
}

/* ---------- 9. Contamination events ---------- */
function ContaminationEvents() {
  return (
    <Card style={{ padding: 22 }}>
      <SectionTitle sub="Historical contamination incidents — distinct from live Alerts.">Contamination Events</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {EVENTS.map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 14, padding: "12px 4px", borderBottom: i < EVENTS.length - 1 ? "1px solid #F5F6F8" : "none", flexWrap: "wrap" }}>
            <div style={{ width: 90, flexShrink: 0, fontSize: 12, color: "#98A2B3", fontWeight: 600 }}>{e.date}</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: TONE_HEX[e.tone] }} />
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1F2937" }}>{e.title}</span>
              </div>
              <div style={{ fontSize: 12, color: "#98A2B3", marginTop: 2 }}>{e.source} · Peak {e.peak}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 11.5, color: "#98A2B3" }}>Duration: {e.duration}</div>
              <Pill tone={e.status === "Resolved" ? "ok" : "warn"}>{e.status}</Pill>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------- 10. Radar profile ---------- */
function RadarProfile() {
  const [source, setSource] = useState("Borewell #1");
  const data = RADAR_BY_SOURCE[source];
  const size = 260, cx = size / 2, cy = size / 2, R = 90;
  const n = RADAR_AXES.length;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const normVal = (id) => {
    const t = THRESHOLDS[id];
    return Math.min(1, data[id] / (t.monitorMax * 1.3));
  };
  const points = RADAR_AXES.map((id, i) => {
    const r = normVal(id) * R;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  });
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <Card style={{ padding: 22, flex: "1 1 340px" }}>
      <SectionTitle icon={icons.radar} right={<Select small value={source} onChange={setSource} options={SOURCES} />}>Water Contamination Profile</SectionTitle>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {gridLevels.map((lvl) => (
            <polygon key={lvl} points={RADAR_AXES.map((_, i) => `${cx + lvl * R * Math.cos(angle(i))},${cy + lvl * R * Math.sin(angle(i))}`).join(" ")} fill="none" stroke="#EEF1F5" strokeWidth="1" />
          ))}
          {RADAR_AXES.map((id, i) => (
            <line key={id} x1={cx} y1={cy} x2={cx + R * Math.cos(angle(i))} y2={cy + R * Math.sin(angle(i))} stroke="#EEF1F5" strokeWidth="1" />
          ))}
          <polygon points={points.map((p) => p.join(",")).join(" ")} fill="rgba(37,99,235,0.18)" stroke="#2563EB" strokeWidth="2" />
          {points.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#2563EB" />)}
          {RADAR_AXES.map((id, i) => {
            const lx = cx + (R + 20) * Math.cos(angle(i));
            const ly = cy + (R + 20) * Math.sin(angle(i));
            return <text key={id} x={lx} y={ly} fontSize="10.5" fontWeight="700" fill="#475467" textAnchor="middle">{RAW_CONTAMINANTS.find((c) => c.id === id).symbol}</text>;
          })}
        </svg>
      </div>
      <div style={{ fontSize: 11.5, color: "#98A2B3", textAlign: "center", marginTop: 6 }}>Normalized against each contaminant's configured monitor threshold.</div>
    </Card>
  );
}

/* ---------- 11. Risk engine ---------- */
function RiskEngine({ counts }) {
  const overall = counts.bad > 0 ? "bad" : counts.warn > 0 ? "warn" : "ok";
  return (
    <Card style={{ padding: 22, flex: "1 1 300px" }}>
      <SectionTitle sub="A water-quality risk indicator — not a prediction of any individual's health outcome.">Contamination Risk</SectionTitle>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 11, color: "#98A2B3", fontWeight: 700 }}>CURRENT RISK</span>
        <Pill tone={overall}>{overall === "ok" ? "Low" : overall === "warn" ? "Moderate" : "High"}</Pill>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {[["Arsenic", "ok", "Low"], ["Heavy Metals", "warn", "Moderate"], ["Overall", overall, overall === "ok" ? "Low" : "Moderate"]].map(([label, tone, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
            <span style={{ color: "#344054", fontWeight: 600 }}>{label}</span>
            <Pill tone={tone}>{val}</Pill>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#98A2B3", marginBottom: 8 }}>RISK FACTORS</div>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "#475467", lineHeight: 1.9 }}>
        <li>{counts.bad} critical contaminants</li>
        <li>{counts.warn} contaminants requiring monitoring</li>
        <li>No recent major threshold crossings</li>
      </ul>
    </Card>
  );
}

/* ---------- 12. AI insight ---------- */
function AIInsight() {
  return (
    <Card style={{ padding: 22, background: "linear-gradient(135deg,#EFF6FF 0%,#F3EEFF 100%)", border: "1px solid #DCEBFF" }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon path={icons.brain} size={18} color="#7C4DFF" />
        </div>
        <div style={{ flex: "1 1 280px", minWidth: 240 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", color: "#6D3FD6" }}>TOYAM CONTAMINATION INTELLIGENCE</span>
            <Pill tone="purple">AI-assisted / rule-based insight</Pill>
          </div>
          <p style={{ fontSize: 13.5, color: "#3B3B57", lineHeight: 1.6, margin: 0 }}>
            Iron is currently the highest-priority contaminant for monitoring. Its concentration has increased over the last 7 days, while arsenic and lead remain below their configured reference values.
          </p>
        </div>
        <div>
          <div style={{ fontSize: 10.5, color: "#98A2B3", fontWeight: 700 }}>CONFIDENCE</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#1F2937" }}>84%</div>
        </div>
      </div>
      <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(124,77,255,0.15)", fontSize: 12.5, color: "#3B3B57" }}>
        <strong>Suggested investigation:</strong> Continue monitoring the affected source and inspect source-water and treatment conditions if the upward trend persists.
      </div>
    </Card>
  );
}

/* ---------- 13. If contamination increases ---------- */
function ResponsePlan() {
  const [open, setOpen] = useState(true);
  const steps = [
    ["Verify", "Confirm the measurement using appropriate laboratory testing."],
    ["Investigate", "Check the affected water source and recent system conditions."],
    ["Treat", "Evaluate a treatment method specifically appropriate for the contaminant."],
    ["Notify", "If confirmed, notify the responsible water-system administrator."],
    ["Monitor", "Continue testing after intervention."],
  ];
  return (
    <Card style={{ padding: 22 }}>
      <SectionTitle right={<button onClick={() => setOpen(!open)} style={btnGhost}>{open ? "Collapse" : "Expand"}<Icon path={open ? icons.chevUp : icons.chevDown} size={13} /></button>}>
        If Contamination Increases
      </SectionTitle>
      {open && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#FDECEC", borderRadius: 12, padding: 14, marginBottom: 18, flexWrap: "wrap" }}>
            <Icon path={icons.shieldWarn} size={20} color="#C43B3B" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#C43B3B" }}>Example: Elevated Arsenic</div>
              <div style={{ fontSize: 12, color: "#8A3A3A" }}>Measured: 0.018 mg/L · Reference: 0.010 mg/L</div>
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#98A2B3", marginBottom: 10 }}>RECOMMENDED RESPONSE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {steps.map(([title, body], i) => (
              <div key={title} style={{ display: "flex", gap: 12 }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#EFF6FF", color: "#2563EB", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>{title}</div>
                  <div style={{ fontSize: 12.5, color: "#667085" }}>{body}</div>
                </div>
              </div>
            ))}
          </div>
          <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#2563EB", fontWeight: 700, textDecoration: "none", marginTop: 16 }}>
            View Treatment Options <Icon path={icons.arrowRight} size={13} />
          </a>
        </>
      )}
    </Card>
  );
}

/* ---------- 14. Treatment relevance ---------- */
function TreatmentRelevance() {
  return (
    <Card style={{ padding: 22 }}>
      <SectionTitle sub="Treatment suitability depends on contaminant concentration, chemical form, source-water characteristics and system design.">Treatment Relevance</SectionTitle>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #EEF1F5" }}>
              {["Contaminant", "Relevant Treatment", "Status"].map((h) => <th key={h} style={{ textAlign: "left", padding: "10px 8px", fontSize: 11.5, color: "#98A2B3", fontWeight: 700 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {TREATMENT.map((t) => (
              <tr key={t.contaminant} style={{ borderBottom: "1px solid #F5F6F8" }}>
                <td style={{ padding: "10px 8px", fontSize: 13, fontWeight: 600, color: "#344054" }}>{t.contaminant}</td>
                <td style={{ padding: "10px 8px", fontSize: 12.5, color: "#667085" }}>{t.relevant}</td>
                <td style={{ padding: "10px 8px" }}><Pill tone={t.status === "Available" ? "ok" : "info"}>{t.status}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#2563EB", fontWeight: 700, textDecoration: "none", marginTop: 16 }}>
        Open Purification <Icon path={icons.arrowRight} size={13} />
      </a>
    </Card>
  );
}

/* ---------- 15. Data log table ---------- */
function DataLog() {
  const [search, setSearch] = useState("");
  const [contamFilter, setContamFilter] = useState("All Contaminants");
  const [srcFilter, setSrcFilter] = useState("All Sources");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = LOG_ROWS.filter((r) => {
    if (search && !(`${r.source} ${r.contaminant}`.toLowerCase().includes(search.toLowerCase()))) return false;
    if (contamFilter !== "All Contaminants" && r.contaminant !== contamFilter) return false;
    if (srcFilter !== "All Sources" && r.source !== srcFilter) return false;
    if (statusFilter !== "All Status" && STATUS_LABEL[r.status] !== statusFilter) return false;
    return true;
  });
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <Card style={{ padding: 22 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <SectionTitle>Contaminant Data Log</SectionTitle>
        <button style={btnPrimary} onClick={() => downloadCSV("toyam-contaminant-log.csv", filtered.map((r) => ({ Timestamp: r.ts, Source: r.source, Contaminant: r.contaminant, Concentration: r.value, Unit: r.unit, Reference: r.reference, Status: STATUS_LABEL[r.status] })), ["Timestamp", "Source", "Contaminant", "Concentration", "Unit", "Reference", "Status"])}>
          <Icon path={icons.download} size={14} /> Export CSV
        </button>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #E7EBF0", borderRadius: 9, padding: "8px 12px", flex: "1 1 200px" }}>
          <Icon path={icons.search} size={14} color="#98A2B3" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search source or contaminant..." style={{ border: "none", outline: "none", fontSize: 13, flex: 1, minWidth: 0 }} />
        </div>
        <Select small value={contamFilter} onChange={(v) => { setContamFilter(v); setPage(1); }} options={["All Contaminants", ...RAW_CONTAMINANTS.map((c) => c.name)]} />
        <Select small value={srcFilter} onChange={(v) => { setSrcFilter(v); setPage(1); }} options={["All Sources", ...SOURCES]} />
        <Select small value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1); }} options={["All Status", "Low", "Monitor", "Critical"]} />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #EEF1F5" }}>
              {["Timestamp", "Source", "Contaminant", "Concentration", "Reference", "Status"].map((h) => <th key={h} style={{ textAlign: "left", padding: "10px", fontSize: 11.5, color: "#98A2B3", fontWeight: 700 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #F5F6F8" }}>
                <td style={{ padding: "10px", fontSize: 12.5, color: "#667085" }}>{r.ts}</td>
                <td style={{ padding: "10px", fontSize: 13, color: "#344054", fontWeight: 500 }}>{r.source}</td>
                <td style={{ padding: "10px", fontSize: 13, color: "#344054" }}>{r.contaminant}</td>
                <td style={{ padding: "10px", fontSize: 13, color: "#344054", fontWeight: 600 }}>{r.value} {r.unit}</td>
                <td style={{ padding: "10px", fontSize: 12.5, color: "#98A2B3" }}>{r.reference}</td>
                <td style={{ padding: "10px" }}><Pill tone={r.status}>{STATUS_LABEL[r.status]}</Pill></td>
              </tr>
            ))}
            {pageRows.length === 0 && <tr><td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#98A2B3", fontSize: 13 }}>No matching readings.</td></tr>}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", gap: 10 }}>
        <span style={{ fontSize: 12, color: "#98A2B3" }}>Showing {pageRows.length} of {filtered.length} readings</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ ...iconBtnStyle, border: "1px solid #E7EBF0", opacity: page === 1 ? 0.4 : 1 }}><Icon path={icons.chevLeft} size={15} color="#344054" /></button>
          {Array.from({ length: pages }, (_, i) => i + 1).slice(0, 5).map((n) => (
            <button key={n} onClick={() => setPage(n)} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid " + (page === n ? "#2563EB" : "#E7EBF0"), background: page === n ? "#2563EB" : "#fff", color: page === n ? "#fff" : "#344054", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{n}</button>
          ))}
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} style={{ ...iconBtnStyle, border: "1px solid #E7EBF0", opacity: page === pages ? 0.4 : 1 }}><Icon path={icons.chevRight} size={15} color="#344054" /></button>
        </div>
      </div>
    </Card>
  );
}

/* ---------- 16. Know your contaminants ---------- */
function KnowYourContaminants() {
  return (
    <Card style={{ padding: 22 }}>
      <SectionTitle>Know Your Contaminants</SectionTitle>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {KNOW_YOUR.map((k) => (
          <div key={k.name} style={{ flex: "1 1 190px", minWidth: 180, background: "#F9FAFB", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1F2937", marginBottom: 6 }}>{k.name}</div>
            <p style={{ fontSize: 12, color: "#667085", lineHeight: 1.5, margin: "0 0 10px" }}>{k.desc}</p>
            <a href="#" style={{ fontSize: 12, color: "#2563EB", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
              Learn More <Icon path={icons.arrowRight} size={11} />
            </a>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------- 17. Cross-page connections ---------- */
function CrossLinks() {
  const links = [
    ["View Treatment", icons.drop], ["View Active Alerts", icons.bell],
    ["Understand the Risk", icons.shield], ["Generate Contamination Report", icons.file], ["View Historical Trend", icons.chart],
  ];
  return (
    <Card style={{ padding: 18 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {links.map(([label, icon]) => (
          <a key={label} href="#" style={{ ...btnGhost, textDecoration: "none" }}>
            <Icon path={icon} size={14} color="#2563EB" />{label}
          </a>
        ))}
      </div>
    </Card>
  );
}

/* ---------- App ---------- */
export default function ToyamContaminants() {
  const [active, setActive] = useState("contaminants");
  const [open, setOpen] = useState(false);
  const [drawer, setDrawer] = useState(null);

  const counts = useMemo(() => ({
    ok: RAW_CONTAMINANTS.filter((c) => c.status === "ok").length,
    warn: RAW_CONTAMINANTS.filter((c) => c.status === "warn").length,
    bad: RAW_CONTAMINANTS.filter((c) => c.status === "bad").length,
  }), []);

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
        .row-2 { display: flex; gap: 16px; flex-wrap: wrap; align-items: stretch; }

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
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#101828", margin: "8px 0 4px" }}>Contaminants</h1>
              <p style={{ fontSize: 14, color: "#667085", margin: 0 }}>Detect, analyze and monitor potentially harmful substances in water.</p>
            </div>
            <div className="head-actions">
              <button style={btnGhost} onClick={() => downloadCSV("toyam-contaminant-export.csv", RAW_CONTAMINANTS.map((c) => ({ Name: c.name, Symbol: c.symbol, Concentration: c.concentration, Unit: c.unit, Reference: c.reference, Status: STATUS_LABEL[c.status], Source: c.source })), ["Name", "Symbol", "Concentration", "Unit", "Reference", "Status", "Source"])}>
                <Icon path={icons.download} size={14} /> Export Contaminant Data
              </button>
              <button style={btnPrimary}><Icon path={icons.compare} size={14} /> Compare Sources</button>
            </div>
          </div>

          <ContaminationOverview counts={counts} />

          <ContaminantGrid onOpen={setDrawer} />

          <SourceMap />

          <div className="row-2">
            <ContaminantDistribution counts={counts} />
            <PriorityContaminants />
          </div>

          <ContaminationTrend />

          <ContaminationEvents />

          <div className="row-2">
            <RadarProfile />
            <RiskEngine counts={counts} />
          </div>

          <AIInsight />

          <ResponsePlan />

          <TreatmentRelevance />

          <DataLog />

          <KnowYourContaminants />

          <CrossLinks />

          <div style={{ textAlign: "center", fontSize: 12, color: "#98A2B3", marginTop: 8 }}>
            <Icon path={icons.shield} size={12} color="#98A2B3" style={{ marginRight: 5, verticalAlign: "-2px" }} />
            Toyam is committed to providing safe water and creating healthier communities through technology and awareness.
          </div>
        </main>
      </div>

      <ContaminantDrawer c={drawer} onClose={() => setDrawer(null)} />
    </div>
  );
}
