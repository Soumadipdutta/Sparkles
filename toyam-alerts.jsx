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
  shieldWarn: <><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" /><path d="M12 8v4M12 15h.01" /></>,
  file: <><path d="M6 2h9l5 5v15H6z" /><path d="M15 2v5h5" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 0 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.1.35.35.66.68.9.3.24.68.38 1.07.38H21a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z" /></>,
  pin: <><path d="M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.2" /></>,
  refresh: <><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  warning: <><path d="M10.3 3.9 2 18h20L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>,
  info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-5M12 8h.01" /></>,
  check: <path d="m5 13 4 4L19 7" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  eye: <><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" /><circle cx="12" cy="12" r="3" /></>,
  checkbox: <><rect x="3" y="3" width="18" height="18" rx="4" /><path d="m8 12 3 3 5-6" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.5" /></>,
  trend: <><path d="M3 17 9 11l4 4 8-8" /><path d="M15 6h6v6" /></>,
};

/* ---------- Small building blocks ---------- */
const Card = ({ children, style, ...p }) => (
  <div style={{ background: "#fff", border: "1px solid #E7EBF0", borderRadius: 16, boxShadow: "0 1px 2px rgba(16,24,40,0.04)", ...style }} {...p}>
    {children}
  </div>
);

const Badge = ({ tone, children }) => {
  const map = {
    critical: { bg: "#FDECEC", fg: "#C43B3B", dot: "#E5484D" },
    warning: { bg: "#FEF4E6", fg: "#B8730B", dot: "#F0A03D" },
    info: { bg: "#EFF6FF", fg: "#2563EB", dot: "#2563EB" },
    new: { bg: "#FDECEC", fg: "#C43B3B" },
    ack: { bg: "#FEF4E6", fg: "#B8730B" },
    resolved: { bg: "#EAF7EE", fg: "#1E8E4E" },
  }[tone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, background: map.bg, color: map.fg,
      fontSize: 11.5, fontWeight: 700, padding: "3px 9px", borderRadius: 999, whiteSpace: "nowrap",
    }}>
      {map.dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: map.dot }} />}
      {children}
    </span>
  );
};

const SectionTitle = ({ children, right, count }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#1F2937", margin: 0 }}>{children}</h2>
      {count != null && (
        <span style={{ background: "#E5484D", color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 999, minWidth: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{count}</span>
      )}
    </div>
    {right}
  </div>
);

const Select = ({ value, options }) => (
  <select
    defaultValue={value}
    style={{
      border: "1px solid #E7EBF0", borderRadius: 9, padding: "8px 30px 8px 12px", fontSize: 13,
      color: "#344054", background: "#fff", fontWeight: 500, appearance: "none",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2398A2B3' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", cursor: "pointer",
    }}
  >
    {options.map((o) => <option key={o}>{o}</option>)}
  </select>
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

const SUMMARY = [
  { value: 2, label: "Critical Alerts", sub: "Require immediate action", bg: "#FDECEC", fg: "#E5484D", icon: icons.shieldWarn },
  { value: 3, label: "Warning Alerts", sub: "Action recommended", bg: "#FEF4E6", fg: "#E08A2E", icon: icons.warning },
  { value: 1, label: "Info Alerts", sub: "Informational only", bg: "#EFF6FF", fg: "#2563EB", icon: icons.info },
  { value: 6, label: "Resolved Today", sub: "No longer active", bg: "#EAF7EE", fg: "#22C55E", icon: icons.check },
];

const ALERTS = [
  { sev: "critical", title: "Arsenic concentration exceeds safe limit", param: "Arsenic (As)", value: "0.018 mg/L", limit: "Limit: 0.010 mg/L", loc: "Borewell #2", time: "11:19 AM", date: "18 May 2025", status: "new" },
  { sev: "critical", title: "Turbidity level is critically high", param: "Turbidity", value: "12.4 NTU", limit: "Limit: < 5 NTU", loc: "Raw Water Inlet", time: "11:15 AM", date: "18 May 2025", status: "new" },
  { sev: "warning", title: "Iron level approaching limit", param: "Iron (Fe)", value: "0.28 mg/L", limit: "Limit: 0.30 mg/L", loc: "Borewell #1", time: "10:48 AM", date: "18 May 2025", status: "ack" },
  { sev: "warning", title: "Carbon filter health below 70%", param: "Carbon Filter", value: "64%", limit: "Limit: > 70%", loc: "Treatment Unit", time: "10:30 AM", date: "18 May 2025", status: "new" },
  { sev: "info", title: "System maintenance completed", param: "System", value: "–", limit: "", loc: "Treatment Unit", time: "09:05 AM", date: "18 May 2025", status: "new" },
];

const SEV_LABEL = { critical: "Critical", warning: "Warning", info: "Info" };

const ACTIVITY = [
  { title: "Arsenic concentration exceeds safe limit", sub: "Arsenic (As) detected at 0.018 mg/L in Borewell #2", time: "11:19 AM", tag: "critical", dot: "#E5484D" },
  { title: "Turbidity level is critically high", sub: "Turbidity detected at 12.4 NTU at Raw Water Inlet", time: "11:15 AM", tag: "critical", dot: "#E5484D" },
  { title: "Iron level approaching limit", sub: "Iron (Fe) detected at 0.28 mg/L in Borewell #1", time: "10:48 AM", tag: "warning", dot: "#F0A03D" },
  { title: "UV disinfection system check", sub: "UV intensity is normal and within safe range", time: "09:30 AM", tag: "info", dot: "#22C55E" },
  { title: "Yesterday's critical alert resolved", sub: "High TDS level in Borewell #2 is now within safe range", time: "Yesterday, 04:20 PM", tag: "resolved", dot: "#22C55E" },
];

const ANALYTICS = [
  { label: "Critical", pct: 18, count: 2, color: "#E5484D" },
  { label: "Warning", pct: 27, count: 3, color: "#F0A03D" },
  { label: "Info", pct: 9, count: 1, color: "#2563EB" },
  { label: "Resolved", pct: 46, count: 5, color: "#22C55E" },
];

const GUIDANCE = [
  { title: "If Critical Alert", body: "Stop using untreated water from the affected source. Check system and take immediate corrective action.", fg: "#C43B3B", bg: "#FDECEC", icon: icons.shieldWarn },
  { title: "If Warning Alert", body: "Monitor the parameter closely and perform maintenance or treatment as recommended.", fg: "#B8730B", bg: "#FEF4E6", icon: icons.warning },
  { title: "If Info Alert", body: "No immediate action required. Continue regular monitoring.", fg: "#2563EB", bg: "#EFF6FF", icon: icons.info },
];

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

/* ---------- Section components ---------- */
function SummaryCard({ s }) {
  return (
    <Card style={{ padding: 18, background: s.bg, border: "1px solid transparent", flex: "1 1 220px", minWidth: 200 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon path={s.icon} size={19} color={s.fg} />
        </div>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#101828" }}>{s.value}</div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1F2937" }}>{s.label}</div>
          <div style={{ fontSize: 12, color: "#667085", marginTop: 1 }}>{s.sub}</div>
        </div>
      </div>
    </Card>
  );
}

function ActiveAlertsTable() {
  return (
    <Card style={{ padding: 22, flex: "1 1 640px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <SectionTitle count={5}>Active Alerts</SectionTitle>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Select value="All Severity" options={["All Severity", "Critical", "Warning", "Info"]} />
          <Select value="All Types" options={["All Types", "Chemical", "Physical", "System"]} />
          <button style={{
            display: "flex", alignItems: "center", gap: 6, border: "1px solid #E7EBF0", background: "#fff",
            color: "#344054", borderRadius: 9, padding: "8px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
          }}>
            <Icon path={icons.checkbox} size={14} color="#2563EB" /> Mark all as read
          </button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #EEF1F5" }}>
              {["Severity", "Alert", "Parameter", "Value", "Location", "Time", "Status", "Action"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 10px", fontSize: 11.5, color: "#98A2B3", fontWeight: 700, letterSpacing: "0.03em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALERTS.map((a, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #F5F6F8" }}>
                <td style={{ padding: "12px 10px" }}><Badge tone={a.sev}>{SEV_LABEL[a.sev]}</Badge></td>
                <td style={{ padding: "12px 10px", fontSize: 13, color: "#1F2937", fontWeight: 600, maxWidth: 220 }}>{a.title}</td>
                <td style={{ padding: "12px 10px", fontSize: 13, color: "#344054" }}>{a.param}</td>
                <td style={{ padding: "12px 10px", fontSize: 13, color: "#344054" }}>
                  {a.value}
                  {a.limit && <div style={{ fontSize: 11, color: a.sev === "critical" ? "#E5484D" : a.sev === "warning" ? "#E08A2E" : "#98A2B3" }}>{a.limit}</div>}
                </td>
                <td style={{ padding: "12px 10px", fontSize: 13, color: "#344054" }}>{a.loc}</td>
                <td style={{ padding: "12px 10px", fontSize: 12.5, color: "#667085" }}>{a.time}<div style={{ fontSize: 11, color: "#98A2B3" }}>{a.date}</div></td>
                <td style={{ padding: "12px 10px" }}><Badge tone={a.status}>{a.status === "new" ? "New" : a.status === "ack" ? "Acknowledged" : "Resolved"}</Badge></td>
                <td style={{ padding: "12px 10px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ border: "1px solid #E7EBF0", background: "#fff", borderRadius: 7, padding: 6, cursor: "pointer", display: "flex" }}>
                      <Icon path={icons.eye} size={14} color="#667085" />
                    </button>
                    <button style={{ border: "1px solid #E7EBF0", background: "#fff", borderRadius: 7, padding: 6, cursor: "pointer", display: "flex" }}>
                      <Icon path={icons.arrowRight} size={14} color="#667085" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "#2563EB", fontWeight: 700, textDecoration: "none", marginTop: 16 }}>
        View all active alerts <Icon path={icons.arrowRight} size={13} />
      </a>
    </Card>
  );
}

function RecentActivity() {
  return (
    <Card style={{ padding: 22, flex: "1 1 300px" }}>
      <SectionTitle>Recent Alert Activity</SectionTitle>
      <div style={{ position: "relative" }}>
        {ACTIVITY.map((a, i) => (
          <div key={i} style={{ display: "flex", gap: 12, paddingBottom: i < ACTIVITY.length - 1 ? 18 : 0, position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: a.dot, marginTop: 4 }} />
              {i < ACTIVITY.length - 1 && <span style={{ width: 1, flex: 1, background: "#EEF1F5", marginTop: 4 }} />}
            </div>
            <div style={{ minWidth: 0, flex: 1, display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1F2937" }}>{a.title}</div>
                <div style={{ fontSize: 12, color: "#98A2B3", marginTop: 2 }}>{a.sub}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 11.5, color: "#98A2B3" }}>{a.time}</div>
                <div style={{ marginTop: 4 }}><Badge tone={a.tag}>{a.tag === "critical" ? "Critical" : a.tag === "warning" ? "Warning" : a.tag === "resolved" ? "Resolved" : "Info"}</Badge></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "#2563EB", fontWeight: 700, textDecoration: "none", marginTop: 18 }}>
        View all activity <Icon path={icons.arrowRight} size={13} />
      </a>
    </Card>
  );
}

function Donut({ data, total }) {
  const size = 150, r = 54, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r;
  let offsetAcc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EEF1F5" strokeWidth="16" />
      {data.map((d, i) => {
        const len = (d.pct / 100) * circ;
        const dash = `${len} ${circ - len}`;
        const rotate = (offsetAcc / 100) * 360 - 90;
        offsetAcc += d.pct;
        return (
          <circle
            key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth="16"
            strokeDasharray={dash} strokeLinecap="butt"
            transform={`rotate(${rotate} ${cx} ${cy})`}
          />
        );
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="24" fontWeight="800" fill="#101828">{total}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize="10.5" fill="#98A2B3" fontWeight="600">Total Alerts</text>
    </svg>
  );
}

function AlertAnalytics() {
  return (
    <Card style={{ padding: 22, flex: "1 1 300px" }}>
      <SectionTitle>Alert Analytics (Last 7 Days)</SectionTitle>
      <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        <Donut data={ANALYTICS} total={11} />
        <div style={{ flex: 1, minWidth: 160, display: "flex", flexDirection: "column", gap: 10 }}>
          {ANALYTICS.map((a) => (
            <div key={a.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, color: "#344054", fontWeight: 500 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.color }} />
                {a.label}
              </span>
              <span style={{ color: "#667085" }}>{a.count} ({a.pct}%)</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 16, background: "#EFF6FF", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 8, fontSize: 12.5, color: "#3B5A8A" }}>
        <Icon path={icons.trend} size={15} color="#2563EB" style={{ flexShrink: 0, marginTop: 1 }} />
        Most alerts were related to heavy metals and filter health. Regular monitoring helps prevent critical issues.
      </div>
    </Card>
  );
}

function AlertMapView() {
  const pins = [
    { label: "Borewell #2", num: 2, tone: "#E5484D", x: "34%", y: "30%" },
    { label: "Borewell #1", num: 1, tone: "#F0A03D", x: "24%", y: "62%" },
  ];
  return (
    <Card style={{ padding: 22, flex: "1 1 340px" }}>
      <SectionTitle>Alert Map View</SectionTitle>
      <div style={{
        position: "relative", height: 220, borderRadius: 12, overflow: "hidden",
        background: "linear-gradient(135deg,#EAF3EA 0%,#E4EFE9 45%,#DCEAF3 100%)",
        border: "1px solid #E7EBF0",
      }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <path d="M0,150 C60,140 120,180 180,160 S300,120 400,140" stroke="#BFDCEE" strokeWidth="14" fill="none" opacity="0.7" />
        </svg>
        {pins.map((p) => (
          <div key={p.label} style={{ position: "absolute", left: p.x, top: p.y, display: "flex", alignItems: "center", gap: 6, transform: "translate(-8px,-8px)" }}>
            <span style={{
              width: 22, height: 22, borderRadius: "50%", background: p.tone, color: "#fff", fontSize: 11, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", flexShrink: 0,
            }}>{p.num}</span>
            <span style={{ background: "#fff", borderRadius: 7, padding: "3px 8px", fontSize: 11.5, fontWeight: 700, color: "#1F2937", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", whiteSpace: "nowrap" }}>{p.label}</span>
          </div>
        ))}
        <div style={{ position: "absolute", left: "50%", top: "68%", display: "flex", alignItems: "center", gap: 6, transform: "translate(-8px,-8px)" }}>
          <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
            <Icon path={icons.check} size={12} color="#fff" />
          </span>
          <span style={{ background: "#fff", borderRadius: 7, padding: "3px 8px", fontSize: 11.5, fontWeight: 700, color: "#1F2937", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", whiteSpace: "nowrap" }}>Treatment Unit (Plant)</span>
        </div>
        <div style={{ position: "absolute", right: 10, top: 10, display: "flex", flexDirection: "column", gap: 4 }}>
          <button style={{ width: 26, height: 26, background: "#fff", border: "1px solid #E7EBF0", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon path={icons.plus} size={13} color="#344054" />
          </button>
          <button style={{ width: 26, height: 26, background: "#fff", border: "1px solid #E7EBF0", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon path={icons.minus} size={13} color="#344054" />
          </button>
          <button style={{ width: 26, height: 26, background: "#fff", border: "1px solid #E7EBF0", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon path={icons.target} size={13} color="#344054" />
          </button>
        </div>
      </div>
      <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "#2563EB", fontWeight: 700, textDecoration: "none", marginTop: 14 }}>
        View full map <Icon path={icons.arrowRight} size={13} />
      </a>
    </Card>
  );
}

function WhatToDo() {
  return (
    <Card style={{ padding: 22, flex: "1 1 300px" }}>
      <SectionTitle>What Should You Do?</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {GUIDANCE.map((g) => (
          <div key={g.title} style={{ display: "flex", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: g.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon path={g.icon} size={16} color={g.fg} />
            </div>
            <div style={{ fontSize: 12.5, color: "#667085", lineHeight: 1.5 }}>
              <span style={{ fontWeight: 700, color: g.fg }}>{g.title}. </span>
              {g.body}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, background: "#EAF7EE", borderRadius: 12, padding: 14, display: "flex", gap: 10 }}>
        <Icon path={icons.shield} size={17} color="#1E8E4E" style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12.5, color: "#1E5B3A", lineHeight: 1.5 }}>
          <strong>Need help?</strong> Contact your local water technician or support team for guidance.
        </div>
      </div>
    </Card>
  );
}

/* ---------- App ---------- */
export default function ToyamAlerts() {
  const [active, setActive] = useState("alerts");
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
        .summary-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
        .row-2 { display: flex; gap: 16px; flex-wrap: wrap; align-items: stretch; margin-bottom: 16px; }
        .row-3 { display: flex; gap: 16px; flex-wrap: wrap; }

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
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#101828", margin: "8px 0 4px" }}>Alerts</h1>
              <p style={{ fontSize: 14, color: "#667085", margin: 0 }}>Monitor and respond to water quality issues in real time.</p>
            </div>
            <button style={{
              display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #E7EBF0",
              color: "#2563EB", borderRadius: 10, padding: "10px 16px", fontSize: 13.5, fontWeight: 700, cursor: "pointer",
            }}>
              <Icon path={icons.gear} size={15} /> Alert Settings
            </button>
          </div>

          <div className="summary-row">
            {SUMMARY.map((s) => <SummaryCard key={s.label} s={s} />)}
          </div>

          <div className="row-2">
            <ActiveAlertsTable />
            <RecentActivity />
          </div>

          <div className="row-2">
            <AlertAnalytics />
            <AlertMapView />
            <WhatToDo />
          </div>

          <Card style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
            <Icon path={icons.info} size={16} color="#2563EB" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#344054" }}>
              Alerts help you take timely action. Always follow recommended guidelines and consult local water authorities if needed.
            </span>
          </Card>

          <div style={{ textAlign: "center", fontSize: 12, color: "#98A2B3", marginTop: 24 }}>
            <Icon path={icons.shield} size={12} color="#98A2B3" style={{ marginRight: 5, verticalAlign: "-2px" }} />
            Toyam is committed to providing safe water and creating healthier communities through technology and awareness.
          </div>
        </main>
      </div>
    </div>
  );
}
