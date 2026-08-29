import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDashboardData, fetchSettingsData } from "../services/api";
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

  let formattedDate = `${day}-${month}-${year}`; // DD-MM-YYYY default
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

function formatTimeOnly(timeStr, timeFormat = "12-Hour (AM/PM)") {
  if (!timeStr) return "";
  const is24H = timeFormat === "24-Hour";
  
  if (timeStr.includes("T")) {
    const d = new Date(timeStr);
    if (!isNaN(d.getTime())) {
      if (is24H) {
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
      } else {
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
      }
    }
  }

  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = match[3] ? match[3].toUpperCase() : null;

    if (is24H) {
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      return `${String(hours).padStart(2, '0')}:${minutes}`;
    } else {
      if (!ampm) {
        const period = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${period}`;
      }
      return timeStr;
    }
  }
  return timeStr;
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
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></>,
  arrowUp: <path d="M12 19V5M5 12l7-7 7 7" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  filter: <path d="M4 4h16l-6 8v6l-4 2v-8L4 4Z" />,
  thermo: <path d="M14 14.76V4a2 2 0 0 0-4 0v10.76a4 4 0 1 0 4 0Z" />,
  beaker: <path d="M9 2h6M10 2v6.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 8.5V2" />,
  cylinder: <><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v10c0 1.7 3.1 3 7 3s7-1.3 7-3V5" /></>,
  tubes: <><path d="M8 3v9a3 3 0 0 0 6 0V3" /><path d="M6 3h10" /></>,
  glass: <path d="M8 3h8l-1 15a3 3 0 0 1-6 0L8 3Z" />,
  brain: <path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3.5 3.5 0 0 0 2 6.5 3 3 0 0 0 5.5 1.5V5a3 3 0 0 0-2.5-2Zm6 0a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3.5 3.5 0 0 1-2 6.5 3 3 0 0 1-5.5 1.5V5a3 3 0 0 1 2.5-2Z" />,
  users: <><circle cx="9" cy="8" r="3" /><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" /><circle cx="17" cy="9" r="2.3" /><path d="M23 20c0-2.7-1.9-4.8-4.5-5.5" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
};

function getTone(status) {
  const value = String(status || "").toLowerCase();
  if (value.includes("unsafe") || value.includes("critical") || value.includes("high") || value.includes("offline") || value.includes("bad")) {
    return "bad";
  }
  if (value.includes("monitor") || value.includes("maintenance") || value.includes("warning") || value.includes("warn")) {
    return "warn";
  }
  return "ok";
}

function formatStatus(status, lang = "English") {
  const value = String(status || "").toLowerCase();
  if (value === "safe" || value === "within_reference" || value === "ok" || value === "healthy") return getTranslation(lang, "safe");
  if (value === "unsafe") return getTranslation(lang, "unsafe");
  if (value === "maintenance_soon") return getTranslation(lang, "warning");
  if (value === "operational") return getTranslation(lang, "safe");
  if (value === "monitoring" || value === "warning") return getTranslation(lang, "warning");
  return status ? String(status).charAt(0).toUpperCase() + String(status).slice(1) : getTranslation(lang, "safe");
}

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
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: map.bg, color: map.fg, fontSize: 12, fontWeight: 600,
      padding: "3px 9px", borderRadius: 999,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: map.dot }} />
      {children}
    </span>
  );
};

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

const SectionTitle = ({ children, isDark = false, right }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
    <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: isDark ? "#94A3B8" : "#1F2937", margin: 0 }}>
      {children}
    </h2>
    {right}
  </div>
);

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
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(10,15,25,0.45)", zIndex: 40, display: "none" }} className="sidebar-scrim" />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div style={{ padding: "22px 20px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 21, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>TOYAM</span>
              </div>
              <div style={{ fontSize: 11, color: "#7C93B8", marginTop: 2, letterSpacing: "0.02em" }}>Smart Water · Safe Future</div>
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
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", borderRadius: 10, border: "none",
                  background: isActive ? "#2563EB" : "transparent",
                  color: isActive ? "#fff" : "#B9C6DC",
                  fontSize: 14, fontWeight: isActive ? 600 : 500,
                  cursor: "pointer", textAlign: "left", width: "100%",
                  transition: "background 0.15s",
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

const iconBtnStyle = {
  background: "transparent", border: "none", cursor: "pointer",
  padding: 6, borderRadius: 8, display: "flex",
};

function TopBar({ setOpen, dashboard, sysInfo, dispPref, lang, isDark }) {
  const village = sysInfo?.village || dashboard?.info?.village || dashboard?.info?.name || "XYZ";
  const rawLastUpdated = dashboard?.system?.last_updated;
  const formattedDateTime = formatDateTime(rawLastUpdated || new Date(), dispPref?.date_format, dispPref?.time_format);
  const isOnline = dashboard?.system?.online ?? true;

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 12, flexWrap: "wrap", padding: "14px 0", marginBottom: 4,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="only-mobile" onClick={() => setOpen(true)} style={{ ...iconBtnStyle, background: isDark ? "#131B2E" : "#fff", border: isDark ? "1px solid #1E2D4A" : "1px solid #E7EBF0" }}>
          <Icon path={icons.menu} color={isDark ? "#94A3B8" : "#344054"} />
        </button>
        <div style={{
          display: "flex", alignItems: "center", gap: 6, background: isDark ? "#131B2E" : "#fff",
          border: isDark ? "1px solid #1E2D4A" : "1px solid #E7EBF0", borderRadius: 10, padding: "7px 12px", fontSize: 13, color: isDark ? "#E2E8F0" : "#344054", fontWeight: 500,
        }}>
          <Icon path={icons.pin} size={15} color="#3B82F6" />
          {getTranslation(lang, "village")}: {village}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: isDark ? "#94A3B8" : "#667085" }}>
          {getTranslation(lang, "lastUpdated")}: {formattedDateTime}
          <Icon path={icons.refresh} size={14} color={isDark ? "#64748B" : "#98A2B3"} />
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: isOnline ? (isDark ? "#064E3B" : "#EAF7EE") : (isDark ? "#7F1D1D" : "#FDECEC"),
          color: isOnline ? (isDark ? "#34D399" : "#1E8E4E") : (isDark ? "#FCA5A5" : "#C43B3B"),
          borderRadius: 999, padding: "6px 12px", fontSize: 13, fontWeight: 700,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: isOnline ? "#22C55E" : "#E5484D" }} />
          {isOnline ? "ONLINE" : "OFFLINE"}
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ dashboard, lang, isDark }) {
  const rawScore = dashboard?.water_safety?.score;
  const score = Math.round(rawScore ?? 87);
  const changePoints = dashboard?.water_safety?.change_from_yesterday ?? 3;
  const rawStatus = String(dashboard?.water_safety?.status || "SAFE").toUpperCase();
  const isUnsafe = rawStatus.includes("UNSAFE") || rawStatus.includes("BAD") || rawStatus.includes("HIGH");
  
  const statusLabel = isUnsafe ? getTranslation(lang, "unsafeToDrink") : getTranslation(lang, "safeToDrink");
  const scoreDesc = isUnsafe ? getTranslation(lang, "scoreDescUnsafe") : getTranslation(lang, "scoreDescSafe");
  const strokeColor = isUnsafe ? "#E5484D" : "#22C55E";
  const textColor = isUnsafe ? (isDark ? "#FCA5A5" : "#C43B3B") : (isDark ? "#34D399" : "#1E8E4E");
  
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - score / 100);

  return (
    <Card isDark={isDark} style={{ padding: 24, flex: "2 1 420px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: isDark ? "#64748B" : "#98A2B3", textAlign: "center", marginBottom: 18 }}>
        {getTranslation(lang, "waterSafetyScore")}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="54" fill="none" stroke={isDark ? "#1E2D4A" : "#EEF1F5"} strokeWidth="12" />
            <circle
              cx="70" cy="70" r="54" fill="none" stroke={strokeColor} strokeWidth="12"
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round" transform="rotate(-90 70 70)"
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 34, fontWeight: 800, color: isDark ? "#F8FAFC" : "#101828", lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 12, color: isDark ? "#64748B" : "#98A2B3", fontWeight: 600 }}>/100</span>
          </div>
        </div>
        <div style={{ flex: "1 1 220px", minWidth: 220 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Icon path={icons.shield} color={strokeColor} size={20} />
            <span style={{ fontSize: 20, fontWeight: 800, color: textColor }}>{statusLabel}</span>
          </div>
          <p style={{ fontSize: 14, color: isDark ? "#94A3B8" : "#667085", margin: "0 0 10px", lineHeight: 1.5 }}>
            {scoreDesc}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: textColor }}>
            <Icon path={icons.arrowUp} size={14} color={textColor} />
            {changePoints > 0 ? `+${changePoints}` : changePoints} {getTranslation(lang, "pointsFromYesterday")}
          </div>
        </div>
      </div>
    </Card>
  );
}

function QuickStatus({ dashboard, lang, isDark }) {
  const customMessage = dashboard?.system?.quick_status;

  return (
    <Card isDark={isDark} style={{ padding: 24, flex: "1 1 260px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: isDark ? "#64748B" : "#98A2B3", marginBottom: 16 }}>
        {getTranslation(lang, "quickStatus")}
      </div>
      <div style={{ background: isDark ? "#1E293B" : "#EFF6FF", borderRadius: 14, padding: 18, display: "flex", gap: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%", background: isDark ? "#0F172A" : "#DCEBFF",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon path={icons.check} size={16} color="#3B82F6" />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: isDark ? "#93C5FD" : "#1D3A6B", lineHeight: 1.5 }}>
            {customMessage || getTranslation(lang, "quickStatusDefault")}
          </p>
          <p style={{ margin: "8px 0 0", fontSize: 13.5, color: isDark ? "#64748B" : "#3B5A8A", lineHeight: 1.5 }}>
            {getTranslation(lang, "quickStatusSub")}
          </p>
        </div>
      </div>
    </Card>
  );
}

function MetricCard({ m, lang, isDark }) {
  return (
    <Card isDark={isDark} style={{ padding: 18, flex: "1 1 200px", minWidth: 180 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Icon path={m.icon} size={16} color={isDark ? "#3B82F6" : m.color} />
        <span style={{ fontSize: 13, fontWeight: 600, color: isDark ? "#94A3B8" : "#475467" }}>{m.label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 26, fontWeight: 800, color: isDark ? "#F8FAFC" : "#101828" }}>{m.value}</span>
        {m.unit && <span style={{ fontSize: 13, color: isDark ? "#64748B" : "#98A2B3", fontWeight: 600 }}>{m.unit}</span>}
        <span style={{ marginLeft: "auto" }}><Pill tone={getTone(m.status)} isDark={isDark}>{formatStatus(m.status, lang)}</Pill></span>
      </div>
      <div style={{ fontSize: 12, color: isDark ? "#64748B" : "#98A2B3" }}>{m.sub}</div>
    </Card>
  );
}

function ArsenicCard({ data, metalsUnit, threshold, lang, isDark }) {
  const isMicrogram = metalsUnit === "µg/L";
  const rawVal = data?.value ?? 0.006;
  const displayVal = isMicrogram ? (rawVal * 1000).toFixed(0) : rawVal;
  const unit = metalsUnit || data?.unit || "mg/L";
  const status = data?.status || "safe";
  
  const rawRef = data?.reference_limit || 0.010;
  const displayRef = threshold?.safe ? threshold.safe : (isMicrogram ? `${(rawRef * 1000).toFixed(0)} ${unit}` : `${rawRef} ${unit}`);
  const pctPos = Math.min(Math.max((rawVal / 0.020) * 100, 0), 100);

  return (
    <Card isDark={isDark} style={{ padding: 20, flex: "1 1 300px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: isDark ? "#E2E8F0" : "#1F2937" }}>Arsenic (As)</span>
        <Icon path={icons.info} size={14} color={isDark ? "#64748B" : "#98A2B3"} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: isDark ? "#F8FAFC" : "#101828" }}>{displayVal}</span>
        <span style={{ fontSize: 13, color: isDark ? "#64748B" : "#98A2B3", fontWeight: 600 }}>{unit}</span>
      </div>
      <div style={{ marginBottom: 16 }}><Pill tone={getTone(status)} isDark={isDark}>{formatStatus(status, lang)}</Pill></div>
      <div style={{ position: "relative", height: 6, background: isDark ? "#1E293B" : "#EEF1F5", borderRadius: 999, marginBottom: 6 }}>
        <div style={{
          position: "absolute", left: `${pctPos}%`, top: -3, width: 12, height: 12,
          borderRadius: "50%", background: getTone(status) === "bad" ? "#E5484D" : getTone(status) === "warn" ? "#F0A03D" : "#22C55E",
          border: isDark ? "2px solid #131B2E" : "2px solid #fff", boxShadow: "0 0 0 1px currentColor",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: isDark ? "#64748B" : "#98A2B3", marginBottom: 14 }}>
        <span>0</span><span>{isMicrogram ? "10" : "0.010"}</span><span>{isMicrogram ? "20" : "0.020"}</span>
      </div>
      <div style={{ fontSize: 12, color: isDark ? "#64748B" : "#98A2B3" }}>{getTranslation(lang, "referenceValue")}: {displayRef}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: isDark ? "#64748B" : "#98A2B3", marginTop: 12, paddingTop: 12, borderTop: isDark ? "1px solid #1E293B" : "1px solid #F0F2F5" }}>
        <Icon path={icons.clock} size={13} color={isDark ? "#64748B" : "#98A2B3"} />
        {getTranslation(lang, "lastMeasured")}: 11:20 AM
      </div>
    </Card>
  );
}

function HeavyMetalCard({ data, lang, isDark }) {
  const val = data?.value ?? 0.72;
  const status = data?.status || "safe";

  return (
    <Card isDark={isDark} style={{ padding: 20, flex: "1 1 300px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: isDark ? "#E2E8F0" : "#1F2937" }}>{getTranslation(lang, "heavyMetalIndex")}</span>
        <Icon path={icons.info} size={14} color={isDark ? "#64748B" : "#98A2B3"} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: isDark ? "#F8FAFC" : "#101828", marginBottom: 8 }}>{val}</div>
      <div style={{ marginBottom: 14 }}><Pill tone={getTone(status)} isDark={isDark}>{formatStatus(status, lang)}</Pill></div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: isDark ? "#64748B" : "#98A2B3" }}>
        <Icon path={icons.clock} size={13} color={isDark ? "#64748B" : "#98A2B3"} />
        {getTranslation(lang, "lastMeasured")}: 11:20 AM
      </div>
    </Card>
  );
}

function MetalsTable({ contaminants, metalsUnit, lang, isDark }) {
  const unit = metalsUnit || "mg/L";
  const isMicrogram = unit === "µg/L";
  const mult = isMicrogram ? 1000 : 1;

  const leadVal = ((contaminants?.lead?.value ?? 0.004) * mult).toFixed(isMicrogram ? 0 : 3);
  const ironVal = ((contaminants?.iron?.value ?? 0.18) * mult).toFixed(isMicrogram ? 0 : 2);
  const mangVal = ((contaminants?.manganese?.value ?? 0.05) * mult).toFixed(isMicrogram ? 0 : 2);
  const chromVal = ((contaminants?.chromium?.value ?? 0.006) * mult).toFixed(isMicrogram ? 0 : 3);

  const metals = [
    { name: "Lead (Pb)", conc: `${leadVal} ${unit}`, status: formatStatus(contaminants?.lead?.status, lang), tone: getTone(contaminants?.lead?.status) },
    { name: "Iron (Fe)", conc: `${ironVal} ${unit}`, status: formatStatus(contaminants?.iron?.status, lang), tone: getTone(contaminants?.iron?.status) },
    { name: "Manganese (Mn)", conc: `${mangVal} ${unit}`, status: formatStatus(contaminants?.manganese?.status, lang), tone: getTone(contaminants?.manganese?.status) },
    { name: "Chromium (Cr)", conc: `${chromVal} ${unit}`, status: formatStatus(contaminants?.chromium?.status, lang), tone: getTone(contaminants?.chromium?.status) },
  ];

  return (
    <Card isDark={isDark} style={{ padding: 0, flex: "2 1 380px", overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 420 }}>
          <thead>
            <tr style={{ borderBottom: isDark ? "1px solid #1E293B" : "1px solid #EEF1F5" }}>
              {["Metal", "Concentration", "Status", "Trend"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "14px 18px", fontSize: 11.5, color: isDark ? "#64748B" : "#98A2B3", fontWeight: 700, letterSpacing: "0.03em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metals.map((m) => (
              <tr key={m.name} style={{ borderBottom: isDark ? "1px solid #1E293B" : "1px solid #F5F6F8" }}>
                <td style={{ padding: "14px 18px", fontSize: 13.5, color: isDark ? "#CBD5E1" : "#344054", fontWeight: 500 }}>{m.name}</td>
                <td style={{ padding: "14px 18px", fontSize: 13.5, color: isDark ? "#CBD5E1" : "#344054" }}>{m.conc}</td>
                <td style={{ padding: "14px 18px" }}><Pill tone={m.tone} isDark={isDark}>{m.status}</Pill></td>
                <td style={{ padding: "14px 18px" }}>
                  <svg width="46" height="18" viewBox="0 0 46 18">
                    <polyline points="0,12 8,9 16,13 24,7 32,10 40,6 46,9" fill="none" stroke={isDark ? "#475569" : "#98A2B3"} strokeWidth="1.6" />
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: "12px 18px", textAlign: "right", borderTop: isDark ? "1px solid #1E293B" : "1px solid #F5F6F8" }}>
        <a href="#" style={{ fontSize: 13, color: "#3B82F6", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
          {getTranslation(lang, "viewAllMetals")} <Icon path={icons.arrowRight} size={13} />
        </a>
      </div>
    </Card>
  );
}

function Pipeline({ stages, lang, isDark }) {
  const PIPELINE = [
    { label: "SOURCE", icon: icons.beaker, status: stages?.source?.status || "healthy" },
    { label: "SEDIMENT", icon: icons.filter, status: stages?.sediment?.status || "healthy" },
    { label: "CARBON", icon: icons.cylinder, status: stages?.carbon?.status || "healthy" },
    { label: "UF/RO", icon: icons.tubes, status: stages?.uf_ro?.status || "healthy" },
    { label: "UV", icon: icons.thermo, status: stages?.uv?.status || "healthy" },
    { label: "CLEAN WATER", icon: icons.glass, status: stages?.clean_water?.status || "healthy" },
  ];

  const allOperational = PIPELINE.every(s => getTone(s.status) === "ok");

  return (
    <Card isDark={isDark} style={{ padding: 24 }}>
      <SectionTitle isDark={isDark}>{getTranslation(lang, "purificationPipeline")}</SectionTitle>
      <div className="pipeline-row">
        {PIPELINE.map((stage, i) => (
          <React.Fragment key={stage.label}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 76 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: isDark ? "#1E293B" : "#EFF6FF",
                border: isDark ? "1px solid #334155" : "1px solid #DCEBFF",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon path={stage.icon} size={22} color="#3B82F6" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? "#94A3B8" : "#475467", letterSpacing: "0.02em" }}>{stage.label}</span>
                <Icon path={icons.check} size={12} color={getTone(stage.status) === "ok" ? "#22C55E" : "#F0A03D"} />
              </div>
            </div>
            {i < PIPELINE.length - 1 && (
              <div className="pipeline-connector">
                <Icon path={icons.arrowRight} size={16} color={isDark ? "#475569" : "#D0D5DD"} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div style={{
        marginTop: 20,
        background: allOperational ? (isDark ? "#064E3B" : "#EAF7EE") : (isDark ? "#78350F" : "#FEF4E6"),
        borderRadius: 10, padding: "10px 16px",
        display: "flex", alignItems: "center", gap: 8, fontSize: 13,
        color: allOperational ? (isDark ? "#34D399" : "#1E8E4E") : (isDark ? "#FBBF24" : "#B8730B"),
        fontWeight: 600,
      }}>
        <Icon path={icons.check} size={15} color={allOperational ? (isDark ? "#34D399" : "#1E8E4E") : (isDark ? "#FBBF24" : "#B8730B")} />
        {allOperational ? getTranslation(lang, "allStagesOperational") : getTranslation(lang, "stagesAttentionRequired")}
      </div>
    </Card>
  );
}

function TrendChart({ points, tempUnit, isDark }) {
  const rawPoints = points || [];
  const trendPoints = Array.isArray(rawPoints) ? rawPoints : typeof rawPoints === "object" ? Object.values(rawPoints) : [];

  if (!trendPoints || trendPoints.length === 0) {
    return (
      <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: isDark ? "#64748B" : "#98A2B3", fontSize: 13 }}>
        No trend data available for this period.
      </div>
    );
  }

  const isFahrenheit = tempUnit === "°F";

  const trendData = trendPoints.map(p => {
    const rawTemp = p.temperature ?? p.temp ?? 25.0;
    const displayTemp = isFahrenheit ? (rawTemp * 9/5) + 32 : rawTemp;
    return {
      t: p.timestamp || p.t,
      turb: p.turbidity ?? p.turb ?? 0,
      tds: p.tds ?? 0,
      ph: p.ph ?? 7.0,
      temp: displayTemp,
    };
  });

  const w = 640, h = 220, padL = 34, padR = 34, padT = 12, padB = 26;
  const innerW = w - padL - padR, innerH = h - padT - padB;
  const xStep = trendData.length > 1 ? innerW / (trendData.length - 1) : innerW;

  const scaleLeft = (v) => padT + innerH - ((v || 0) / 10) * innerH;
  const scaleRight = (v) => padT + innerH - ((v || 0) / 800) * innerH;
  const scaleTemp = (v) => {
    const maxTemp = isFahrenheit ? 100 : 40;
    return padT + innerH - ((v || 0) / maxTemp) * innerH;
  };

  const path = (key, scale) =>
    trendData.map((p, i) => `${i === 0 ? "M" : "L"} ${padL + i * xStep} ${scale(p[key])}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto", display: "block" }} preserveAspectRatio="xMidYMid meet">
      {[0, 2, 4, 6, 8, 10].map((v) => (
        <line key={v} x1={padL} x2={w - padR} y1={scaleLeft(v)} y2={scaleLeft(v)} stroke={isDark ? "#1E293B" : "#EEF1F5"} strokeWidth="1" />
      ))}
      {[0, 2, 4, 6, 8, 10].map((v) => (
        <text key={v} x={padL - 8} y={scaleLeft(v) + 3} fontSize="9" fill={isDark ? "#64748B" : "#98A2B3"} textAnchor="end">{v}</text>
      ))}
      {[0, 200, 400, 600, 800].map((v) => (
        <text key={v} x={w - padR + 8} y={scaleRight(v) + 3} fontSize="9" fill={isDark ? "#64748B" : "#98A2B3"} textAnchor="start">{v}</text>
      ))}
      <path d={path("turb", scaleLeft)} fill="none" stroke="#3B82F6" strokeWidth="2" />
      <path d={path("tds", scaleRight)} fill="none" stroke="#10B981" strokeWidth="2" />
      <path d={path("ph", (v) => scaleLeft((v || 7) * (10 / 8.5)))} fill="none" stroke="#A855F7" strokeWidth="2" />
      <path d={path("temp", scaleTemp)} fill="none" stroke="#F59E0B" strokeWidth="2" />
      {trendData.map((p, i) => (
        <g key={i}>
          <circle cx={padL + i * xStep} cy={scaleLeft(p.turb)} r="2.6" fill="#3B82F6" />
          <circle cx={padL + i * xStep} cy={scaleRight(p.tds)} r="2.6" fill="#10B981" />
          <circle cx={padL + i * xStep} cy={scaleLeft((p.ph || 7) * (10 / 8.5))} r="2.6" fill="#A855F7" />
          <circle cx={padL + i * xStep} cy={scaleTemp(p.temp)} r="2.6" fill="#F59E0B" />
          <text x={padL + i * xStep} y={h - 6} fontSize="9" fill={isDark ? "#64748B" : "#98A2B3"} textAnchor="middle">{p.t}</text>
        </g>
      ))}
    </svg>
  );
}

function TrendCard({ dashboard, tempUnit, lang, isDark }) {
  const [range, setRange] = useState("24H");
  const trendsObj = dashboard?.trends || {};
  const rawPoints = range === "24H" ? trendsObj.last_24h
               : range === "7D" ? trendsObj.last_7d
               : trendsObj.last_30d;

  const points = Array.isArray(rawPoints) ? rawPoints : typeof rawPoints === "object" ? Object.values(rawPoints || {}) : [];

  return (
    <Card isDark={isDark} style={{ padding: 22, flex: "2 1 420px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 4 }}>
        <SectionTitle isDark={isDark}>{getTranslation(lang, "waterQualityTrend")}</SectionTitle>
        <div style={{ display: "flex", gap: 4, background: isDark ? "#1E293B" : "#F5F6F8", borderRadius: 8, padding: 3 }}>
          {["24H", "7D", "30D"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
                padding: "5px 12px", borderRadius: 6,
                background: range === r ? (isDark ? "#3B82F6" : "#101828") : "transparent",
                color: range === r ? "#fff" : (isDark ? "#94A3B8" : "#667085"),
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, fontSize: 12, color: isDark ? "#94A3B8" : "#667085", marginBottom: 10, flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><i style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6", display: "inline-block" }} />Turbidity (NTU)</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><i style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />TDS (ppm)</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><i style={{ width: 8, height: 8, borderRadius: "50%", background: "#A855F7", display: "inline-block" }} />pH</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><i style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B", display: "inline-block" }} />Temp ({tempUnit || "°C"})</span>
      </div>
      <TrendChart points={points} tempUnit={tempUnit} isDark={isDark} />
      <div style={{
        marginTop: 14, background: isDark ? "#1E293B" : "#EFF6FF", borderRadius: 10, padding: "10px 14px",
        display: "flex", gap: 8, fontSize: 12.5, color: isDark ? "#93C5FD" : "#3B5A8A",
      }}>
        <Icon path={icons.brain} size={15} color="#3B82F6" />
        <span><strong style={{ color: isDark ? "#60A5FA" : "#1D3A6B" }}>{getTranslation(lang, "aiInsightTitle")}</strong> {getTranslation(lang, "aiInsightBody")}</span>
      </div>
    </Card>
  );
}

function AlertsCard({ alerts, timeFormat, lang, isDark }) {
  const rawRecent = alerts?.recent || [];
  const recentAlerts = Array.isArray(rawRecent) ? rawRecent : typeof rawRecent === "object" ? Object.values(rawRecent) : [];
  
  const hasActiveAlerts = recentAlerts.some(a => {
    const s = String(a?.status || "").toLowerCase();
    return s === "active" || s === "monitoring";
  });

  const displayEvents = recentAlerts.length > 0 ? recentAlerts : [
    { title: "Water quality normal", timestamp: "10:42 AM", status: "resolved" },
    { title: "Filter performance checked", timestamp: "09:15 AM", status: "resolved" },
    { title: "Carbon filter approaching maintenance threshold", timestamp: "Yesterday", status: "resolved" },
  ];

  return (
    <Card isDark={isDark} style={{ padding: 22, flex: "1 1 300px", display: "flex", flexDirection: "column" }}>
      <SectionTitle isDark={isDark}>{getTranslation(lang, "alerts")}</SectionTitle>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: hasActiveAlerts ? (isDark ? "#78350F" : "#FEF4E6") : (isDark ? "#064E3B" : "#EAF7EE"),
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon path={icons.check} size={16} color={hasActiveAlerts ? "#F0A03D" : "#22C55E"} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: hasActiveAlerts ? (isDark ? "#FBBF24" : "#B8730B") : (isDark ? "#34D399" : "#1E8E4E") }}>
            {hasActiveAlerts ? getTranslation(lang, "activeAlertsDetected") : getTranslation(lang, "noActiveAlerts")}
          </div>
          <div style={{ fontSize: 12.5, color: isDark ? "#64748B" : "#98A2B3" }}>
            {hasActiveAlerts ? getTranslation(lang, "activeAlertsSub") : getTranslation(lang, "noAlertsSub")}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: isDark ? "#64748B" : "#98A2B3", letterSpacing: "0.05em", marginBottom: 10 }}>{getTranslation(lang, "recentEvents")}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {displayEvents.map((e, i) => {
          const tone = getTone(e.status);
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%", marginTop: 5, flexShrink: 0,
                background: tone === "ok" ? "#22C55E" : tone === "warn" ? "#F0A03D" : "#E5484D",
              }} />
              <div>
                <div style={{ fontSize: 12, color: isDark ? "#64748B" : "#98A2B3" }}>{formatTimeOnly(e.timestamp, timeFormat)}</div>
                <div style={{ fontSize: 13.5, color: isDark ? "#CBD5E1" : "#344054" }}>{e.title || e.message}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: "auto", paddingTop: 16, textAlign: "right" }}>
        <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "#3B82F6", fontWeight: 600, textDecoration: "none" }}>
          {getTranslation(lang, "viewAllAlerts")} <Icon path={icons.arrowRight} size={13} />
        </a>
      </div>
    </Card>
  );
}

function FilterHealth({ filters, lang, isDark }) {
  const sediment = filters?.sediment || {};
  const carbon = filters?.carbon || {};
  const ufRo = filters?.uf_ro || {};

  const items = [
    { name: "Sediment Filter", pct: sediment.health ?? 82, status: formatStatus(sediment.status || "healthy", lang), tone: getTone(sediment.status || "healthy") },
    { name: "Carbon Filter", pct: carbon.health ?? 64, status: formatStatus(carbon.status || "maintenance_soon", lang), tone: getTone(carbon.status || "maintenance_soon") },
    { name: "Membrane (UF/RO)", pct: ufRo.health ?? 71, status: formatStatus(ufRo.status || "healthy", lang), tone: getTone(ufRo.status || "healthy") },
  ];

  return (
    <Card isDark={isDark} style={{ padding: 22, flex: "1 1 320px" }}>
      <SectionTitle isDark={isDark}>{getTranslation(lang, "filterHealth")}</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {items.map((f) => (
          <div key={f.name}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: isDark ? "#CBD5E1" : "#344054", fontWeight: 500 }}>
                <Icon path={f.name.includes("Membrane") ? icons.tubes : icons.cylinder} size={15} color={isDark ? "#64748B" : "#667085"} />
                {f.name}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? "#E2E8F0" : "#344054" }}>{f.pct}%</span>
                <Pill tone={f.tone} isDark={isDark}>{f.status}</Pill>
              </div>
            </div>
            <div style={{ height: 7, background: isDark ? "#1E293B" : "#EEF1F5", borderRadius: 999 }}>
              <div style={{
                width: `${f.pct}%`, height: "100%", borderRadius: 999,
                background: f.tone === "ok" ? "#22C55E" : f.tone === "warn" ? "#F0A03D" : "#E5484D",
              }} />
            </div>
          </div>
        ))}
      </div>
      <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "#3B82F6", fontWeight: 600, textDecoration: "none", marginTop: 18 }}>
        {getTranslation(lang, "viewMaintenance")} <Icon path={icons.arrowRight} size={13} />
      </a>
    </Card>
  );
}

function RiskCard({ risk, lang, isDark }) {
  const riskLevel = risk?.risk_level || "low";
  const summary = risk?.summary || "Current measured contaminant levels are below configured reference thresholds.";
  const rawFindings = risk?.key_findings || [
    { label: "Arsenic", status: "Within reference value", tone: "ok" },
    { label: "Lead", status: "Low", tone: "ok" },
    { label: "Chromium", status: "Low", tone: "ok" },
    { label: "Manganese", status: "Monitor", tone: "warn" },
    { label: "Iron", status: "Low", tone: "ok" },
  ];
  const keyFindings = Array.isArray(rawFindings) ? rawFindings : typeof rawFindings === "object" ? Object.values(rawFindings) : [];

  return (
    <Card isDark={isDark} style={{ padding: 22, flex: "1 1 420px" }}>
      <SectionTitle isDark={isDark}>{getTranslation(lang, "waterRiskAwareness")}</SectionTitle>
      <div className="risk-grid">
        <div style={{ background: isDark ? "#1E293B" : "#F9FAFB", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: isDark ? "#64748B" : "#98A2B3", marginBottom: 8 }}>{getTranslation(lang, "currentAssessment")}</div>
          <div style={{ marginBottom: 10 }}><Pill tone={getTone(riskLevel)} isDark={isDark}>{String(riskLevel).toUpperCase()} CONTAMINATION RISK</Pill></div>
          <p style={{ fontSize: 12.5, color: isDark ? "#94A3B8" : "#667085", lineHeight: 1.5, margin: 0 }}>
            {summary}
          </p>
          <p style={{ fontSize: 11.5, color: isDark ? "#64748B" : "#98A2B3", margin: "10px 0 0", fontStyle: "italic" }}>
            {getTranslation(lang, "riskIndicatorNote")}
          </p>
        </div>
        <div>
          <div style={{ fontSize: 12, color: isDark ? "#64748B" : "#98A2B3", marginBottom: 10 }}>{getTranslation(lang, "keyFindings")}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {keyFindings.map((f, i) => {
              const label = f.name || f.label || `Item ${i+1}`;
              const status = formatStatus(f.status, lang);
              const tone = getTone(f.status);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 7, color: isDark ? "#CBD5E1" : "#344054" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: tone === "ok" ? "#22C55E" : "#F0A03D" }} />
                    {label}
                  </span>
                  <span style={{ color: isDark ? "#64748B" : "#667085", fontSize: 12.5 }}>{status}</span>
                </div>
              );
            })}
          </div>
          <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "#3B82F6", fontWeight: 600, textDecoration: "none", marginTop: 14 }}>
            {getTranslation(lang, "viewDetailedRisk")} <Icon path={icons.arrowRight} size={13} />
          </a>
        </div>
      </div>
    </Card>
  );
}

function BottomInfoCard({ icon, iconBg, iconColor, title, body, linkLabel, isDark }) {
  return (
    <Card isDark={isDark} style={{ padding: 20, flex: "1 1 280px" }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10, background: isDark ? "#1E293B" : iconBg,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
      }}>
        <Icon path={icon} size={17} color={iconColor} />
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: isDark ? "#F8FAFC" : "#1F2937", marginBottom: 8 }}>{title}</div>
      <p style={{ fontSize: 12.5, color: isDark ? "#94A3B8" : "#667085", lineHeight: 1.55, margin: "0 0 12px" }}>{body}</p>
      <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "#3B82F6", fontWeight: 600, textDecoration: "none" }}>
        {linkLabel} <Icon path={icons.arrowRight} size={12} />
      </a>
    </Card>
  );
}

export default function Dashboard({ dashboard: propDashboard, settings: propSettings }) {
  const [dashboard, setDashboard] = useState(propDashboard || null);
  const [settings, setSettings] = useState(propSettings || null);
  const [error, setError] = useState(null);
  const [active, setActive] = useState("dashboard");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (propDashboard) setDashboard(propDashboard);
    if (propSettings) setSettings(propSettings);

    if (!propDashboard || !propSettings) {
      Promise.all([
        propDashboard ? Promise.resolve(propDashboard) : fetchDashboardData(),
        propSettings ? Promise.resolve(propSettings) : fetchSettingsData(),
      ])
        .then(([dash, setts]) => {
          setDashboard(dash);
          setSettings(setts);
        })
        .catch((err) => setError(err.message));
    }
  }, [propDashboard, propSettings]);

  const activeSettings = propSettings || settings;
  const activeDashboard = propDashboard || dashboard;

  const rawLang = activeSettings?.display_preferences?.language || "English";
  const lang = normalizeLanguage(rawLang);

  const themeSetting = activeSettings?.display_preferences?.theme || "Light";
  const isDark = themeSetting === "Dark" || (themeSetting === "System" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    const refreshText = activeSettings?.display_preferences?.refresh_interval || "1 Minute";
    let intervalMs = 60000;
    if (refreshText.includes("5")) intervalMs = 5 * 60000;
    else if (refreshText.includes("15")) intervalMs = 15 * 60000;

    const timer = setInterval(() => {
      fetchDashboardData().then((dash) => setDashboard(dash)).catch(() => {});
    }, intervalMs);

    return () => clearInterval(timer);
  }, [activeSettings?.display_preferences?.refresh_interval]);

  if (error) {
    return (
      <div style={{ padding: 30, color: "#C43B3B", fontFamily: "sans-serif" }}>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>API Connection Error</h2>
        <p style={{ fontSize: 14, color: "#475467" }}>{error}</p>
        <p style={{ fontSize: 13, color: "#667085", marginTop: 12 }}>
          Ensure your FastAPI backend is running locally at <code>http://127.0.0.1:8000</code>.
        </p>
      </div>
    );
  }

  const wq = activeDashboard?.water_quality || {};
  const units = activeSettings?.measurement_units || {};
  const sysInfo = activeSettings?.system_info || {};
  const dispPref = activeSettings?.display_preferences || {};
  
  const rawThresholds = activeSettings?.thresholds || [];
  const thresholds = Array.isArray(rawThresholds) ? rawThresholds : typeof rawThresholds === "object" ? Object.values(rawThresholds) : [];

  const tempUnit = units.temperature || "°C";
  const rawTemp = wq.temperature ?? 27.4;
  const isFahrenheit = tempUnit === "°F";
  const displayTemp = isFahrenheit ? ((rawTemp * 9 / 5) + 32).toFixed(1) : rawTemp;
  
  const tempThreshold = thresholds.find((t) => String(t?.param || "").toLowerCase().includes("temp"));
  const tempSub = tempThreshold ? `Safe: ${tempThreshold.safe}` : (isFahrenheit ? "Range: 77 - 86 °F" : "Range: 25 - 30 °C");

  const tdsUnit = units.tds || "ppm";
  const tdsThreshold = thresholds.find((t) => String(t?.param || "").toLowerCase().includes("tds"));
  const tdsSub = tdsThreshold ? `Safe: ${tdsThreshold.safe} ${tdsUnit}` : `Ideal: < 600 ${tdsUnit}`;

  const metalsUnit = units.arsenic_metals || "mg/L";
  const arsenicThreshold = thresholds.find((t) => String(t?.param || "").toLowerCase().includes("arsenic"));

  const phThreshold = thresholds.find((t) => String(t?.param || "").toLowerCase().includes("ph"));
  const phSub = phThreshold ? `Safe: ${phThreshold.safe}` : "Range: 6.5 - 8.5";

  const turbThreshold = thresholds.find((t) => String(t?.param || "").toLowerCase().includes("turbidity"));
  const turbSub = turbThreshold ? `Safe: ${turbThreshold.safe}` : "Safe: < 5 NTU";

  const METRICS = [
    { label: "pH", value: wq.ph ?? "7.2", unit: "", icon: icons.beaker, sub: phSub, color: "#2F6FED", status: "ok" },
    { label: "Turbidity", value: wq.turbidity ?? "2.1", unit: units.turbidity || "NTU", icon: icons.drop, sub: turbSub, color: "#2F6FED", status: "ok" },
    { label: "TDS", value: wq.tds ?? "480", unit: tdsUnit, icon: icons.drop, sub: tdsSub, color: "#2F6FED", status: "ok" },
    { label: "Temperature", value: displayTemp, unit: tempUnit, icon: icons.thermo, sub: tempSub, color: "#2F6FED", status: "ok" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif", background: isDark ? "#0B0F19" : "#F6F7F9", minHeight: "100vh", color: isDark ? "#F8FAFC" : "#101828" }}>
      <style>{`
        html, body { margin: 0; padding: 0; background-color: ${isDark ? "#0B0F19" : "#F6F7F9"}; }
        * { box-sizing: border-box; }
        .layout { display: flex; min-height: 100vh; }
        .sidebar {
          width: 232px; background: #0C1830; display: flex; flex-direction: column;
          flex-shrink: 0; position: sticky; top: 0; height: 100vh;
        }
        .main { flex: 1; min-width: 0; padding: 20px clamp(16px, 3vw, 32px) 40px; }
        .only-mobile { display: none; }
        .metrics-row, .contam-row, .bottom-row { display: flex; gap: 16px; flex-wrap: wrap; }
        .top-cards-row { display: flex; gap: 16px; flex-wrap: wrap; }
        .mid-row { display: flex; gap: 16px; flex-wrap: wrap; align-items: stretch; }
        .pipeline-row { display: flex; align-items: center; overflow-x: auto; padding-bottom: 4px; gap: 4px; }
        .pipeline-connector { display: flex; align-items: center; padding: 0 4px; flex-shrink: 0; margin-bottom: 22px; }
        .risk-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .sidebar-scrim { display: none; }

        @media (max-width: 980px) {
          .sidebar { position: fixed; left: -260px; top: 0; z-index: 50; transition: left 0.22s ease; box-shadow: 0 0 0 rgba(0,0,0,0); }
          .sidebar-open { left: 0; box-shadow: 8px 0 24px rgba(0,0,0,0.25); }
          .only-mobile { display: flex; }
          .sidebar-scrim { display: block !important; }
          .risk-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .main { padding: 16px 14px 32px; }
        }
      `}</style>

      <div className="layout">
        <Sidebar active={active} setActive={setActive} open={open} setOpen={setOpen} lang={lang} />

        <main className="main">
          <TopBar setOpen={setOpen} dashboard={activeDashboard} sysInfo={sysInfo} dispPref={dispPref} lang={lang} isDark={isDark} />

          <div className="top-cards-row" style={{ marginBottom: 16 }}>
            <ScoreCard dashboard={activeDashboard} lang={lang} isDark={isDark} />
            <QuickStatus dashboard={activeDashboard} lang={lang} isDark={isDark} />
          </div>

          <div className="metrics-row" style={{ marginBottom: 16 }}>
            {METRICS.map((m) => <MetricCard key={m.label} m={m} lang={lang} isDark={isDark} />)}
          </div>

          <Card isDark={isDark} style={{ padding: 22, marginBottom: 16 }}>
            <SectionTitle isDark={isDark}>{getTranslation(lang, "contaminantMonitoring")}</SectionTitle>
            <div className="contam-row">
              <ArsenicCard data={activeDashboard?.contaminants?.arsenic} metalsUnit={metalsUnit} threshold={arsenicThreshold} lang={lang} isDark={isDark} />
              <HeavyMetalCard data={activeDashboard?.contaminants?.heavy_metal_index} lang={lang} isDark={isDark} />
              <MetalsTable contaminants={activeDashboard?.contaminants} metalsUnit={metalsUnit} lang={lang} isDark={isDark} />
            </div>
          </Card>

          <div style={{ marginBottom: 16 }}>
            <Pipeline stages={activeDashboard?.purification?.stages} lang={lang} isDark={isDark} />
          </div>

          <div className="mid-row" style={{ marginBottom: 16 }}>
            <TrendCard dashboard={activeDashboard} tempUnit={tempUnit} lang={lang} isDark={isDark} />
            <AlertsCard alerts={activeDashboard?.alerts} timeFormat={dispPref?.time_format} lang={lang} isDark={isDark} />
          </div>

          <div className="mid-row" style={{ marginBottom: 16 }}>
            <FilterHealth filters={activeDashboard?.filters} lang={lang} isDark={isDark} />
            <RiskCard risk={activeDashboard?.risk_awareness} lang={lang} isDark={isDark} />
          </div>

          <div className="bottom-row">
            <BottomInfoCard
              isDark={isDark}
              icon={icons.chart} iconBg="#EFF6FF" iconColor="#3B82F6"
              title={getTranslation(lang, "card1Title")}
              body={getTranslation(lang, "card1Body")}
              linkLabel={getTranslation(lang, "card1Link")}
            />
            <BottomInfoCard
              isDark={isDark}
              icon={icons.brain} iconBg="#F3EEFF" iconColor="#A855F7"
              title={getTranslation(lang, "card2Title")}
              body={getTranslation(lang, "card2Body")}
              linkLabel={getTranslation(lang, "card2Link")}
            />
            <BottomInfoCard
              isDark={isDark}
              icon={icons.users} iconBg="#FEF4E6" iconColor="#F59E0B"
              title={getTranslation(lang, "card3Title")}
              body={getTranslation(lang, "card3Body")}
              linkLabel={getTranslation(lang, "card3Link")}
            />
          </div>

          <div style={{ textAlign: "center", fontSize: 12, color: isDark ? "#64748B" : "#98A2B3", marginTop: 24 }}>
            <Icon path={icons.shield} size={12} color={isDark ? "#64748B" : "#98A2B3"} style={{ marginRight: 5, verticalAlign: "-2px" }} />
            {getTranslation(lang, "toyamCommitment")}
          </div>
        </main>
      </div>
    </div>
  );
}
