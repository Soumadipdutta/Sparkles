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
  check: <path d="m5 13 4 4L19 7" />,
  info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-5M12 8h.01" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  ruler: <><path d="M3 8h18v8H3z" /><path d="M7 8v3M11 8v3M15 8v3M19 8v3" /></>,
  monitor: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>,
  sliders: <><path d="M4 6h10M4 18h6M4 12h16" /><circle cx="17" cy="6" r="2" /><circle cx="13" cy="18" r="2" /></>,
  users: <><circle cx="9" cy="8" r="3" /><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" /><circle cx="17" cy="9" r="2.3" /><path d="M23 20c0-2.7-1.9-4.8-4.5-5.5" /></>,
  download: <><path d="M12 3v13M7 11l5 5 5-5" /><path d="M4 21h16" /></>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m3 6 9 7 9-7" /></>,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  cloud: <path d="M7 18a4 4 0 0 1-1-7.9A5.5 5.5 0 0 1 17 8a4.5 4.5 0 0 1-.5 9H7Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
};

/* ---------- Small building blocks ---------- */
const Card = ({ children, style, ...p }) => (
  <div style={{ background: "#fff", border: "1px solid #E7EBF0", borderRadius: 16, boxShadow: "0 1px 2px rgba(16,24,40,0.04)", ...style }} {...p}>
    {children}
  </div>
);

const CardHeader = ({ children, icon }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
    <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#98A2B3", margin: 0 }}>
      {children}
    </h3>
    {icon && <Icon path={icon} size={17} color="#2563EB" />}
  </div>
);

const Row = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid #F5F6F8", fontSize: 13.5 }}>
    <span style={{ color: "#98A2B3" }}>{label}</span>
    <span style={{ color: "#344054", fontWeight: 600, textAlign: "right" }}>{value}</span>
  </div>
);

const Select = ({ value, options }) => (
  <select
    defaultValue={value}
    style={{
      width: "100%", border: "1px solid #E7EBF0", borderRadius: 8, padding: "9px 12px",
      fontSize: 13.5, color: "#344054", background: "#fff", fontWeight: 500,
      appearance: "none",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2398A2B3' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", cursor: "pointer",
    }}
  >
    {options.map((o) => <option key={o}>{o}</option>)}
  </select>
);

const FieldRow = ({ label, control }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "9px 0" }}>
    <span style={{ fontSize: 13.5, color: "#344054", fontWeight: 500, flexShrink: 0 }}>{label}</span>
    <div style={{ width: "58%", minWidth: 140 }}>{control}</div>
  </div>
);

const Toggle = ({ on }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", width: 40, height: 22, borderRadius: 999,
    background: on ? "#2563EB" : "#E4E7EC", padding: 2, cursor: "pointer", flexShrink: 0,
  }}>
    <span style={{
      width: 18, height: 18, borderRadius: "50%", background: "#fff",
      transform: on ? "translateX(18px)" : "translateX(0)", transition: "transform 0.15s",
      boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
    }} />
  </span>
);

const AlertToggleRow = ({ title, desc, on }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 0", borderBottom: "1px solid #F5F6F8" }}>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1F2937" }}>{title}</div>
      <div style={{ fontSize: 12, color: "#98A2B3", marginTop: 2 }}>{desc}</div>
    </div>
    <Toggle on={on} />
  </div>
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

const SETTINGS_NAV = [
  { key: "general", label: "General", desc: "Basic system settings", icon: icons.gear },
  { key: "units", label: "Units & Display", desc: "Measurement units and display", icon: icons.monitor },
  { key: "alerts", label: "Alert Settings", desc: "Configure alert preferences", icon: icons.bell },
  { key: "thresholds", label: "Thresholds", desc: "Set safe limits for parameters", icon: icons.sliders },
  { key: "users", label: "Users & Access", desc: "Manage users and roles", icon: icons.users },
  { key: "data", label: "Data & Export", desc: "Data export and reports", icon: icons.download },
  { key: "notifications", label: "Notifications", desc: "Email and SMS notifications", icon: icons.mail },
  { key: "about", label: "About Toyam", desc: "System information", icon: icons.info },
];

const THRESHOLDS = [
  { param: "pH", safe: "6.5 – 8.5", warn: "6.0 – 6.4 / 8.6 – 9.0", crit: "< 6.0 or > 9.0", unit: "pH" },
  { param: "Turbidity", safe: "< 5", warn: "5 – 10", crit: "> 10", unit: "NTU" },
  { param: "TDS", safe: "< 600", warn: "600 – 1000", crit: "> 1000", unit: "ppm" },
  { param: "Arsenic (As)", safe: "< 0.010", warn: "0.010 – 0.020", crit: "> 0.020", unit: "mg/L" },
  { param: "Lead (Pb)", safe: "< 0.010", warn: "0.010 – 0.020", crit: "> 0.020", unit: "mg/L" },
  { param: "Iron (Fe)", safe: "< 0.30", warn: "0.30 – 1.00", crit: "> 1.00", unit: "mg/L" },
];

/* ---------- Layout: Sidebar / TopBar (shared shell) ---------- */
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

/* ---------- Settings-specific pieces ---------- */
function SettingsSidebar({ activeTab, setActiveTab }) {
  return (
    <Card style={{ padding: 8, flex: "0 0 260px" }}>
      {SETTINGS_NAV.map((item) => {
        const isActive = activeTab === item.key;
        return (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            style={{
              display: "flex", alignItems: "flex-start", gap: 12, width: "100%", textAlign: "left",
              border: "none", cursor: "pointer", borderRadius: 10, padding: "12px 12px", marginBottom: 2,
              background: isActive ? "#EFF6FF" : "transparent",
            }}
          >
            <Icon path={item.icon} size={18} color={isActive ? "#2563EB" : "#98A2B3"} style={{ marginTop: 1, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: isActive ? "#2563EB" : "#1F2937" }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "#98A2B3", marginTop: 1 }}>{item.desc}</div>
            </div>
          </button>
        );
      })}
    </Card>
  );
}

function ThresholdsTable() {
  return (
    <Card style={{ padding: 22 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#1F2937", marginBottom: 6 }}>Parameter Thresholds</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#667085", marginBottom: 18 }}>
        <Icon path={icons.info} size={13} color="#98A2B3" />
        Set safe limits for water quality parameters and contaminants.
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #EEF1F5" }}>
              {["Parameter", "Safe (Good)", "Warning", "Critical (Unsafe)", "Unit", "Actions"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 11.5, color: "#98A2B3", fontWeight: 700, letterSpacing: "0.03em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {THRESHOLDS.map((t) => (
              <tr key={t.param} style={{ borderBottom: "1px solid #F5F6F8" }}>
                <td style={{ padding: "12px", fontSize: 13.5, color: "#344054", fontWeight: 600 }}>{t.param}</td>
                <td style={{ padding: "12px", fontSize: 13, color: "#1E8E4E" }}>{t.safe}</td>
                <td style={{ padding: "12px", fontSize: 13, color: "#B8730B" }}>{t.warn}</td>
                <td style={{ padding: "12px", fontSize: 13, color: "#C43B3B" }}>{t.crit}</td>
                <td style={{ padding: "12px", fontSize: 13, color: "#667085" }}>{t.unit}</td>
                <td style={{ padding: "12px" }}>
                  <button style={{ border: "1px solid #E7EBF0", background: "#fff", borderRadius: 7, padding: 6, cursor: "pointer", display: "flex" }}>
                    <Icon path={icons.edit} size={14} color="#2563EB" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button style={{
        display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, background: "transparent",
        border: "none", color: "#2563EB", fontSize: 13.5, fontWeight: 700, cursor: "pointer", padding: 0,
      }}>
        <Icon path={icons.plus} size={15} /> Add New Parameter
      </button>
    </Card>
  );
}

/* ---------- App ---------- */
export default function ToyamSettings() {
  const [active, setActive] = useState("settings");
  const [activeTab, setActiveTab] = useState("general");
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
        .settings-body { display: flex; gap: 20px; align-items: flex-start; }
        .settings-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .profile-col { display: flex; flex-direction: column; gap: 18px; flex: 0 0 340px; }

        @media (max-width: 980px) {
          .sidebar { position: fixed; left: -260px; top: 0; z-index: 50; transition: left 0.22s ease; }
          .sidebar-open { left: 0; box-shadow: 8px 0 24px rgba(0,0,0,0.25); }
          .only-mobile { display: flex; }
          .sidebar-scrim { display: block !important; }
          .settings-body { flex-direction: column; }
          .profile-col { flex: 1 1 auto; width: 100%; }
        }
        @media (max-width: 760px) {
          .settings-grid-2 { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .main { padding: 16px 14px 32px; }
        }
      `}</style>

      <div className="layout">
        <Sidebar active={active} setActive={setActive} open={open} setOpen={setOpen} />

        <main className="main">
          <TopBar setOpen={setOpen} />

          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#101828", margin: "8px 0 4px" }}>Settings</h1>
            <p style={{ fontSize: 14, color: "#667085", margin: 0 }}>Manage system preferences, alerts, units, thresholds and user profile.</p>
          </div>

          <div className="settings-body" style={{ marginBottom: 18 }}>
            <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="settings-grid-2">
                <Card style={{ padding: 22 }}>
                  <CardHeader icon={icons.shield}>System Information</CardHeader>
                  <Row label="System Name" value="Toyam Water Monitoring System" />
                  <Row label="Installed Location" value="Village: XYZ" />
                  <Row label="System ID" value="TYM-XYZ-2025-0047" />
                  <Row label="Firmware Version" value="v2.1.3 (Latest)" />
                  <Row label="Last Maintenance" value="02 May 2025, 09:30 AM" />
                </Card>

                <Card style={{ padding: 22 }}>
                  <CardHeader icon={icons.monitor}>Display Preferences</CardHeader>
                  <FieldRow label="Language" control={<Select value="English" options={["English", "Hindi", "Bengali"]} />} />
                  <FieldRow label="Theme" control={<Select value="Light" options={["Light", "Dark", "System"]} />} />
                  <FieldRow label="Date Format" control={<Select value="DD MMM YYYY" options={["DD MMM YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]} />} />
                  <FieldRow label="Time Format" control={<Select value="12-Hour (AM/PM)" options={["12-Hour (AM/PM)", "24-Hour"]} />} />
                  <FieldRow label="Dashboard Refresh Interval" control={<Select value="1 Minute" options={["1 Minute", "5 Minutes", "15 Minutes"]} />} />
                </Card>
              </div>

              <div className="settings-grid-2">
                <Card style={{ padding: 22 }}>
                  <CardHeader icon={icons.ruler}>Measurement Units</CardHeader>
                  <FieldRow label="pH" control={<Select value="pH" options={["pH"]} />} />
                  <FieldRow label="Turbidity" control={<Select value="NTU" options={["NTU"]} />} />
                  <FieldRow label="TDS" control={<Select value="ppm" options={["ppm", "mg/L"]} />} />
                  <FieldRow label="Arsenic & Metals" control={<Select value="mg/L" options={["mg/L", "µg/L"]} />} />
                  <FieldRow label="Temperature" control={<Select value="°C" options={["°C", "°F"]} />} />
                </Card>

                <Card style={{ padding: 22 }}>
                  <CardHeader icon={icons.bell}>Alert Settings</CardHeader>
                  <AlertToggleRow title="Critical Alerts" desc="Immediate alert for unsafe levels" on />
                  <AlertToggleRow title="Warning Alerts" desc="Alert when parameter approaches limit" on />
                  <AlertToggleRow title="Info Alerts" desc="Informational updates and reminders" on />
                  <AlertToggleRow title="Maintenance Alerts" desc="Filter maintenance and system alerts" on />
                </Card>
              </div>

              <ThresholdsTable />
            </div>

            <div className="profile-col">
              <Card style={{ padding: 22 }}>
                <CardHeader icon={icons.user}>User Profile</CardHeader>
                <Row label="Name" value="Admin User" />
                <Row label="Email" value="admin@toyam.in" />
                <Row label="Role" value="System Administrator" />
                <Row label="Phone" value="+91 98765 43210" />
                <button style={{
                  marginTop: 16, display: "inline-flex", alignItems: "center", gap: 7,
                  border: "1px solid #DCEBFF", background: "#EFF6FF", color: "#2563EB",
                  fontSize: 13, fontWeight: 700, padding: "9px 16px", borderRadius: 9, cursor: "pointer",
                }}>
                  <Icon path={icons.edit} size={14} /> Edit Profile
                </button>
              </Card>

              <Card style={{ padding: 22 }}>
                <CardHeader icon={icons.cloud}>Data & System Backup</CardHeader>
                <Row label="Last Backup" value="12 May 2025, 02:15 AM" />
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: 13.5 }}>
                  <span style={{ color: "#98A2B3" }}>Backup Status</span>
                  <span style={{ color: "#1E8E4E", fontWeight: 700 }}>Successful</span>
                </div>
                <button style={{
                  marginTop: 8, display: "inline-flex", alignItems: "center", gap: 7,
                  border: "1px solid #DCEBFF", background: "#EFF6FF", color: "#2563EB",
                  fontSize: 13, fontWeight: 700, padding: "9px 16px", borderRadius: 9, cursor: "pointer",
                }}>
                  <Icon path={icons.cloud} size={14} /> Backup Now
                </button>
              </Card>
            </div>
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
