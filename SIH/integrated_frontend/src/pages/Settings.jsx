import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSettingsData, updateSettingsData, triggerSystemBackup } from "../services/api";
import { getTranslation, normalizeLanguage } from "../i18n/translations";

function formatDateTime(dateInput, dateFormat = "DD-MM-YYYY", timeFormat = "12-Hour (AM/PM)") {
  let d = new Date();
  if (dateInput) {
    if (typeof dateInput === "string" && dateInput.includes("T")) {
      const parsed = new Date(dateInput);
      if (!isNaN(parsed.getTime())) d = parsed;
    } else if (dateInput instanceof Date) {
      d = dateInput;
    }
  }

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  let formattedDate = `${day}-${month}-${year}`;
  if (dateFormat === "MM-DD-YYYY") {
    formattedDate = `${month}-${day}-${year}`;
  } else if (dateFormat === "YYYY-MM-DD") {
    formattedDate = `${year}-${month}-${day}`;
  }

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  let formattedTime = "";

  if (timeFormat === "24-Hour") {
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
  trash: <><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  cloud: <path d="M7 18a4 4 0 0 1-1-7.9A5.5 5.5 0 0 1 17 8a4.5 4.5 0 0 1-.5 9H7Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
};

/* ---------- Small building blocks ---------- */
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

const CardHeader = ({ children, icon, isDark = false }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
    <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: isDark ? "#64748B" : "#98A2B3", margin: 0 }}>
      {children}
    </h3>
    {icon && <Icon path={icon} size={17} color="#3B82F6" />}
  </div>
);

const Row = ({ label, value, isDark = false }) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: isDark ? "1px solid #1E293B" : "1px solid #F5F6F8", fontSize: 13.5 }}>
    <span style={{ color: isDark ? "#64748B" : "#98A2B3" }}>{label}</span>
    <span style={{ color: isDark ? "#CBD5E1" : "#344054", fontWeight: 600, textAlign: "right" }}>{value}</span>
  </div>
);

const Select = ({ value, options, onChange, isDark = false }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      width: "100%", border: isDark ? "1px solid #334155" : "1px solid #E7EBF0", borderRadius: 8, padding: "8px 10px",
      fontSize: 13, color: isDark ? "#F8FAFC" : "#344054", background: isDark ? "#1E293B" : "#fff", fontWeight: 500,
      appearance: "none", boxSizing: "border-box", textOverflow: "ellipsis",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2398A2B3' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", cursor: "pointer",
      outline: "none",
    }}
  >
    {options.map((o) => <option key={o} value={o}>{o}</option>)}
  </select>
);

const FieldRow = ({ label, control, isDark = false }) => (
  <div style={{
    display: "grid", gridTemplateColumns: "1fr 135px", alignItems: "center",
    gap: 8, padding: "9px 0", width: "100%", boxSizing: "border-box",
  }}>
    <span style={{ fontSize: 13, color: isDark ? "#CBD5E1" : "#344054", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={label}>
      {label}
    </span>
    <div style={{ width: 135, boxSizing: "border-box", padding: 2 }}>{control}</div>
  </div>
);

const Toggle = ({ on, onToggle }) => (
  <span
    onClick={onToggle}
    style={{
      display: "inline-flex", alignItems: "center", width: 40, height: 22, borderRadius: 999,
      background: on ? "#2563EB" : "#E4E7EC", padding: 2, cursor: "pointer", flexShrink: 0,
      transition: "background 0.15s",
    }}
  >
    <span style={{
      width: 18, height: 18, borderRadius: "50%", background: "#fff",
      transform: on ? "translateX(18px)" : "translateX(0)", transition: "transform 0.15s",
      boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
    }} />
  </span>
);

const AlertToggleRow = ({ title, desc, on, onToggle, isDark = false }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 0", borderBottom: isDark ? "1px solid #1E293B" : "1px solid #F5F6F8" }}>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: isDark ? "#F8FAFC" : "#1F2937" }}>{title}</div>
      <div style={{ fontSize: 12, color: isDark ? "#64748B" : "#98A2B3", marginTop: 2 }}>{desc}</div>
    </div>
    <Toggle on={on} onToggle={onToggle} />
  </div>
);

const iconBtnStyle = { background: "transparent", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex" };

function Sidebar({ active, setActive, open, setOpen, lang }) {
  const navigate = useNavigate();

  const NAV = [
    { key: "dashboard", label: getTranslation(lang, "dashboard"), icon: icons.home },
    { key: "quality", label: getTranslation(lang, "quality"), icon: icons.chart },
    { key: "contaminants", label: getTranslation(lang, "contaminants"), icon: icons.flask },
    { key: "purification", label: getTranslation(lang, "purification"), icon: icons.drop },
    { key: "alerts", label: getTranslation(lang, "alerts"), icon: icons.bell },
    { key: "awareness", label: getTranslation(lang, "awareness"), icon: icons.shield },
    { key: "reports", label: getTranslation(lang, "reports"), icon: icons.file },
    { key: "settings", label: getTranslation(lang, "settings"), icon: icons.gear },
  ];

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
            <div style={{ fontSize: 12, color: "#8FA2C2", marginBottom: 8 }}>{getTranslation(lang, "systemStatus")}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
              <span style={{ fontSize: 13, color: "#E5EAF3", fontWeight: 600 }}>{getTranslation(lang, "systemOperational")}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function TopBar({ setOpen, village, dispPref, lang, isDark }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const formattedDateTime = formatDateTime(now, dispPref?.date_format, dispPref?.time_format);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: "14px 0", marginBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="only-mobile" onClick={() => setOpen(true)} style={{ ...iconBtnStyle, background: isDark ? "#131B2E" : "#fff", border: isDark ? "1px solid #1E2D4A" : "1px solid #E7EBF0" }}>
          <Icon path={icons.menu} color={isDark ? "#94A3B8" : "#344054"} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: isDark ? "#131B2E" : "#fff", border: isDark ? "1px solid #1E2D4A" : "1px solid #E7EBF0", borderRadius: 10, padding: "7px 12px", fontSize: 13, color: isDark ? "#E2E8F0" : "#344054", fontWeight: 500 }}>
          <Icon path={icons.pin} size={15} color="#3B82F6" />
          {getTranslation(lang, "village")}: {village || "XYZ"}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: isDark ? "#94A3B8" : "#667085" }}>
          {getTranslation(lang, "lastUpdated")}: {formattedDateTime}
          <Icon path={icons.refresh} size={14} color={isDark ? "#64748B" : "#98A2B3"} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: isDark ? "#064E3B" : "#EAF7EE", color: isDark ? "#34D399" : "#1E8E4E", borderRadius: 999, padding: "6px 12px", fontSize: 13, fontWeight: 700 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E" }} />
          ONLINE
        </div>
      </div>
    </div>
  );
}

function SettingsSidebar({ activeTab, setActiveTab, isDark }) {
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

  return (
    <Card isDark={isDark} style={{ padding: 8, flex: "0 0 260px" }}>
      {SETTINGS_NAV.map((item) => {
        const isActive = activeTab === item.key;
        return (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            style={{
              display: "flex", alignItems: "flex-start", gap: 12, width: "100%", textAlign: "left",
              border: "none", cursor: "pointer", borderRadius: 10, padding: "12px 12px", marginBottom: 2,
              background: isActive ? (isDark ? "#1E293B" : "#EFF6FF") : "transparent",
            }}
          >
            <Icon path={item.icon} size={18} color={isActive ? "#3B82F6" : (isDark ? "#64748B" : "#98A2B3")} style={{ marginTop: 1, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: isActive ? "#3B82F6" : (isDark ? "#F8FAFC" : "#1F2937") }}>{item.label}</div>
              <div style={{ fontSize: 12, color: isDark ? "#64748B" : "#98A2B3", marginTop: 1 }}>{item.desc}</div>
            </div>
          </button>
        );
      })}
    </Card>
  );
}

function ThresholdsTable({ thresholds, onEdit, onDelete, onAdd, lang, isDark }) {
  const rawThresholds = thresholds || [];
  const thresholdsArr = Array.isArray(rawThresholds) ? rawThresholds : typeof rawThresholds === "object" ? Object.values(rawThresholds) : [];

  return (
    <Card isDark={isDark} style={{ padding: 22 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: isDark ? "#F8FAFC" : "#1F2937", marginBottom: 6 }}>{getTranslation(lang, "parameterThresholds")}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: isDark ? "#94A3B8" : "#667085", marginBottom: 18 }}>
        <Icon path={icons.info} size={13} color={isDark ? "#64748B" : "#98A2B3"} />
        {getTranslation(lang, "parameterThresholdsSub")}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
          <thead>
            <tr style={{ borderBottom: isDark ? "1px solid #1E293B" : "1px solid #EEF1F5" }}>
              {["Parameter", getTranslation(lang, "safe"), getTranslation(lang, "warning"), getTranslation(lang, "unsafe"), "Unit", "Actions"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 11.5, color: isDark ? "#64748B" : "#98A2B3", fontWeight: 700, letterSpacing: "0.03em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {thresholdsArr.map((t) => (
              <tr key={t.id || t.param} style={{ borderBottom: isDark ? "1px solid #1E293B" : "1px solid #F5F6F8" }}>
                <td style={{ padding: "12px", fontSize: 13.5, color: isDark ? "#CBD5E1" : "#344054", fontWeight: 600 }}>{t.param}</td>
                <td style={{ padding: "12px", fontSize: 13, color: isDark ? "#34D399" : "#1E8E4E" }}>{t.safe}</td>
                <td style={{ padding: "12px", fontSize: 13, color: isDark ? "#FBBF24" : "#B8730B" }}>{t.warn}</td>
                <td style={{ padding: "12px", fontSize: 13, color: isDark ? "#FCA5A5" : "#C43B3B" }}>{t.crit}</td>
                <td style={{ padding: "12px", fontSize: 13, color: isDark ? "#64748B" : "#667085" }}>{t.unit}</td>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => onEdit(t)} title="Edit Parameter" style={{ border: isDark ? "1px solid #334155" : "1px solid #E7EBF0", background: isDark ? "#1E293B" : "#fff", borderRadius: 7, padding: 6, cursor: "pointer", display: "flex" }}>
                      <Icon path={icons.edit} size={14} color="#3B82F6" />
                    </button>
                    <button onClick={() => onDelete(t.id)} title="Delete Parameter" style={{ border: isDark ? "1px solid #7F1D1D" : "1px solid #FDECEC", background: isDark ? "#451A1A" : "#FDECEC", borderRadius: 7, padding: 6, cursor: "pointer", display: "flex" }}>
                      <Icon path={icons.trash} size={14} color="#FCA5A5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={onAdd}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, background: "transparent",
          border: "none", color: "#3B82F6", fontSize: 13.5, fontWeight: 700, cursor: "pointer", padding: 0,
        }}
      >
        <Icon path={icons.plus} size={15} /> {getTranslation(lang, "addParameter")}
      </button>
    </Card>
  );
}

export default function Settings({ settings: propSettings, onUpdateSettings: propOnUpdateSettings }) {
  const [active, setActive] = useState("settings");
  const [activeTab, setActiveTab] = useState("general");
  const [open, setOpen] = useState(false);

  const [settings, setSettings] = useState(propSettings || null);
  const [loading, setLoading] = useState(!propSettings);
  const [error, setError] = useState(null);
  const [backupMsg, setBackupMsg] = useState("");

  const [editThreshold, setEditThreshold] = useState(null);
  const [thresholdErr, setThresholdErr] = useState("");
  
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [draftProfile, setDraftProfile] = useState(null);

  useEffect(() => {
    if (propSettings) {
      setSettings(propSettings);
      setLoading(false);
    } else {
      fetchSettingsData()
        .then((data) => {
          setSettings(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [propSettings]);

  const handleUpdate = async (fieldGroup, updatedObj) => {
    try {
      if (propOnUpdateSettings) {
        const newSettings = await propOnUpdateSettings(fieldGroup, updatedObj);
        setSettings(newSettings);
      } else {
        const payload = { [fieldGroup]: updatedObj };
        const newSettings = await updateSettingsData(payload);
        setSettings(newSettings);
      }
    } catch (err) {
      alert(`Failed to save settings: ${err.message}`);
    }
  };

  const handleBackup = async () => {
    try {
      setBackupMsg("Backing up...");
      const backupInfo = await triggerSystemBackup();
      setSettings((prev) => ({ ...prev, backup_info: backupInfo }));
      setBackupMsg("Backup complete!");
      setTimeout(() => setBackupMsg(""), 3000);
    } catch (err) {
      setBackupMsg(`Backup failed: ${err.message}`);
    }
  };

  const handleDeleteThreshold = (id) => {
    const rawThresholds = activeSettings?.thresholds || [];
    const existing = Array.isArray(rawThresholds) ? rawThresholds : typeof rawThresholds === "object" ? Object.values(rawThresholds) : [];
    const filtered = existing.filter((t) => t.id !== id);
    handleUpdate("thresholds", filtered);
  };

  if (loading) {
    return <div style={{ padding: 40, fontFamily: "sans-serif", color: "#667085", textAlign: "center" }}>Loading settings...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 30, color: "#C43B3B", fontFamily: "sans-serif" }}>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>API Connection Error</h2>
        <p style={{ fontSize: 14, color: "#475467" }}>{error}</p>
        <p style={{ fontSize: 13, color: "#667085", marginTop: 12 }}>Ensure FastAPI backend is running at <code>http://127.0.0.1:8000</code>.</p>
      </div>
    );
  }

  const activeSettings = propSettings || settings;
  const sysInfo = activeSettings?.system_info || {};
  const dispPref = activeSettings?.display_preferences || {};
  const units = activeSettings?.measurement_units || {};
  const alertSet = activeSettings?.alert_settings || {};
  const profile = activeSettings?.user_profile || {};
  const backup = activeSettings?.backup_info || {};

  const rawLang = dispPref?.language || "English";
  const lang = normalizeLanguage(rawLang);

  const themeSetting = dispPref?.theme || "Light";
  const isDark = themeSetting === "Dark" || (themeSetting === "System" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const displayLangValue = rawLang.includes("Hindi") || rawLang.includes("हिन्दी") ? "हिन्दी (Hindi)"
                          : rawLang.includes("Bengali") || rawLang.includes("বাংলা") ? "বাংলা (Bengali)"
                          : "English";

  return (
    <div style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif", background: isDark ? "#0B0F19" : "#F6F7F9", minHeight: "100vh", color: isDark ? "#F8FAFC" : "#101828" }}>
      <style>{`
        html, body { margin: 0; padding: 0; background-color: ${isDark ? "#0B0F19" : "#F6F7F9"}; }
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
        <Sidebar active={active} setActive={setActive} open={open} setOpen={setOpen} lang={lang} />

        <main className="main">
          <TopBar setOpen={setOpen} village={sysInfo.village} dispPref={dispPref} lang={lang} isDark={isDark} />

          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: isDark ? "#F8FAFC" : "#101828", margin: "8px 0 4px" }}>{getTranslation(lang, "settings")}</h1>
            <p style={{ fontSize: 14, color: isDark ? "#94A3B8" : "#667085", margin: 0 }}>{getTranslation(lang, "settingsSub")}</p>
          </div>

          <div className="settings-body" style={{ marginBottom: 18 }}>
            <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} isDark={isDark} />

            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="settings-grid-2">
                <Card isDark={isDark} style={{ padding: 22 }}>
                  <CardHeader icon={icons.shield} isDark={isDark}>{getTranslation(lang, "systemInformation")}</CardHeader>
                  <Row label={getTranslation(lang, "systemName")} value={sysInfo.system_name} isDark={isDark} />
                  <Row label={getTranslation(lang, "installedLocation")} value={`${getTranslation(lang, "village")}: ${sysInfo.village}`} isDark={isDark} />
                  <Row label={getTranslation(lang, "systemId")} value={sysInfo.system_id} isDark={isDark} />
                  <Row label={getTranslation(lang, "firmwareVersion")} value={sysInfo.firmware_version} isDark={isDark} />
                  <Row label={getTranslation(lang, "lastMaintenance")} value={sysInfo.last_maintenance} isDark={isDark} />
                </Card>

                <Card isDark={isDark} style={{ padding: 22 }}>
                  <CardHeader icon={icons.monitor} isDark={isDark}>{getTranslation(lang, "displayPreferences")}</CardHeader>
                  <FieldRow
                    label={getTranslation(lang, "language")}
                    isDark={isDark}
                    control={
                      <Select
                        value={displayLangValue}
                        options={["English", "हिन्दी (Hindi)", "বাংলা (Bengali)"]}
                        isDark={isDark}
                        onChange={(val) => {
                          const targetLang = val.includes("Hindi") || val.includes("हिन्दी") ? "Hindi"
                                           : val.includes("Bengali") || val.includes("বাংলা") ? "Bengali"
                                           : "English";
                          handleUpdate("display_preferences", { ...dispPref, language: targetLang });
                        }}
                      />
                    }
                  />
                  <FieldRow
                    label={getTranslation(lang, "theme")}
                    isDark={isDark}
                    control={<Select value={dispPref.theme || "Light"} options={["Light", "Dark", "System"]} isDark={isDark} onChange={(val) => handleUpdate("display_preferences", { ...dispPref, theme: val })} />}
                  />
                  <FieldRow
                    label={getTranslation(lang, "dateFormat")}
                    isDark={isDark}
                    control={<Select value={dispPref.date_format || "DD-MM-YYYY"} options={["DD-MM-YYYY", "MM-DD-YYYY", "YYYY-MM-DD"]} isDark={isDark} onChange={(val) => handleUpdate("display_preferences", { ...dispPref, date_format: val })} />}
                  />
                  <FieldRow
                    label={getTranslation(lang, "timeFormat")}
                    isDark={isDark}
                    control={<Select value={dispPref.time_format || "12-Hour (AM/PM)"} options={["12-Hour (AM/PM)", "24-Hour"]} isDark={isDark} onChange={(val) => handleUpdate("display_preferences", { ...dispPref, time_format: val })} />}
                  />
                  <FieldRow
                    label={getTranslation(lang, "refreshInterval")}
                    isDark={isDark}
                    control={<Select value={dispPref.refresh_interval || "1 Minute"} options={["1 Minute", "5 Minutes", "15 Minutes"]} isDark={isDark} onChange={(val) => handleUpdate("display_preferences", { ...dispPref, refresh_interval: val })} />}
                  />
                </Card>
              </div>

              <div className="settings-grid-2">
                <Card isDark={isDark} style={{ padding: 22 }}>
                  <CardHeader icon={icons.ruler} isDark={isDark}>{getTranslation(lang, "measurementUnits")}</CardHeader>
                  <FieldRow
                    label="pH"
                    isDark={isDark}
                    control={<Select value={units.ph || "pH"} options={["pH"]} isDark={isDark} onChange={(val) => handleUpdate("measurement_units", { ...units, ph: val })} />}
                  />
                  <FieldRow
                    label="Turbidity"
                    isDark={isDark}
                    control={<Select value={units.turbidity || "NTU"} options={["NTU"]} isDark={isDark} onChange={(val) => handleUpdate("measurement_units", { ...units, turbidity: val })} />}
                  />
                  <FieldRow
                    label="TDS"
                    isDark={isDark}
                    control={<Select value={units.tds || "ppm"} options={["ppm", "mg/L"]} isDark={isDark} onChange={(val) => handleUpdate("measurement_units", { ...units, tds: val })} />}
                  />
                  <FieldRow
                    label="Arsenic & Metals"
                    isDark={isDark}
                    control={<Select value={units.arsenic_metals || "mg/L"} options={["mg/L", "µg/L"]} isDark={isDark} onChange={(val) => handleUpdate("measurement_units", { ...units, arsenic_metals: val })} />}
                  />
                  <FieldRow
                    label="Temperature"
                    isDark={isDark}
                    control={<Select value={units.temperature || "°C"} options={["°C", "°F"]} isDark={isDark} onChange={(val) => handleUpdate("measurement_units", { ...units, temperature: val })} />}
                  />
                </Card>

                <Card isDark={isDark} style={{ padding: 22 }}>
                  <CardHeader icon={icons.bell} isDark={isDark}>{getTranslation(lang, "alertSettings")}</CardHeader>
                  <AlertToggleRow
                    title={getTranslation(lang, "criticalAlerts")}
                    desc={getTranslation(lang, "criticalAlertsDesc")}
                    on={alertSet.critical_alerts ?? true}
                    isDark={isDark}
                    onToggle={() => handleUpdate("alert_settings", { ...alertSet, critical_alerts: !(alertSet.critical_alerts ?? true) })}
                  />
                  <AlertToggleRow
                    title={getTranslation(lang, "warningAlerts")}
                    desc={getTranslation(lang, "warningAlertsDesc")}
                    on={alertSet.warning_alerts ?? true}
                    isDark={isDark}
                    onToggle={() => handleUpdate("alert_settings", { ...alertSet, warning_alerts: !(alertSet.warning_alerts ?? true) })}
                  />
                  <AlertToggleRow
                    title={getTranslation(lang, "infoAlerts")}
                    desc={getTranslation(lang, "infoAlertsDesc")}
                    on={alertSet.info_alerts ?? true}
                    isDark={isDark}
                    onToggle={() => handleUpdate("alert_settings", { ...alertSet, info_alerts: !(alertSet.info_alerts ?? true) })}
                  />
                  <AlertToggleRow
                    title={getTranslation(lang, "maintenanceAlerts")}
                    desc={getTranslation(lang, "maintenanceAlertsDesc")}
                    on={alertSet.maintenance_alerts ?? true}
                    isDark={isDark}
                    onToggle={() => handleUpdate("alert_settings", { ...alertSet, maintenance_alerts: !(alertSet.maintenance_alerts ?? true) })}
                  />
                </Card>
              </div>

              <ThresholdsTable
                thresholds={activeSettings?.thresholds}
                onEdit={(item) => { setThresholdErr(""); setEditThreshold({ ...item }); }}
                onDelete={handleDeleteThreshold}
                onAdd={() => { setThresholdErr(""); setEditThreshold({ id: `param_${Date.now()}`, param: "", safe: "", warn: "", crit: "", unit: "" }); }}
                lang={lang}
                isDark={isDark}
              />
            </div>

            <div className="profile-col">
              <Card isDark={isDark} style={{ padding: 22 }}>
                <CardHeader icon={icons.user} isDark={isDark}>{getTranslation(lang, "userProfile")}</CardHeader>
                <Row label={getTranslation(lang, "name")} value={profile.name} isDark={isDark} />
                <Row label={getTranslation(lang, "email")} value={profile.email} isDark={isDark} />
                <Row label={getTranslation(lang, "role")} value={profile.role} isDark={isDark} />
                <Row label={getTranslation(lang, "phone")} value={profile.phone} isDark={isDark} />
                <button
                  onClick={() => {
                    setDraftProfile({
                      name: profile.name || "",
                      email: profile.email || "",
                      role: profile.role || "",
                      phone: profile.phone || "",
                    });
                    setEditProfileModal(true);
                  }}
                  style={{
                    marginTop: 16, display: "inline-flex", alignItems: "center", gap: 7,
                    border: isDark ? "1px solid #1E293B" : "1px solid #DCEBFF",
                    background: isDark ? "#1E293B" : "#EFF6FF",
                    color: "#3B82F6",
                    fontSize: 13, fontWeight: 700, padding: "9px 16px", borderRadius: 9, cursor: "pointer",
                  }}
                >
                  <Icon path={icons.edit} size={14} /> {getTranslation(lang, "editProfile")}
                </button>
              </Card>

              <Card isDark={isDark} style={{ padding: 22 }}>
                <CardHeader icon={icons.cloud} isDark={isDark}>{getTranslation(lang, "dataBackup")}</CardHeader>
                <Row label={getTranslation(lang, "lastBackup")} value={backup.last_backup} isDark={isDark} />
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: 13.5, borderBottom: isDark ? "1px solid #1E293B" : "1px solid #F5F6F8" }}>
                  <span style={{ color: isDark ? "#64748B" : "#98A2B3" }}>{getTranslation(lang, "backupStatus")}</span>
                  <span style={{ color: isDark ? "#34D399" : "#1E8E4E", fontWeight: 700 }}>{backup.status || "Successful"}</span>
                </div>
                <button
                  onClick={handleBackup}
                  style={{
                    marginTop: 16, display: "inline-flex", alignItems: "center", gap: 7,
                    border: isDark ? "1px solid #1E293B" : "1px solid #DCEBFF",
                    background: isDark ? "#1E293B" : "#EFF6FF",
                    color: "#3B82F6",
                    fontSize: 13, fontWeight: 700, padding: "9px 16px", borderRadius: 9, cursor: "pointer",
                  }}
                >
                  <Icon path={icons.cloud} size={14} /> {getTranslation(lang, "backupNow")}
                </button>
                {backupMsg && <div style={{ marginTop: 8, fontSize: 12, color: "#3B82F6", fontWeight: 600 }}>{backupMsg}</div>}
              </Card>
            </div>
          </div>

          {/* Modal for Threshold Editing */}
          {editThreshold && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: isDark ? "#131B2E" : "#fff", color: isDark ? "#F8FAFC" : "#101828", border: isDark ? "1px solid #1E2D4A" : "none", padding: 24, borderRadius: 16, width: 420, maxWidth: "90%" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 18 }}>{editThreshold.param ? "Edit Threshold" : "Add Parameter Threshold"}</h3>
                {thresholdErr && <div style={{ background: "#7F1D1D", color: "#FCA5A5", padding: "8px 12px", borderRadius: 8, fontSize: 13, marginBottom: 12, fontWeight: 500 }}>{thresholdErr}</div>}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "#94A3B8" : "#344054" }}>Parameter Name</label>
                  <input
                    type="text"
                    value={editThreshold.param}
                    onChange={(e) => setEditThreshold({ ...editThreshold, param: e.target.value })}
                    placeholder="e.g. pH, Turbidity, Lead"
                    style={{ padding: "8px 12px", border: isDark ? "1px solid #334155" : "1px solid #D0D5DD", background: isDark ? "#1E293B" : "#fff", color: isDark ? "#F8FAFC" : "#101828", borderRadius: 8, fontSize: 14 }}
                  />
                  <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "#94A3B8" : "#344054" }}>Safe Limit</label>
                  <input
                    type="text"
                    value={editThreshold.safe}
                    onChange={(e) => setEditThreshold({ ...editThreshold, safe: e.target.value })}
                    placeholder="e.g. 6.5 – 8.5 or < 5"
                    style={{ padding: "8px 12px", border: isDark ? "1px solid #334155" : "1px solid #D0D5DD", background: isDark ? "#1E293B" : "#fff", color: isDark ? "#F8FAFC" : "#101828", borderRadius: 8, fontSize: 14 }}
                  />
                  <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "#94A3B8" : "#344054" }}>Warning Range</label>
                  <input
                    type="text"
                    value={editThreshold.warn}
                    onChange={(e) => setEditThreshold({ ...editThreshold, warn: e.target.value })}
                    placeholder="e.g. 5 – 10"
                    style={{ padding: "8px 12px", border: isDark ? "1px solid #334155" : "1px solid #D0D5DD", background: isDark ? "#1E293B" : "#fff", color: isDark ? "#F8FAFC" : "#101828", borderRadius: 8, fontSize: 14 }}
                  />
                  <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "#94A3B8" : "#344054" }}>Unsafe Limit</label>
                  <input
                    type="text"
                    value={editThreshold.crit}
                    onChange={(e) => setEditThreshold({ ...editThreshold, crit: e.target.value })}
                    placeholder="e.g. > 10"
                    style={{ padding: "8px 12px", border: isDark ? "1px solid #334155" : "1px solid #D0D5DD", background: isDark ? "#1E293B" : "#fff", color: isDark ? "#F8FAFC" : "#101828", borderRadius: 8, fontSize: 14 }}
                  />
                  <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "#94A3B8" : "#344054" }}>Unit</label>
                  <input
                    type="text"
                    value={editThreshold.unit}
                    onChange={(e) => setEditThreshold({ ...editThreshold, unit: e.target.value })}
                    placeholder="e.g. NTU, ppm, mg/L"
                    style={{ padding: "8px 12px", border: isDark ? "1px solid #334155" : "1px solid #D0D5DD", background: isDark ? "#1E293B" : "#fff", color: isDark ? "#F8FAFC" : "#101828", borderRadius: 8, fontSize: 14 }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
                  <button onClick={() => setEditThreshold(null)} style={{ padding: "8px 16px", border: isDark ? "1px solid #334155" : "1px solid #D0D5DD", background: isDark ? "#1E293B" : "#fff", color: isDark ? "#F8FAFC" : "#101828", borderRadius: 8, cursor: "pointer" }}>{getTranslation(lang, "cancel")}</button>
                  <button
                    onClick={() => {
                      if (!editThreshold.param.trim() || !editThreshold.safe.trim() || !editThreshold.warn.trim() || !editThreshold.crit.trim() || !editThreshold.unit.trim()) {
                        setThresholdErr("Fields cannot be empty. Please fill in all parameters.");
                        return;
                      }
                      const rawThresholds = activeSettings?.thresholds || [];
                      const existing = Array.isArray(rawThresholds) ? rawThresholds : typeof rawThresholds === "object" ? Object.values(rawThresholds) : [];
                      const idx = existing.findIndex((t) => t.id === editThreshold.id);
                      let newThresholds;
                      if (idx >= 0) {
                        newThresholds = [...existing];
                        newThresholds[idx] = editThreshold;
                      } else {
                        newThresholds = [...existing, editThreshold];
                      }
                      handleUpdate("thresholds", newThresholds);
                      setEditThreshold(null);
                    }}
                    style={{ padding: "8px 16px", border: "none", background: "#2563EB", color: "#fff", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
                  >
                    {getTranslation(lang, "save")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal for Profile Editing */}
          {editProfileModal && draftProfile && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: isDark ? "#131B2E" : "#fff", color: isDark ? "#F8FAFC" : "#101828", border: isDark ? "1px solid #1E2D4A" : "none", padding: 24, borderRadius: 16, width: 420, maxWidth: "90%" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 18 }}>Edit User Profile</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "#94A3B8" : "#344054" }}>Full Name</label>
                  <input
                    type="text"
                    value={draftProfile.name}
                    onChange={(e) => setDraftProfile({ ...draftProfile, name: e.target.value })}
                    style={{ padding: "8px 12px", border: isDark ? "1px solid #334155" : "1px solid #D0D5DD", background: isDark ? "#1E293B" : "#fff", color: isDark ? "#F8FAFC" : "#101828", borderRadius: 8, fontSize: 14 }}
                  />
                  <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "#94A3B8" : "#344054" }}>Email Address</label>
                  <input
                    type="email"
                    value={draftProfile.email}
                    onChange={(e) => setDraftProfile({ ...draftProfile, email: e.target.value })}
                    style={{ padding: "8px 12px", border: isDark ? "1px solid #334155" : "1px solid #D0D5DD", background: isDark ? "#1E293B" : "#fff", color: isDark ? "#F8FAFC" : "#101828", borderRadius: 8, fontSize: 14 }}
                  />
                  <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "#94A3B8" : "#344054" }}>Role</label>
                  <input
                    type="text"
                    value={draftProfile.role}
                    onChange={(e) => setDraftProfile({ ...draftProfile, role: e.target.value })}
                    style={{ padding: "8px 12px", border: isDark ? "1px solid #334155" : "1px solid #D0D5DD", background: isDark ? "#1E293B" : "#fff", color: isDark ? "#F8FAFC" : "#101828", borderRadius: 8, fontSize: 14 }}
                  />
                  <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? "#94A3B8" : "#344054" }}>Phone Number</label>
                  <input
                    type="text"
                    value={draftProfile.phone}
                    onChange={(e) => setDraftProfile({ ...draftProfile, phone: e.target.value })}
                    style={{ padding: "8px 12px", border: isDark ? "1px solid #334155" : "1px solid #D0D5DD", background: isDark ? "#1E293B" : "#fff", color: isDark ? "#F8FAFC" : "#101828", borderRadius: 8, fontSize: 14 }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
                  <button onClick={() => setEditProfileModal(false)} style={{ padding: "8px 16px", border: isDark ? "1px solid #334155" : "1px solid #D0D5DD", background: isDark ? "#1E293B" : "#fff", color: isDark ? "#F8FAFC" : "#101828", borderRadius: 8, cursor: "pointer" }}>{getTranslation(lang, "cancel")}</button>
                  <button
                    onClick={() => {
                      handleUpdate("user_profile", draftProfile);
                      setEditProfileModal(false);
                    }}
                    style={{ padding: "8px 16px", border: "none", background: "#2563EB", color: "#fff", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
                  >
                    {getTranslation(lang, "save")}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{ textAlign: "center", fontSize: 12, color: isDark ? "#64748B" : "#98A2B3", marginTop: 24 }}>
            <Icon path={icons.shield} size={12} color={isDark ? "#64748B" : "#98A2B3"} style={{ marginRight: 5, verticalAlign: "-2px" }} />
            {getTranslation(lang, "toyamCommitment")}
          </div>
        </main>
      </div>
    </div>
  );
}
