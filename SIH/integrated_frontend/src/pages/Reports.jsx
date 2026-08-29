import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  download: <><path d="M12 3v13M7 11l5 5 5-5" /><path d="M4 21h16" /></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" /></>,
  fileText: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></>,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="m5 13 4 4L19 7" />,
  filterIcon: <path d="M4 4h16l-6 8v6l-4 2v-8L4 4Z" />,
  checkCircle: <><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>,
};

const Card = ({ children, style, ...p }) => (
  <div style={{ background: "#fff", border: "1px solid #E7EBF0", borderRadius: 16, boxShadow: "0 1px 2px rgba(16,24,40,0.04)", ...style }} {...p}>
    {children}
  </div>
);

const SectionTitle = ({ children, right }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
    <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#1F2937", margin: 0 }}>
      {children}
    </h2>
    {right}
  </div>
);

const FieldLabel = ({ children }) => (
  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#98A2B3", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
    {children}
  </div>
);

const Select = ({ value, options, style }) => (
  <select
    defaultValue={value}
    style={{
      width: "100%", border: "1px solid #E7EBF0", borderRadius: 9, padding: "8px 12px",
      fontSize: 13, color: "#344054", background: "#fff", cursor: "pointer", outline: "none", ...style,
    }}
  >
    {options.map((o) => (
      <option key={o} value={o}>{o}</option>
    ))}
  </select>
);

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
  { label: "Overall Compliance", value: "96.4", unit: "%", icon: icons.checkCircle, bg: "#EAF7EE", fg: "#1E8E4E" },
  { label: "Samples Tested", value: "1,248", unit: "", icon: icons.flask, bg: "#EFF6FF", fg: "#2563EB" },
  { label: "Alert Exceedances", value: "3", unit: "events", icon: icons.bell, bg: "#FEF4E6", fg: "#B8730B" },
  { label: "Avg Water Safety Score", value: "92", unit: "/100", icon: icons.chart, bg: "#F3EEFF", fg: "#7C4DFF" },
];

const METALS_SUMMARY = [
  { name: "Lead (Pb)", conc: "0.004 mg/L", safe: "< 0.010", pct: 45, ok: true },
  { name: "Iron (Fe)", conc: "0.180 mg/L", safe: "< 0.300", pct: 60, ok: true },
  { name: "Manganese (Mn)", conc: "0.050 mg/L", safe: "< 0.050", pct: 85, ok: false },
  { name: "Chromium (Cr)", conc: "0.006 mg/L", safe: "< 0.050", pct: 15, ok: true },
  { name: "Arsenic (As)", conc: "0.003 mg/L", safe: "< 0.010", pct: 30, ok: true },
];

const RECENT_REPORTS = [
  { title: "Monthly Water Quality Summary - April 2025", range: "01 Apr - 30 Apr 2025", type: "PDF", size: "2.4 MB" },
  { title: "Heavy Metal & Arsenic Assessment", range: "15 Apr 2025", type: "PDF", size: "1.1 MB" },
  { title: "Weekly Parameter Log", range: "07 Apr - 13 Apr 2025", type: "CSV", size: "480 KB" },
  { title: "Filter Performance & Health Audit", range: "01 Apr 2025", type: "PDF", size: "1.8 MB" },
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

const iconBtnStyle = {
  background: "transparent", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex",
};

function TopBar({ setOpen }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: "14px 0", marginBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="only-mobile" onClick={() => setOpen(true)} style={{ ...iconBtnStyle, background: "#fff", border: "1px solid #E7EBF0" }}>
          <Icon path={icons.menu} color="#344054" />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #E7EBF0", borderRadius: 10, padding: "7px 12px", fontSize: 13, color: "#344054", fontWeight: 500 }}>
          <Icon path={icons.pin} size={15} color="#2F6FED" />
          Reports Overview
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#667085" }}>
          Last updated: Just now
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

function ReportFilters() {
  return (
    <Card style={{ padding: 18 }}>
      <div className="filters-row">
        <div style={{ minWidth: 140, flex: "1 1 140px" }}>
          <FieldLabel>Date Range</FieldLabel>
          <Select value="Last 30 Days" options={["Today", "Last 7 Days", "Last 30 Days", "This Month", "Custom"]} />
        </div>
        <div style={{ minWidth: 140, flex: "1 1 140px" }}>
          <FieldLabel>Report Type</FieldLabel>
          <Select value="All Reports" options={["All Reports", "Water Quality", "Contaminants", "Filter Health", "Compliance"]} />
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
        </div>
      </div>
    </Card>
  );
}

function WaterQualityOverview() {
  const params = [
    { label: "pH Level", val: "7.2", avg: "7.15", min: "6.8", max: "7.4", status: "Optimal" },
    { label: "Turbidity", val: "2.1 NTU", avg: "2.4 NTU", min: "1.8 NTU", max: "3.2 NTU", status: "Safe" },
    { label: "TDS", val: "480 ppm", avg: "465 ppm", min: "420 ppm", max: "510 ppm", status: "Ideal" },
    { label: "Temperature", val: "27.4 °C", avg: "26.8 °C", min: "25.1 °C", max: "28.5 °C", status: "Normal" },
  ];

  return (
    <Card style={{ padding: 22, flex: "2 1 420px" }}>
      <SectionTitle>Water Quality Parameter Overview</SectionTitle>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #EEF1F5" }}>
              <th style={{ textAlign: "left", padding: "8px 12px", color: "#98A2B3", fontWeight: 700, fontSize: 11.5 }}>Parameter</th>
              <th style={{ textAlign: "left", padding: "8px 12px", color: "#98A2B3", fontWeight: 700, fontSize: 11.5 }}>Latest</th>
              <th style={{ textAlign: "left", padding: "8px 12px", color: "#98A2B3", fontWeight: 700, fontSize: 11.5 }}>30-Day Avg</th>
              <th style={{ textAlign: "left", padding: "8px 12px", color: "#98A2B3", fontWeight: 700, fontSize: 11.5 }}>Min / Max</th>
              <th style={{ textAlign: "left", padding: "8px 12px", color: "#98A2B3", fontWeight: 700, fontSize: 11.5 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {params.map((p) => (
              <tr key={p.label} style={{ borderBottom: "1px solid #F5F6F8" }}>
                <td style={{ padding: "10px 12px", fontWeight: 600, color: "#344054" }}>{p.label}</td>
                <td style={{ padding: "10px 12px", color: "#101828", fontWeight: 700 }}>{p.val}</td>
                <td style={{ padding: "10px 12px", color: "#667085" }}>{p.avg}</td>
                <td style={{ padding: "10px 12px", color: "#667085" }}>{p.min} / {p.max}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ background: "#EAF7EE", color: "#1E8E4E", padding: "3px 8px", borderRadius: 999, fontSize: 11.5, fontWeight: 700 }}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function ContaminantSummary() {
  return (
    <Card style={{ padding: 22, flex: "1 1 320px" }}>
      <SectionTitle>Contaminant Levels vs Safe Thresholds</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {METALS_SUMMARY.map((m) => (
          <div key={m.name}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
              <span style={{ fontWeight: 600, color: "#344054" }}>{m.name}</span>
              <span style={{ color: m.ok ? "#1E8E4E" : "#B8730B", fontWeight: 700 }}>{m.conc}</span>
            </div>
            <div style={{ height: 6, background: "#EAECF0", borderRadius: 999, overflow: "hidden", marginBottom: 3 }}>
              <div style={{ height: "100%", width: `${m.pct}%`, background: m.ok ? "#22C55E" : "#F0A03D", borderRadius: 999 }} />
            </div>
            <div style={{ fontSize: 11, color: "#98A2B3", textAlign: "right" }}>Limit: {m.safe}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TemporalHeatmap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"];

  return (
    <Card style={{ padding: 22, flex: "2 1 420px" }}>
      <SectionTitle>Weekly Quality Heatmap (pH Stability)</SectionTitle>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 4, minWidth: 380 }}>
          <thead>
            <tr>
              <th style={{ fontSize: 11, color: "#98A2B3", textAlign: "left", padding: 4 }}></th>
              {hours.map((h) => (
                <th key={h} style={{ fontSize: 11, color: "#98A2B3", textAlign: "center", padding: 4 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((d, di) => (
              <tr key={d}>
                <td style={{ fontSize: 12, color: "#475467", fontWeight: 600, padding: 4 }}>{d}</td>
                {hours.map((h, hi) => {
                  const val = 7.0 + ((di * 3 + hi * 5) % 7) * 0.05;
                  const isWarn = di === 2 && hi === 3;
                  const bg = isWarn ? "#FEF4E6" : "#EAF7EE";
                  const fg = isWarn ? "#B8730B" : "#1E8E4E";
                  return (
                    <td key={h} style={{ background: bg, color: fg, textAlign: "center", borderRadius: 6, padding: "8px 4px", fontSize: 11.5, fontWeight: 700 }}>
                      {val.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function RecentReports() {
  return (
    <Card style={{ padding: 22, flex: "1.2 1 340px" }}>
      <SectionTitle>Available Reports & Audits</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {RECENT_REPORTS.map((r) => (
          <div key={r.title} style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, border: "1px solid #F0F2F5", borderRadius: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon path={icons.fileText} size={18} color="#2563EB" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</div>
              <div style={{ fontSize: 11.5, color: "#98A2B3" }}>{r.range}</div>
            </div>
            <button style={{ border: "1px solid #E7EBF0", background: "#fff", borderRadius: 7, padding: 6, cursor: "pointer", display: "flex" }}>
              <Icon path={icons.download} size={14} color="#2563EB" />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ShareReport() {
  return (
    <Card style={{ padding: 22, flex: "1 1 260px" }}>
      <SectionTitle right={<Icon path={icons.share} size={15} color="#98A2B3" />}>Share Report</SectionTitle>
      <p style={{ fontSize: 12.5, color: "#667085", margin: "0 0 12px" }}>Share the selected report with team members.</p>
      <div className="share-row">
        <input placeholder="Enter email address" style={{
          flex: "1 1 160px", border: "1px solid #E7EBF0", borderRadius: 9, padding: "9px 12px", fontSize: 13, color: "#344054", minWidth: 0,
        }} />
        <Select value="View Only" options={["View Only", "Can Download", "Can Edit"]} style={{ width: 120, flex: "0 0 120px" }} />
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
    </Card>
  );
}

export default function Reports() {
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
