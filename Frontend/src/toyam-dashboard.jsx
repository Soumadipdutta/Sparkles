import React, { useState } from "react";
// const [riskData, setRiskData] = useState(null);

const checkHealthRisk = async (parameter, value) => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/health-risk",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parameter,
          value,
        }),
      }
    );

    const data = await response.json();

    console.log("Backend response:", data);

    setRiskData(data);

    return data;
  } catch (error) {
    console.error("Backend connection error:", error);
  }
};

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

/* ---------- Small building blocks ---------- */
const Pill = ({ tone = "ok", children }) => {
  const map = {
    ok: { bg: "#EAF7EE", fg: "#1E8E4E", dot: "#22B15C" },
    warn: { bg: "#FEF4E6", fg: "#B8730B", dot: "#F0A03D" },
    bad: { bg: "#FDECEC", fg: "#C43B3B", dot: "#E5484D" },
  }[tone];
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

const Card = ({ children, style, ...p }) => (
  <div
    style={{
      background: "#fff",
      border: "1px solid #E7EBF0",
      borderRadius: 16,
      boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
      ...style,
    }}
    {...p}
  >
    {children}
  </div>
);

const SectionTitle = ({ children, right }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
    <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#1F2937", margin: 0 }}>
      {children}
    </h2>
    {right}
  </div>
);

/* ---------- Data (mirrors source dashboard) ---------- */
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

const METRICS = [
  { label: "pH", value: "7.2", unit: "", icon: icons.beaker, sub: "Range: 6.5 - 8.5", color: "#2F6FED" },
  { label: "Turbidity", value: "2.1", unit: "NTU", icon: icons.drop, sub: "Safe: < 5 NTU", color: "#2F6FED" },
  { label: "TDS", value: "480", unit: "ppm", icon: icons.drop, sub: "Ideal: < 600 ppm", color: "#2F6FED" },
  { label: "Temperature", value: "27.4", unit: "°C", icon: icons.thermo, sub: "Range: 25 - 30 °C", color: "#2F6FED" },
];

const METALS = [
  { name: "Lead (Pb)", conc: "0.004 mg/L", status: "Low", tone: "ok" },
  { name: "Iron (Fe)", conc: "0.18 mg/L", status: "Low", tone: "ok" },
  { name: "Manganese (Mn)", conc: "0.05 mg/L", status: "Monitor", tone: "warn" },
  { name: "Chromium (Cr)", conc: "0.006 mg/L", status: "Low", tone: "ok" },
];

const PIPELINE = [
  { label: "SOURCE", icon: icons.beaker },
  { label: "SEDIMENT", icon: icons.filter },
  { label: "CARBON", icon: icons.cylinder },
  { label: "UF/RO", icon: icons.tubes },
  { label: "UV", icon: icons.thermo },
  { label: "CLEAN WATER", icon: icons.glass },
];

const EVENTS = [
  { time: "10:42 AM", label: "Water quality normal", tone: "ok" },
  { time: "09:15 AM", label: "Filter performance checked", tone: "ok" },
  { time: "Yesterday", label: "Carbon filter approaching maintenance threshold", tone: "warn" },
];

const FILTERS = [
  { name: "Sediment Filter", pct: 82, status: "Healthy", tone: "ok" },
  { name: "Carbon Filter", pct: 64, status: "Maintenance Soon", tone: "warn" },
  { name: "Membrane (UF/RO)", pct: 71, status: "Healthy", tone: "ok" },
];

const FINDINGS = [
  { label: "Arsenic", status: "Within reference value", tone: "ok" },
  { label: "Lead", status: "Low", tone: "ok" },
  { label: "Chromium", status: "Low", tone: "ok" },
  { label: "Manganese", status: "Monitor", tone: "warn" },
  { label: "Iron", status: "Low", tone: "ok" },
];

const TREND_POINTS = [
  { t: "12 PM", turb: 3.1, tds: 460, ph: 6.9 },
  { t: "4 PM", turb: 2.6, tds: 470, ph: 7.0 },
  { t: "8 PM", turb: 3.4, tds: 455, ph: 7.1 },
  { t: "12 AM", turb: 2.2, tds: 480, ph: 7.0 },
  { t: "4 AM", turb: 2.8, tds: 465, ph: 6.95 },
  { t: "8 AM", turb: 2.0, tds: 475, ph: 7.15 },
  { t: "11 AM", turb: 2.1, tds: 480, ph: 7.2 },
];

/* ---------- Chart (lightweight inline SVG) ---------- */
function TrendChart() {
  const w = 640, h = 220, padL = 34, padR = 34, padT = 12, padB = 26;
  const innerW = w - padL - padR, innerH = h - padT - padB;
  const xStep = innerW / (TREND_POINTS.length - 1);

  const scaleLeft = (v) => padT + innerH - (v / 10) * innerH; // turbidity 0-10
  const scaleRight = (v) => padT + innerH - (v / 800) * innerH; // tds 0-800

  const path = (key, scale) =>
    TREND_POINTS.map((p, i) => `${i === 0 ? "M" : "L"} ${padL + i * xStep} ${scale(p[key])}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto", display: "block" }} preserveAspectRatio="xMidYMid meet">
      {[0, 2, 4, 6, 8, 10].map((v) => (
        <line key={v} x1={padL} x2={w - padR} y1={scaleLeft(v)} y2={scaleLeft(v)} stroke="#EEF1F5" strokeWidth="1" />
      ))}
      {[0, 2, 4, 6, 8, 10].map((v) => (
        <text key={v} x={padL - 8} y={scaleLeft(v) + 3} fontSize="9" fill="#98A2B3" textAnchor="end">{v}</text>
      ))}
      {[0, 200, 400, 600, 800].map((v) => (
        <text key={v} x={w - padR + 8} y={scaleRight(v) + 3} fontSize="9" fill="#98A2B3" textAnchor="start">{v}</text>
      ))}
      <path d={path("turb", scaleLeft)} fill="none" stroke="#2F6FED" strokeWidth="2" />
      <path d={path("tds", scaleRight)} fill="none" stroke="#1FAA6C" strokeWidth="2" />
      <path d={path("ph", (v) => scaleLeft(v * (10 / 8.5)))} fill="none" stroke="#8B5CF6" strokeWidth="2" />
      {TREND_POINTS.map((p, i) => (
        <g key={i}>
          <circle cx={padL + i * xStep} cy={scaleLeft(p.turb)} r="2.6" fill="#2F6FED" />
          <circle cx={padL + i * xStep} cy={scaleRight(p.tds)} r="2.6" fill="#1FAA6C" />
          <circle cx={padL + i * xStep} cy={scaleLeft(p.ph * (10 / 8.5))} r="2.6" fill="#8B5CF6" />
          <text x={padL + i * xStep} y={h - 6} fontSize="9" fill="#98A2B3" textAnchor="middle">{p.t}</text>
        </g>
      ))}
    </svg>
  );
}

/* ---------- Layout pieces ---------- */
function Sidebar({ active, setActive, open, setOpen }) {
  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(10,15,25,0.45)", zIndex: 40, display: "none" }}
          className="sidebar-scrim"
        />
      )}
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
                onClick={() => { setActive(item.key); setOpen(false); }}
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
  background: "transparent", border: "none", cursor: "pointer",
  padding: 6, borderRadius: 8, display: "flex",
};

function TopBar({ setOpen }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 12, flexWrap: "wrap", padding: "14px 0", marginBottom: 4,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="only-mobile" onClick={() => setOpen(true)} style={{ ...iconBtnStyle, background: "#fff", border: "1px solid #E7EBF0" }}>
          <Icon path={icons.menu} color="#344054" />
        </button>
        <button
          onClick={() => checkHealthRisk("pm25", 100)}
        >
        Test Backend
        </button>
        <div style={{
          display: "flex", alignItems: "center", gap: 6, background: "#fff",
          border: "1px solid #E7EBF0", borderRadius: 10, padding: "7px 12px", fontSize: 13, color: "#344054", fontWeight: 500,
        }}>
          <Icon path={icons.pin} size={15} color="#2F6FED" />
          Village: XYZ
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#667085" }}>
          Last updated: 11:23 AM
          <Icon path={icons.refresh} size={14} color="#98A2B3" />
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6, background: "#EAF7EE",
          color: "#1E8E4E", borderRadius: 999, padding: "6px 12px", fontSize: 13, fontWeight: 700,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E" }} />
          ONLINE
        </div>
      </div>
    </div>
  );
}

function ScoreCard() {
  const score = 87;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - score / 100);
  return (
    <Card style={{ padding: 24, flex: "2 1 420px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: "#98A2B3", textAlign: "center", marginBottom: 18 }}>
        WATER SAFETY SCORE
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="54" fill="none" stroke="#EEF1F5" strokeWidth="12" />
            <circle
              cx="70" cy="70" r="54" fill="none" stroke="#22C55E" strokeWidth="12"
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round" transform="rotate(-90 70 70)"
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 34, fontWeight: 800, color: "#101828", lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 12, color: "#98A2B3", fontWeight: 600 }}>/100</span>
          </div>
        </div>
        <div style={{ flex: "1 1 220px", minWidth: 220 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Icon path={icons.shield} color="#22C55E" size={20} />
            <span style={{ fontSize: 20, fontWeight: 800, color: "#1E8E4E" }}>SAFE TO DRINK</span>
          </div>
          <p style={{ fontSize: 14, color: "#667085", margin: "0 0 10px", lineHeight: 1.5 }}>
            Water quality is currently within safe operating limits.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#1E8E4E" }}>
            <Icon path={icons.arrowUp} size={14} color="#1E8E4E" />
            3 points from yesterday
          </div>
        </div>
      </div>
    </Card>
  );
}

function QuickStatus() {
  return (
    <Card style={{ padding: 24, flex: "1 1 260px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: "#98A2B3", marginBottom: 16 }}>
        QUICK STATUS
      </div>
      <div style={{ background: "#EFF6FF", borderRadius: 14, padding: 18, display: "flex", gap: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%", background: "#DCEBFF",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon path={icons.check} size={16} color="#2563EB" />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "#1D3A6B", lineHeight: 1.5 }}>
            System is online and monitoring continuously.
          </p>
          <p style={{ margin: "8px 0 0", fontSize: 13.5, color: "#3B5A8A", lineHeight: 1.5 }}>
            All systems are functioning normally.
          </p>
        </div>
      </div>
    </Card>
  );
}

function MetricCard({ m }) {
  return (
    <Card style={{ padding: 18, flex: "1 1 200px", minWidth: 180 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Icon path={m.icon} size={16} color={m.color} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#475467" }}>{m.label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 26, fontWeight: 800, color: "#101828" }}>{m.value}</span>
        {m.unit && <span style={{ fontSize: 13, color: "#98A2B3", fontWeight: 600 }}>{m.unit}</span>}
        <span style={{ marginLeft: "auto" }}><Pill tone="ok">Normal</Pill></span>
      </div>
      <div style={{ fontSize: 12, color: "#98A2B3" }}>{m.sub}</div>
    </Card>
  );
}

function ArsenicCard() {
  return (
    <Card style={{ padding: 20, flex: "1 1 300px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>Arsenic (As)</span>
        <Icon path={icons.info} size={14} color="#98A2B3" />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: "#101828" }}>0.006</span>
        <span style={{ fontSize: 13, color: "#98A2B3", fontWeight: 600 }}>mg/L</span>
      </div>
      <div style={{ marginBottom: 16 }}><Pill tone="ok">Within reference limit</Pill></div>
      <div style={{ position: "relative", height: 6, background: "#EEF1F5", borderRadius: 999, marginBottom: 6 }}>
        <div style={{ position: "absolute", left: "30%", top: -3, width: 12, height: 12, borderRadius: "50%", background: "#22C55E", border: "2px solid #fff", boxShadow: "0 0 0 1px #22C55E" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#98A2B3", marginBottom: 14 }}>
        <span>0</span><span>0.010</span><span>0.020</span>
      </div>
      <div style={{ fontSize: 12, color: "#98A2B3" }}>Reference value: 0.010 mg/L</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#98A2B3", marginTop: 12, paddingTop: 12, borderTop: "1px solid #F0F2F5" }}>
        <Icon path={icons.clock} size={13} color="#98A2B3" />
        Last measured: 11:20 AM
      </div>
    </Card>
  );
}

function HeavyMetalCard() {
  return (
    <Card style={{ padding: 20, flex: "1 1 300px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>Heavy Metal Index</span>
        <Icon path={icons.info} size={14} color="#98A2B3" />
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#101828", marginBottom: 8 }}>0.72</div>
      <div style={{ marginBottom: 14 }}><Pill tone="ok">Low</Pill></div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#98A2B3" }}>
        <Icon path={icons.clock} size={13} color="#98A2B3" />
        Last measured: 11:20 AM
      </div>
    </Card>
  );
}

function MetalsTable() {
  return (
    <Card style={{ padding: 0, flex: "2 1 380px", overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 420 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #EEF1F5" }}>
              {["Metal", "Concentration", "Status", "Trend"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "14px 18px", fontSize: 11.5, color: "#98A2B3", fontWeight: 700, letterSpacing: "0.03em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {METALS.map((m) => (
              <tr key={m.name} style={{ borderBottom: "1px solid #F5F6F8" }}>
                <td style={{ padding: "14px 18px", fontSize: 13.5, color: "#344054", fontWeight: 500 }}>{m.name}</td>
                <td style={{ padding: "14px 18px", fontSize: 13.5, color: "#344054" }}>{m.conc}</td>
                <td style={{ padding: "14px 18px" }}><Pill tone={m.tone}>{m.status}</Pill></td>
                <td style={{ padding: "14px 18px" }}>
                  <svg width="46" height="18" viewBox="0 0 46 18">
                    <polyline points="0,12 8,9 16,13 24,7 32,10 40,6 46,9" fill="none" stroke="#98A2B3" strokeWidth="1.6" />
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: "12px 18px", textAlign: "right", borderTop: "1px solid #F5F6F8" }}>
        <a href="#" style={{ fontSize: 13, color: "#2563EB", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
          View all metals <Icon path={icons.arrowRight} size={13} />
        </a>
      </div>
    </Card>
  );
}

function Pipeline() {
  return (
    <Card style={{ padding: 24 }}>
      <SectionTitle>Purification Pipeline</SectionTitle>
      <div className="pipeline-row">
        {PIPELINE.map((stage, i) => (
          <React.Fragment key={stage.label}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 76 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%", background: "#EFF6FF",
                border: "1px solid #DCEBFF", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon path={stage.icon} size={22} color="#2563EB" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#475467", letterSpacing: "0.02em" }}>{stage.label}</span>
                <Icon path={icons.check} size={12} color="#22C55E" />
              </div>
            </div>
            {i < PIPELINE.length - 1 && (
              <div className="pipeline-connector">
                <Icon path={icons.arrowRight} size={16} color="#D0D5DD" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div style={{
        marginTop: 20, background: "#EAF7EE", borderRadius: 10, padding: "10px 16px",
        display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#1E8E4E", fontWeight: 600,
      }}>
        <Icon path={icons.check} size={15} color="#1E8E4E" />
        All treatment stages are operational
      </div>
    </Card>
  );
}

function TrendCard() {
  const [range, setRange] = useState("24H");
  return (
    <Card style={{ padding: 22, flex: "2 1 420px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 4 }}>
        <SectionTitle>Water Quality Trend</SectionTitle>
        <div style={{ display: "flex", gap: 4, background: "#F5F6F8", borderRadius: 8, padding: 3 }}>
          {["24H", "7D", "30D"].map((r) => (
            <button key={r} onClick={() => setRange(r)} style={{
              border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
              padding: "5px 12px", borderRadius: 6,
              background: range === r ? "#101828" : "transparent",
              color: range === r ? "#fff" : "#667085",
            }}>{r}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#667085", marginBottom: 10, flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><i style={{ width: 8, height: 8, borderRadius: "50%", background: "#2F6FED", display: "inline-block" }} />Turbidity (NTU)</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><i style={{ width: 8, height: 8, borderRadius: "50%", background: "#1FAA6C", display: "inline-block" }} />TDS (ppm)</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><i style={{ width: 8, height: 8, borderRadius: "50%", background: "#8B5CF6", display: "inline-block" }} />pH</span>
      </div>
      <TrendChart />
      <div style={{
        marginTop: 14, background: "#EFF6FF", borderRadius: 10, padding: "10px 14px",
        display: "flex", gap: 8, fontSize: 12.5, color: "#3B5A8A",
      }}>
        <Icon path={icons.brain} size={15} color="#2563EB" />
        <span><strong style={{ color: "#1D3A6B" }}>AI Insight:</strong> Water quality has remained stable over the last 24 hours.</span>
      </div>
    </Card>
  );
}

function AlertsCard() {
  return (
    <Card style={{ padding: 22, flex: "1 1 300px" }}>
      <SectionTitle>Alerts</SectionTitle>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%", background: "#EAF7EE",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon path={icons.check} size={16} color="#22C55E" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1E8E4E" }}>No active alerts</div>
          <div style={{ fontSize: 12.5, color: "#98A2B3" }}>All monitored parameters are currently within safe limits.</div>
        </div>
      </div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#98A2B3", letterSpacing: "0.05em", marginBottom: 10 }}>RECENT EVENTS</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {EVENTS.map((e, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%", marginTop: 5, flexShrink: 0,
              background: e.tone === "ok" ? "#22C55E" : "#F0A03D",
            }} />
            <div>
              <div style={{ fontSize: 12, color: "#98A2B3" }}>{e.time}</div>
              <div style={{ fontSize: 13.5, color: "#344054" }}>{e.label}</div>
            </div>
          </div>
        ))}
      </div>
      <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "#2563EB", fontWeight: 600, textDecoration: "none", marginTop: 16 }}>
        View all alerts <Icon path={icons.arrowRight} size={13} />
      </a>
    </Card>
  );
}

function FilterHealth() {
  return (
    <Card style={{ padding: 22, flex: "1 1 320px" }}>
      <SectionTitle>Filter Health</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {FILTERS.map((f) => (
          <div key={f.name}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#344054", fontWeight: 500 }}>
                <Icon path={f.name.includes("Membrane") ? icons.tubes : icons.cylinder} size={15} color="#667085" />
                {f.name}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#344054" }}>{f.pct}%</span>
                <Pill tone={f.tone}>{f.status}</Pill>
              </div>
            </div>
            <div style={{ height: 7, background: "#EEF1F5", borderRadius: 999 }}>
              <div style={{
                width: `${f.pct}%`, height: "100%", borderRadius: 999,
                background: f.tone === "ok" ? "#22C55E" : "#F0A03D",
              }} />
            </div>
          </div>
        ))}
      </div>
      <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "#2563EB", fontWeight: 600, textDecoration: "none", marginTop: 18 }}>
        View maintenance <Icon path={icons.arrowRight} size={13} />
      </a>
    </Card>
  );
}

function RiskCard() {
  return (
    <Card style={{ padding: 22, flex: "1 1 420px" }}>
      <SectionTitle>Water Risk & Awareness</SectionTitle>
      <div className="risk-grid">
        <div style={{ background: "#F9FAFB", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: "#98A2B3", marginBottom: 8 }}>Current Assessment</div>
          <div style={{ marginBottom: 10 }}><Pill tone="ok">LOW CONTAMINATION RISK</Pill></div>
          <p style={{ fontSize: 12.5, color: "#667085", lineHeight: 1.5, margin: 0 }}>
            Current measured contaminant levels are below configured reference thresholds.
          </p>
          <p style={{ fontSize: 11.5, color: "#98A2B3", margin: "10px 0 0", fontStyle: "italic" }}>
            This is an environmental risk indicator, not a medical diagnosis.
          </p>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#98A2B3", marginBottom: 10 }}>Key Findings</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FINDINGS.map((f) => (
              <div key={f.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 7, color: "#344054" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: f.tone === "ok" ? "#22C55E" : "#F0A03D" }} />
                  {f.label}
                </span>
                <span style={{ color: "#667085", fontSize: 12.5 }}>{f.status}</span>
              </div>
            ))}
          </div>
          <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "#2563EB", fontWeight: 600, textDecoration: "none", marginTop: 14 }}>
            View detailed risk analysis <Icon path={icons.arrowRight} size={13} />
          </a>
        </div>
      </div>
    </Card>
  );
}

function BottomInfoCard({ icon, iconBg, iconColor, title, body, linkLabel }) {
  return (
    <Card style={{ padding: 20, flex: "1 1 280px" }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10, background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
      }}>
        <Icon path={icon} size={17} color={iconColor} />
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1F2937", marginBottom: 8 }}>{title}</div>
      <p style={{ fontSize: 12.5, color: "#667085", lineHeight: 1.55, margin: "0 0 12px" }}>{body}</p>
      <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "#2563EB", fontWeight: 600, textDecoration: "none" }}>
        {linkLabel} <Icon path={icons.arrowRight} size={12} />
      </a>
    </Card>
  );
}

/* ---------- App ---------- */
export default function ToyamDashboard() {
  const [active, setActive] = useState("dashboard");
  const [open, setOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif", background: "#F6F7F9", minHeight: "100vh" }}>
      <style>{`
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
        <Sidebar active={active} setActive={setActive} open={open} setOpen={setOpen} />

        <main className="main">
          <TopBar setOpen={setOpen} />

          <div className="top-cards-row" style={{ marginBottom: 16 }}>
            <ScoreCard />
            <QuickStatus />
          </div>

          <div className="metrics-row" style={{ marginBottom: 16 }}>
            {METRICS.map((m) => <MetricCard key={m.label} m={m} />)}
          </div>

          <Card style={{ padding: 22, marginBottom: 16 }}>
            <SectionTitle>Contaminant Monitoring</SectionTitle>
            <div className="contam-row">
              <ArsenicCard />
              <HeavyMetalCard />
              <MetalsTable />
            </div>
          </Card>

          <div style={{ marginBottom: 16 }}>
            <Pipeline />
          </div>

          <div className="mid-row" style={{ marginBottom: 16 }}>
            <TrendCard />
            <AlertsCard />
          </div>

          <div className="mid-row" style={{ marginBottom: 16 }}>
            <FilterHealth />
            <RiskCard />
          </div>

          <div className="bottom-row">
            <BottomInfoCard
              icon={icons.chart} iconBg="#EFF6FF" iconColor="#2563EB"
              title="What Could This Composition Indicate?"
              body="Current composition does not indicate a major contaminant exceedance. Iron is relatively higher than other measured metals and should continue to be monitored."
              linkLabel="Learn about contaminants"
            />
            <BottomInfoCard
              icon={icons.brain} iconBg="#F3EEFF" iconColor="#7C4DFF"
              title="Toyam Intelligence"
              body="Water quality is stable. Arsenic and heavy metal concentrations are within safe limits. Continue routine monitoring and filter maintenance."
              linkLabel="View full insight"
            />
            <BottomInfoCard
              icon={icons.users} iconBg="#FEF4E6" iconColor="#B8730B"
              title="Water Awareness"
              body="Clear water isn't always safe water. Some contaminants cannot be seen, smelled, or tasted."
              linkLabel="Learn more"
            />
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
