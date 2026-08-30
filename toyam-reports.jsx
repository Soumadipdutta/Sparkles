import React, { useState } from "react";

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

/* ---------- Small building blocks ---------- */
const Card = ({ children, style, ...p }) => (
  <div style={{ background: "#fff", border: "1px solid #E7EBF0", borderRadius: 16, boxShadow: "0 1px 2px rgba(16,24,40,0.04)", ...style }} {...p}>
    {children}
  </div>
);

const Pill = ({ tone = "ok", children }) => {
  const map = {
    ok: { bg: "#EAF7EE", fg: "#1E8E4E", dot: "#22B15C" },
    warn: { bg: "#FEF4E6", fg: "#B8730B", dot: "#F0A03D" },
    bad: { bg: "#FDECEC", fg: "#C43B3B", dot: "#E5484D" },
  }[tone];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: map.bg, color: map.fg, fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 999 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: map.dot }} />
      {children}
    </span>
  );
};

const SectionTitle = ({ children, right }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
    <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#1F2937", margin: 0 }}>{children}</h2>
    {right}
  </div>
);

const Select = ({ value, options, style }) => (
  <select
    defaultValue={value}
    style={{
      width: "100%", border: "1px solid #E7EBF0", borderRadius: 9, padding: "9px 12px",
      fontSize: 13.5, color: "#344054", background: "#fff", fontWeight: 500, appearance: "none",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2398A2B3' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", cursor: "pointer", ...style,
    }}
  >
    {options.map((o) => <option key={o}>{o}</option>)}
  </select>
);

const FieldLabel = ({ children }) => (
  <label style={{ fontSize: 12, fontWeight: 600, color: "#667085", marginBottom: 6, display: "block" }}>{children}</label>
);

const iconBtnStyle = { background: "transparent", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex" };

/* ---------- Data ---------- */
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

const KPIS = [
  { label: "Overall Water Safety Score", value: "87", unit: "/100", sub: "Safe", subTone: "ok", delta: "3 points from previous period", up: true, icon: icons.shield, bg: "#EAF7EE", fg: "#22C55E" },
  { label: "Tests Conducted", value: "96", sub: "Across all parameters", delta: "12% from previous period", up: true, icon: icons.flaskFill, bg: "#EFF6FF", fg: "#2563EB" },
  { label: "Alerts Triggered", value: "2", sub: "1 Warning, 1 Info", delta: "33% from previous period", up: false, icon: icons.warning, bg: "#FEF4E6", fg: "#E08A2E" },
  { label: "Data Uptime", value: "99.6", unit: "%", sub: "Excellent", subTone: "ok", delta: "0.4% from previous period", up: true, icon: icons.drop, bg: "#F3EEFF", fg: "#7C4DFF" },
];

const CONTAMINANTS = [
  { name: "Arsenic (As)", avg: "0.006", max: "0.009", ref: "0.010", status: "Low", tone: "ok" },
  { name: "Lead (Pb)", avg: "0.004", max: "0.006", ref: "0.010", status: "Low", tone: "ok" },
  { name: "Iron (Fe)", avg: "0.18", max: "0.24", ref: "0.30", status: "Low", tone: "ok" },
  { name: "Manganese (Mn)", avg: "0.05", max: "0.08", ref: "0.10", status: "Monitor", tone: "warn" },
  { name: "Chromium (Cr)", avg: "0.006", max: "0.009", ref: "0.050", status: "Low", tone: "ok" },
];

const TREND_POINTS = [
  { d: "12 May", ph: 7.2, turb: 2.1, tds: 480, temp: 27 },
  { d: "13 May", ph: 7.3, turb: 1.8, tds: 470, temp: 27.4 },
  { d: "14 May", ph: 7.1, turb: 2.3, tds: 490, temp: 27.1 },
  { d: "15 May", ph: 7.2, turb: 2.0, tds: 485, temp: 27.6 },
  { d: "16 May", ph: 7.2, turb: 2.2, tds: 475, temp: 27.3 },
  { d: "17 May", ph: 7.4, turb: 1.9, tds: 500, temp: 27.8 },
  { d: "18 May", ph: 7.2, turb: 2.1, tds: 480, temp: 27.4 },
];

const HEATMAP_ROWS = [
  { param: "pH", unit: "", values: [7.2, 7.3, 7.1, 7.2, 7.2, 7.4, 7.2], tone: (v) => v >= 6.5 && v <= 8.5 ? "good" : "poor" },
  { param: "Turbidity (NTU)", unit: "", values: [2.1, 1.8, 2.3, 2.0, 2.2, 1.9, 2.1], tone: (v) => v < 5 ? "good" : v < 10 ? "monitor" : "poor" },
  { param: "TDS (ppm)", unit: "", values: [480, 470, 490, 485, 475, 500, 480], tone: (v) => v < 600 ? "good" : "monitor" },
  { param: "Arsenic (mg/L)", unit: "", values: [0.006, 0.007, 0.006, 0.006, 0.007, 0.008, 0.006], tone: (v) => v < 0.01 ? "good" : "monitor" },
  { param: "Lead (mg/L)", unit: "", values: [0.004, 0.003, 0.004, 0.004, 0.005, 0.004, 0.004], tone: (v) => v < 0.01 ? "good" : "monitor" },
];
const HEATMAP_DATES = ["12 May", "13 May", "14 May", "15 May", "16 May", "17 May", "18 May"];
const TONE_COLORS = { good: "#DDF3E4", monitor: "#FCEBC7", poor: "#FBD5C8", unsafe: "#F8C7C7" };

const RECENT_REPORTS = [
  { title: "Water Quality Summary", range: "12 May – 18 May 2025", type: "PDF", size: "1.2 MB", tone: "#E5484D" },
  { title: "Contaminant Analysis Report", range: "12 May – 18 May 2025", type: "PDF", size: "980 KB", tone: "#7C4DFF" },
  { title: "System Performance Report", range: "12 May – 18 May 2025", type: "PDF", size: "1.1 MB", tone: "#2563EB" },
  { title: "Monthly Compliance Report", range: "April 2025", type: "PDF", size: "1.4 MB", tone: "#1E8E4E" },
];

/* ---------- Shared shell: Sidebar / TopBar ---------- */
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
                onClick={() => { setActive(item.key); setOpen(false); }}
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

function TopBar({ setOpen }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: "14px 0", marginBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="only-mobile" onClick={() => setOpen(true)} style={{ ...iconBtnStyle, background: "#fff", border: "1px solid #E7EBF0" }}>
          <Icon path={icons.menu} color="#344054" />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #E7EBF0", borderRadius: 10, padding: "7px 12px", fontSize: 13, color: "#344054", fontWeight: 500 }}>
          <Icon path={icons.pin} size={15} color="#2F6FED" />
          Village: XYZ
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#667085" }}>
          Last updated: 11:23 AM
          <Icon path={icons.refresh} size={14} color="#98A2B3" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#EAF7EE", color: "#1E8E4E", borderRadius: 999, padding: "6px 12px", fontSize: 13, fontWeight: 700 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E" }} />
          ONLINE
        </div>
      </div>
    </div>
  );
}

/* ---------- Chart ---------- */
function TrendChart() {
  const w = 720, h = 240, padL = 34, padR = 34, padT = 12, padB = 26;
  const innerW = w - padL - padR, innerH = h - padT - padB;
  const xStep = innerW / (TREND_POINTS.length - 1);
  const scaleLeft = (v) => padT + innerH - (v / 10) * innerH; // ph *~ / turbidity 0-10 shared axis
  const scaleRight = (v) => padT + innerH - (v / 800) * innerH; // tds 0-800

  const path = (getter) => TREND_POINTS.map((p, i) => `${i === 0 ? "M" : "L"} ${padL + i * xStep} ${getter(p)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto", display: "block" }} preserveAspectRatio="xMidYMid meet">
      {[0, 2, 4, 6, 8, 10].map((v) => (
        <line key={v} x1={padL} x2={w - padR} y1={scaleLeft(v)} y2={scaleLeft(v)} stroke="#EEF1F5" strokeWidth="1" />
      ))}
      {[0, 2, 4, 6, 8, 10].map((v) => (
        <text key={v} x={padL - 8} y={scaleLeft(v) + 3} fontSize="9.5" fill="#98A2B3" textAnchor="end">{v}</text>
      ))}
      {[0, 200, 400, 600, 800].map((v) => (
        <text key={v} x={w - padR + 8} y={scaleRight(v) + 3} fontSize="9.5" fill="#98A2B3" textAnchor="start">{v}</text>
      ))}
      <path d={path((p) => scaleLeft(p.ph))} fill="none" stroke="#2F6FED" strokeWidth="2" />
      <path d={path((p) => scaleLeft(p.turb))} fill="none" stroke="#1FAA6C" strokeWidth="2" />
      <path d={path((p) => scaleRight(p.tds))} fill="none" stroke="#8B5CF6" strokeWidth="2" />
      <path d={path((p) => scaleLeft(p.temp))} fill="none" stroke="#F0A03D" strokeWidth="2" />
      {TREND_POINTS.map((p, i) => (
        <g key={i}>
          <circle cx={padL + i * xStep} cy={scaleLeft(p.ph)} r="2.6" fill="#2F6FED" />
          <circle cx={padL + i * xStep} cy={scaleLeft(p.turb)} r="2.6" fill="#1FAA6C" />
          <circle cx={padL + i * xStep} cy={scaleRight(p.tds)} r="2.6" fill="#8B5CF6" />
          <circle cx={padL + i * xStep} cy={scaleLeft(p.temp)} r="2.6" fill="#F0A03D" />
          <text x={padL + i * xStep} y={h - 6} fontSize="9.5" fill="#98A2B3" textAnchor="middle">{p.d}</text>
        </g>
      ))}
    </svg>
  );
}

/* ---------- Section components ---------- */
function ReportFilters() {
  return (
    <Card style={{ padding: 18 }}>
      <div className="filters-row">
        <div style={{ minWidth: 160, flex: "1 1 160px" }}>
          <FieldLabel>Report Type</FieldLabel>
          <Select value="Water Quality Summary" options={["Water Quality Summary", "Contaminant Analysis", "System Performance", "Compliance Report"]} />
        </div>
        <div style={{ minWidth: 140, flex: "1 1 140px" }}>
          <FieldLabel>Time Range</FieldLabel>
          <Select value="Last 7 Days" options={["Last 7 Days", "Last 30 Days", "Custom"]} />
        </div>
        <div style={{ minWidth: 140, flex: "1 1 140px" }}>
          <FieldLabel>Start Date</FieldLabel>
          <div style={{ display: "flex", alignItems: "center", gap: 7, border: "1px solid #E7EBF0", borderRadius: 9, padding: "9px 12px" }}>
            <Icon path={icons.calendar} size={14} color="#98A2B3" />
            <span style={{ fontSize: 13.5, color: "#344054", fontWeight: 500 }}>12 May 2025</span>
          </div>
        </div>
        <div style={{ minWidth: 140, flex: "1 1 140px" }}>
          <FieldLabel>End Date</FieldLabel>
          <div style={{ display: "flex", alignItems: "center", gap: 7, border: "1px solid #E7EBF0", borderRadius: 9, padding: "9px 12px" }}>
            <Icon path={icons.calendar} size={14} color="#98A2B3" />
            <span style={{ fontSize: 13.5, color: "#344054", fontWeight: 500 }}>18 May 2025</span>
          </div>
        </div>
        <div style={{ minWidth: 140, flex: "1 1 140px" }}>
          <FieldLabel>Data Source</FieldLabel>
          <Select value="All Sources" options={["All Sources", "Primary Sensor", "Backup Sensor"]} />
        </div>
        <div style={{ flex: "0 0 auto", alignSelf: "flex-end" }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 8, background: "#2563EB", color: "#fff", border: "none",
            borderRadius: 9, padding: "10px 18px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
          }}>
            <Icon path={icons.fileText} size={15} /> Generate Report
          </button>
        </div>
      </div>
    </Card>
  );
}

function KpiCard({ k }) {
  return (
    <Card style={{ padding: 20, flex: "1 1 240px", minWidth: 220 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon path={k.icon} size={20} color={k.fg} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, color: "#667085", fontWeight: 600, marginBottom: 6 }}>{k.label}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: "#101828" }}>{k.value}</span>
            {k.unit && <span style={{ fontSize: 13, color: "#98A2B3", fontWeight: 600 }}>{k.unit}</span>}
          </div>
          {k.subTone ? (
            <div style={{ marginTop: 6 }}><Pill tone={k.subTone}>{k.sub}</Pill></div>
          ) : (
            <div style={{ fontSize: 12.5, color: "#98A2B3", marginTop: 4 }}>{k.sub}</div>
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

function WaterQualityOverview() {
  const [range, setRange] = useState("7D");
  return (
    <Card style={{ padding: 22, flex: "2 1 460px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <SectionTitle>Water Quality Overview</SectionTitle>
        <div style={{ display: "flex", gap: 4, background: "#F5F6F8", borderRadius: 8, padding: 3 }}>
          {["24H", "7D", "30D", "Custom"].map((r) => (
            <button key={r} onClick={() => setRange(r)} style={{
              border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 6,
              background: range === r ? "#101828" : "transparent", color: range === r ? "#fff" : "#667085",
            }}>{r}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#667085", margin: "6px 0 10px", flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><i style={{ width: 8, height: 8, borderRadius: "50%", background: "#2F6FED", display: "inline-block" }} />pH</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><i style={{ width: 8, height: 8, borderRadius: "50%", background: "#1FAA6C", display: "inline-block" }} />Turbidity (NTU)</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><i style={{ width: 8, height: 8, borderRadius: "50%", background: "#8B5CF6", display: "inline-block" }} />TDS (ppm)</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><i style={{ width: 8, height: 8, borderRadius: "50%", background: "#F0A03D", display: "inline-block" }} />Temperature (°C)</span>
      </div>
      <TrendChart />
      <div style={{ marginTop: 14, background: "#EFF6FF", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <Icon path={icons.brain} size={15} color="#2563EB" />
        <span style={{ fontSize: 12.5, color: "#3B5A8A", flex: 1 }}>
          <strong style={{ color: "#1D3A6B" }}>AI Insight:</strong> Water quality has remained stable over the last 7 days.
        </span>
        <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "#2563EB", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
          View details <Icon path={icons.arrowRight} size={12} />
        </a>
      </div>
    </Card>
  );
}

function ContaminantSummary() {
  return (
    <Card style={{ padding: 22, flex: "1 1 380px", overflow: "hidden" }}>
      <SectionTitle
        right={<a href="#" style={{ fontSize: 12.5, color: "#2563EB", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>View full analysis <Icon path={icons.arrowRight} size={12} /></a>}
      >
        Contaminant Summary (Last 7 Days)
      </SectionTitle>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 460 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #EEF1F5" }}>
              {["Parameter", "Average", "Max", "Reference", "Status"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 8px", fontSize: 11.5, color: "#98A2B3", fontWeight: 700, letterSpacing: "0.03em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CONTAMINANTS.map((c) => (
              <tr key={c.name} style={{ borderBottom: "1px solid #F5F6F8" }}>
                <td style={{ padding: "11px 8px", fontSize: 13, color: "#344054", fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: "11px 8px", fontSize: 13, color: "#344054" }}>{c.avg}</td>
                <td style={{ padding: "11px 8px", fontSize: 13, color: "#344054" }}>{c.max}</td>
                <td style={{ padding: "11px 8px", fontSize: 13, color: "#344054" }}>{c.ref}</td>
                <td style={{ padding: "11px 8px" }}><Pill tone={c.tone}>{c.status}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function TemporalHeatmap() {
  return (
    <Card style={{ padding: 22, flex: "2 1 460px" }}>
      <SectionTitle right={<Icon path={icons.info} size={14} color="#98A2B3" />}>Temporal Trend Heatmap</SectionTitle>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 11.5, color: "#98A2B3", fontWeight: 700 }}>Parameter</th>
              {HEATMAP_DATES.map((d) => (
                <th key={d} style={{ textAlign: "center", padding: "8px 6px", fontSize: 11.5, color: "#98A2B3", fontWeight: 700 }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HEATMAP_ROWS.map((row) => (
              <tr key={row.param}>
                <td style={{ padding: "6px 10px", fontSize: 12.5, color: "#344054", fontWeight: 600, whiteSpace: "nowrap" }}>{row.param}</td>
                {row.values.map((v, i) => (
                  <td key={i} style={{ padding: 4 }}>
                    <div style={{
                      background: TONE_COLORS[row.tone(v)], borderRadius: 7, padding: "8px 4px",
                      textAlign: "center", fontSize: 12, fontWeight: 600, color: "#344054",
                    }}>{v}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
        {[["Good", "good"], ["Monitor", "monitor"], ["Poor", "poor"], ["Unsafe", "unsafe"]].map(([label, key]) => (
          <span key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#667085", fontWeight: 500 }}>
            <i style={{ width: 10, height: 10, borderRadius: 3, background: TONE_COLORS[key], display: "inline-block" }} />
            {label}
          </span>
        ))}
      </div>
    </Card>
  );
}

function RecentReports() {
  return (
    <Card style={{ padding: 22, flex: "1 1 300px" }}>
      <SectionTitle>Recent Reports</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {RECENT_REPORTS.map((r) => (
          <div key={r.title} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 4px", borderBottom: "1px solid #F5F6F8" }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#F5F6F8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon path={icons.redPage} size={16} color={r.tone} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1F2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</div>
              <div style={{ fontSize: 12, color: "#98A2B3" }}>{r.range}</div>
            </div>
            <div style={{ fontSize: 11.5, color: "#98A2B3", textAlign: "right", flexShrink: 0 }}>{r.type} · {r.size}</div>
            <button style={{ border: "1px solid #E7EBF0", background: "#fff", borderRadius: 7, padding: 7, cursor: "pointer", display: "flex", flexShrink: 0 }}>
              <Icon path={icons.download} size={14} color="#2563EB" />
            </button>
          </div>
        ))}
      </div>
      <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "#2563EB", fontWeight: 700, textDecoration: "none", marginTop: 16 }}>
        View all reports <Icon path={icons.arrowRight} size={13} />
      </a>
    </Card>
  );
}

function ShareReport() {
  return (
    <Card style={{ padding: 22, flex: "1 1 260px" }}>
      <SectionTitle right={<Icon path={icons.share} size={15} color="#98A2B3" />}>Share Report</SectionTitle>
      <p style={{ fontSize: 12.5, color: "#667085", margin: "0 0 12px" }}>Share the selected report with others.</p>
      <div className="share-row">
        <input placeholder="Enter email address" style={{
          flex: "1 1 160px", border: "1px solid #E7EBF0", borderRadius: 9, padding: "9px 12px", fontSize: 13, color: "#344054", minWidth: 0,
        }} />
        <Select value="View Only" options={["View Only", "Can Download", "Can Edit"]} style={{ width: 130, flex: "0 0 130px" }} />
        <button style={{ background: "#2563EB", color: "#fff", border: "none", borderRadius: 9, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
          Share
        </button>
      </div>
    </Card>
  );
}

function AutomatedReports() {
  const items = [
    { title: "Weekly Report", desc: "Every Monday at 09:00 AM", on: true },
    { title: "Monthly Report", desc: "1st of every month at 09:00 AM", on: true },
  ];
  return (
    <Card style={{ padding: 22, flex: "1 1 260px" }}>
      <SectionTitle>Automated Reports</SectionTitle>
      <p style={{ fontSize: 12.5, color: "#667085", margin: "0 0 14px" }}>Schedule and receive reports automatically.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((it) => (
          <div key={it.title} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1F2937" }}>{it.title}</div>
              <div style={{ fontSize: 12, color: "#98A2B3" }}>{it.desc}</div>
            </div>
            <span style={{
              display: "inline-flex", alignItems: "center", width: 40, height: 22, borderRadius: 999,
              background: it.on ? "#2563EB" : "#E4E7EC", padding: 2, flexShrink: 0,
            }}>
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", transform: it.on ? "translateX(18px)" : "translateX(0)", boxShadow: "0 1px 2px rgba(0,0,0,0.15)" }} />
            </span>
          </div>
        ))}
      </div>
      <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "#2563EB", fontWeight: 700, textDecoration: "none", marginTop: 18 }}>
        <Icon path={icons.calendar} size={13} /> Manage schedules
      </a>
    </Card>
  );
}

/* ---------- App ---------- */
export default function ToyamReports() {
  const [active, setActive] = useState("reports");
  const [open, setOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif", background: "#F6F7F9", minHeight: "100vh" }}>
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
          <TopBar setOpen={setOpen} />

          <div className="page-head">
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#101828", margin: "8px 0 4px" }}>Reports</h1>
              <p style={{ fontSize: 14, color: "#667085", margin: 0 }}>View, download and share water quality reports and analytics.</p>
            </div>
            <button style={{
              display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #E7EBF0",
              color: "#2563EB", borderRadius: 10, padding: "10px 16px", fontSize: 13.5, fontWeight: 700, cursor: "pointer",
            }}>
              <Icon path={icons.calendar} size={15} /> Schedule Report
            </button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <ReportFilters />
          </div>

          <div className="kpi-row">
            {KPIS.map((k) => <KpiCard key={k.label} k={k} />)}
          </div>

          <div className="mid-row">
            <WaterQualityOverview />
            <ContaminantSummary />
          </div>

          <div className="mid-row">
            <TemporalHeatmap />
            <RecentReports />
          </div>

          <div className="bottom-row">
            <ShareReport />
            <AutomatedReports />
          </div>

          <div style={{ textAlign: "center", fontSize: 12, color: "#98A2B3", marginTop: 24 }}>
            <Icon path={icons.shield} size={12} color="#98A2B3" style={{ marginRight: 5, verticalAlign: "-2px" }} />
            Toyam is committed to providing safe water and creating healthier communities through technology and awareness.
          </div>
        </main>
      </div>
    </div>
  );
}
